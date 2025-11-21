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
      if (!res.ok) throw new Error('Failed to fetch')

      const data = await res.json()

      const mapped: POARequest[] = data.map((item: any) => ({
  id: item.request_id,
  principal: item.principal,  // <-- use 'principal', not 'full_name'
  category: item.category.charAt(0).toUpperCase() + item.category.slice(1),
  submitted: new Date(item.submitted_date).toLocaleDateString('en-GB'),
  agent: item.assigned_agent || 'Not Assigned',
  status: item.status.toLowerCase().includes('pending')
    ? 'pending'
    : item.status.toLowerCase().includes('approved') || item.status.toLowerCase().includes('active')
      ? 'active'
      : 'rejected',
}))


      setRequests(mapped)
    } catch (err) {
      setError('Cannot load requests – check if backend is running')
      setRequests([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRequests()
  }, [])

  // These two functions fix the TypeScript error
  const handleViewDetails = (request: POARequest) => {
    // You can expand this later
    alert(`Viewing: ${request.id} – ${request.principal}`)
  }

  const handleNewRequest = () => {
    router.push('/new-poa-request')
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />

      <main className="flex-1 lg:ml-56 flex flex-col overflow-hidden">
        <Header />

        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-96">
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-96 text-center">
              <AlertCircle className="h-12 w-12 text-destructive mb-4" />
              <p className="text-lg font-medium text-destructive">{error}</p>
              <button onClick={fetchRequests} className="mt-4 px-6 py-2 bg-primary text-primary-foreground rounded-lg">
                Retry
              </button>
            </div>
          ) : requests.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-xl text-muted-foreground mb-6">No POA requests found</p>
              <button onClick={handleNewRequest} className="px-8 py-3 bg-primary text-white rounded-lg text-lg">
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
