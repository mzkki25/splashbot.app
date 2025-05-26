import type { StateCreator } from "zustand"
import {
  getCurrentChatSession,
  generateChatSessionId,
  storeCurrentChatSession,
  getIdToken,
  waitForTokenReady,
} from "../auth"
import { messagesApi } from "../api/message"

export interface ChatMessage {
  id: string
  role: "user" | "assistant" | "system"
  content: string
  timestamp: string
  file?: {
    name?: string
    type?: string
    size?: number
    url?: string
    id?: string
  }
  references?: string[]
  follow_up_question?: string[]
  result?: string | null // Add result field for API response
}

export interface ChatSession {
  id: string
  title: string
  timestamp: string
  messages: ChatMessage[]
}

export interface ChatSessionSlice {
  currentChat: ChatSession | null
  chatHistory: ChatSession[]
  setCurrentChat: (chat: ChatSession | null) => void
  addMessage: (message: ChatMessage) => void
  setChatHistory: (history: ChatSession[]) => void
  deleteChat: (chatId: string) => void
  clearAllChats: () => void
  createNewChat: () => void
  loadChatMessages: (chatSessionId: string) => Promise<void>
}

// Create a welcome message helper function
const createWelcomeMessage = (): ChatMessage => ({
  id: `system-welcome-${Date.now()}`,
  role: "system",
  content: "Hello! I'm SPLASHBot, your macroeconomics assistant. How can I help you today?",
  timestamp: new Date().toISOString(),
})

export const createChatSessionSlice: StateCreator<
  ChatSessionSlice & { isLoading: boolean },
  [],
  [],
  ChatSessionSlice
> = (set, get) => ({
  currentChat: null,
  chatHistory: [],

  setCurrentChat: (chat) => set({ currentChat: chat }),

  createNewChat: () => {
    const chatId = generateChatSessionId()
    const newChat: ChatSession = {
      id: chatId,
      title: "New Conversation",
      timestamp: new Date().toISOString(),
      messages: [createWelcomeMessage()],
    }
    set({ currentChat: newChat })
    set((state) => ({
      chatHistory: [newChat, ...state.chatHistory],
    }))
    storeCurrentChatSession(chatId)
  },

  addMessage: (message) =>
    set((state) => {
      if (!state.currentChat) {
        const newChat = {
          id: getCurrentChatSession() || generateChatSessionId(),
          title: message.content.slice(0, 30) + (message.content.length > 30 ? "..." : ""),
          timestamp: new Date().toISOString(),
          messages: [message],
        }

        storeCurrentChatSession(newChat.id)

        return {
          currentChat: newChat,
          chatHistory: [newChat, ...state.chatHistory],
        }
      }

      const updatedChat = {
        ...state.currentChat,
        messages: [...state.currentChat.messages, message],
      }

      const updatedHistory = state.chatHistory.map((chat) => (chat.id === updatedChat.id ? updatedChat : chat))

      return {
        currentChat: updatedChat,
        chatHistory: updatedHistory,
      }
    }),

  setChatHistory: (history) => set({ chatHistory: history }),

  deleteChat: (chatId) =>
    set((state) => ({
      chatHistory: state.chatHistory.filter((chat) => chat.id !== chatId),
      currentChat: state.currentChat?.id === chatId ? null : state.currentChat,
    })),

  clearAllChats: () =>
    set({
      chatHistory: [],
      currentChat: null,
    }),

  loadChatMessages: async (chatSessionId: string) => {
    if (get().isLoading) return
    try {
      set({ isLoading: true })

      await waitForTokenReady()
      const idToken = getIdToken()
      if (!idToken) throw new Error("Not authenticated")

      const currentChat = get().currentChat
      const isNewLocalChat =
        currentChat?.id === chatSessionId &&
        currentChat?.messages?.length === 1 &&
        currentChat?.messages?.[0]?.role === "system"

      if (isNewLocalChat) {
        console.log("Using existing new chat session, not loading from server")
        storeCurrentChatSession(chatSessionId)
        set({ isLoading: false })
        return
      }

      const messages = await messagesApi.getChatMessages(chatSessionId, idToken)

      if (messages.length === 0) {
        console.log("No messages found for chat, creating new chat with welcome message")
        const chatSession: ChatSession = {
          id: chatSessionId,
          title: "New Conversation",
          timestamp: new Date().toISOString(),
          messages: [createWelcomeMessage()],
        }

        set({ currentChat: chatSession })
        storeCurrentChatSession(chatSessionId)
        return
      }

      const formattedMessages: ChatMessage[] = messages.map((msg) => {
        let content: string
        let result: string | null = null

        if (typeof msg.content === "object" && msg.content !== null) {
          const contentObj = msg.content as { explanation?: string; result?: string | null }
          content = contentObj.explanation || "No content available"
          result = contentObj.result || null
        } else {
          content = String(msg.content || "")
        }

        return {
          id: msg.message_id,
          role: msg.role,
          content: content,
          timestamp: new Date(msg.timestamp).toISOString(),
          file: msg.file_id ? { id: msg.file_id } : undefined,
          references: msg.references || [],
          result: result,
        }
      })

      const chatSession: ChatSession = {
        id: chatSessionId,
        title:
          formattedMessages.length && formattedMessages[0].role === "user"
            ? formattedMessages[0].content.slice(0, 30) + (formattedMessages[0].content.length > 30 ? "..." : "")
            : "Conversation",
        timestamp: formattedMessages[0]?.timestamp ?? new Date().toISOString(),
        messages: formattedMessages,
      }

      set({ currentChat: chatSession })
      storeCurrentChatSession(chatSessionId)
    } catch (err) {
      console.error("Error loading chat messages:", err)

      const chatSession: ChatSession = {
        id: chatSessionId,
        title: "New Conversation",
        timestamp: new Date().toISOString(),
        messages: [createWelcomeMessage()],
      }

      set({ currentChat: chatSession })
      storeCurrentChatSession(chatSessionId)
    } finally {
      set({ isLoading: false })
    }
  },
})
