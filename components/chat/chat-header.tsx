"use client"

import { LogOut, PanelLeftClose, PanelLeftOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/handler/theme-toggle"
import { useWelcomePopup } from "@/hooks/useWelcomePopup"

interface ChatHeaderProps {
  onLogout: () => void
  onToggleSidebar: () => void
  isSidebarOpen: boolean
}

export default function ChatHeader({ onLogout, onToggleSidebar, isSidebarOpen }: ChatHeaderProps) {
  const { setFalseWelcomePopup } = useWelcomePopup()

  return (
    <header className="h-16 border-b bg-white dark:bg-gray-800 dark:border-gray-700 flex items-center justify-between px-4">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleSidebar}
          aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
        >
          {isSidebarOpen ? (
            <PanelLeftClose className="h-5 w-5" />
          ) : (
            <PanelLeftOpen className="h-5 w-5" />
          )}
        </Button>
      </div>
      <div className="flex items-center gap-2">
        <ThemeToggle />
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            setFalseWelcomePopup()
            onLogout()
          }}
          aria-label="Logout"
        >
          <LogOut className="h-5 w-5" />
        </Button>
      </div>
    </header>
  )
}
