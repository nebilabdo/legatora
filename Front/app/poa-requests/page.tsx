'use client'

import { useState, useEffect } from 'react'
import { Sidebar } from '@/components/sidebar'
import { Header } from '@/components/header'
import { Loader2, AlertCircle, Search, Eye } from 'lucide-react'
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
  const [searchTerm, setSearchTerm] = useState('')

  const fetchRequests = async () => {
    try {
      setLoading(true)
      setError(null)

      const res = await fetch('https://legatora-backend.onrender.com/poa-requests')
      if (!res.ok) throw new Error('Failed to fetch')

      const data = await res.json()

      const mapped: POARequest[] = data.map((item: any) => ({
        id: item.request_id,
        principal: item.full_name,
        category: item.category.charAt(0).toUpperCase() + item.category.slice(1),
        submitted: new Date(item.submitted_date || item.created_at).toLocaleDateString('en-GB'),
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

  const handleViewDetails = (requestId: string) => {
    router.push(`/poa-requests/${requestId}`)
  }

  const handleNewRequest = () => {
    router.push('/new-poa-request')
  }

  const handleRetry = () => {
    fetchRequests()
  }

  const filteredRequests = requests.filter(request => 
    request.principal.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.id.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar - hidden on mobile */}
      <div className="hidden md:block w-64 flex-shrink-0">
        <Sidebar />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 md:ml-2">
        <Header />
        
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Page Header */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-6">Power of Attorney Requests</h1>
              
              {/* Search and Filters */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="flex-1 min-w-[200px]">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                      type="text"
                      placeholder="Search by title, type, or location..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                    />
                  </div>
                </div>
                
                <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500">
                  <option>Category: All</option>
                  <option>Property</option>
                  <option>Medical</option>
                </select>
                
                <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500">
                  <option>Status: Active</option>
                  <option>Pending</option>
                  <option>Rejected</option>
                </select>
                
                <select className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500">
                  <option>Sort: Newest</option>
                  <option>Oldest</option>
                </select>
              </div>

              <div className="border-t border-gray-200 mb-6"></div>
            </div>

            {/* Content Area */}
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
            ) : filteredRequests.length === 0 ? (
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
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                {/* Table */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Request ID</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Principal</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Submitted</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned Agent</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredRequests.map((request) => (
                        <tr key={request.id} className="hover:bg-gray-50">
                          <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{request.id}</td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{request.principal}</td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{request.category}</td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{request.submitted}</td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">{request.agent}</td>
                          <td className="px-4 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                              {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                            </span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => handleViewDetails(request.id)}
                              className="text-teal-600 hover:text-teal-900 flex items-center gap-1"
                            >
                              <Eye className="h-4 w-4" />
                              View Details
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {/* Pagination */}
                <div className="px-4 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
                  <div className="text-sm text-gray-700">
                    Showing 1 to {Math.min(filteredRequests.length, 8)} of {filteredRequests.length} results
                  </div>
                  <div className="flex gap-2">
                    <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">
                      Previous
                    </button>
                    <button className="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50">
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
