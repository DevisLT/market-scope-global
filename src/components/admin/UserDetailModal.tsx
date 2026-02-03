import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { roleLabels, type AppRole } from "@/lib/auth";
import type { AdminUser } from "@/hooks/useAdmin";
import { useUpdateUserRole } from "@/hooks/useUserRole";
import { useSuspendUser, useVerifyUser } from "@/hooks/useAdmin";
import { useSoftDeleteUser } from "@/hooks/useDeletedItems";
import {
  User,
  Mail,
  Phone,
  Calendar,
  Shield,
  ShieldCheck,
  ShieldOff,
  Trash2,
  Loader2,
  AlertTriangle,
} from "lucide-react";
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

interface UserDetailModalProps {
  user: AdminUser | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const roles: AppRole[] = ["buyer", "seller", "industry", "admin"];

export function UserDetailModal({ user, open, onOpenChange }: UserDetailModalProps) {
  const [selectedRole, setSelectedRole] = useState<AppRole | undefined>(user?.role);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const updateRole = useUpdateUserRole();
  const suspendUser = useSuspendUser();
  const verifyUser = useVerifyUser();
  const softDeleteUser = useSoftDeleteUser();

  useEffect(() => {
    if (user) {
      setSelectedRole(user.role);
    }
  }, [user]);

  if (!user) return null;

  const handleRoleChange = (newRole: AppRole) => {
    setSelectedRole(newRole);
  };

  const handleSaveRole = () => {
    if (selectedRole && selectedRole !== user.role) {
      updateRole.mutate({
        userId: user.id,
        username: user.username,
        newRole: selectedRole,
        oldRole: user.role,
      });
    }
  };

  const handleToggleSuspend = () => {
    suspendUser.mutate({
      userId: user.id,
      username: user.username,
      suspend: !user.is_suspended,
    });
  };

  const handleToggleVerify = () => {
    verifyUser.mutate({
      userId: user.id,
      username: user.username,
      verify: !user.is_verified,
    });
  };

  const handleDelete = () => {
    softDeleteUser.mutate(
      { userId: user.id, username: user.username },
      { onSuccess: () => onOpenChange(false) }
    );
    setShowDeleteConfirm(false);
  };

  const isLoading =
    updateRole.isPending ||
    suspendUser.isPending ||
    verifyUser.isPending ||
    softDeleteUser.isPending;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[500px] bg-[hsl(var(--admin-bg-elevated))] border-[hsl(var(--admin-border))]">
          <DialogHeader>
            <DialogTitle className="text-[hsl(var(--admin-foreground))] flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={user.avatar_url || undefined} />
                <AvatarFallback className="bg-[hsl(var(--admin-accent))] text-[hsl(var(--admin-accent-foreground))]">
                  {user.username.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <span>{user.username}</span>
                <div className="flex gap-2 mt-1">
                  {user.is_verified && (
                    <Badge className="bg-[hsl(var(--admin-success))]/20 text-[hsl(var(--admin-success))] text-xs">
                      Verified
                    </Badge>
                  )}
                  {user.is_suspended && (
                    <Badge className="bg-[hsl(var(--admin-danger))]/20 text-[hsl(var(--admin-danger))] text-xs">
                      Suspended
                    </Badge>
                  )}
                </div>
              </div>
            </DialogTitle>
            <DialogDescription className="text-[hsl(var(--admin-foreground-muted))]">
              View and manage user details, role, and status
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* User Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-[hsl(var(--admin-foreground))]">
                <User className="h-4 w-4 text-[hsl(var(--admin-foreground-muted))]" />
                <span className="font-medium">Full Name:</span>
                <span className="text-[hsl(var(--admin-foreground-muted))]">
                  {user.full_name || "Not set"}
                </span>
              </div>
              <div className="flex items-center gap-3 text-[hsl(var(--admin-foreground))]">
                <Mail className="h-4 w-4 text-[hsl(var(--admin-foreground-muted))]" />
                <span className="font-medium">Email:</span>
                <span className="text-[hsl(var(--admin-foreground-muted))]">
                  {user.email || "Not set"}
                </span>
              </div>
              <div className="flex items-center gap-3 text-[hsl(var(--admin-foreground))]">
                <Phone className="h-4 w-4 text-[hsl(var(--admin-foreground-muted))]" />
                <span className="font-medium">Phone:</span>
                <span className="text-[hsl(var(--admin-foreground-muted))]">
                  {user.phone || "Not set"}
                </span>
              </div>
              <div className="flex items-center gap-3 text-[hsl(var(--admin-foreground))]">
                <Calendar className="h-4 w-4 text-[hsl(var(--admin-foreground-muted))]" />
                <span className="font-medium">Joined:</span>
                <span className="text-[hsl(var(--admin-foreground-muted))]">
                  {format(new Date(user.created_at), "PPP")}
                </span>
              </div>
            </div>

            <Separator className="bg-[hsl(var(--admin-border))]" />

            {/* Role Management */}
            <div className="space-y-3">
              <Label className="text-[hsl(var(--admin-foreground))] flex items-center gap-2">
                <Shield className="h-4 w-4" />
                User Role
              </Label>
              <div className="flex gap-3">
                <Select
                  value={selectedRole}
                  onValueChange={(value) => handleRoleChange(value as AppRole)}
                >
                  <SelectTrigger className="w-[200px] bg-[hsl(var(--admin-bg-muted))] border-[hsl(var(--admin-border))] text-[hsl(var(--admin-foreground))]">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent className="bg-[hsl(var(--admin-bg-elevated))] border-[hsl(var(--admin-border))]">
                    {roles.map((role) => (
                      <SelectItem
                        key={role}
                        value={role}
                        className="text-[hsl(var(--admin-foreground))] focus:bg-[hsl(var(--admin-bg-muted))]"
                      >
                        {roleLabels[role]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  onClick={handleSaveRole}
                  disabled={selectedRole === user.role || isLoading}
                  className="bg-[hsl(var(--admin-accent))] hover:bg-[hsl(var(--admin-accent))]/90 text-[hsl(var(--admin-accent-foreground))]"
                >
                  {updateRole.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Save Role"
                  )}
                </Button>
              </div>
              {selectedRole === "admin" && selectedRole !== user.role && (
                <p className="text-sm text-[hsl(var(--admin-warning))] flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  This will grant full admin access to the system
                </p>
              )}
            </div>

            <Separator className="bg-[hsl(var(--admin-border))]" />

            {/* Quick Actions */}
            <div className="space-y-3">
              <Label className="text-[hsl(var(--admin-foreground))]">Quick Actions</Label>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleToggleVerify}
                  disabled={isLoading}
                  className="border-[hsl(var(--admin-border))] text-[hsl(var(--admin-foreground))]"
                >
                  {verifyUser.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : user.is_verified ? (
                    <ShieldOff className="h-4 w-4 mr-2" />
                  ) : (
                    <ShieldCheck className="h-4 w-4 mr-2" />
                  )}
                  {user.is_verified ? "Remove Verification" : "Verify User"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleToggleSuspend}
                  disabled={isLoading}
                  className={
                    user.is_suspended
                      ? "border-[hsl(var(--admin-success))]/50 text-[hsl(var(--admin-success))]"
                      : "border-[hsl(var(--admin-warning))]/50 text-[hsl(var(--admin-warning))]"
                  }
                >
                  {suspendUser.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <ShieldOff className="h-4 w-4 mr-2" />
                  )}
                  {user.is_suspended ? "Unsuspend User" : "Suspend User"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowDeleteConfirm(true)}
                  disabled={isLoading}
                  className="border-[hsl(var(--admin-danger))]/50 text-[hsl(var(--admin-danger))] hover:bg-[hsl(var(--admin-danger))]/10"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete User
                </Button>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-[hsl(var(--admin-border))] text-[hsl(var(--admin-foreground))]"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent className="bg-[hsl(var(--admin-bg-elevated))] border-[hsl(var(--admin-border))]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[hsl(var(--admin-foreground))]">
              Delete User?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-[hsl(var(--admin-foreground-muted))]">
              This will move <strong>{user.username}</strong> to the trash. You can restore them later from the Deleted Items section.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-[hsl(var(--admin-border))] text-[hsl(var(--admin-foreground))]">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-[hsl(var(--admin-danger))] hover:bg-[hsl(var(--admin-danger))]/90 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
