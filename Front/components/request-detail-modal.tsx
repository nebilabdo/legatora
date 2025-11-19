'use client'

import { X, Download, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface RequestDetailModalProps {
  isOpen: boolean
  onClose: () => void
  requestId: string
}

export function RequestDetailModal({ isOpen, onClose, requestId }: RequestDetailModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-lg border border-border max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border sticky top-0 bg-card">
          <div>
            <p className="text-sm text-muted-foreground">Request</p>
            <h2 className="text-2xl font-bold">{requestId}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-muted rounded transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Principal Information */}
          <section>
            <h3 className="text-lg font-semibold mb-4">Principal Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-muted-foreground">Full Name</label>
                <p className="font-medium">Abebe Bikila</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Contact Info</label>
                <p className="font-medium">+251966347584</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Address</label>
                <p className="font-medium">Addis Ababa, Ethiopia</p>
              </div>
              <div>
                <label className="text-sm text-muted-foreground">Category</label>
                <p className="font-medium">Property</p>
              </div>
            </div>
          </section>

          {/* Approval Workflow */}
          <section>
            <h3 className="text-lg font-semibold mb-4">Approval Workflow</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-1">
                  <div className="w-2 h-2 bg-green-600 rounded-full" />
                </div>
                <div>
                  <p className="font-medium">Authority Assigned</p>
                  <p className="text-sm text-muted-foreground">October 25th, 2023</p>
                  <p className="text-sm text-muted-foreground">Request submitted and assigned to agent Anya Sharma.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center flex-shrink-0 mt-1">
                  <div className="w-2 h-2 bg-yellow-600 rounded-full" />
                </div>
                <div>
                  <p className="font-medium">Notification</p>
                  <p className="text-sm text-muted-foreground">In Progress</p>
                  <p className="text-sm text-muted-foreground">Documents and signature are currently under review.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0 mt-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full" />
                </div>
                <div>
                  <p className="font-medium">Completion</p>
                  <p className="text-sm text-muted-foreground">Not yet started</p>
                </div>
              </div>
            </div>
          </section>

          {/* Submitted Documents */}
          <section>
            <h3 className="text-lg font-semibold mb-4">Submitted Documents</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg border border-border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded flex items-center justify-center">
                    <span className="text-xs font-semibold text-primary">PDF</span>
                  </div>
                  <div>
                    <p className="font-medium text-sm">POWER OF ATTORNEY</p>
                    <p className="text-xs text-muted-foreground">1.2 MB</p>
                  </div>
                </div>
                <Download className="w-4 h-4 text-muted-foreground cursor-pointer hover:text-foreground" />
              </div>
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg border border-border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded flex items-center justify-center">
                    <span className="text-xs font-semibold text-primary">PDF</span>
                  </div>
                  <div>
                    <p className="font-medium text-sm">ID CARD</p>
                    <p className="text-xs text-muted-foreground">800 KB</p>
                  </div>
                </div>
                <Download className="w-4 h-4 text-muted-foreground cursor-pointer hover:text-foreground" />
              </div>
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg border border-border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded flex items-center justify-center">
                    <span className="text-xs font-semibold text-primary">JPG</span>
                  </div>
                  <div>
                    <p className="font-medium text-sm">PROOF_OF_ADDRESS</p>
                    <p className="text-xs text-muted-foreground">2.1 MB</p>
                  </div>
                </div>
                <Download className="w-4 h-4 text-muted-foreground cursor-pointer hover:text-foreground" />
              </div>
            </div>
          </section>

          {/* Description of Powers */}
          <section>
            <h3 className="text-lg font-semibold mb-4">Description of Powers</h3>
            <div className="p-4 bg-muted rounded-lg border border-border">
              <p className="text-sm leading-relaxed">
                I authorize the designated Attorney-in-Fact to represent me in all matters related to my real estate, including preparing, signing, and executing documents on my behalf for my acquisition, leasing, and managing properties in any state in the country. This authority extends to negotiating contracts, managing leases, collecting rent, and otherwise acting as my agent in property matters.
              </p>
            </div>
          </section>

          {/* POA Template Preview */}
          <section>
            <h3 className="text-lg font-semibold mb-4">POA Template Preview</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 border border-border rounded-lg text-center">
                <p className="text-xs text-muted-foreground mb-2">POA Template</p>
                <div className="w-full h-40 bg-muted rounded flex items-center justify-center">
                  <span className="text-xs text-muted-foreground">Preview</span>
                </div>
              </div>
              <div className="p-4 border border-border rounded-lg text-center">
                <p className="text-xs text-muted-foreground mb-2">Digital Signature</p>
                <div className="w-full h-40 bg-muted rounded flex items-center justify-center">
                  <span className="text-xs text-muted-foreground">Signature</span>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-border bg-muted/30">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
            Update Request
          </Button>
        </div>
      </div>
    </div>
  )
}
