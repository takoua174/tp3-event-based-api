"use client"

import { useState } from "react"
import type { User, Channel } from "@/types/messaging"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MessageSquare, Users, Settings, Plus } from "lucide-react"

interface ChatSidebarProps {
  currentUser: User | null
  channels: Channel[]
  users: User[]
  activeChannel: Channel | null
  onChannelSelect: (channel: Channel) => void
}

export function ChatSidebar({ currentUser, channels, users, activeChannel, onChannelSelect }: ChatSidebarProps) {
  const [activeTab, setActiveTab] = useState("channels")

  return (
    <div className="w-64 border-r bg-muted/10 flex flex-col h-full">
      {currentUser && (
        <div className="p-4 border-b flex items-center gap-3">
          <Avatar>
            <AvatarImage src={currentUser.avatar || "/placeholder.svg"} alt={currentUser.name} />
            <AvatarFallback>{currentUser.name.substring(0, 2)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-medium text-sm">{currentUser.name}</span>
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <span
                className={cn("w-2 h-2 rounded-full", currentUser.status === "online" ? "bg-green-500" : "bg-gray-400")}
              />
              {currentUser.status === "online" ? "Online" : "Offline"}
            </span>
          </div>
        </div>
      )}

      <Tabs defaultValue="channels" className="flex-1 flex flex-col">
        <TabsList className="grid grid-cols-3 mx-2 mt-2">
          <TabsTrigger value="channels" onClick={() => setActiveTab("channels")}>
            <MessageSquare className="h-4 w-4" />
          </TabsTrigger>
          <TabsTrigger value="users" onClick={() => setActiveTab("users")}>
            <Users className="h-4 w-4" />
          </TabsTrigger>
          <TabsTrigger value="settings" onClick={() => setActiveTab("settings")}>
            <Settings className="h-4 w-4" />
          </TabsTrigger>
        </TabsList>

        <TabsContent value="channels" className="flex-1 overflow-y-auto p-2">
          <div className="flex justify-between items-center mb-2 px-2">
            <h3 className="font-semibold text-sm">Channels</h3>
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-1">
            {channels.map((channel) => (
              <button
                key={channel.id}
                className={cn(
                  "w-full text-left px-3 py-2 rounded-md text-sm flex items-center justify-between",
                  activeChannel?.id === channel.id ? "bg-accent text-accent-foreground" : "hover:bg-muted/50",
                )}
                onClick={() => onChannelSelect(channel)}
              >
                <span># {channel.name}</span>
                {channel.unreadCount > 0 && (
                  <span className="bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-xs">
                    {channel.unreadCount}
                  </span>
                )}
              </button>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="users" className="flex-1 overflow-y-auto p-2">
          <h3 className="font-semibold text-sm px-2 mb-2">Users</h3>
          <div className="space-y-1">
            {users.map((user) => (
              <div key={user.id} className="px-3 py-2 rounded-md text-sm flex items-center gap-2 hover:bg-muted/50">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                  <AvatarFallback>{user.name.substring(0, 2)}</AvatarFallback>
                </Avatar>
                <span>{user.name}</span>
                <span
                  className={cn(
                    "w-2 h-2 rounded-full ml-auto",
                    user.status === "online" ? "bg-green-500" : "bg-gray-400",
                  )}
                />
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="settings" className="flex-1 p-4">
          <h3 className="font-semibold mb-4">Settings</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Theme</label>
              <select className="w-full p-2 rounded-md border">
                <option>Light</option>
                <option>Dark</option>
                <option>System</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Notifications</label>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="notifications" className="rounded" />
                <label htmlFor="notifications" className="text-sm">
                  Enable notifications
                </label>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
