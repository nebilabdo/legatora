'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { useState } from 'react'

interface NewRequestModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function NewRequestModal({ open, onOpenChange }: NewRequestModalProps) {
  const [signature, setSignature] = useState<string>('')

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>New POA Request</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Principal Information */}
          <div>
            <h3 className="font-semibold mb-4">Principal Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Principal Full Name</label>
                <Input placeholder="Enter name" />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Principal's Contact Info</label>
                <Input placeholder="Enter phone or email" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Principal's Address</label>
                <Input placeholder="Enter address, city, state" />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Category</label>
                <select className="w-full px-3 py-2 border border-border rounded-lg bg-card">
                  <option>Property POA</option>
                  <option>Vehicle POA</option>
                  <option>Medical POA</option>
                  <option>Business POA</option>
                </select>
              </div>
            </div>
          </div>

          {/* Request Configuration */}
          <div>
            <h3 className="font-semibold mb-4">Request Configuration</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Request Category</label>
                <select className="w-full px-3 py-2 border border-border rounded-lg bg-card">
                  <option>Property POA</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Expiration Date (Optional)</label>
                <Input type="date" />
              </div>
            </div>
            <div className="mt-4">
              <Button variant="outline" className="w-full">
                Choose POA Template
              </Button>
            </div>
          </div>

          {/* Description of Powers */}
          <div>
            <h3 className="font-semibold mb-4">Description of Powers</h3>
            <Textarea placeholder="Clearly specify the powers assigned to the agent..." className="min-h-32" />
          </div>

          {/* Digital Signature */}
          <div>
            <h3 className="font-semibold mb-4">Digital Signature</h3>
            <Card className="p-6 bg-muted/30 border-dashed">
              <div className="text-center text-muted-foreground">
                Signature area - draw or upload signature
              </div>
            </Card>
          </div>

          {/* Agent Assignment */}
          <div>
            <h3 className="font-semibold mb-4">Agent Assignment</h3>
            <select className="w-full px-3 py-2 border border-border rounded-lg bg-card">
              <option>Select Agent</option>
              <option>Nati Geleta</option>
              <option>Sintayeyu Amele</option>
              <option>Badesa Alex</option>
            </select>
          </div>

          {/* Required Documents */}
          <div>
            <h3 className="font-semibold mb-4">Required Documents</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Checkbox id="principal" />
                <label htmlFor="principal" className="text-sm">
                  Principal's ID Proof
                </label>
              </div>
              <div className="flex items-center gap-3">
                <Checkbox id="property" />
                <label htmlFor="property" className="text-sm">
                  Property Deed / Title
                </label>
              </div>
              <div className="flex items-center gap-3">
                <Checkbox id="affidavit" />
                <label htmlFor="affidavit" className="text-sm">
                  Notarized Affidavit
                </label>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-3">Upload or link to any documents</p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t border-border">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button className="bg-primary text-primary-foreground">
              Create Request
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
