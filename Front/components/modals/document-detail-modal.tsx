'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import { Eye, Download, XCircle, CheckCircle2 } from 'lucide-react'
import { useState } from 'react'

interface VerificationItem {
  id: string
  poaId: string
  applicant: string
  category: string
  submitted: string
  status: 'verified' | 'pending' | 'rejected'
}

interface DocumentDetailModalProps {
  item: VerificationItem
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DocumentDetailModal({ item, open, onOpenChange }: DocumentDetailModalProps) {
  const [comment, setComment] = useState('')

  const documents = [
    { name: "Applicant's Passport", date: '2023-10-15', status: 'accepted' },
    { name: 'Property Title Deed', date: '2023-10-15', status: 'rejected', rejection: 'Scanned copy is blurry and unreadable.' },
    { name: 'Utility Bill (Proof of Address)', date: '2023-10-14', status: 'accepted' },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between mb-2">
            <DialogTitle>Document Verification</DialogTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="text-red-600 border-red-200 hover:bg-red-50">
                <XCircle className="w-4 h-4 mr-1" />
                Reject All
              </Button>
              <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                <CheckCircle2 className="w-4 h-4 mr-1" />
                Accept All
              </Button>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Review and verify documents for POA Request {item.poaId}
          </p>
        </DialogHeader>

        <div className="space-y-6">
          {/* Submitted Documents */}
          <div>
            <h3 className="font-semibold mb-4">Submitted Documents (3)</h3>
            <div className="space-y-4">
              {documents.map((doc, idx) => (
                <div key={idx} className="border border-border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-muted rounded flex items-center justify-center flex-shrink-0">
                        <Eye className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <div>
                        <h4 className="font-semibold">{doc.name}</h4>
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

                  {doc.status === 'rejected' && (
                    <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm font-semibold text-red-700 mb-1">Document Rejected</p>
                      <p className="text-sm text-red-600">Reason: {doc.rejection}</p>
                    </div>
                  )}

                  <div className="flex gap-2">
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
                      <CheckCircle2 className="w-4 h-4 mr-1" />
                      Accept
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Request Resubmission */}
          <div className="border-t border-border pt-6">
            <h3 className="font-semibold mb-4">Request Resubmission</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Select required documents and add a comment for the applicant
            </p>

            <div className="space-y-3 mb-6">
              {['Property Title Deed', 'National ID Card', 'Another Document'].map((doc, idx) => (
                <div key={idx} className="flex items-center">
                  <Checkbox id={`doc-${idx}`} defaultChecked={idx === 0} />
                  <label htmlFor={`doc-${idx}`} className="ml-3 text-sm cursor-pointer">
                    {doc}
                  </label>
                </div>
              ))}
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Comment for Applicant</label>
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="e.g., Please re-upload a clear, high-resolution scan of the Property Title Deed."
                className="min-h-32"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-border">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button className="bg-primary text-primary-foreground">
              Send Resubmission Request
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
