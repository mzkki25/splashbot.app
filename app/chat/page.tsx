"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useToast } from "@/components/ui/use-toast"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useStore } from "@/lib/store/useStore"
import { getCurrentChatSession } from "@/lib/auth"

import WelcomePopup from "@/components/welcome/welcome-popup"
import ChatSidebar from "@/components/chat/chat-sidebar"
import ChatHeader from "@/components/chat/chat-header"
import ChatInput from "@/components/chat/chat-input"
import ChatMessage from "@/components/chat/chat-message"
import ChatLoadingSkeleton from "@/components/chat/chat-loading-skeleton"
import ChatTypingIndicator from "@/components/chat/chat-typing-indicator"
import ChatErrorMessage from "@/components/chat/chat-error-message"
import InitialQuestions from "@/components/chat/chat-initial-questions"

import { useChatActions } from "@/hooks/useChatAction"
import { useInitialQuestions } from "@/hooks/useInitialQuestions"
import { useWelcomePopup } from "@/hooks/useWelcomePopup"
import ChatEmptyState from "@/components/chat/chat-empty-state"

export default function ChatPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [initialLoadComplete, setInitialLoadComplete] = useState(false)
  const [isScrolling, setIsScrolling] = useState(false)
  const [inputValue, setInputValue] = useState("")
  const [shouldFetchQuestions, setShouldFetchQuestions] = useState(false)
  const [chatError, setChatError] = useState<string | null>(null)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()
  const router = useRouter()
  const searchParams = useSearchParams()

  const { isWelcomePopupOpen, closeWelcomePopup } = useWelcomePopup()
  const { currentChat, chatHistory, isLoading, loadChatMessages, chatOption } = useStore()

  const showInitialQuestions =
    currentChat?.messages.length === 1 && currentChat.messages[0].role === "system" && !isLoading && !inputValue.trim()

  useEffect(() => {
    if (initialLoadComplete && showInitialQuestions) {
      console.log("Setting shouldFetchQuestions to true")
      setShouldFetchQuestions(true)
    } else if (!showInitialQuestions) {
      setShouldFetchQuestions(false)
    }
  }, [showInitialQuestions, initialLoadComplete])

  const { initialQuestions, isLoadingQuestions } = useInitialQuestions(chatOption, shouldFetchQuestions)

  const showEmptyState =
    currentChat?.messages.length === 1 && currentChat.messages[0].role === "system" && !isLoading && !initialQuestions.length && !isLoadingQuestions

  const {
    handleDeleteChat,
    handleClearAllChats,
    handleLogout,
    handleNewChat,
    handleFollowUpQuestionClick,
    loadChatHistoryData,
    handleSendMessage,
  } = useChatActions({ setInput: setInputValue, setIsMobileMenuOpen, setChatError })

  useEffect(() => {
    const chatId = searchParams.get("id")
    if (chatId && initialLoadComplete && (!currentChat || currentChat.id !== chatId)) {
      console.log("URL changed, loading chat:", chatId)
      loadChatMessages(chatId)
    }
  }, [searchParams, initialLoadComplete, currentChat, loadChatMessages])

  useEffect(() => {
    const initializeChat = async () => {
      try {
        await loadChatHistoryData()

        const chatId = searchParams.get("id")
        if (chatId) {
          await loadChatMessages(chatId)
        } else {
          const currentSessionId = getCurrentChatSession()
          if (currentSessionId) {
            await loadChatMessages(currentSessionId)
          } else {
            console.log("Creating new chat during initialization")
          }
        }
      } catch (error) {
        console.error("Error initializing chat:", error)
        toast({
          title: "Error",
          description: "Failed to initialize chat. Please try refreshing the page.",
          variant: "destructive",
        })

      } finally {
        setInitialLoadComplete(true)
      }
    }

    if (!initialLoadComplete) {
      initializeChat()
    }
  }, [initialLoadComplete, router, searchParams, toast, loadChatMessages, loadChatHistoryData])

  useEffect(() => {
    if (currentChat) {
      console.log("Current chat updated:", {
        id: currentChat.id,
        messageCount: currentChat.messages.length,
        firstMessageRole: currentChat.messages[0]?.role,
      })
    } else {
      console.log("Current chat is null")
    }
  }, [currentChat])

  useEffect(() => {
    if (!isScrolling && messagesEndRef.current) {
      requestAnimationFrame(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
      })
    }
  }, [currentChat?.messages, isScrolling])

  const handleScroll = () => {
    if (!scrollAreaRef.current) return

    const { scrollTop, scrollHeight, clientHeight } = scrollAreaRef.current
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 50

    setIsScrolling(!isAtBottom)
  }

  const handleInitialQuestionClick = (question: string) => {
    setInputValue(question)
    setShouldFetchQuestions(false)
    handleSendMessage(question)
  }

  useEffect(() => {
    const meta = document.createElement("meta")
    meta.name = "viewport"
    meta.content = "width=device-width, initial-scale=1, maximum-scale=1"
    document.head.appendChild(meta)

    return () => {
      document.head.removeChild(meta)
    }
  }, [])

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <WelcomePopup isOpen={isWelcomePopupOpen} onClose={closeWelcomePopup} />

      {/* Mobile sidebar */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetContent side="left" className="p-0 w-[280px]" showClose={false}>
          <ChatSidebar
            chatHistory={chatHistory}
            onDeleteChat={handleDeleteChat}
            onClearAllChats={handleClearAllChats}
            onLogout={handleLogout}
            onNewChat={handleNewChat}
            onClose={() => setIsMobileMenuOpen(false)}
          />
        </SheetContent>
      </Sheet>

      {/* Desktop sidebar */}
      <div
        className={`hidden md:block border-r bg-white dark:bg-gray-800 dark:border-gray-700 transition-all duration-300 overflow-hidden ${
          isSidebarOpen ? "w-[280px]" : "w-0"
        }`}
      >
        <ChatSidebar
          chatHistory={chatHistory}
          onDeleteChat={handleDeleteChat}
          onClearAllChats={handleClearAllChats}
          onLogout={handleLogout}
          onNewChat={handleNewChat}
        />
      </div>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col min-w-0">
        <ChatHeader
          onLogout={handleLogout}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          isSidebarOpen={isSidebarOpen}
        />

        <main className="flex-1 overflow-hidden flex flex-col">
          {/* Messages area */}
          <ScrollArea className="flex-1 p-4 mobile-scroll" onScrollCapture={handleScroll} ref={scrollAreaRef}>
            <div className="space-y-4 max-w-3xl mx-auto">
              {currentChat?.messages.map((message) => (
                <ChatMessage key={message.id} message={message} onFollowUpQuestionClick={handleFollowUpQuestionClick} />
              ))}

              {isLoading && <ChatTypingIndicator />}

              {chatError && !isLoading && (
                <ChatErrorMessage
                  error={chatError}
                  onRetry={() => {
                    setChatError(null)
                    const lastUserMsg = currentChat?.messages.filter(m => m.role === "user").pop()
                    if (lastUserMsg) {
                      setInputValue(lastUserMsg.content)
                      handleSendMessage(lastUserMsg.content)
                    }
                  }}
                />
              )}

              {/* Show initial questions if this is a new chat */}
              {showInitialQuestions && (
                <InitialQuestions
                  questions={initialQuestions}
                  onQuestionClick={handleInitialQuestionClick}
                  isLoading={isLoadingQuestions}
                />
              )}

              {/* Empty state when no initial questions loaded yet */}
              {showEmptyState && (
                <ChatEmptyState onStartQuestion={handleInitialQuestionClick} />
              )}

              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Scroll to bottom button - shows when not at bottom */}
          {isScrolling && (currentChat?.messages?.length ?? 0) > 3 && (
            <Button
              className="absolute bottom-24 right-4 rounded-full shadow-md"
              size="sm"
              onClick={() => {
                messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
                setIsScrolling(false)
              }}
              aria-label="Scroll to bottom"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </Button>
          )}

          {/* Input area */}
          <ChatInput isLoading={isLoading} inputValue={inputValue} setInputValue={setInputValue} />
        </main>
      </div>
    </div>
  )
}
