'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, FileText, Users, Zap, BarChart3, Settings, LogOut, Moon, Sun } from 'lucide-react'
import Image from 'next/image'

interface SidebarItem {
  name: string
  href: string
  icon: React.ReactNode
}

const sidebarItems: SidebarItem[] = [
  { name: 'Dashboard', href: '/', icon: <BarChart3 className="w-5 h-5" /> },
  { name: 'POA Requests', href: '/poa-requests', icon: <FileText className="w-5 h-5" /> },
  { name: 'Document Verification', href: '/document-verification', icon: <FileText className="w-5 h-5" /> },
  { name: 'User Management', href: '/users', icon: <Users className="w-5 h-5" /> },
  { name: 'Agent Assignment', href: '/agents', icon: <Users className="w-5 h-5" /> },
  { name: 'Payments', href: '/payments', icon: <Zap className="w-5 h-5" /> },
  { name: 'AI & Automation Logs', href: '/logs', icon: <Zap className="w-5 h-5" /> },
  { name: 'Legal Templates', href: '/templates', icon: <FileText className="w-5 h-5" /> },
  { name: 'Audit Trail', href: '/audit', icon: <BarChart3 className="w-5 h-5" /> },
  { name: 'Settings', href: '/settings', icon: <Settings className="w-5 h-5" /> },
]

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isDark, setIsDark] = useState(false)
  const pathname = usePathname()

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-sidebar text-sidebar-foreground lg:hidden"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-56 bg-sidebar text-sidebar-foreground z-40 transform transition-transform duration-300 flex flex-col ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <img 
              src="/legatora-logo.png" 
              alt="LEGATORA" 
              className="w-8 h-8"
            />
            <div>
              <h1 className="font-bold text-lg">LEGATORA</h1>
              <p className="text-xs opacity-75">Admin Portal</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          {sidebarItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 px-6 py-3 transition-colors ${
                  isActive
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                    : 'hover:bg-sidebar-accent'
                }`}
              >
                {item.icon}
                <span className="text-sm font-medium">{item.name}</span>
              </Link>
            )
          })}
        </nav>

        {/* Footer */}
        <div className="border-t border-sidebar-border p-4 space-y-2">
          <button
            onClick={() => setIsDark(!isDark)}
            className="w-full flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-sidebar-accent transition-colors text-sm"
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            <span>Night Mode</span>
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-sidebar-accent transition-colors text-sm">
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  )
}
