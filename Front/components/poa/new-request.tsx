'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { DigitalSignature } from '@/components/digital-signature'
import { ArrowLeft, Upload, Cloud } from 'lucide-react'

interface POANewRequestProps {
  onBack: () => void
}

export function POANewRequest({ onBack }: POANewRequestProps) {
  const [formData, setFormData] = useState({
    fullName: '',
    contactInfo: '',
    address: '',
    category: 'Property POA',
    expiration: '',
    description: '',
  })
  const [signature, setSignature] = useState<string | null>(null)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [checkedDocs, setCheckedDocs] = useState({
    principal: false,
    property: false,
    agent: false,
    notary: false,
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
    const files = Array.from(e.dataTransfer.files)
    setUploadedFiles(prev => [...prev, ...files])
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files ? Array.from(e.currentTarget.files) : []
    setUploadedFiles(prev => [...prev, ...files])
  }

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleCheckboxChange = (doc: keyof typeof checkedDocs) => {
    setCheckedDocs(prev => ({ ...prev, [doc]: !prev[doc] }))
  }

  return (
    <div className="w-full overflow-y-auto">
      <div className="w-full min-h-screen p-4 sm:p-6 lg:p-8">
        <div className="max-w-3xl mx-auto w-full">
          <div className="flex items-center gap-2 mb-6">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-primary hover:underline text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Requests
            </button>
          </div>

          <div className="mb-6">
            <p className="text-xs sm:text-sm text-muted-foreground mb-2">POA Requests / New Request</p>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">New POA Request</h1>
          </div>

          <div className="space-y-6 pb-12">
            {/* Principal Information */}
            <Card className="p-4 sm:p-6">
              <h2 className="text-base sm:text-lg md:text-xl font-bold mb-4">Principal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-2">Principal's Full Name</label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Enter name..."
                    className="w-full px-3 sm:px-4 py-2 rounded-lg border border-border bg-card focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-2">Principal's Contact Info</label>
                  <input
                    type="email"
                    name="contactInfo"
                    value={formData.contactInfo}
                    onChange={handleInputChange}
                    placeholder="Enter phone or email"
                    className="w-full px-3 sm:px-4 py-2 rounded-lg border border-border bg-card focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs sm:text-sm font-medium mb-2">Principal's Address</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Enter your address, city, etc."
                    className="w-full px-3 sm:px-4 py-2 rounded-lg border border-border bg-card focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                  />
                </div>
              </div>
            </Card>

            {/* Request Configuration */}
            <Card className="p-4 sm:p-6">
              <h2 className="text-base sm:text-lg md:text-xl font-bold mb-4">Request Configuration</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-2">Request Category</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-3 sm:px-4 py-2 rounded-lg border border-border bg-card focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                  >
                    <option>Property POA</option>
                    <option>Vehicle POA</option>
                    <option>Medical POA</option>
                    <option>Business POA</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium mb-2">Expiration Date (Optional)</label>
                  <input
                    type="date"
                    name="expiration"
                    value={formData.expiration}
                    onChange={handleInputChange}
                    className="w-full px-3 sm:px-4 py-2 rounded-lg border border-border bg-card focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                  />
                </div>
              </div>
              <div className="mt-4">
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90 text-xs sm:text-sm">
                  Choose POA Template
                </Button>
              </div>
            </Card>

            {/* Description of Powers */}
            <Card className="p-4 sm:p-6">
              <h2 className="text-base sm:text-lg md:text-xl font-bold mb-4">Description of Powers</h2>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Clearly describe the scope of powers..."
                rows={5}
                className="w-full px-3 sm:px-4 py-2 rounded-lg border border-border bg-card focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              />
              <p className="text-xs text-muted-foreground mt-2">0 / 1000</p>
            </Card>

            {/* Digital Signature */}
            <Card className="p-4 sm:p-6">
              <DigitalSignature 
                onSign={(dataUrl) => {
                  setSignature(dataUrl)
                }}
              />
            </Card>

            {/* Agent Assignment */}
            <Card className="p-4 sm:p-6">
              <h2 className="text-base sm:text-lg md:text-xl font-bold mb-4">Agent Assignment</h2>
              <div>
                <label className="block text-xs sm:text-sm font-medium mb-2">Select Agent</label>
                <input
                  type="text"
                  placeholder="Search for an agent by name..."
                  className="w-full px-3 sm:px-4 py-2 rounded-lg border border-border bg-card focus:outline-none focus:ring-2 focus:ring-primary text-sm"
                />
              </div>
            </Card>

            {/* Required Documents */}
            <Card className="p-4 sm:p-6">
              <h2 className="text-base sm:text-lg md:text-xl font-bold mb-6">Required Documents</h2>
              
              {/* Checklist Section */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold mb-4">Checklist</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={checkedDocs.principal}
                      onChange={() => handleCheckboxChange('principal')}
                      className="w-5 h-5 rounded border-border accent-primary"
                    />
                    <span className="text-sm">Principal's ID Proof</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={checkedDocs.agent}
                      onChange={() => handleCheckboxChange('agent')}
                      className="w-5 h-5 rounded border-border accent-primary"
                    />
                    <span className="text-sm">Agent's ID Proof</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={checkedDocs.property}
                      onChange={() => handleCheckboxChange('property')}
                      className="w-5 h-5 rounded border-border accent-primary"
                    />
                    <span className="text-sm">Property Deed / Title</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={checkedDocs.notary}
                      onChange={() => handleCheckboxChange('notary')}
                      className="w-5 h-5 rounded border-border accent-primary"
                    />
                    <span className="text-sm">Notarized Affidavit</span>
                  </label>
                </div>
              </div>

              {/* Upload Area - Light Blue Background */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`p-8 sm:p-12 rounded-lg transition-colors text-center cursor-pointer ${
                  isDragging
                    ? 'bg-primary/10 border-2 border-primary'
                    : 'bg-blue-50 border-2 border-dashed border-blue-200'
                }`}
              >
                <div className="flex flex-col items-center justify-center gap-3">
                  <Cloud className="w-10 h-10 text-primary" />
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      <label htmlFor="file-upload" className="text-primary hover:underline cursor-pointer">
                        Upload a file
                      </label>
                      {' or drag and drop'}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">PNG, JPG, PDF up to 10MB</p>
                  </div>
                  <input
                    type="file"
                    multiple
                    onChange={handleFileInput}
                    className="hidden"
                    id="file-upload"
                  />
                </div>
              </div>

              {/* Uploaded Files List */}
              {uploadedFiles.length > 0 && (
                <div className="mt-4 space-y-2">
                  <p className="text-sm font-medium">Uploaded Files:</p>
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-muted rounded-lg text-sm">
                      <span className="truncate">{file.name}</span>
                      <button
                        onClick={() => removeFile(index)}
                        className="text-xs text-destructive hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {/* Submit Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-end pb-4">
              <Button variant="outline" onClick={onBack} className="text-xs sm:text-sm">
                Save as Draft
              </Button>
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 text-xs sm:text-sm">
                Submit Request
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
