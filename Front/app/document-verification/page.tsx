// app/document-verification/page.tsx
'use client'

import { useState, useEffect } from 'react'
import { Sidebar } from '@/components/sidebar'
import { Header } from '@/components/header'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { StatusBadge } from '@/components/status-badge'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Search, MoreVertical, ArrowLeft, FileText, Loader2 } from 'lucide-react'

interface VerificationItem {
  request_id: string
  applicant: string
  category: string
  submitted_date: string
  status: 'Verified' | 'Pending' | 'Rejected'
  contact_info: string
  address: string
}

export default function DocumentVerificationPage() {
  const [items, setItems] = useState<VerificationItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const [view, setView] = useState<'list' | 'detail'>('list')
  const [selected, setSelected] = useState<VerificationItem | null>(null)

  const categories = ['All', 'Property', 'Vehicle', 'Business', 'Medical']
  const statuses = ['All', 'Verified', 'Pending', 'Rejected']

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const res = await fetch('https://legatora-backend.onrender.com/external-doc-verification?sort_by=newest')
      if (!res.ok) throw new Error('Failed to fetch')
      const data: VerificationItem[] = await res.json()
      setItems(data)
    } catch (err) {
      console.error(err)
      alert('Cannot connect to backend. Is FastAPI running?')
      setItems([])
    } finally {
      setLoading(false)
    }
  }

  const filtered = items.filter(item => {
    const matchesSearch =
      item.request_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.applicant.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter
    const matchesStatus = statusFilter === 'All' || item.status === statusFilter
    return matchesSearch && matchesCategory && matchesStatus
  })

  const handleViewDetails = (item: VerificationItem) => {
    setSelected(item)
    setView('detail')
  }

  const getBadgeStatus = (status: string): 'pending' | 'verified' | 'rejected' => {
    if (status === 'Verified') return 'verified'
    if (status === 'Pending') return 'pending'
    return 'rejected'
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 lg:ml-56 flex flex-col overflow-hidden">
        <Header />

        {/* LIST VIEW */}
        {view === 'list' ? (
          <div className="flex-1 overflow-y-auto p-6">
            <div className="max-w-7xl mx-auto">
              <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">External Document Verification</h1>
                <p className="text-muted-foreground">
                  Documents requiring approval from MoFA, DAMA, or Embassy
                </p>
              </div>

              {/* Filters */}
              <div className="flex flex-col md:flex-row gap-4 mb-8">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search by POA ID or applicant..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border bg-card focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-4 py-3 rounded-lg border bg-card"
                >
                  {categories.map(c => <option key={c} value={c}>{c === 'All' ? 'All Categories' : c}</option>)}
                </select>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-3 rounded-lg border bg-card"
                >
                  {statuses.map(s => <option key={s} value={s}>{s === 'All' ? 'All Status' : s}</option>)}
                </select>
              </div>

              {/* Table */}
              {loading ? (
                <div className="flex justify-center py-20">
                  <Loader2 className="w-12 h-12 animate-spin text-primary" />
                </div>
              ) : (
                <Card className="overflow-hidden border">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-muted/50 border-b">
                        <tr>
                          <th className="px-6 py-4 text-left text-sm font-medium">POA Request ID</th>
                          <th className="px-6 py-4 text-left text-sm font-medium">Applicant</th>
                          <th className="px-6 py-4 text-left text-sm font-medium hidden md:table-cell">Category</th>
                          <th className="px-6 py-4 text-left text-sm font-medium hidden lg:table-cell">Submitted</th>
                          <th className="px-6 py-4 text-left text-sm font-medium">Status</th>
                          <th className="px-6 py-4 text-left text-sm font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {filtered.map((item) => (
                          <tr key={item.request_id} className="hover:bg-muted/30 transition">
                            <td className="px-6 py-4 font-medium text-primary">{item.request_id}</td>
                            <td className="px-6 py-4">{item.applicant}</td>
                            <td className="px-6 py-4 hidden md:table-cell">{item.category}</td>
                            <td className="px-6 py-4 hidden lg:table-cell">
                              {new Date(item.submitted_date).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4">
                              <StatusBadge
                                status={getBadgeStatus(item.status)}
                                label={item.status}
                              />
                            </td>
                            <td className="px-6 py-4">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreVertical className="w-4 h-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => handleViewDetails(item)}>
                                    View Details
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>Request Resubmission</DropdownMenuItem>
                                  <DropdownMenuItem className="text-destructive">
                                    Reject Permanently
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              )}
            </div>
          </div>
        ) : (
          /* DETAIL VIEW */
          <div className="flex-1 overflow-y-auto p-6">
            <div className="max-w-6xl mx-auto">
              <button
                onClick={() => setView('list')}
                className="flex items-center gap-2 mb-8 text-primary hover:underline"
              >
                <ArrowLeft className="w-5 h-5" /> Back to List
              </button>

              {selected && (
                <div className="grid lg:grid-cols-3 gap-8">
                  {/* Left: Documents */}
                  <div className="lg:col-span-2">
                    <h1 className="text-3xl font-bold mb-6">Document Verification</h1>
                    <Card className="p-12 text-center">
                      <FileText className="w-20 h-20 mx-auto mb-4 text-muted-foreground/40" />
                      <p className="text-lg font-medium">No documents submitted yet</p>
                      <p className="text-muted-foreground mt-2">
                        Applicant must upload required documents for external verification
                      </p>
                    </Card>
                  </div>

                  {/* Right: Info */}
                  <div>
                    <Card className="p-6 sticky top-6">
                      <h2 className="text-xl font-bold mb-6">Request Information</h2>
                      <div className="space-y-5 text-sm">
                        <div>
                          <p className="text-muted-foreground">Request ID</p>
                          <p className="font-semibold text-base">{selected.request_id}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Applicant</p>
                          <p className="font-semibold">{selected.applicant}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Category</p>
                          <p>{selected.category}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Contact</p>
                          <p>{selected.contact_info}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Address</p>
                          <p className="text-sm">{selected.address}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Submitted Date</p>
                          <p>{new Date(selected.submitted_date).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground mb-2">Current Status</p>
                          <StatusBadge
                            status={getBadgeStatus(selected.status)}
                            label={selected.status}
                          />
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
