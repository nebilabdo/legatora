'use client'

import { Sidebar } from '@/components/sidebar'
import { Header } from '@/components/header'

export default function AuditPage() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />

      <main className="flex-1 lg:ml-56 flex flex-col overflow-hidden">
        <Header />

        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-7xl">
            <h1 className="text-3xl font-bold mb-8">Audit Trail</h1>
            <div className="bg-card p-8 rounded-lg border border-border text-center">
              <p className="text-muted-foreground">Audit Trail page coming soon</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
