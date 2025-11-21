// app/poa-requests/[id]/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { Sidebar } from '@/components/sidebar'
import { Header } from '@/components/header'
import { Loader2, AlertCircle, ArrowLeft, CheckCircle, Clock, UserCheck, Download, Eye } from 'lucide-react'
import { useRouter, useParams } from 'next/navigation'
import Image from 'next/image'

interface Document {
  id: string
  filename: string
  url: string
  type: string
}

interface WorkflowStep {
  status: string
  date: string
  description: string
  agent?: string
}

interface POARequestDetail {
  request_id: string
  full_name: string
  contact_info: string
  address: string
  category: string
  status: string
  submitted_date: string
  assigned_agent: string | null
  documents: Document[]
  powers_description: string
  digital_signature_url?: string
  poa_template_preview?: string
  workflow: WorkflowStep[]
}

export default function RequestDetailPage() {
  const router = useRouter()
  const params = useParams()
  const requestId = params.id as string

  const [request, setRequest] = useState<POARequestDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set())
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const fetchRequestDetail = async () => {
    try {
      setLoading(true)
      setError(null)

      const res = await fetch(`https://legatora-backend.onrender.com/poa-requests/${requestId}`)
      
      if (!res.ok) {
        throw new Error(`Failed to fetch request details: ${res.status}`)
      }

      const data = await res.json()

      // Map backend data to frontend interface
      setRequest({
        request_id: data.request_id || data.id || 'N/A',
        full_name: data.full_name || data.principal || 'Not provided',
        contact_info: data.contact_info || 'Not provided',
        address: data.address || 'Not provided',
        category: data.category || 'General',
        status: data.status || 'Pending',
        submitted_date: data.submitted_date || data.created_at || new Date().toISOString(),
        assigned_agent: data.assigned_agent || null,
        documents: Array.isArray(data.documents) ? data.documents : [],
        powers_description: data.powers_description || data.description_of_power || 'No description provided',
        digital_signature_url: data.digital_signature_url || undefined,
        poa_template_preview: data.poa_template_preview || undefined,
        workflow: Array.isArray(data.workflow) ? data.workflow : getDefaultWorkflow(data.status),
      })
    } catch (err) {
      console.error('Error fetching request:', err)
      setError('Failed to load request details. Please check your connection and try again.')
      setRequest(null)
    } finally {
      setLoading(false)
    }
  }

  // Generate default workflow if not provided by backend
  const getDefaultWorkflow = (status: string): WorkflowStep[] => {
    const baseSteps: WorkflowStep[] = [
      {
        status: 'Request Submitted',
        date: new Date().toISOString().split('T')[0],
        description: 'Power of Attorney request has been submitted'
      }
    ]

    if (status.toLowerCase().includes('progress') || status.toLowerCase().includes('review')) {
      return [
        ...baseSteps,
        {
          status: 'Under Review',
          date: new Date().toISOString().split('T')[0],
          description: 'Documents and information are being reviewed'
        }
      ]
    }

    if (status.toLowerCase().includes('approved')) {
      return [
        ...baseSteps,
        {
          status: 'Under Review',
          date: new Date().toISOString().split('T')[0],
          description: 'Documents and information are being reviewed'
        },
        {
          status: 'Approved',
          date: new Date().toISOString().split('T')[0],
          description: 'Request has been approved and finalized'
        }
      ]
    }

    return baseSteps
  }

  useEffect(() => {
    if (requestId) {
      fetchRequestDetail()
    }
  }, [requestId])

  const handleImageError = (url: string) => {
    setImageErrors(prev => new Set(prev).add(url))
  }

  const handleRetry = () => {
    fetchRequestDetail()
  }

  const handleViewDocument = (doc: Document) => {
    window.open(doc.url, '_blank')
  }

  const handleDownloadDocument = (doc: Document) => {
    const link = document.createElement('a')
    link.href = doc.url
    link.download = doc.filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const getStatusColor = (status: string) => {
    const s = status.toLowerCase()
    if (s.includes('progress') || s.includes('pending') || s.includes('review')) 
      return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    if (s.includes('approved') || s.includes('active') || s.includes('completed')) 
      return 'bg-green-100 text-green-800 border-green-200'
    if (s.includes('rejected') || s.includes('denied') || s.includes('failed')) 
      return 'bg-red-100 text-red-800 border-red-200'
    return 'bg-gray-100 text-gray-800 border-gray-200'
  }

  const getStatusIcon = (status: string) => {
    const s = status.toLowerCase()
    if (s.includes('progress') || s.includes('pending') || s.includes('review')) 
      return <Clock className="w-4 h-4" />
    if (s.includes('approved') || s.includes('active') || s.includes('completed')) 
      return <CheckCircle className="w-4 h-4" />
    if (s.includes('rejected') || s.includes('denied') || s.includes('failed')) 
      return <AlertCircle className="w-4 h-4" />
    return <UserCheck className="w-4 h-4" />
  }

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    } catch {
      return 'Invalid date'
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <div className="flex-1 flex items-center justify-center">
            <div className="flex items-center gap-3 text-gray-600">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span>Loading request details...</span>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !request) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center max-w-md mx-auto p-6">
              <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Unable to Load Request</h2>
              <p className="text-gray-700 mb-6">{error || 'Request not found'}</p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => router.back()}
                  className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Go Back
                </button>
                <button
                  onClick={handleRetry}
                  className="flex items-center gap-2 px-4 py-2 text-white bg-teal-600 rounded-lg hover:bg-teal-700 transition-colors"
                >
                  <Loader2 className="w-4 h-4" />
                  Retry
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0"> {/* Added min-w-0 to prevent overflow */}
        <Header />
        
        {/* Main Content Area with proper spacing */}
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Back Button & Title */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Requests
              </button>
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                <div className="min-w-0 flex-1"> {/* Added min-w-0 and flex-1 */}
                  <h1 className="text-2xl font-bold text-gray-900 truncate">Request POA-{request.request_id}</h1>
                  <p className="text-sm text-gray-500 mt-1 truncate">
                    Principal: {request.full_name} | Category: {request.category} | Submitted: {formatDate(request.submitted_date)}
                  </p>
                </div>
                <div className="flex items-center gap-3 flex-wrap shrink-0"> {/* Added shrink-0 */}
                  <span className={`px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 border ${getStatusColor(request.status)}`}>
                    {getStatusIcon(request.status)}
                    {request.status}
                  </span>
                  <button className="bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm font-medium hover:bg-orange-200 transition-colors whitespace-nowrap">
                    Assign Agent
                  </button>
                </div>
              </div>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Principal Info */}
              <div className="lg:col-span-2 space-y-6 min-w-0"> {/* Added min-w-0 */}
                {/* Principal Information */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold mb-4">Principal Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="min-w-0"> {/* Added min-w-0 */}
                      <p className="text-sm text-gray-500 mb-1">Full Name</p>
                      <p className="font-medium text-gray-900 truncate">{request.full_name}</p>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm text-gray-500 mb-1">Contact Info</p>
                      <p className="font-medium text-gray-900 truncate">{request.contact_info}</p>
                    </div>
                    <div className="md:col-span-2 min-w-0">
                      <p className="text-sm text-gray-500 mb-1">Address</p>
                      <p className="font-medium text-gray-900 break-words">{request.address}</p>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm text-gray-500 mb-1">Category</p>
                      <p className="font-medium text-gray-900 capitalize truncate">{request.category}</p>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm text-gray-500 mb-1">Assigned Agent</p>
                      <p className="font-medium text-gray-900 truncate">
                        {request.assigned_agent || 'Not assigned'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Submitted Documents */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold mb-4">Submitted Documents</h2>
                  {request.documents.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {request.documents.map((doc) => (
                        <div key={doc.id} className="border border-gray-200 rounded-lg overflow-hidden group hover:shadow-md transition-shadow min-w-0">
                          <div className="relative bg-gray-50 aspect-[3/4] overflow-hidden">
                            {!imageErrors.has(doc.url) ? (
                              <Image
                                src={doc.url}
                                alt={doc.filename}
                                width={300}
                                height={400}
                                className="w-full h-full object-cover"
                                onError={() => handleImageError(doc.url)}
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-gray-200">
                                <div className="text-center p-4">
                                  <AlertCircle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                  <p className="text-xs text-gray-500">Failed to load image</p>
                                </div>
                              </div>
                            )}
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                              <button
                                onClick={() => handleViewDocument(doc)}
                                className="bg-white text-gray-700 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                                title="View Document"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDownloadDocument(doc)}
                                className="bg-white text-gray-700 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                                title="Download Document"
                              >
                                <Download className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                          <div className="p-3 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate" title={doc.filename}>
                              {doc.filename}
                            </p>
                            <p className="text-xs text-gray-500 capitalize truncate">{doc.type}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <AlertCircle className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                      <p>No documents submitted</p>
                    </div>
                  )}
                </div>

                {/* Description of Powers */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h2 className="text-lg font-semibold mb-4">Description of Powers</h2>
                  <div className="bg-gray-50 rounded-lg p-4 min-w-0">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap break-words">
                      {request.powers_description}
                    </p>
                  </div>
                </div>

                {/* POA Template & Signature */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 min-w-0">
                    <h3 className="text-lg font-semibold mb-4">POA Template Preview</h3>
                    {request.poa_template_preview ? (
                      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 min-w-0">
                        <p className="text-sm text-gray-600 mb-3 line-clamp-3 break-words">
                          {request.poa_template_preview}
                        </p>
                        <button className="text-teal-600 text-sm font-medium hover:underline flex items-center gap-1">
                          View Full Document
                          <ArrowLeft className="w-4 h-4 rotate-180" />
                        </button>
                      </div>
                    ) : (
                      <div className="text-center py-6 text-gray-500">
                        <Clock className="w-8 h-8 mx-auto mb-2" />
                        <p>Template not generated yet</p>
                      </div>
                    )}
                  </div>

                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 min-w-0">
                    <h3 className="text-lg font-semibold mb-4">Digital Signature</h3>
                    {request.digital_signature_url ? (
                      <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 text-center min-w-0">
                        <div className="mb-4">
                          <Image
                            src={request.digital_signature_url}
                            alt="Digital Signature"
                            width={200}
                            height={80}
                            className="mx-auto max-w-full"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none'
                              const errorDiv = e.currentTarget.parentElement?.querySelector('.signature-error') as HTMLElement
                              if (errorDiv) errorDiv.style.display = 'block'
                            }}
                          />
                          <div className="signature-error hidden text-gray-400">
                            <AlertCircle className="w-12 h-12 mx-auto mb-2" />
                            <p className="text-sm">Signature image failed to load</p>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 truncate">
                          Signed by {request.full_name}
                        </p>
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <AlertCircle className="w-8 h-8 mx-auto mb-2" />
                        <p>Not signed yet</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right Column - Approval Workflow */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-6 min-w-0">
                  <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
                    <UserCheck className="w-5 h-5 text-teal-600" />
                    Approval Workflow
                  </h2>
                  <div className="space-y-6">
                    {request.workflow.map((step, index) => (
                      <div key={index} className="flex gap-4 min-w-0">
                        <div className="flex flex-col items-center shrink-0">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                            index < request.workflow.length - 1 
                              ? 'bg-teal-600 text-white border-teal-600' 
                              : 'bg-white text-gray-600 border-gray-300'
                          }`}>
                            {index < request.workflow.length - 1 ? (
                              <CheckCircle className="w-5 h-5" />
                            ) : (
                              index + 1
                            )}
                          </div>
                          {index < request.workflow.length - 1 && (
                            <div className="w-0.5 h-16 bg-teal-600 mt-2" />
                          )}
                        </div>
                        <div className="flex-1 pb-8 last:pb-0 min-w-0">
                          <p className="font-medium text-gray-900 truncate">{step.status}</p>
                          <p className="text-sm text-gray-500">{formatDate(step.date)}</p>
                          <p className="text-sm text-gray-600 mt-1 break-words">{step.description}</p>
                          {step.agent && (
                            <p className="text-xs text-teal-600 mt-2 font-medium truncate">
                              Agent: {step.agent}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
