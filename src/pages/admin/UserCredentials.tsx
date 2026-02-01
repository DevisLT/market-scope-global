import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
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
  ArrowLeft,
} from "lucide-react";
import { format } from "date-fns";
import { roleLabels } from "@/lib/auth";
import { Link } from "react-router-dom";
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
      className="h-6 w-6"
      onClick={() => copyToClipboard(text, field)}
    >
      {copiedField === field ? (
        <Check className="h-3 w-3 text-green-500" />
      ) : (
        <Copy className="h-3 w-3" />
      )}
    </Button>
  );

  return (
    <Layout showFooter={false}>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button variant="ghost" asChild className="mb-4">
            <Link to="/admin">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Admin Panel
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">User Credentials</h1>
          <p className="text-muted-foreground">
            View complete user account details and credentials
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Users</CardTitle>
            <CardDescription>
              Click on a user to view their complete credentials
            </CardDescription>
            <div className="relative mt-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by username, email, name, or phone..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 max-w-md"
              />
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers?.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={user.avatar_url || undefined} />
                            <AvatarFallback className="text-xs">
                              {user.username.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-sm">{user.username}</p>
                            <p className="text-xs text-muted-foreground">
                              {user.full_name || "—"}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">
                          {user.email || <span className="text-muted-foreground">No email</span>}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm">
                          {user.phone || <span className="text-muted-foreground">—</span>}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">
                          {user.role ? roleLabels[user.role] : "Unknown"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {user.is_verified && (
                            <Badge className="bg-green-100 text-green-800 text-xs">
                              Verified
                            </Badge>
                          )}
                          {user.is_suspended && (
                            <Badge variant="destructive" className="text-xs">
                              Suspended
                            </Badge>
                          )}
                          {!user.is_verified && !user.is_suspended && (
                            <Badge variant="secondary" className="text-xs">
                              Pending
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">
                        {format(new Date(user.created_at), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedUser(user)}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}

            {!isLoading && filteredUsers?.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No users found matching your search.
              </div>
            )}
          </CardContent>
        </Card>

        {/* User Details Dialog */}
        <Dialog open={!!selectedUser} onOpenChange={() => setSelectedUser(null)}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={selectedUser?.avatar_url || undefined} />
                  <AvatarFallback>
                    {selectedUser?.username.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <span>{selectedUser?.username}</span>
                  {selectedUser?.role && (
                    <Badge variant="outline" className="ml-2 text-xs">
                      {roleLabels[selectedUser.role]}
                    </Badge>
                  )}
                </div>
              </DialogTitle>
              <DialogDescription>
                Complete user credentials and account information
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 mt-4">
              {/* User ID */}
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-3">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">User ID</p>
                    <p className="text-sm font-mono">{selectedUser?.id}</p>
                  </div>
                </div>
                {selectedUser?.id && (
                  <CopyButton text={selectedUser.id} field="id" />
                )}
              </div>

              {/* Username */}
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-3">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Username</p>
                    <p className="text-sm font-medium">{selectedUser?.username}</p>
                  </div>
                </div>
                {selectedUser?.username && (
                  <CopyButton text={selectedUser.username} field="username" />
                )}
              </div>

              {/* Full Name */}
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-3">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Full Name</p>
                    <p className="text-sm">{selectedUser?.full_name || "Not provided"}</p>
                  </div>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Email Address</p>
                    <p className="text-sm">{selectedUser?.email || "Not provided"}</p>
                  </div>
                </div>
                {selectedUser?.email && (
                  <CopyButton text={selectedUser.email} field="email" />
                )}
              </div>

              {/* Phone */}
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Phone Number</p>
                    <p className="text-sm">{selectedUser?.phone || "Not provided"}</p>
                  </div>
                </div>
                {selectedUser?.phone && (
                  <CopyButton text={selectedUser.phone} field="phone" />
                )}
              </div>

              {/* Account Status */}
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-3">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Account Status</p>
                    <div className="flex gap-2 mt-1">
                      {selectedUser?.is_verified ? (
                        <Badge className="bg-green-100 text-green-800">Verified</Badge>
                      ) : (
                        <Badge variant="secondary">Unverified</Badge>
                      )}
                      {selectedUser?.is_suspended && (
                        <Badge variant="destructive">Suspended</Badge>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Subscription */}
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-3">
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Subscription</p>
                    {subscription ? (
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            subscription.status === "active"
                              ? "default"
                              : subscription.status === "trial"
                              ? "secondary"
                              : "outline"
                          }
                        >
                          {subscription.plan} - {subscription.status}
                        </Badge>
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">No subscription</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Created Date */}
              <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Account Created</p>
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
      </div>
    </Layout>
  );
}
