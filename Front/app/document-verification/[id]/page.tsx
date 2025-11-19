'use client'

import { Sidebar } from '@/components/sidebar'
import { Header } from '@/components/header'
import { Button } from '@/components/ui/button'
import { ChevronLeft, Eye, Download, XCircle, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

interface POARequest {
  request_id: string
  applicant: string
  category: string
  submitted_date: string
  status: string
  contact_info: string
  address: string
}

interface Document {
  name: string
  date: string
  status: 'accepted' | 'pending'
  rejection?: string
}

export default function DocumentDetailPage({ params }: { params: { id: string } }) {
  const [comment, setComment] = useState('')

  // Mock POA request data
  const poaRequest: POARequest = {
    request_id: params.id,
    applicant: 'John Doe',
    category: 'Property',
    submitted_date: '2023-10-15',
    status: 'Pending',
    contact_info: 'johndoe@example.com',
    address: '123 Main Street, City'
  }

  // Mock submitted documents
  const documents: Document[] = [
    { name: "Applicant's Passport", date: '2023-10-15', status: 'accepted' },
    { name: 'Property Title Deed', date: '2023-10-15', status: 'pending', rejection: 'Scanned copy is blurry and unreadable.' },
    { name: 'Utility Bill (Proof of Address)', date: '2023-10-14', status: 'accepted' },
  ]

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />

      <main className="flex-1 lg:ml-56 flex flex-col overflow-hidden">
        <Header />

        <div className="flex-1 overflow-auto p-4 sm:p-6">
          <div className="max-w-4xl">
            {/* Back Button */}
            <Link href="/document-verification" className="flex items-center gap-2 text-primary hover:underline mb-6">
              <ChevronLeft className="w-4 h-4" />
              Back to Requests
            </Link>

            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
              <div>
                <h1 className="text-3xl font-bold mb-2">Document Verification</h1>
                <p className="text-sm text-muted-foreground">
                  Review and verify documents for POA Request {poaRequest.request_id} ({poaRequest.applicant})
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline">
                  <XCircle className="w-4 h-4 mr-2" />
                  Reject All
                </Button>
                <Button className="bg-green-600 hover:bg-green-700 text-white">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Accept All
                </Button>
              </div>
            </div>

            {/* Submitted Documents */}
            <section className="bg-card p-6 rounded-lg border border-border mb-6">
              <h2 className="text-xl font-semibold mb-4">Submitted Documents ({documents.length})</h2>
              <div className="space-y-4">
                {documents.map((doc, idx) => (
                  <div key={idx} className="border border-border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-muted rounded flex items-center justify-center flex-shrink-0">
                          <Eye className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{doc.name}</h3>
                          <p className="text-sm text-muted-foreground">Submitted: {doc.date}</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4" />
                          View
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4" />
                          Download
                        </Button>
                      </div>
                    </div>

                    {doc.status === 'pending' && doc.rejection && (
                      <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm font-semibold text-red-700 mb-1">Document Rejected</p>
                        <p className="text-sm text-red-600">Reason: {doc.rejection}</p>
                      </div>
                    )}

                    <div className="mt-4 flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:bg-red-50 border-red-200"
                      >
                        <XCircle className="w-4 h-4 mr-1" />
                        Reject
                      </Button>
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Accept
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Request Resubmission */}
            <section className="bg-card p-6 rounded-lg border border-border mb-6">
              <h2 className="text-xl font-semibold mb-4">Request Resubmission</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Select required documents and add a comment for the applicant
              </p>
              <div className="space-y-3 mb-4">
                {['Property Title Deed', 'National ID Card', 'Another Document'].map((doc, idx) => (
                  <div key={idx} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`doc-${idx}`}
                      className="w-4 h-4 rounded border-border"
                      defaultChecked={idx === 0}
                    />
                    <label htmlFor={`doc-${idx}`} className="ml-3 text-sm">
                      {doc}
                    </label>
                  </div>
                ))}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Comment for Applicant</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="e.g., Please re-upload a clear, high-resolution scan of the Property Title Deed."
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
              </div>
            </section>

            {/* Actions */}
            <div className="flex gap-3 justify-end">
              <Button variant="outline">
                Cancel
              </Button>
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
                Send Resubmission Request
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
