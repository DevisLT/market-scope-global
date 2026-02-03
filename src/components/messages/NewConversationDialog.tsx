import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useUsers } from "@/hooks/useUsers";
import { MessageSquarePlus, Search, Loader2, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface NewConversationDialogProps {
  onSelectUser: (userId: string) => void;
}

const roleLabels: Record<string, string> = {
  seller: "Seller",
  buyer: "Buyer",
  industry: "Industry",
  admin: "Admin",
};

const roleColors: Record<string, string> = {
  seller: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  buyer: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  industry: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  admin: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
};

export function NewConversationDialog({ onSelectUser }: NewConversationDialogProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const { data: users, isLoading } = useUsers({ search, excludeSelf: true });

  const handleSelect = (userId: string) => {
    onSelectUser(userId);
    setOpen(false);
    setSearch("");
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <MessageSquarePlus className="h-4 w-4 mr-2" />
          New Message
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>New Conversation</DialogTitle>
          <DialogDescription>
            Search for a user to start a conversation with
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by username or name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <ScrollArea className="h-64">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : users?.length === 0 ? (
              <div className="text-center py-8">
                <User className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">
                  {search ? "No users found" : "Start typing to search"}
                </p>
              </div>
            ) : (
              <div className="space-y-1">
                {users?.map((user) => (
                  <button
                    key={user.id}
                    onClick={() => handleSelect(user.id)}
                    className="w-full p-3 flex items-center gap-3 hover:bg-muted/50 rounded-lg transition-colors text-left"
                  >
                    <Avatar>
                      <AvatarImage src={user.avatar_url || undefined} />
                      <AvatarFallback>
                        {user.username.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium truncate">
                          {user.full_name || user.username}
                        </span>
                        {user.role && (
                          <Badge
                            variant="secondary"
                            className={cn("text-xs", roleColors[user.role])}
                          >
                            {roleLabels[user.role]}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        @{user.username}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
