"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import type { User, Message } from "@/types/messaging"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MessageItem } from "@/components/message-item"
import { Send, AlertCircle } from "lucide-react"

interface MessagePanelProps {
  isConnected: boolean
  messages: Message[]
  currentUser: User | null
  onSendMessage: (text: string) => void
  onAddReaction: (messageId: string, reactionType: string) => void
  onAddComment: (messageId: string, text: string) => void
}

export function MessagePanel({
  isConnected,
  messages,
  currentUser,
  onSendMessage,
  onAddReaction,
  onAddComment,
}: MessagePanelProps) {
  const [messageInput, setMessageInput] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (messageInput.trim() && isConnected) {
      onSendMessage(messageInput.trim())
      setMessageInput("")
    }
  }

  return (
    <div className="flex-1 flex flex-col h-full">
      <div className="border-b p-4 flex items-center justify-between">
        <div>
          <h2 className="font-semibold">Chat Room</h2>
          <p className="text-sm text-muted-foreground">{messages.length} messages</p>
        </div>
        {!isConnected && (
          <div className="flex items-center gap-2 text-amber-500 bg-amber-50 px-3 py-1 rounded-full text-sm">
            <AlertCircle className="h-4 w-4" />
            <span>Disconnected</span>
          </div>
        )}
      </div>

      {!isConnected && (
        <div className="bg-amber-50 border border-amber-200 p-3 m-4 rounded-md">
          <div className="flex items-center gap-2 text-amber-700">
            <AlertCircle className="h-5 w-5" />
            <div>
              <p className="font-medium">Connection lost</p>
              <p className="text-sm">Attempting to reconnect to the chat server...</p>
            </div>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <MessageItem
            key={message.id}
            message={message}
            currentUser={currentUser}
            onAddReaction={onAddReaction}
            onAddComment={onAddComment}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t p-4">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            placeholder="Type a message..."
            disabled={!isConnected}
            className="flex-1"
          />
          <Button type="submit" disabled={!isConnected || !messageInput.trim()}>
            <Send className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </div>
    </div>
  )
}
