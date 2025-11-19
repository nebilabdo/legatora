'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft, CheckCircle2, Clock, AlertCircle } from 'lucide-react'

interface POARequest {
  id: string
  principal: string
  category: string
  submitted: string
  agent: string
  status: 'active' | 'pending' | 'rejected'
}

interface RequestDetailProps {
  request: POARequest
  onBack: () => void
}

export function POARequestDetail({ request, onBack }: RequestDetailProps) {
  return (
    <div className="w-full overflow-y-auto">
      <div className="w-full min-h-screen p-4 sm:p-6 lg:p-8">
        <div className="max-w-6xl mx-auto">
          {/* Back Button */}
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-primary hover:underline mb-6 text-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Requests
          </button>

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold mb-2">Request {request.id}</h1>
              <p className="text-xs sm:text-sm text-muted-foreground">
                Principal: <span className="font-medium">{request.principal}</span> | Category: <span className="font-medium">{request.category}</span>
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Button variant="outline" className="text-xs sm:text-sm">Assign Agent</Button>
              <Button className="bg-amber-500 text-white hover:bg-amber-600 text-xs sm:text-sm">In Progress</Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Content - 2 columns on large screens */}
            <div className="lg:col-span-2 space-y-6">
              {/* Principal Information */}
              <Card className="p-4 sm:p-6">
                <h2 className="text-base sm:text-lg font-bold mb-4">Principal Information</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Full Name</p>
                    <p className="text-sm font-medium">{request.principal}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Contact Info</p>
                    <p className="text-sm font-medium">+251964387384</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Address</p>
                    <p className="text-sm font-medium">Addis Ababa, Ethiopia</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Category</p>
                    <p className="text-sm font-medium">{request.category}</p>
                  </div>
                </div>
              </Card>

              {/* Submitted Documents */}
              <Card className="p-4 sm:p-6">
                <h2 className="text-base sm:text-lg font-bold mb-4">Submitted Documents</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                  {[
                    { name: 'POWER OF ATTORNEY', file: 'form1.jpg' },
                    { name: 'ID PROOF', file: 'form2.jpg' },
                    { name: 'ID Front', file: 'form3.jpg' },
                  ].map((doc, i) => (
                    <div key={i} className="border border-border rounded-lg p-3 sm:p-4 cursor-pointer hover:bg-muted/50 transition-colors">
                      <img 
                        src={`/.jpg?height=80&width=100&query=${doc.file}`}
                        alt={doc.name} 
                        className="w-full h-20 sm:h-24 object-cover rounded mb-2"
                      />
                      <p className="text-xs sm:text-sm font-medium line-clamp-2">{doc.name}</p>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Description of Powers */}
              <Card className="p-4 sm:p-6">
                <h2 className="text-base sm:text-lg font-bold mb-3">Description of Powers</h2>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  I authorize the assigned Attorney/Agent to represent me in all matters related to this request, including preparing, submitting, collecting, verifying, and receiving documents on my behalf from any government office, ministry, embassy, or private institution as required.
                </p>
              </Card>

              {/* POA Template & Digital Signature */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <Card className="p-4 sm:p-6">
                  <h3 className="text-base font-bold mb-3">POA Template Preview</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    I, [Client Name], residing at [23 Oak Avenue], hereby appoint [Agent Name] as my Attorney-in-Fact to represent me. This POA is valid for [30 days]...
                  </p>
                  <a href="#" className="text-xs sm:text-sm text-primary hover:underline mt-3 inline-block">View Full Document</a>
                </Card>
                <Card className="p-4 sm:p-6">
                  <h3 className="text-base font-bold mb-3">Digital Signature</h3>
                  <div className="border-2 border-dashed border-border rounded-lg h-32 flex items-center justify-center">
                    <img 
                      src="/handwritten-signature.png"
                      alt="signature"
                      className="w-32 h-16 object-contain"
                    />
                  </div>
                </Card>
              </div>
            </div>

            {/* Right Sidebar - Approval Workflow */}
            <div className="lg:col-span-1">
              <Card className="p-4 sm:p-6 sticky top-4">
                <h2 className="text-base sm:text-lg font-bold mb-5">Approval Workflow</h2>
                
                <div className="space-y-5">
                  {/* Authority Assigned - Complete */}
                  <div className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                      </div>
                      <div className="w-0.5 h-12 bg-green-200 my-1" />
                    </div>
                    <div className="pb-3">
                      <p className="text-xs sm:text-sm font-semibold text-foreground">Authority Assigned</p>
                      <p className="text-xs text-muted-foreground mt-1">October 25th, 2023</p>
                      <p className="text-xs text-muted-foreground mt-2">Request submitted and assigned to agent Anya Sharma.</p>
                    </div>
                  </div>

                  {/* Verification - In Progress */}
                  <div className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                        <Clock className="w-5 h-5 text-blue-600" />
                      </div>
                      <div className="w-0.5 h-12 bg-gray-200 my-1" />
                    </div>
                    <div className="pb-3">
                      <p className="text-xs sm:text-sm font-semibold text-foreground">Verification</p>
                      <p className="text-xs text-blue-600 font-medium mt-1">In Progress</p>
                      <p className="text-xs text-muted-foreground mt-2">Documents and signature are currently under review.</p>
                    </div>
                  </div>

                  {/* Completion - Pending */}
                  <div className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                        <AlertCircle className="w-5 h-5 text-gray-400" />
                      </div>
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-semibold text-gray-500">Completion</p>
                      <p className="text-xs text-muted-foreground mt-1">Pending</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
