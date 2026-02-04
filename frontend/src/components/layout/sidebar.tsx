'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { 
  LayoutDashboard, 
  Database, 
  Bot, 
  Tags, 
  BarChart3, 
  Settings,
  FileText,
  X,
  BookOpen,
  ChevronDown,
  ChevronRight
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Data Sources', href: '/data-sources', icon: Database },
  { name: 'Agents', href: '/agents', icon: Bot },
  { name: 'Taxonomies', href: '/taxonomies', icon: Tags },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Reports', href: '/reports', icon: FileText },
  { 
    name: 'Documentation', 
    icon: BookOpen,
    submenu: [
      { name: 'Overview', href: '/docs' },
      { name: 'Tech Stack Architecture', href: '/docs/architecture' },
      { name: 'Production Readiness', href: '/docs/production' },
      { name: 'API Reference', href: 'http://localhost:8000/api/v1/docs', external: true },
    ]
  },
  { name: 'Settings', href: '/settings', icon: Settings },
]

interface SidebarProps {
  open: boolean
  onClose: () => void
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname()
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null)

  const toggleSubmenu = (name: string) => {
    setOpenSubmenu(openSubmenu === name ? null : name)
  }

  const NavItem = ({ item, mobile = false }: { item: typeof navigation[0], mobile?: boolean }) => {
    if ('submenu' in item && item.submenu) {
      const isOpen = openSubmenu === item.name
      const hasActiveChild = item.submenu.some((sub) => !sub.external && pathname === sub.href)
      
      return (
        <div key={item.name}>
          <button
            onClick={() => toggleSubmenu(item.name)}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors w-full',
              hasActiveChild || isOpen
                ? 'bg-accent text-accent-foreground'
                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
            )}
          >
            <item.icon className="h-5 w-5" />
            {item.name}
            {isOpen ? (
              <ChevronDown className="h-4 w-4 ml-auto" />
            ) : (
              <ChevronRight className="h-4 w-4 ml-auto" />
            )}
          </button>
          {isOpen && (
            <div className="ml-8 mt-1 space-y-1">
              {item.submenu.map((subItem) => {
                const isActive = !subItem.external && pathname === subItem.href
                if (subItem.external) {
                  return (
                    <a
                      key={subItem.name}
                      href={subItem.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                    >
                      {subItem.name}
                      <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  )
                }
                return (
                  <Link
                    key={subItem.name}
                    href={subItem.href}
                    onClick={mobile ? onClose : undefined}
                    className={cn(
                      'flex items-center rounded-lg px-3 py-2 text-sm transition-colors',
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                    )}
                  >
                    {subItem.name}
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      )
    }

    const isActive = 'href' in item && pathname === item.href
    return (
      <Link
        key={item.name}
        href={'href' in item ? item.href : '#'}
        onClick={mobile ? onClose : undefined}
        className={cn(
          'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
          isActive
            ? 'bg-primary text-primary-foreground'
            : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
        )}
      >
        <item.icon className="h-5 w-5" />
        {item.name}
      </Link>
    )
  }

  return (
    <>
      {/* Mobile sidebar */}
      <div className={cn(
        "fixed inset-0 z-50 lg:hidden",
        open ? "block" : "hidden"
      )}>
        <div className="fixed inset-0 bg-black/50" onClick={onClose} />
        <div className="fixed inset-y-0 left-0 w-64 bg-card border-r">
          <div className="flex h-16 items-center justify-between px-6">
            <div>
              <div className="text-sm font-bold">Agentic Fiscal Policy</div>
              <div className="text-xs text-muted-foreground">Intelligence Platform <span className="text-primary">v1.0.9</span></div>
            </div>
            <button onClick={onClose} className="lg:hidden">
              <X className="h-6 w-6" />
            </button>
          </div>
          <nav className="space-y-1 px-3">
            {navigation.map((item) => (
              <NavItem key={item.name} item={item} mobile />
            ))}
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow border-r bg-card overflow-y-auto">
          <div className="flex h-16 items-center px-6">
            <div>
              <div className="text-sm font-bold">Agentic Fiscal Policy</div>
              <div className="text-xs text-muted-foreground">Intelligence Platform <span className="text-primary">v1.0.9</span></div>
            </div>
          </div>
          <nav className="flex-1 space-y-1 px-3 py-4">
            {navigation.map((item) => (
              <NavItem key={item.name} item={item} />
            ))}
          </nav>
        </div>
      </div>
    </>
  )
}
