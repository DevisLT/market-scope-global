import { useState } from "react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AdminLayout } from "@/components/admin";
import {
  useAdminUsers,
  useAdminProducts,
  useAdminStats,
  useApproveProduct,
  useRejectProduct,
  useSuspendUser,
  useVerifyUser,
} from "@/hooks/useAdmin";
import { useSoftDeleteProduct, useSoftDeleteUser } from "@/hooks/useDeletedItems";
import { UserDetailModal } from "@/components/admin/UserDetailModal";
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
import {
  Users,
  Package,
  DollarSign,
  CreditCard,
  Search,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  Shield,
  ShieldOff,
  Loader2,
  AlertTriangle,
  Eye,
  LayoutDashboard,
  Download,
  UserCheck,
  UserX,
  X,
  Trash2,
} from "lucide-react";
import { format } from "date-fns";
import { roleLabels } from "@/lib/auth";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import type { AdminUser } from "@/hooks/useAdmin";

export default function AdminPanel() {
  const [userSearch, setUserSearch] = useState("");
  const [productSearch, setProductSearch] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [bulkActionLoading, setBulkActionLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [userModalOpen, setUserModalOpen] = useState(false);

  const { data: stats, isLoading: statsLoading } = useAdminStats();
  const { data: users, isLoading: usersLoading } = useAdminUsers();
  const { data: products, isLoading: productsLoading } = useAdminProducts();

  const approveProduct = useApproveProduct();
  const rejectProduct = useRejectProduct();
  const suspendUser = useSuspendUser();
  const verifyUser = useVerifyUser();
  const softDeleteProduct = useSoftDeleteProduct();
  const softDeleteUser = useSoftDeleteUser();
  const [userToDelete, setUserToDelete] = useState<{ id: string; username: string } | null>(null);

  const filteredUsers = users?.filter(
    (u) =>
      u.username.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email?.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.full_name?.toLowerCase().includes(userSearch.toLowerCase())
  );

  const allFilteredSelected = 
    filteredUsers && 
    filteredUsers.length > 0 && 
    filteredUsers.every((u) => selectedUsers.has(u.id));

  const toggleUserSelection = (userId: string) => {
    const newSelected = new Set(selectedUsers);
    if (newSelected.has(userId)) {
      newSelected.delete(userId);
    } else {
      newSelected.add(userId);
    }
    setSelectedUsers(newSelected);
  };

  const toggleAllUsers = () => {
    if (allFilteredSelected) {
      setSelectedUsers(new Set());
    } else {
      const allIds = filteredUsers?.map((u) => u.id) || [];
      setSelectedUsers(new Set(allIds));
    }
  };

  const clearSelection = () => {
    setSelectedUsers(new Set());
  };

  const handleBulkSuspend = async (suspend: boolean) => {
    setBulkActionLoading(true);
    try {
      for (const userId of selectedUsers) {
        const user = users?.find((u) => u.id === userId);
        await suspendUser.mutateAsync({ userId, username: user?.username || "", suspend });
      }
      toast.success(`${selectedUsers.size} users ${suspend ? "suspended" : "unsuspended"}`);
      clearSelection();
    } catch (error) {
      toast.error("Failed to update some users");
    } finally {
      setBulkActionLoading(false);
    }
  };

  const handleBulkVerify = async (verify: boolean) => {
    setBulkActionLoading(true);
    try {
      for (const userId of selectedUsers) {
        const user = users?.find((u) => u.id === userId);
        await verifyUser.mutateAsync({ userId, username: user?.username || "", verify });
      }
      toast.success(`${selectedUsers.size} users ${verify ? "verified" : "unverified"}`);
      clearSelection();
    } catch (error) {
      toast.error("Failed to update some users");
    } finally {
      setBulkActionLoading(false);
    }
  };

  const handleExportUsers = () => {
    const selectedUserData = users?.filter((u) => selectedUsers.has(u.id)) || [];
    const csvHeaders = ["ID", "Username", "Email", "Full Name", "Phone", "Role", "Verified", "Suspended", "Created At"];
    const csvRows = selectedUserData.map((u) => [
      u.id,
      u.username,
      u.email || "",
      u.full_name || "",
      u.phone || "",
      u.role || "",
      u.is_verified ? "Yes" : "No",
      u.is_suspended ? "Yes" : "No",
      format(new Date(u.created_at), "yyyy-MM-dd HH:mm:ss"),
    ]);
    
    const csvContent = [
      csvHeaders.join(","),
      ...csvRows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `users-export-${format(new Date(), "yyyy-MM-dd")}.csv`;
    link.click();
    
    toast.success(`Exported ${selectedUsers.size} users to CSV`);
  };

  const filteredProducts = products?.filter((p) =>
    p.name.toLowerCase().includes(productSearch.toLowerCase())
  );

  const pendingProducts = filteredProducts?.filter((p) => !p.is_approved);

  return (
    <AdminLayout title="Admin Panel" description="Manage users, products, and system settings">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        {[
          {
            label: "Total Users",
            value: stats?.totalUsers || 0,
            icon: Users,
            color: "text-[hsl(var(--admin-accent))]",
          },
          {
            label: "Total Products",
            value: stats?.totalProducts || 0,
            icon: Package,
            color: "text-[hsl(var(--admin-success))]",
          },
          {
            label: "Pending Approval",
            value: stats?.pendingProducts || 0,
            icon: AlertTriangle,
            color: "text-[hsl(var(--admin-warning))]",
          },
          {
            label: "Total Prices",
            value: stats?.totalPrices || 0,
            icon: DollarSign,
            color: "text-purple-400",
          },
          {
            label: "Active Subscriptions",
            value: stats?.activeSubscriptions || 0,
            icon: CreditCard,
            color: "text-pink-400",
          },
        ].map((stat) => (
          <Card key={stat.label} className="bg-[hsl(var(--admin-bg-elevated))] border-[hsl(var(--admin-border))]">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-[hsl(var(--admin-foreground-muted))]">
                {stat.label}
              </CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[hsl(var(--admin-foreground))]">
                {statsLoading ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  stat.value.toLocaleString()
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="users" className="space-y-6">
        <TabsList className="bg-[hsl(var(--admin-bg-muted))] border border-[hsl(var(--admin-border))]">
          <TabsTrigger
            value="users"
            className="data-[state=active]:bg-[hsl(var(--admin-accent))] data-[state=active]:text-[hsl(var(--admin-accent-foreground))]"
          >
            Users
          </TabsTrigger>
          <TabsTrigger
            value="products"
            className="data-[state=active]:bg-[hsl(var(--admin-accent))] data-[state=active]:text-[hsl(var(--admin-accent-foreground))]"
          >
            Products
          </TabsTrigger>
          <TabsTrigger
            value="pending"
            className="data-[state=active]:bg-[hsl(var(--admin-accent))] data-[state=active]:text-[hsl(var(--admin-accent-foreground))]"
          >
            Pending Approval
            {(stats?.pendingProducts || 0) > 0 && (
              <Badge className="ml-2 bg-[hsl(var(--admin-danger))] text-white">
                {stats?.pendingProducts}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        {/* Users Tab */}
        <TabsContent value="users">
          <Card className="bg-[hsl(var(--admin-bg-elevated))] border-[hsl(var(--admin-border))]">
            <CardHeader>
              <CardTitle className="text-[hsl(var(--admin-foreground))]">User Management</CardTitle>
              <CardDescription className="text-[hsl(var(--admin-foreground-muted))]">
                View and manage all registered users
              </CardDescription>
              <div className="relative mt-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[hsl(var(--admin-foreground-muted))]" />
                <Input
                  placeholder="Search users..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="pl-10 max-w-sm bg-[hsl(var(--admin-bg-muted))] border-[hsl(var(--admin-border))] text-[hsl(var(--admin-foreground))] placeholder:text-[hsl(var(--admin-foreground-muted))]"
                />
              </div>
            </CardHeader>
            <CardContent>
              {/* Bulk Actions Toolbar */}
              {selectedUsers.size > 0 && (
                <div className="flex items-center gap-4 p-4 mb-4 bg-[hsl(var(--admin-bg-muted))] rounded-lg border border-[hsl(var(--admin-accent))]/30">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-[hsl(var(--admin-foreground))]">
                      {selectedUsers.size} user{selectedUsers.size > 1 ? "s" : ""} selected
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearSelection}
                      className="h-6 px-2 text-[hsl(var(--admin-foreground-muted))]"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                  <div className="h-4 w-px bg-[hsl(var(--admin-border))]" />
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleBulkVerify(true)}
                      disabled={bulkActionLoading}
                      className="border-[hsl(var(--admin-border))] text-[hsl(var(--admin-foreground))]"
                    >
                      <UserCheck className="h-4 w-4 mr-1" />
                      Verify
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleBulkVerify(false)}
                      disabled={bulkActionLoading}
                      className="border-[hsl(var(--admin-border))] text-[hsl(var(--admin-foreground))]"
                    >
                      <ShieldOff className="h-4 w-4 mr-1" />
                      Unverify
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleBulkSuspend(true)}
                      disabled={bulkActionLoading}
                      className="border-[hsl(var(--admin-danger))]/50 text-[hsl(var(--admin-danger))] hover:bg-[hsl(var(--admin-danger))]/10"
                    >
                      <UserX className="h-4 w-4 mr-1" />
                      Suspend
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleBulkSuspend(false)}
                      disabled={bulkActionLoading}
                      className="border-[hsl(var(--admin-border))] text-[hsl(var(--admin-foreground))]"
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Unsuspend
                    </Button>
                    <div className="h-4 w-px bg-[hsl(var(--admin-border))]" />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleExportUsers}
                      disabled={bulkActionLoading}
                      className="border-[hsl(var(--admin-accent))]/50 text-[hsl(var(--admin-accent))]"
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Export CSV
                    </Button>
                  </div>
                  {bulkActionLoading && (
                    <Loader2 className="h-4 w-4 animate-spin ml-auto text-[hsl(var(--admin-accent))]" />
                  )}
                </div>
              )}

              {usersLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-[hsl(var(--admin-accent))]" />
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-[hsl(var(--admin-border))] hover:bg-transparent">
                        <TableHead className="w-[50px] text-[hsl(var(--admin-foreground-muted))]">
                          <Checkbox
                            checked={allFilteredSelected}
                            onCheckedChange={toggleAllUsers}
                            aria-label="Select all users"
                            className="border-[hsl(var(--admin-border))]"
                          />
                        </TableHead>
                        <TableHead className="text-[hsl(var(--admin-foreground-muted))]">User</TableHead>
                        <TableHead className="text-[hsl(var(--admin-foreground-muted))]">Role</TableHead>
                        <TableHead className="text-[hsl(var(--admin-foreground-muted))]">Status</TableHead>
                        <TableHead className="text-[hsl(var(--admin-foreground-muted))]">Joined</TableHead>
                        <TableHead className="w-[70px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers?.map((user) => (
                        <TableRow 
                          key={user.id}
                          className={`border-[hsl(var(--admin-border))] hover:bg-[hsl(var(--admin-bg-muted))] ${selectedUsers.has(user.id) ? "bg-[hsl(var(--admin-accent))]/5" : ""}`}
                        >
                          <TableCell>
                            <Checkbox
                              checked={selectedUsers.has(user.id)}
                              onCheckedChange={() => toggleUserSelection(user.id)}
                              aria-label={`Select ${user.username}`}
                              className="border-[hsl(var(--admin-border))]"
                            />
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarImage src={user.avatar_url || undefined} />
                                <AvatarFallback className="bg-[hsl(var(--admin-accent))] text-[hsl(var(--admin-accent-foreground))]">
                                  {user.username.slice(0, 2).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium text-[hsl(var(--admin-foreground))]">{user.username}</p>
                                <p className="text-sm text-[hsl(var(--admin-foreground-muted))]">
                                  {user.email || user.full_name || "No email"}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant="outline"
                              className="border-[hsl(var(--admin-accent))] text-[hsl(var(--admin-accent))]"
                            >
                              {user.role ? roleLabels[user.role] : "Unknown"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              {user.is_verified && (
                                <Badge className="bg-[hsl(var(--admin-success))]/20 text-[hsl(var(--admin-success))] border-0">
                                  Verified
                                </Badge>
                              )}
                              {user.is_suspended && (
                                <Badge className="bg-[hsl(var(--admin-danger))]/20 text-[hsl(var(--admin-danger))] border-0">
                                  Suspended
                                </Badge>
                              )}
                              {!user.is_verified && !user.is_suspended && (
                                <Badge className="bg-[hsl(var(--admin-bg-muted))] text-[hsl(var(--admin-foreground-muted))] border-0">
                                  Unverified
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-[hsl(var(--admin-foreground))]">
                            {format(new Date(user.created_at), "MMM d, yyyy")}
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-[hsl(var(--admin-foreground-muted))] hover:text-[hsl(var(--admin-foreground))] hover:bg-[hsl(var(--admin-bg-muted))]"
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent
                                align="end"
                                className="bg-[hsl(var(--admin-bg-elevated))] border-[hsl(var(--admin-border))] text-[hsl(var(--admin-foreground))]"
                              >
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedUser(user);
                                    setUserModalOpen(true);
                                  }}
                                  className="focus:bg-[hsl(var(--admin-bg-muted))]"
                                >
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Details
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    verifyUser.mutate({
                                      userId: user.id,
                                      username: user.username,
                                      verify: !user.is_verified,
                                    })
                                  }
                                  className="focus:bg-[hsl(var(--admin-bg-muted))]"
                                >
                                  {user.is_verified ? (
                                    <>
                                      <ShieldOff className="mr-2 h-4 w-4" />
                                      Remove Verification
                                    </>
                                  ) : (
                                    <>
                                      <Shield className="mr-2 h-4 w-4" />
                                      Verify User
                                    </>
                                  )}
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    suspendUser.mutate({
                                      userId: user.id,
                                      username: user.username,
                                      suspend: !user.is_suspended,
                                    })
                                  }
                                  className={`focus:bg-[hsl(var(--admin-bg-muted))] ${!user.is_suspended ? "text-[hsl(var(--admin-danger))]" : ""}`}
                                >
                                  {user.is_suspended ? (
                                    <>
                                      <CheckCircle className="mr-2 h-4 w-4" />
                                      Unsuspend User
                                    </>
                                  ) : (
                                    <>
                                      <XCircle className="mr-2 h-4 w-4" />
                                      Suspend User
                                    </>
                                  )}
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    setUserToDelete({ id: user.id, username: user.username })
                                  }
                                  className="focus:bg-[hsl(var(--admin-bg-muted))] text-[hsl(var(--admin-danger))]"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete User
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Products Tab */}
        <TabsContent value="products">
          <Card className="bg-[hsl(var(--admin-bg-elevated))] border-[hsl(var(--admin-border))]">
            <CardHeader>
              <CardTitle className="text-[hsl(var(--admin-foreground))]">All Products</CardTitle>
              <CardDescription className="text-[hsl(var(--admin-foreground-muted))]">
                View and manage all product listings
              </CardDescription>
              <div className="relative mt-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[hsl(var(--admin-foreground-muted))]" />
                <Input
                  placeholder="Search products..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="pl-10 max-w-sm bg-[hsl(var(--admin-bg-muted))] border-[hsl(var(--admin-border))] text-[hsl(var(--admin-foreground))] placeholder:text-[hsl(var(--admin-foreground-muted))]"
                />
              </div>
            </CardHeader>
            <CardContent>
              {productsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-[hsl(var(--admin-accent))]" />
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-[hsl(var(--admin-border))] hover:bg-transparent">
                        <TableHead className="text-[hsl(var(--admin-foreground-muted))]">Product</TableHead>
                        <TableHead className="text-[hsl(var(--admin-foreground-muted))]">Category</TableHead>
                        <TableHead className="text-[hsl(var(--admin-foreground-muted))]">Seller</TableHead>
                        <TableHead className="text-[hsl(var(--admin-foreground-muted))]">Status</TableHead>
                        <TableHead className="text-[hsl(var(--admin-foreground-muted))]">Created</TableHead>
                        <TableHead className="w-[70px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredProducts?.map((product) => (
                        <TableRow
                          key={product.id}
                          className="border-[hsl(var(--admin-border))] hover:bg-[hsl(var(--admin-bg-muted))]"
                        >
                          <TableCell className="font-medium text-[hsl(var(--admin-foreground))]">
                            {product.name}
                          </TableCell>
                          <TableCell className="text-[hsl(var(--admin-foreground))]">
                            {product.category?.name || "—"}
                          </TableCell>
                          <TableCell className="text-[hsl(var(--admin-foreground))]">
                            {product.seller?.username || "—"}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              {product.is_approved ? (
                                <Badge className="bg-[hsl(var(--admin-success))]/20 text-[hsl(var(--admin-success))] border-0">
                                  Approved
                                </Badge>
                              ) : (
                                <Badge className="bg-[hsl(var(--admin-warning))]/20 text-[hsl(var(--admin-warning))] border-0">
                                  Pending
                                </Badge>
                              )}
                              {!product.is_active && (
                                <Badge className="bg-[hsl(var(--admin-bg-muted))] text-[hsl(var(--admin-foreground-muted))] border-0">
                                  Inactive
                                </Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-[hsl(var(--admin-foreground))]">
                            {format(new Date(product.created_at), "MMM d, yyyy")}
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="text-[hsl(var(--admin-foreground-muted))] hover:text-[hsl(var(--admin-foreground))] hover:bg-[hsl(var(--admin-bg-muted))]"
                                >
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent
                                align="end"
                                className="bg-[hsl(var(--admin-bg-elevated))] border-[hsl(var(--admin-border))] text-[hsl(var(--admin-foreground))]"
                              >
                                {!product.is_approved && (
                                  <DropdownMenuItem
                                    onClick={() => approveProduct.mutate({ productId: product.id, productName: product.name })}
                                    className="focus:bg-[hsl(var(--admin-bg-muted))]"
                                  >
                                    <CheckCircle className="mr-2 h-4 w-4" />
                                    Approve
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem
                                  onClick={() => rejectProduct.mutate({ productId: product.id, productName: product.name })}
                                  className="focus:bg-[hsl(var(--admin-bg-muted))]"
                                >
                                  <XCircle className="mr-2 h-4 w-4" />
                                  Reject
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => softDeleteProduct.mutate({ productId: product.id, productName: product.name })}
                                  className="text-[hsl(var(--admin-danger))] focus:bg-[hsl(var(--admin-bg-muted))]"
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pending Approval Tab */}
        <TabsContent value="pending">
          <Card className="bg-[hsl(var(--admin-bg-elevated))] border-[hsl(var(--admin-border))]">
            <CardHeader>
              <CardTitle className="text-[hsl(var(--admin-foreground))]">Pending Approval</CardTitle>
              <CardDescription className="text-[hsl(var(--admin-foreground-muted))]">
                Products waiting for admin review
              </CardDescription>
            </CardHeader>
            <CardContent>
              {productsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-[hsl(var(--admin-accent))]" />
                </div>
              ) : pendingProducts?.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 mx-auto text-[hsl(var(--admin-success))] mb-4" />
                  <h3 className="text-lg font-medium text-[hsl(var(--admin-foreground))]">All caught up!</h3>
                  <p className="text-[hsl(var(--admin-foreground-muted))]">
                    No products pending approval
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingProducts?.map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center justify-between p-4 border border-[hsl(var(--admin-border))] rounded-lg bg-[hsl(var(--admin-bg-muted))] hover:border-[hsl(var(--admin-accent))]/30 transition-colors"
                    >
                      <div>
                        <h4 className="font-medium text-[hsl(var(--admin-foreground))]">{product.name}</h4>
                        <p className="text-sm text-[hsl(var(--admin-foreground-muted))]">
                          by {product.seller?.username} • {product.category?.name}
                        </p>
                        {product.description && (
                          <p className="text-sm text-[hsl(var(--admin-foreground-muted))] mt-1 line-clamp-2">
                            {product.description}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => approveProduct.mutate({ productId: product.id, productName: product.name })}
                          disabled={approveProduct.isPending}
                          className="bg-[hsl(var(--admin-accent))] text-[hsl(var(--admin-accent-foreground))] hover:bg-[hsl(var(--admin-accent-glow))]"
                        >
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => rejectProduct.mutate({ productId: product.id, productName: product.name })}
                          disabled={rejectProduct.isPending}
                          className="border-[hsl(var(--admin-danger))]/50 text-[hsl(var(--admin-danger))] hover:bg-[hsl(var(--admin-danger))]/10"
                        >
                          <XCircle className="mr-2 h-4 w-4" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* User Detail Modal */}
      <UserDetailModal
        user={selectedUser}
        open={userModalOpen}
        onOpenChange={setUserModalOpen}
      />
    </AdminLayout>
  );
}
