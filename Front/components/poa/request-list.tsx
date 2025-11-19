'use client'

import { useState } from 'react'
import { StatusBadge } from '@/components/status-badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Search, MoreVertical, Plus } from 'lucide-react'

interface POARequest {
  id: string
  principal: string
  category: string
  submitted: string
  agent: string
  status: 'active' | 'pending' | 'rejected'
}

interface RequestListProps {
  data: POARequest[]
  onViewDetails: (request: POARequest) => void
  onNewRequest: () => void
}

export function POARequestList({ data, onViewDetails, onNewRequest }: RequestListProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('Active')
  const [sortBy, setSortBy] = useState('newest')

  let filteredData = data.filter((item) => {
    const matchesSearch =
      item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.principal.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter
    const matchesStatus = statusFilter === 'All' || item.status === statusFilter.toLowerCase()

    return matchesSearch && matchesCategory && matchesStatus
  })

  if (sortBy === 'newest') {
    filteredData = [...filteredData].sort((a, b) => new Date(b.submitted).getTime() - new Date(a.submitted).getTime())
  } else if (sortBy === 'oldest') {
    filteredData = [...filteredData].sort((a, b) => new Date(a.submitted).getTime() - new Date(b.submitted).getTime())
  }

  const categories = ['All', 'Property', 'Vehicle', 'Business', 'Medical']
  const statuses = ['All', 'Active', 'Pending', 'Rejected']

  return (
    <div className="flex-1 overflow-y-auto flex flex-col p-6">
      <div className="max-w-7xl w-full mx-auto flex flex-col flex-1">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Power of Attorney Requests</h1>
          <Button 
            onClick={onNewRequest}
            className="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            New Request
          </Button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by title, type, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-border bg-card focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 rounded-lg border border-border bg-card focus:outline-none focus:ring-2 focus:ring-primary text-sm"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                Category: {cat}
              </option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 rounded-lg border border-border bg-card focus:outline-none focus:ring-2 focus:ring-primary text-sm"
          >
            {statuses.map((status) => (
              <option key={status} value={status}>
                Status: {status}
              </option>
            ))}
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 rounded-lg border border-border bg-card focus:outline-none focus:ring-2 focus:ring-primary text-sm"
          >
            <option value="newest">Sort: Newest</option>
            <option value="oldest">Sort: Oldest</option>
          </select>
        </div>

        {/* Table */}
        <Card className="rounded-lg border border-border overflow-hidden flex-1 flex flex-col">
          <div className="overflow-y-auto flex-1">
            <table className="w-full">
              <thead className="sticky top-0">
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-6 py-3 text-left text-sm font-semibold">Request ID</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Principal</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Category</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Submitted</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Assigned Agent</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((row) => (
                  <tr key={row.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-primary">{row.id}</td>
                    <td className="px-6 py-4 text-sm">{row.principal}</td>
                    <td className="px-6 py-4 text-sm">{row.category}</td>
                    <td className="px-6 py-4 text-sm">{row.submitted}</td>
                    <td className="px-6 py-4 text-sm">{row.agent}</td>
                    <td className="px-6 py-4">
                      <StatusBadge
                        status={row.status}
                        label={row.status.charAt(0).toUpperCase() + row.status.slice(1)}
                      />
                    </td>
                    <td className="px-6 py-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="p-1 hover:bg-muted rounded transition-colors">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onViewDetails(row)}>
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>Edit Listing</DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-muted/30">
            <p className="text-sm text-muted-foreground">Showing 1 to 5 of 8 results</p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                Previous
              </Button>
              <Button className="bg-primary text-primary-foreground" size="sm">
                Next
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
