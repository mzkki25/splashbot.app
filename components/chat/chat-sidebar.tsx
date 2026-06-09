"use client"

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Trash2, LogOut, Plus, Search, Check, Pencil } from "lucide-react"
import { formatDistanceToNow, isToday, isYesterday, isThisWeek, isThisMonth } from "date-fns"
import React, { useState, useEffect, useMemo } from "react"
import Image from "next/image"
import SafeClientOnly from "@/components/handler/safe-client-only"
import type { ChatSession } from "@/lib/store/chatSessionStore"
import { useWelcomePopup } from "@/hooks/useWelcomePopup"
import { historyApi } from "@/lib/api/history"
import { getIdToken, waitForTokenReady } from "@/lib/auth"

interface ChatSidebarProps {
  chatHistory: ChatSession[]
  onDeleteChat: (chatId: string) => void
  onClearAllChats: () => void
  onLogout: () => void
  onNewChat: () => void
  onClose?: () => void
}

function getDateGroup(dateStr: string): string {
  const date = new Date(dateStr)
  if (isToday(date)) return "Hari ini"
  if (isYesterday(date)) return "Kemarin"
  if (isThisWeek(date)) return "Minggu ini"
  if (isThisMonth(date)) return "Bulan ini"
  return "Lebih lama"
}

const GROUP_ORDER = ["Hari ini", "Kemarin", "Minggu ini", "Bulan ini", "Lebih lama"]

export default React.memo(function ChatSidebar({
  chatHistory,
  onDeleteChat,
  onClearAllChats,
  onLogout,
  onNewChat,
  onClose,
}: ChatSidebarProps) {
  const [hoveredChatId, setHoveredChatId] = useState<string | null>(null)
  const [activeChatId, setActiveChatId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState("")
  const { setFalseWelcomePopup } = useWelcomePopup()

  useEffect(() => {
    const updateActive = () => {
      const params = new URLSearchParams(window.location.search)
      setActiveChatId(params.get("id"))
    }
    updateActive()
    window.addEventListener("popstate", updateActive)
    return () => window.removeEventListener("popstate", updateActive)
  }, [])

  const handleChatClick = (chatId: string) => {
    setActiveChatId(chatId)
    window.location.href = `/chat?id=${chatId}`
    onClose?.()
  }

  const filteredHistory = useMemo(() => {
    if (!searchQuery.trim()) return chatHistory
    const q = searchQuery.toLowerCase()
    return chatHistory.filter((c) => c.title.toLowerCase().includes(q))
  }, [chatHistory, searchQuery])

  const grouped = useMemo(() => {
    const groups: Record<string, ChatSession[]> = {}
    for (const chat of filteredHistory) {
      const g = getDateGroup(chat.timestamp)
      if (!groups[g]) groups[g] = []
      groups[g].push(chat)
    }
    return GROUP_ORDER.filter((g) => groups[g] && groups[g].length > 0).map((g) => ({
      label: g,
      chats: groups[g],
    }))
  }, [filteredHistory])

  const handleDeleteClick = (chatId: string) => {
    setDeleteConfirmId(chatId)
  }

  const confirmDelete = () => {
    if (deleteConfirmId) {
      onDeleteChat(deleteConfirmId)
      setDeleteConfirmId(null)
    }
  }

  const startRename = (chatId: string, currentTitle: string) => {
    setEditingId(chatId)
    setEditTitle(currentTitle)
  }

  const saveRename = async (chatId: string) => {
    if (!editTitle.trim() || editTitle.trim() === chatHistory.find(c => c.id === chatId)?.title) {
      setEditingId(null)
      return
    }
    try {
      await waitForTokenReady()
      const token = getIdToken()
      if (!token) return
      await historyApi.renameChat(chatId, editTitle.trim(), token)
      window.location.reload()
    } catch {
      setEditingId(null)
    }
  }

  return (
    <div className="flex flex-col h-full">
      {/* Logo Header */}
      <div className="px-4 pt-4 pb-2 flex items-center gap-2">
        <div className="w-8 h-8 rounded-md overflow-hidden bg-white dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
          <Image
            src="/splashbot-logo.png"
            alt="SPLASHBot Logo"
            width={28}
            height={28}
          />
        </div>
        <span className="text-lg font-bold text-gray-800 dark:text-white">SPLASHBot</span>
      </div>

      {/* New Chat Button */}
      <div className="p-4">
        <Button className="w-full flex items-center gap-2 h-10" onClick={onNewChat}>
          <Plus className="h-4 w-4" />
          New Chat
        </Button>
      </div>

      {/* Search */}
      <div className="px-4 pb-2">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            className="pl-8 h-8 text-sm"
            placeholder="Cari chat..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Chat History List */}
      <ScrollArea className="flex-1 px-2">
        {grouped.length > 0 ? (
          <div className="space-y-3 py-2">
            {grouped.map((group) => (
              <div key={group.label}>
                <p className="px-3 py-1 text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                  {group.label}
                </p>
                <div className="space-y-0.5">
                  {group.chats.map((chat) => (
                    <div
                      key={chat.id}
                      className={`
                        group relative rounded-md transition-colors cursor-pointer
                        ${activeChatId === chat.id
                          ? "bg-blue-100 dark:bg-blue-900/40 font-medium"
                          : "hover:bg-gray-100 dark:hover:bg-gray-800"
                        }
                      `}
                      onMouseEnter={() => setHoveredChatId(chat.id)}
                      onMouseLeave={() => setHoveredChatId(null)}
                      onClick={() => handleChatClick(chat.id)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") handleChatClick(chat.id)
                      }}
                    >
                      {/* Active indicator bar */}
                      {activeChatId === chat.id && (
                        <div className="absolute left-0 top-1 bottom-1 w-0.5 bg-blue-500 rounded-full" />
                      )}

                      <div className="pl-4 pr-9 py-2.5">
                        {editingId === chat.id ? (
                          <form
                            onSubmit={(e) => { e.preventDefault(); saveRename(chat.id) }}
                            className="flex items-center gap-1"
                          >
                            <Input
                              autoFocus
                              className="h-7 text-sm py-0"
                              value={editTitle}
                              onChange={(e) => setEditTitle(e.target.value)}
                              onBlur={() => saveRename(chat.id)}
                              onKeyDown={(e) => {
                                if (e.key === "Escape") setEditingId(null)
                              }}
                            />
                            <Button type="submit" size="icon" variant="ghost" className="h-7 w-7 flex-shrink-0">
                              <Check className="h-3.5 w-3.5 text-green-500" />
                            </Button>
                          </form>
                        ) : (
                          <>
                            <div className="text-sm truncate">{chat.title}</div>
                            <SafeClientOnly fallback={<div className="text-[10px] text-gray-400">...</div>}>
                              <div className="text-[10px] text-gray-400 mt-0.5">
                                {formatDistanceToNow(new Date(chat.timestamp), { addSuffix: true })}
                              </div>
                            </SafeClientOnly>
                          </>
                        )}
                      </div>

                      {(hoveredChatId === chat.id) && !editingId && (
                        <div className="absolute right-1 top-1/2 -translate-y-1/2 flex gap-0.5">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 opacity-60 hover:opacity-100 hover:bg-gray-200 dark:hover:bg-gray-700"
                            onClick={(e) => {
                              e.stopPropagation()
                              startRename(chat.id, chat.title)
                            }}
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 opacity-60 hover:opacity-100 hover:bg-red-100 hover:text-red-500 dark:hover:bg-red-900/30"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDeleteClick(chat.id)
                            }}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : searchQuery ? (
          <div className="py-8 text-center text-sm text-gray-400">Tidak ada chat yang cocok</div>
        ) : (
          <div className="py-8 text-center text-sm text-gray-400">Belum ada chat</div>
        )}
      </ScrollArea>

      {/* Footer */}
      <div className="p-4 border-t mt-auto space-y-2">
        {chatHistory.length > 0 && (
          <Button
            variant="outline"
            className="w-full text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
            onClick={onClearAllChats}
          >
            Clear All Chats
          </Button>
        )}
        <Button
          variant="outline"
          className="w-full"
          onClick={() => {
            setFalseWelcomePopup()
            onLogout()
          }}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Logout
        </Button>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteConfirmId} onOpenChange={(open) => !open && setDeleteConfirmId(null)}>
        <DialogContent className="sm:max-w-[380px]">
          <DialogHeader>
            <DialogTitle>Hapus chat?</DialogTitle>
            <DialogDescription>
              Chat ini akan dihapus permanen dan tidak bisa dikembalikan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 sm:justify-end">
            <Button variant="outline" size="sm" onClick={() => setDeleteConfirmId(null)}>
              Batal
            </Button>
            <Button variant="destructive" size="sm" onClick={confirmDelete}>
              Hapus
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
})
