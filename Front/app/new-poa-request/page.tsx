'use client'
//new poa -request
import { useState } from 'react'
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
        router.push('/poa-requests') // Back to list
      } else {
        const err = await res.json()
        alert('Error: ' + JSON.stringify(err.detail || 'Failed'))
      }
    } catch (err) {
      alert('Backend not running. Start: uvicorn main:app --reload')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background py-12 px-6 md:pl-64">
      {/* md:pl-64 adds padding so sidebar does not hide content */}
      <div className="max-w-4xl mx-auto w-full">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 mb-8 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="w-5 h-5" /> Back
        </button>

        <h1 className="text-4xl font-bold mb-4">Create New POA Request</h1>
        <p className="text-muted-foreground mb-10">Submit your Power of Attorney application</p>

        <form
          onSubmit={handleSubmit}
          className="bg-card p-10 rounded-2xl border shadow-lg space-y-8 overflow-auto max-h-[calc(100vh-6rem)]"
        >
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Label>Full Name *</Label>
              <Input name="full_name" required placeholder="Md. Ekramul Hasan" disabled={loading} />
            </div>
            <div>
              <Label>Contact Info *</Label>
              <Input name="contact_info" required placeholder="+88017..." disabled={loading} />
            </div>
          </div>

          <div>
            <Label>Address *</Label>
            <Textarea name="address" required rows={3} disabled={loading} />
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Label>Category *</Label>
              <Select name="category" required disabled={loading}>
                <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="property">Property</SelectItem>
                  <SelectItem value="vehicle">Vehicle</SelectItem>
                  <SelectItem value="medical">Medical</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                  <SelectItem value="general">General</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Expiration Date *</Label>
              <Input name="expiration_date" type="date" required disabled={loading} />
            </div>
          </div>

          <div>
            <Label>Description of Powers *</Label>
            <Textarea name="description_of_power" required rows={6} disabled={loading} />
          </div>

          <div>
            <Label>Quick Checklist (Optional)</Label>
            <div className="mt-4 grid md:grid-cols-2 gap-4">
              {checklistOptions.map(item => (
                <label key={item} className="flex items-center gap-3 p-4 border rounded-lg hover:bg-muted/50 cursor-pointer">
                  <Checkbox
                    checked={checklist.includes(item)}
                    onCheckedChange={(c) => c ? setChecklist([...checklist, item]) : setChecklist(checklist.filter(i => i !== item))}
                    disabled={loading}
                  />
                  <span>{item}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex gap-4 pt-6 border-t">
            <Button type="submit" size="lg" disabled={loading}>
              {loading ? <Loader2 className="mr-2 animate-spin" /> : <CheckCircle className="mr-2" />}
              {loading ? 'Submitting...' : 'Submit Request'}
            </Button>
            <Button type="button" variant="outline" size="lg" onClick={() => router.push('/poa-requests')} disabled={loading}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
