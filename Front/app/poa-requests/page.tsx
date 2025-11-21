'use client'

import { useState, useEffect } from 'react'
import { Sidebar } from '@/components/sidebar'
import { Header } from '@/components/header'
import { POARequestList } from '@/components/poa/request-list'
import { Loader2, AlertCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface POARequest {
  id: string
  principal: string
  category: string
  submitted: string
  agent: string
  status: 'active' | 'pending' | 'rejected'
}

export default function POARequestsPage() {
  const router = useRouter()
  const [requests, setRequests] = useState<POARequest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchRequests = async () => {
    try {
      setLoading(true)
      setError(null)

      const res = await fetch('https://legatora-backend.onrender.com/poa-requests')
      if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`)

      const data = await res.json()
      const requestsData = Array.isArray(data) ? data : (data.requests || data.data || [])
      
      const mapped: POARequest[] = requestsData.map((item: any) => ({
        id: item.request_id || item.id,
        principal: item.full_name || item.principal || 'Unknown',
        category: item.category ? item.category.charAt(0).toUpperCase() + item.category.slice(1) : 'General',
        submitted: new Date(item.submitted_date || item.created_at || item.date).toLocaleDateString('en-GB'),
        agent: item.assigned_agent || 'Not Assigned',
        status: item.status?.toLowerCase().includes('pending')
          ? 'pending'
          : item.status?.toLowerCase().includes('approved') || item.status?.toLowerCase().includes('active')
            ? 'active'
            : 'rejected',
      }))

      setRequests(mapped)
    } catch (err) {
      console.error('Error fetching requests:', err)
      setError('Cannot load requests – please check your connection and try again')
      setRequests([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRequests()
  }, [])

  const handleViewDetails = (request: POARequest) => {
    router.push(`/poa-requests/${request.id}`)
  }

  const handleNewRequest = () => {
    router.push('/new-poa-request')
  }

  const handleRetry = () => {
    fetchRequests()
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <div className="w-56 flex-shrink-0">
        <Sidebar />
      </div>

      {/* Main content: reduced margin-left to decrease gap between sidebar and content */}
      <main className="flex-1 flex flex-col min-w-0 ml-48 overflow-hidden">
        <Header />

        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex items-center justify-center h-96">
              <div className="flex items-center gap-3 text-gray-600">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span>Loading requests...</span>
              </div>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-96 text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
              <p className="text-lg font-medium text-gray-900 mb-2">Unable to Load Requests</p>
              <p className="text-gray-600 mb-6">{error}</p>
              <button 
                onClick={handleRetry} 
                className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : requests.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-xl text-gray-600 mb-6">No POA requests found</p>
              <button 
                onClick={handleNewRequest} 
                className="px-8 py-3 bg-teal-600 text-white rounded-lg text-lg hover:bg-teal-700 transition-colors"
              >
                Create Your First Request
              </button>
            </div>
          ) : (
            <POARequestList
              data={requests}
              onViewDetails={handleViewDetails}
              onNewRequest={handleNewRequest}
            />
          )}
        </div>
      </main>
    </div>
  )
}
