'use client'

import { useState, useEffect } from 'react'
import { Sidebar } from '@/components/sidebar'
import { Header } from '@/components/header'
import { Loader2, AlertCircle, ArrowLeft, CheckCircle, Clock, UserCheck } from 'lucide-react'
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

  const fetchRequestDetail = async () => {
    try {
      setLoading(true)
      setError(null)

      const res = await fetch(`https://legatora-backend.onrender.com/poa-requests/${requestId}`)
      if (!res.ok) throw new Error('Failed to fetch request details')

      const data = await res.json()
      setRequest(data)
    } catch (err) {
      setError('Failed to load request details. Please try again.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (requestId) fetchRequestDetail()
  }, [requestId])

  const getStatusColor = (status: string) => {
    if (status.toLowerCase().includes('progress') || status.toLowerCase().includes('pending'))
      return 'bg-yellow-100 text-yellow-800'
    if (status.toLowerCase().includes('approved') || status.toLowerCase().includes('active'))
      return 'bg-green-100 text-green-800'
    return 'bg-gray-100 text-gray-800'
  }

  const getStatusIcon = (status: string) => {
    if (status.toLowerCase().includes('progress') || status.toLowerCase().includes('pending'))
      return <Clock className="w-4 h-4" />
    if (status.toLowerCase().includes('approved') || status.toLowerCase().includes('active'))
      return <CheckCircle className="w-4 h-4" />
    return <UserCheck className="w-4 h-4" />
  }

  if (loading) {
    return (
      <>
        <Sidebar />
        <div className="flex-1 flex items-center justify-center min-h-screen bg-gray-50">
          <div className="flex items-center gap-3 text-gray-600">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span>Loading request details...</span>
          </div>
        </div>
      </>
    )
  }

  if (error || !request) {
    return (
      <>
        <Sidebar />
        <div className="flex-1 flex items-center justify-center min-h-screen bg-gray-50">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-gray-700 mb-4">{error || 'Request not found'}</p>
            <button
              onClick={() => router.back()}
              className="text-teal-600 hover:underline flex items-center gap-2 mx-auto"
            >
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </button>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <Header />

        <div className="p-6 max-w-7xl mx-auto">
          {/* Back Button & Title */}
          <div className="mb-6">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Requests
            </button>
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Request POA-{request.request_id}</h1>
                <p className="text-sm text-gray-500">
                  Principal: Abebe Bikila | Category: {request.category}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 ${getStatusColor(request.status)}`}>
                  {getStatusIcon(request.status)}
                  {request.status}
                </span>
                <span className="bg-orange-100 text-orange-700 px-4 py-2 rounded-full text-sm font-medium">
                  Assign Agent
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Principal Info */}
            <div className="lg:col-span-2 space-y-6">
              {/* Principal Information */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold mb-4">Principal Information</h2>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-500">Full Name</p>
                    <p className="font-medium">{request.full_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Contact Info</p>
                    <p className="font-medium">{request.contact_info}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Address</p>
                    <p className="font-medium">{request.address}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Category</p>
                    <p className="font-medium capitalize">{request.category}</p>
                  </div>
                </div>
              </div>

              {/* Submitted Documents */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold mb-4">Submitted Documents</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {request.documents.map((doc) => (
                    <div key={doc.id} className="relative group cursor-pointer">
                      <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden">
                        <Image
                          src={doc.url}
                          alt={doc.filename}
                          width={300}
                          height={400}
                          className="w-full h-64 object-cover"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all flex items-center justify-center">
                          <p className="text-white opacity-0 group-hover:opacity-100 font-medium">
                            {doc.filename}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Description of Powers */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold mb-4">Description of Powers</h2>
                <p className="text-gray-700 leading-relaxed">{request.powers_description}</p>
              </div>

              {/* POA Template & Signature */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold mb-4">POA Template Preview</h3>
                  {request.poa_template_preview ? (
                    <div className="bg-gray-50 p-4 rounded border">
                      <p className="text-sm text-gray-600 mb-3">{request.poa_template_preview}</p>
                      <button className="text-teal-600 text-sm hover:underline">
                        View Full Document →
                      </button>
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">Template not generated yet</p>
                  )}
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold mb-4">Digital Signature</h3>
                  {request.digital_signature_url ? (
                    <div className="bg-gray-50 p-8 rounded-lg border text-center">
                      <Image
                        src={request.digital_signature_url}
                        alt="Digital Signature"
                        width={200}
                        height={100}
                        className="mx-auto"
                      />
                      <p className="text-sm text-gray-600 mt-4">Signed by {request.full_name}</p>
                    </div>
                  ) : (
                    <p className="text-gray-500 italic text-center py-8">Not signed yet</p>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Approval Workflow */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-6">
                <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-teal-600" />
                  Approval Workflow
                </h2>
                <div className="space-y-6">
                  {request.workflow.map((step, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          index === 0 ? 'bg-teal-600 text-white' : 'bg-gray-200 text-gray-600'
                        }`}>
                          {index === 0 ? <CheckCircle className="w-5 h-5" /> : index + 1}
                        </div>
                        {index < request.workflow.length - 1 && (
                          <div className="w-0.5 h-16 bg-gray-300 mt-2" />
                        )}
                      </div>
                      <div className="flex-1 pb-8">
                        <p className="font-medium text-gray-900">{step.status}</p>
                        <p className="text-sm text-gray-500">{step.date}</p>
                        <p className="text-sm text-gray-600 mt-1">{step.description}</p>
                        {step.agent && (
                          <p className="text-xs text-teal-600 mt-2">Agent: {step.agent}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
