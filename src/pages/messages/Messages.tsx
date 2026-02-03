import { useState, useEffect, useRef } from "react";
import { Layout } from "@/components/layout/Layout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  useConversations,
  useMessages,
  useSendMessage,
  useMarkAsRead,
} from "@/hooks/useMessages";
import { useAuth } from "@/hooks/useAuth";
import { NewConversationDialog } from "@/components/messages/NewConversationDialog";
import {
  Search,
  Send,
  MessageSquare,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export default function Messages() {
  const { user } = useAuth();
  const [selectedPartner, setSelectedPartner] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const [search, setSearch] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: conversations, isLoading: conversationsLoading, refetch: refetchConversations } = useConversations();
  const { data: messages, isLoading: messagesLoading } = useMessages(selectedPartner || "");
  const sendMessage = useSendMessage();
  const markAsRead = useMarkAsRead();

  const selectedConversation = conversations?.find(
    (c) => c.userId === selectedPartner
  );

  // Filter conversations by search
  const filteredConversations = conversations?.filter(
    (c) =>
      c.username.toLowerCase().includes(search.toLowerCase()) ||
      c.fullName?.toLowerCase().includes(search.toLowerCase())
  );

  // Mark messages as read when selecting a conversation
  useEffect(() => {
    if (selectedPartner && messages?.some((m) => !m.is_read && m.sender_id === selectedPartner)) {
      markAsRead.mutate(selectedPartner);
    }
  }, [selectedPartner, messages]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!messageInput.trim() || !selectedPartner) return;

    await sendMessage.mutateAsync({
      receiverId: selectedPartner,
      content: messageInput.trim(),
    });
    setMessageInput("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Layout showFooter={false}>
      <div className="container mx-auto px-4 py-4 h-[calc(100vh-4rem)]">
        <div className="flex h-full border rounded-lg overflow-hidden bg-card">
          {/* Conversation List */}
          <div
            className={cn(
              "w-full md:w-80 border-r flex flex-col",
              selectedPartner && "hidden md:flex"
            )}
          >
            <div className="p-4 border-b space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold">Messages</h2>
                <NewConversationDialog 
                  onSelectUser={(userId) => {
                    setSelectedPartner(userId);
                    refetchConversations();
                  }} 
                />
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search conversations..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <ScrollArea className="flex-1">
              {conversationsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                </div>
              ) : filteredConversations?.length === 0 ? (
                <div className="text-center py-8 px-4">
                  <MessageSquare className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">No conversations yet</p>
                </div>
              ) : (
                <div className="divide-y">
                  {filteredConversations?.map((conversation) => (
                    <button
                      key={conversation.userId}
                      onClick={() => setSelectedPartner(conversation.userId)}
                      className={cn(
                        "w-full p-4 flex items-start gap-3 hover:bg-muted/50 transition-colors text-left",
                        selectedPartner === conversation.userId && "bg-muted"
                      )}
                    >
                      <Avatar>
                        <AvatarImage src={conversation.avatarUrl || undefined} />
                        <AvatarFallback>
                          {conversation.username.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-medium truncate">
                            {conversation.fullName || conversation.username}
                          </span>
                          {conversation.unreadCount > 0 && (
                            <Badge className="h-5 w-5 p-0 flex items-center justify-center">
                              {conversation.unreadCount}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground truncate">
                          {conversation.lastMessage}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {format(new Date(conversation.lastMessageAt), "MMM d, h:mm a")}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>

          {/* Message View */}
          <div
            className={cn(
              "flex-1 flex flex-col",
              !selectedPartner && "hidden md:flex"
            )}
          >
            {selectedPartner ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden"
                    onClick={() => setSelectedPartner(null)}
                  >
                    <ArrowLeft className="h-5 w-5" />
                  </Button>
                  <Avatar>
                    <AvatarImage src={selectedConversation?.avatarUrl || undefined} />
                    <AvatarFallback>
                      {selectedConversation?.username.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">
                      {selectedConversation?.fullName || selectedConversation?.username}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      @{selectedConversation?.username}
                    </p>
                  </div>
                </div>

                {/* Messages */}
                <ScrollArea className="flex-1 p-4">
                  {messagesLoading ? (
                    <div className="flex items-center justify-center h-full">
                      <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {messages?.map((message) => {
                        const isOwn = message.sender_id === user?.id;
                        return (
                          <div
                            key={message.id}
                            className={cn(
                              "flex",
                              isOwn ? "justify-end" : "justify-start"
                            )}
                          >
                            <div
                              className={cn(
                                "max-w-[70%] rounded-lg px-4 py-2",
                                isOwn
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-muted"
                              )}
                            >
                              <p className="text-sm">{message.content}</p>
                              <p
                                className={cn(
                                  "text-xs mt-1",
                                  isOwn
                                    ? "text-primary-foreground/70"
                                    : "text-muted-foreground"
                                )}
                              >
                                {format(new Date(message.created_at), "h:mm a")}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                      <div ref={messagesEndRef} />
                    </div>
                  )}
                </ScrollArea>

                {/* Message Input */}
                <div className="p-4 border-t">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Type a message..."
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      disabled={sendMessage.isPending}
                    />
                    <Button
                      onClick={handleSend}
                      disabled={!messageInput.trim() || sendMessage.isPending}
                    >
                      {sendMessage.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">Select a conversation</h3>
                  <p className="text-muted-foreground">
                    Choose a conversation from the list to start messaging
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
