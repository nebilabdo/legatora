'use client'

import { useState } from 'react'
import { Sidebar } from '@/components/sidebar'
import { Header } from '@/components/header'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { ArrowLeft, CheckCircle, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

const checklistOptions = [
  'Sell or transfer property',
  'Sign legal documents',
  'Manage bank accounts',
  'Represent in court',
  'Handle medical decisions',
  'Collect rents or payments',
]

export default function NewPOARequestPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [checklist, setChecklist] = useState<string[]>([])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    const form = e.currentTarget
    const payload = {
      full_name: form.full_name.value.trim(),
      contact_info: form.contact_info.value.trim(),
      address: form.address.value.trim(),
      category: form.category.value,
      expiration_date: form.expiration_date.value,
      description_of_power: form.description_of_power.value.trim(),
      checklist_items: checklist,
    }

    try {
      const res = await fetch('https://legatora-backend.onrender.com/poa-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        alert('POA Request Created Successfully!')
        router.push('/poa-requests')
      } else {
        const err = await res.json()
        alert('Error: ' + JSON.stringify(err.detail || 'Failed to create request'))
      }
    } catch (err) {
      console.error('Submission error:', err)
      alert('Failed to connect to server. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar: fixed width to prevent overlapping */}
      <div className="w-64 flex-shrink-0">
        <Sidebar />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header />

        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-4xl mx-auto">
            <button 
              onClick={() => router.back()} 
              className="flex items-center gap-2 mb-6 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" /> 
              Back
            </button>

            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New POA Request</h1>
              <p className="text-gray-600">Submit your Power of Attorney application</p>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 shadow-sm p-8 space-y-8">
              {/* Personal Information */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 border-b pb-2">Personal Information</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="full_name">Full Name *</Label>
                    <Input id="full_name" name="full_name" required placeholder="Enter full legal name" disabled={loading} className="w-full" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contact_info">Contact Info *</Label>
                    <Input id="contact_info" name="contact_info" required placeholder="Phone number or email" disabled={loading} className="w-full" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address *</Label>
                  <Textarea id="address" name="address" required rows={3} placeholder="Enter complete residential address" disabled={loading} className="w-full resize-none" />
                </div>
              </div>

              {/* POA Details */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-900 border-b pb-2">POA Details</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select name="category" required disabled={loading}>
                      <SelectTrigger id="category" className="w-full">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="property">Property</SelectItem>
                        <SelectItem value="vehicle">Vehicle</SelectItem>
                        <SelectItem value="medical">Medical</SelectItem>
                        <SelectItem value="business">Business</SelectItem>
                        <SelectItem value="general">General</SelectItem>
                        <SelectItem value="financial">Financial</SelectItem>
                        <SelectItem value="legal">Legal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="expiration_date">Expiration Date *</Label>
                    <Input id="expiration_date" name="expiration_date" type="date" required disabled={loading} className="w-full" min={new Date().toISOString().split('T')[0]} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description_of_power">Description of Powers *</Label>
                  <Textarea id="description_of_power" name="description_of_power" required rows={6} placeholder="Describe powers..." disabled={loading} className="w-full resize-none" />
                  <p className="text-xs text-gray-500">Be specific about what the agent can and cannot do.</p>
                </div>
              </div>

              {/* Checklist */}
              <div className="space-y-6">
                <Label>Quick Checklist (Optional)</Label>
                <p className="text-xs text-gray-500 mb-4">Select common powers to quickly define the scope of authority</p>
                <div className="grid md:grid-cols-2 gap-3">
                  {checklistOptions.map((item, index) => (
                    <label key={index} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer min-w-0">
                      <Checkbox
                        checked={checklist.includes(item)}
                        onCheckedChange={(checked) => 
                          checked ? setChecklist([...checklist, item]) : setChecklist(checklist.filter(i => i !== item))
                        }
                        disabled={loading}
                      />
                      <span className="text-sm text-gray-700 flex-1 min-w-0 break-words">{item}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Form Actions */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
                <Button type="submit" size="lg" disabled={loading} className="flex-1 sm:flex-none">
                  {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Submitting...</> : <><CheckCircle className="w-4 h-4 mr-2" />Submit Request</>}
                </Button>
                <Button type="button" variant="outline" size="lg" onClick={() => router.push('/poa-requests')} disabled={loading} className="flex-1 sm:flex-none">
                  Cancel
                </Button>
              </div>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">Need help? Contact support at support@legatora.com</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
