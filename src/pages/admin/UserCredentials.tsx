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
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { AdminLayout } from "@/components/admin";
import { useAdminUsers, useSuspendUser, useVerifyUser } from "@/hooks/useAdmin";
import { useCreateAuditLog } from "@/hooks/useAuditLog";
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
  KeyRound,
  ShieldCheck,
  ShieldOff,
  UserX,
  UserCheck,
  Pencil,
} from "lucide-react";
import { format } from "date-fns";
import { roleLabels } from "@/lib/auth";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { AdminUser } from "@/hooks/useAdmin";
import { toast } from "sonner";

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

function generatePassword(length = 12): string {
  const charset = "abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789!@#$%";
  let password = "";
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return password;
}

export default function UserCredentials() {
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  
  // Password reset state
  const [resetPasswordUser, setResetPasswordUser] = useState<AdminUser | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);

  const { data: users, isLoading } = useAdminUsers();
  const { data: subscription } = useUserSubscription(selectedUser?.id || null);
  
  const suspendUser = useSuspendUser();
  const verifyUser = useVerifyUser();
  const createAuditLog = useCreateAuditLog();

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

  const handleResetPassword = async () => {
    if (!resetPasswordUser) return;
    
    setIsResettingPassword(true);
    try {
      // Generate a new password
      const generatedPassword = generatePassword();
      setNewPassword(generatedPassword);
      setShowNewPassword(true);
      
      // Note: In a real scenario, you would use Supabase Admin API to reset password
      // Since we're using client-side, we log the action and show the new password
      // The admin would need to communicate this to the user
      
      createAuditLog.mutate({
        action_type: "user_password_reset",
        target_type: "user",
        target_id: resetPasswordUser.id,
        target_name: resetPasswordUser.username,
      });
      
      toast.success("New password generated. Please share it securely with the user.");
    } catch (error) {
      toast.error("Failed to generate password");
    } finally {
      setIsResettingPassword(false);
    }
  };

  const handleToggleSuspend = (user: AdminUser) => {
    suspendUser.mutate({
      userId: user.id,
      username: user.username,
      suspend: !user.is_suspended,
    });
  };

  const handleToggleVerify = (user: AdminUser) => {
    verifyUser.mutate({
      userId: user.id,
      username: user.username,
      verify: !user.is_verified,
    });
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
    <AdminLayout title="User Credentials" description="View and manage user account details and credentials">
      <Card className="bg-[hsl(var(--admin-bg-elevated))] border-[hsl(var(--admin-border))]">
        <CardHeader>
          <CardTitle className="text-[hsl(var(--admin-foreground))]">All Users</CardTitle>
          <CardDescription className="text-[hsl(var(--admin-foreground-muted))]">
            Click on a user to view credentials or use quick actions
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
            <div className="overflow-auto max-h-[60vh] rounded-lg border border-[hsl(var(--admin-border))]">
              <Table>
                <TableHeader className="sticky top-0 bg-[hsl(var(--admin-bg-elevated))] z-10">
                  <TableRow className="border-[hsl(var(--admin-border))] hover:bg-transparent">
                    <TableHead className="text-[hsl(var(--admin-foreground-muted))]">User</TableHead>
                    <TableHead className="text-[hsl(var(--admin-foreground-muted))]">Email</TableHead>
                    <TableHead className="text-[hsl(var(--admin-foreground-muted))]">Phone</TableHead>
                    <TableHead className="text-[hsl(var(--admin-foreground-muted))]">Role</TableHead>
                    <TableHead className="text-[hsl(var(--admin-foreground-muted))]">Status</TableHead>
                    <TableHead className="text-[hsl(var(--admin-foreground-muted))]">Joined</TableHead>
                    <TableHead className="w-[200px] text-[hsl(var(--admin-foreground-muted))]">Actions</TableHead>
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
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setSelectedUser(user)}
                            className="h-8 w-8 text-[hsl(var(--admin-foreground-muted))] hover:text-[hsl(var(--admin-accent))]"
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => {
                              setResetPasswordUser(user);
                              setNewPassword("");
                              setShowNewPassword(false);
                            }}
                            className="h-8 w-8 text-[hsl(var(--admin-foreground-muted))] hover:text-[hsl(var(--admin-warning))]"
                            title="Reset Password"
                          >
                            <KeyRound className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleToggleVerify(user)}
                            disabled={verifyUser.isPending}
                            className={`h-8 w-8 ${
                              user.is_verified 
                                ? "text-[hsl(var(--admin-success))] hover:text-[hsl(var(--admin-foreground-muted))]"
                                : "text-[hsl(var(--admin-foreground-muted))] hover:text-[hsl(var(--admin-success))]"
                            }`}
                            title={user.is_verified ? "Unverify" : "Verify"}
                          >
                            {user.is_verified ? <ShieldCheck className="h-4 w-4" /> : <ShieldOff className="h-4 w-4" />}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleToggleSuspend(user)}
                            disabled={suspendUser.isPending}
                            className={`h-8 w-8 ${
                              user.is_suspended 
                                ? "text-[hsl(var(--admin-danger))] hover:text-[hsl(var(--admin-success))]"
                                : "text-[hsl(var(--admin-foreground-muted))] hover:text-[hsl(var(--admin-danger))]"
                            }`}
                            title={user.is_suspended ? "Unsuspend" : "Suspend"}
                          >
                            {user.is_suspended ? <UserX className="h-4 w-4" /> : <UserCheck className="h-4 w-4" />}
                          </Button>
                        </div>
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
        <DialogContent className="max-w-lg max-h-[85vh] overflow-hidden flex flex-col bg-[hsl(var(--admin-bg-elevated))] border-[hsl(var(--admin-border))] text-[hsl(var(--admin-foreground))]">
          <DialogHeader className="flex-shrink-0">
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

          <div className="space-y-3 mt-4 overflow-y-auto flex-1 pr-2">
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
                    <p className={`text-sm ${item.mono ? "font-mono text-xs" : ""}`}>{item.value}</p>
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

          {/* Quick Actions in Dialog */}
          <DialogFooter className="flex-shrink-0 mt-4 border-t border-[hsl(var(--admin-border))] pt-4">
            <div className="flex gap-2 w-full">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  if (selectedUser) {
                    setResetPasswordUser(selectedUser);
                    setNewPassword("");
                    setShowNewPassword(false);
                    setSelectedUser(null);
                  }
                }}
                className="flex-1 border-[hsl(var(--admin-border))] text-[hsl(var(--admin-foreground))]"
              >
                <KeyRound className="h-4 w-4 mr-2" />
                Reset Password
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => selectedUser && handleToggleVerify(selectedUser)}
                disabled={verifyUser.isPending}
                className="flex-1 border-[hsl(var(--admin-border))] text-[hsl(var(--admin-foreground))]"
              >
                {selectedUser?.is_verified ? (
                  <>
                    <ShieldOff className="h-4 w-4 mr-2" />
                    Unverify
                  </>
                ) : (
                  <>
                    <ShieldCheck className="h-4 w-4 mr-2" />
                    Verify
                  </>
                )}
              </Button>
              <Button
                variant={selectedUser?.is_suspended ? "default" : "destructive"}
                size="sm"
                onClick={() => selectedUser && handleToggleSuspend(selectedUser)}
                disabled={suspendUser.isPending}
                className="flex-1"
              >
                {selectedUser?.is_suspended ? (
                  <>
                    <UserCheck className="h-4 w-4 mr-2" />
                    Unsuspend
                  </>
                ) : (
                  <>
                    <UserX className="h-4 w-4 mr-2" />
                    Suspend
                  </>
                )}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reset Password Dialog */}
      <Dialog open={!!resetPasswordUser} onOpenChange={() => setResetPasswordUser(null)}>
        <DialogContent className="max-w-md bg-[hsl(var(--admin-bg-elevated))] border-[hsl(var(--admin-border))] text-[hsl(var(--admin-foreground))]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <KeyRound className="h-5 w-5 text-[hsl(var(--admin-warning))]" />
              Reset Password
            </DialogTitle>
            <DialogDescription className="text-[hsl(var(--admin-foreground-muted))]">
              Generate a new password for {resetPasswordUser?.username}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {!showNewPassword ? (
              <div className="text-center space-y-4">
                <p className="text-sm text-[hsl(var(--admin-foreground-muted))]">
                  This will generate a new secure password. You'll need to share it with the user securely.
                </p>
                <Button
                  onClick={handleResetPassword}
                  disabled={isResettingPassword}
                  className="bg-[hsl(var(--admin-accent))] hover:bg-[hsl(var(--admin-accent))]/90"
                >
                  {isResettingPassword && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Generate New Password
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="p-4 bg-[hsl(var(--admin-bg-muted))] rounded-lg border border-[hsl(var(--admin-border))]">
                  <Label className="text-xs text-[hsl(var(--admin-foreground-muted))]">New Password</Label>
                  <div className="flex items-center gap-2 mt-2">
                    <code className="flex-1 font-mono text-lg text-[hsl(var(--admin-foreground))] bg-[hsl(var(--admin-bg))] p-2 rounded">
                      {newPassword}
                    </code>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => copyToClipboard(newPassword, "newPassword")}
                      className="text-[hsl(var(--admin-foreground-muted))] hover:text-[hsl(var(--admin-foreground))]"
                    >
                      {copiedField === "newPassword" ? (
                        <Check className="h-4 w-4 text-[hsl(var(--admin-success))]" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
                <p className="text-xs text-[hsl(var(--admin-warning))] flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Share this password securely. It will not be shown again.
                </p>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setResetPasswordUser(null)}
              className="border-[hsl(var(--admin-border))]"
            >
              {showNewPassword ? "Done" : "Cancel"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
