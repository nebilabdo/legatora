'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Download, Eye, CheckCircle2, Clock, FileText } from 'lucide-react'

interface POARequest {
  id: string
  principal: string
  category: string
  submitted: string
  agent: string
  status: 'active' | 'pending' | 'rejected'
}

interface RequestDetailModalProps {
  request: POARequest
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function RequestDetailModal({ request, open, onOpenChange }: RequestDetailModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle>Request {request.id}</DialogTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Principal: {request.principal} | Category: {request.category}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">Assign Agent</Button>
              <Badge className={
                request.status === 'active' ? 'bg-green-500' :
                request.status === 'pending' ? 'bg-yellow-500' :
                'bg-red-500'
              }>
                {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
              </Badge>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Principal Information */}
          <div>
            <h3 className="font-semibold mb-4">Principal Information</h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Full Name</p>
                <p className="font-medium">{request.principal}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Contact Info</p>
                <p className="font-medium">+251964387384</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Address</p>
                <p className="font-medium">Addis Ababa, Ethiopia</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Category</p>
                <p className="font-medium">{request.category}</p>
              </div>
            </div>
          </div>

          {/* Approval Workflow */}
          <div>
            <h3 className="font-semibold mb-4">Approval Workflow</h3>
            <div className="space-y-4">
              <div className="flex gap-4 items-start">
                <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-medium">Authority Assigned</p>
                  <p className="text-sm text-muted-foreground">October 25th, 2023</p>
                  <p className="text-sm">Request submitted and assigned to agent Anya Sharma.</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <Clock className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-medium">Verification</p>
                  <p className="text-sm text-muted-foreground">In Progress</p>
                  <p className="text-sm">Documents and signature are currently under review.</p>
                </div>
              </div>
              <div className="flex gap-4 items-start">
                <FileText className="w-5 h-5 text-gray-400 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-medium">Completion</p>
                  <p className="text-sm text-muted-foreground">Pending</p>
                </div>
              </div>
            </div>
          </div>

          {/* Submitted Documents */}
          <div>
            <h3 className="font-semibold mb-4">Submitted Documents</h3>
            <div className="grid grid-cols-3 gap-4">
              <Card className="p-4 bg-muted/50 hover:bg-muted cursor-pointer transition-colors">
                <FileText className="w-8 h-8 mb-2 text-primary" />
                <p className="text-sm font-medium">power-of-attorney</p>
                <p className="text-xs text-muted-foreground mt-1">PDF • 2.4 MB</p>
              </Card>
              <Card className="p-4 bg-muted/50 hover:bg-muted cursor-pointer transition-colors">
                <FileText className="w-8 h-8 mb-2 text-primary" />
                <p className="text-sm font-medium">id-card</p>
                <p className="text-xs text-muted-foreground mt-1">PDF • 1.8 MB</p>
              </Card>
              <Card className="p-4 bg-muted/50 hover:bg-muted cursor-pointer transition-colors">
                <FileText className="w-8 h-8 mb-2 text-primary" />
                <p className="text-sm font-medium">proof-of-residence</p>
                <p className="text-xs text-muted-foreground mt-1">JPG • 3.2 MB</p>
              </Card>
            </div>
          </div>

          {/* Description of Powers */}
          <div>
            <h3 className="font-semibold mb-4">Description of Powers</h3>
            <Card className="p-4 bg-muted/30">
              <p className="text-sm">I authorize the assigned Attorney/Agent to represent me in all matters related to this request, including preparing, submitting, collecting, verifying, and receiving documents on my behalf from any government office, ministry, embassy, or private institution as required.</p>
              <p className="text-xs text-muted-foreground mt-2">0 / 1000</p>
            </Card>
          </div>

          {/* POA Template & Signature */}
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-4">POA Template Preview</h3>
              <Card className="p-4 bg-muted/30 min-h-40 flex items-center justify-center">
                <div className="text-center text-sm text-muted-foreground">
                  <p>Laban Ariom, residing at 123 Oak Avenue,</p>
                  <p>hereby appoint Anya Sharma as my attorney</p>
                  <Button variant="link" className="text-primary mt-2">View Full Document</Button>
                </div>
              </Card>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Digital Signature</h3>
              <Card className="p-4 bg-muted/30 min-h-40 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-3xl italic">Signature</p>
                </div>
              </Card>
            </div>
          </div>

          {/* Close button */}
          <div className="flex gap-3 pt-4 border-t border-border">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
