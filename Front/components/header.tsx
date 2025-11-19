'use client'

import { Bell, Search, User } from 'lucide-react'

export function Header() {
  return (
    <header className="sticky top-0 z-20 w-full bg-background border-b border-border">
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by title, type, location..."
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-muted border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button className="relative p-2 rounded-lg hover:bg-muted transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full" />
          </button>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-muted transition-colors">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-bold">
              BA
            </div>
            <div className="hidden sm:block text-sm">
              <p className="font-medium">Bilan Ayale</p>
              <p className="text-xs text-muted-foreground">Admin</p>
            </div>
          </button>
        </div>
      </div>
    </header>
  )
}
