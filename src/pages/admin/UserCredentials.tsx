import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AdminLayout } from "@/components/admin";
import { useAdminUsers } from "@/hooks/useAdmin";
import {
  Search,
  Loader2,
  Eye,
  Mail,
  Phone,
  User,
  Calendar,
  Shield,
  CreditCard,
  Copy,
  Check,
} from "lucide-react";
import { format } from "date-fns";
import { roleLabels } from "@/lib/auth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { AdminUser } from "@/hooks/useAdmin";

interface UserSubscription {
  id: string;
  plan: string;
  status: string;
  current_period_end: string | null;
  trial_ends_at: string | null;
}

function useUserSubscription(userId: string | null) {
  return useQuery({
    queryKey: ["user-subscription", userId],
    queryFn: async () => {
      if (!userId) return null;
      const { data, error } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", userId)
        .single();

      if (error) return null;
      return data as UserSubscription;
    },
    enabled: !!userId,
  });
}

export default function UserCredentials() {
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const { data: users, isLoading } = useAdminUsers();
  const { data: subscription } = useUserSubscription(selectedUser?.id || null);

  const filteredUsers = users?.filter(
    (u) =>
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase()) ||
      u.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      u.phone?.toLowerCase().includes(search.toLowerCase())
  );

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const CopyButton = ({ text, field }: { text: string; field: string }) => (
    <Button
      variant="ghost"
      size="icon"
      className="h-6 w-6 text-[hsl(var(--admin-foreground-muted))] hover:text-[hsl(var(--admin-foreground))]"
      onClick={() => copyToClipboard(text, field)}
    >
      {copiedField === field ? (
        <Check className="h-3 w-3 text-[hsl(var(--admin-success))]" />
      ) : (
        <Copy className="h-3 w-3" />
      )}
    </Button>
  );

  return (
    <AdminLayout title="User Credentials" description="View complete user account details and credentials">
      <Card className="bg-[hsl(var(--admin-bg-elevated))] border-[hsl(var(--admin-border))]">
        <CardHeader>
          <CardTitle className="text-[hsl(var(--admin-foreground))]">All Users</CardTitle>
          <CardDescription className="text-[hsl(var(--admin-foreground-muted))]">
            Click on a user to view their complete credentials
          </CardDescription>
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[hsl(var(--admin-foreground-muted))]" />
            <Input
              placeholder="Search by username, email, name, or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 max-w-md bg-[hsl(var(--admin-bg-muted))] border-[hsl(var(--admin-border))] text-[hsl(var(--admin-foreground))] placeholder:text-[hsl(var(--admin-foreground-muted))]"
            />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-[hsl(var(--admin-accent))]" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-[hsl(var(--admin-border))] hover:bg-transparent">
                    <TableHead className="text-[hsl(var(--admin-foreground-muted))]">User</TableHead>
                    <TableHead className="text-[hsl(var(--admin-foreground-muted))]">Email</TableHead>
                    <TableHead className="text-[hsl(var(--admin-foreground-muted))]">Phone</TableHead>
                    <TableHead className="text-[hsl(var(--admin-foreground-muted))]">Role</TableHead>
                    <TableHead className="text-[hsl(var(--admin-foreground-muted))]">Status</TableHead>
                    <TableHead className="text-[hsl(var(--admin-foreground-muted))]">Joined</TableHead>
                    <TableHead className="w-[100px] text-[hsl(var(--admin-foreground-muted))]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers?.map((user) => (
                    <TableRow
                      key={user.id}
                      className="border-[hsl(var(--admin-border))] hover:bg-[hsl(var(--admin-bg-muted))]"
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={user.avatar_url || undefined} />
                            <AvatarFallback className="bg-[hsl(var(--admin-accent))] text-[hsl(var(--admin-accent-foreground))] text-xs">
                              {user.username.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-sm text-[hsl(var(--admin-foreground))]">
                              {user.username}
                            </p>
                            <p className="text-xs text-[hsl(var(--admin-foreground-muted))]">
                              {user.full_name || "—"}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-[hsl(var(--admin-foreground))]">
                          {user.email || (
                            <span className="text-[hsl(var(--admin-foreground-muted))]">No email</span>
                          )}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-[hsl(var(--admin-foreground))]">
                          {user.phone || (
                            <span className="text-[hsl(var(--admin-foreground-muted))]">—</span>
                          )}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="text-xs border-[hsl(var(--admin-accent))] text-[hsl(var(--admin-accent))]"
                        >
                          {user.role ? roleLabels[user.role] : "Unknown"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {user.is_verified && (
                            <Badge className="bg-[hsl(var(--admin-success))]/20 text-[hsl(var(--admin-success))] text-xs border-0">
                              Verified
                            </Badge>
                          )}
                          {user.is_suspended && (
                            <Badge className="bg-[hsl(var(--admin-danger))]/20 text-[hsl(var(--admin-danger))] text-xs border-0">
                              Suspended
                            </Badge>
                          )}
                          {!user.is_verified && !user.is_suspended && (
                            <Badge className="bg-[hsl(var(--admin-bg-muted))] text-[hsl(var(--admin-foreground-muted))] text-xs border-0">
                              Pending
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-[hsl(var(--admin-foreground))]">
                        {format(new Date(user.created_at), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedUser(user)}
                          className="border-[hsl(var(--admin-border))] text-[hsl(var(--admin-foreground))] hover:bg-[hsl(var(--admin-bg-muted))] hover:border-[hsl(var(--admin-accent))]"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {!isLoading && filteredUsers?.length === 0 && (
            <div className="text-center py-8 text-[hsl(var(--admin-foreground-muted))]">
              No users found matching your search.
            </div>
          )}
        </CardContent>
      </Card>

      {/* User Details Dialog */}
      <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
        <DialogContent className="max-w-lg bg-[hsl(var(--admin-bg-elevated))] border-[hsl(var(--admin-border))] text-[hsl(var(--admin-foreground))]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={selectedUser?.avatar_url || undefined} />
                <AvatarFallback className="bg-[hsl(var(--admin-accent))] text-[hsl(var(--admin-accent-foreground))]">
                  {selectedUser?.username.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <span>{selectedUser?.username}</span>
                {selectedUser?.role && (
                  <Badge
                    variant="outline"
                    className="ml-2 text-xs border-[hsl(var(--admin-accent))] text-[hsl(var(--admin-accent))]"
                  >
                    {roleLabels[selectedUser.role]}
                  </Badge>
                )}
              </div>
            </DialogTitle>
            <DialogDescription className="text-[hsl(var(--admin-foreground-muted))]">
              Complete user credentials and account information
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 mt-4">
            {[
              { icon: User, label: "User ID", value: selectedUser?.id, field: "id", mono: true },
              { icon: User, label: "Username", value: selectedUser?.username, field: "username" },
              { icon: User, label: "Full Name", value: selectedUser?.full_name || "Not provided", field: null },
              { icon: Mail, label: "Email Address", value: selectedUser?.email || "Not provided", field: selectedUser?.email ? "email" : null },
              { icon: Phone, label: "Phone Number", value: selectedUser?.phone || "Not provided", field: selectedUser?.phone ? "phone" : null },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between p-3 bg-[hsl(var(--admin-bg-muted))] rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <item.icon className="h-4 w-4 text-[hsl(var(--admin-foreground-muted))]" />
                  <div>
                    <p className="text-xs text-[hsl(var(--admin-foreground-muted))]">{item.label}</p>
                    <p className={`text-sm ${item.mono ? "font-mono" : ""}`}>{item.value}</p>
                  </div>
                </div>
                {item.field && item.value && (
                  <CopyButton text={item.value} field={item.field} />
                )}
              </div>
            ))}

            {/* Account Status */}
            <div className="flex items-center justify-between p-3 bg-[hsl(var(--admin-bg-muted))] rounded-lg">
              <div className="flex items-center gap-3">
                <Shield className="h-4 w-4 text-[hsl(var(--admin-foreground-muted))]" />
                <div>
                  <p className="text-xs text-[hsl(var(--admin-foreground-muted))]">Account Status</p>
                  <div className="flex gap-2 mt-1">
                    {selectedUser?.is_verified ? (
                      <Badge className="bg-[hsl(var(--admin-success))]/20 text-[hsl(var(--admin-success))]">
                        Verified
                      </Badge>
                    ) : (
                      <Badge className="bg-[hsl(var(--admin-bg))] text-[hsl(var(--admin-foreground-muted))]">
                        Unverified
                      </Badge>
                    )}
                    {selectedUser?.is_suspended && (
                      <Badge className="bg-[hsl(var(--admin-danger))]/20 text-[hsl(var(--admin-danger))]">
                        Suspended
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Subscription */}
            <div className="flex items-center justify-between p-3 bg-[hsl(var(--admin-bg-muted))] rounded-lg">
              <div className="flex items-center gap-3">
                <CreditCard className="h-4 w-4 text-[hsl(var(--admin-foreground-muted))]" />
                <div>
                  <p className="text-xs text-[hsl(var(--admin-foreground-muted))]">Subscription</p>
                  {subscription ? (
                    <Badge
                      className={
                        subscription.status === "active"
                          ? "bg-[hsl(var(--admin-success))]/20 text-[hsl(var(--admin-success))]"
                          : subscription.status === "trial"
                          ? "bg-[hsl(var(--admin-accent))]/20 text-[hsl(var(--admin-accent))]"
                          : "bg-[hsl(var(--admin-bg))] text-[hsl(var(--admin-foreground-muted))]"
                      }
                    >
                      {subscription.plan} - {subscription.status}
                    </Badge>
                  ) : (
                    <p className="text-sm text-[hsl(var(--admin-foreground-muted))]">No subscription</p>
                  )}
                </div>
              </div>
            </div>

            {/* Created Date */}
            <div className="flex items-center justify-between p-3 bg-[hsl(var(--admin-bg-muted))] rounded-lg">
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-[hsl(var(--admin-foreground-muted))]" />
                <div>
                  <p className="text-xs text-[hsl(var(--admin-foreground-muted))]">Account Created</p>
                  <p className="text-sm">
                    {selectedUser?.created_at &&
                      format(new Date(selectedUser.created_at), "MMMM d, yyyy 'at' h:mm a")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
