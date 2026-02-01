import { useState } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
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
import {
  useAdminUsers,
  useAdminProducts,
  useAdminStats,
  useApproveProduct,
  useRejectProduct,
  useSuspendUser,
  useVerifyUser,
} from "@/hooks/useAdmin";
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
} from "lucide-react";
import { format } from "date-fns";
import { roleLabels } from "@/lib/auth";

export default function AdminPanel() {
  const [userSearch, setUserSearch] = useState("");
  const [productSearch, setProductSearch] = useState("");

  const { data: stats, isLoading: statsLoading } = useAdminStats();
  const { data: users, isLoading: usersLoading } = useAdminUsers();
  const { data: products, isLoading: productsLoading } = useAdminProducts();

  const approveProduct = useApproveProduct();
  const rejectProduct = useRejectProduct();
  const suspendUser = useSuspendUser();
  const verifyUser = useVerifyUser();

  const filteredUsers = users?.filter(
    (u) =>
      u.username.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email?.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.full_name?.toLowerCase().includes(userSearch.toLowerCase())
  );

  const filteredProducts = products?.filter((p) =>
    p.name.toLowerCase().includes(productSearch.toLowerCase())
  );

  const pendingProducts = filteredProducts?.filter((p) => !p.is_approved);

  return (
    <Layout showFooter={false}>
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold">Admin Panel</h1>
            <p className="text-muted-foreground">
              Manage users, products, and system settings
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link to="/admin/credentials">
                <Eye className="mr-2 h-4 w-4" />
                User Credentials
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/admin/system">
                <LayoutDashboard className="mr-2 h-4 w-4" />
                System Overview
              </Link>
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {[
            {
              label: "Total Users",
              value: stats?.totalUsers || 0,
              icon: Users,
              color: "text-blue-500",
            },
            {
              label: "Total Products",
              value: stats?.totalProducts || 0,
              icon: Package,
              color: "text-green-500",
            },
            {
              label: "Pending Approval",
              value: stats?.pendingProducts || 0,
              icon: AlertTriangle,
              color: "text-amber-500",
            },
            {
              label: "Total Prices",
              value: stats?.totalPrices || 0,
              icon: DollarSign,
              color: "text-purple-500",
            },
            {
              label: "Active Subscriptions",
              value: stats?.activeSubscriptions || 0,
              icon: CreditCard,
              color: "text-pink-500",
            },
          ].map((stat) => (
            <Card key={stat.label}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
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
          <TabsList>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="pending">
              Pending Approval
              {(stats?.pendingProducts || 0) > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {stats?.pendingProducts}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Users Tab */}
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>
                  View and manage all registered users
                </CardDescription>
                <div className="relative mt-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search users..."
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    className="pl-10 max-w-sm"
                  />
                </div>
              </CardHeader>
              <CardContent>
                {usersLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Joined</TableHead>
                        <TableHead className="w-[70px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers?.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarImage src={user.avatar_url || undefined} />
                                <AvatarFallback>
                                  {user.username.slice(0, 2).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <p className="font-medium">{user.username}</p>
                                <p className="text-sm text-muted-foreground">
                                  {user.email || user.full_name || "No email"}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {user.role ? roleLabels[user.role] : "Unknown"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              {user.is_verified && (
                                <Badge className="bg-success text-success-foreground">
                                  Verified
                                </Badge>
                              )}
                              {user.is_suspended && (
                                <Badge variant="destructive">Suspended</Badge>
                              )}
                              {!user.is_verified && !user.is_suspended && (
                                <Badge variant="secondary">Unverified</Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            {format(new Date(user.created_at), "MMM d, yyyy")}
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="bg-popover">
                                <DropdownMenuItem
                                  onClick={() =>
                                    verifyUser.mutate({
                                      userId: user.id,
                                      verify: !user.is_verified,
                                    })
                                  }
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
                                      suspend: !user.is_suspended,
                                    })
                                  }
                                  className={user.is_suspended ? "" : "text-destructive"}
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
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Products Tab */}
          <TabsContent value="products">
            <Card>
              <CardHeader>
                <CardTitle>All Products</CardTitle>
                <CardDescription>
                  View and manage all product listings
                </CardDescription>
                <div className="relative mt-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search products..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    className="pl-10 max-w-sm"
                  />
                </div>
              </CardHeader>
              <CardContent>
                {productsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Seller</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Created</TableHead>
                        <TableHead className="w-[70px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredProducts?.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell className="font-medium">
                            {product.name}
                          </TableCell>
                          <TableCell>{product.category?.name || "—"}</TableCell>
                          <TableCell>{product.seller?.username || "—"}</TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              {product.is_approved ? (
                                <Badge className="bg-success text-success-foreground">
                                  Approved
                                </Badge>
                              ) : (
                                <Badge variant="secondary">Pending</Badge>
                              )}
                              {!product.is_active && (
                                <Badge variant="outline">Inactive</Badge>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            {format(new Date(product.created_at), "MMM d, yyyy")}
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="bg-popover">
                                {!product.is_approved && (
                                  <DropdownMenuItem
                                    onClick={() => approveProduct.mutate(product.id)}
                                  >
                                    <CheckCircle className="mr-2 h-4 w-4" />
                                    Approve
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem
                                  onClick={() => rejectProduct.mutate(product.id)}
                                  className="text-destructive"
                                >
                                  <XCircle className="mr-2 h-4 w-4" />
                                  Reject
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pending Approval Tab */}
          <TabsContent value="pending">
            <Card>
              <CardHeader>
                <CardTitle>Pending Approval</CardTitle>
                <CardDescription>
                  Products waiting for admin review
                </CardDescription>
              </CardHeader>
              <CardContent>
                {productsLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : pendingProducts?.length === 0 ? (
                  <div className="text-center py-8">
                    <CheckCircle className="h-12 w-12 mx-auto text-success mb-4" />
                    <h3 className="text-lg font-medium">All caught up!</h3>
                    <p className="text-muted-foreground">
                      No products pending approval
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingProducts?.map((product) => (
                      <div
                        key={product.id}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div>
                          <h4 className="font-medium">{product.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            by {product.seller?.username} • {product.category?.name}
                          </p>
                          {product.description && (
                            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                              {product.description}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => approveProduct.mutate(product.id)}
                            disabled={approveProduct.isPending}
                          >
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => rejectProduct.mutate(product.id)}
                            disabled={rejectProduct.isPending}
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
      </div>
    </Layout>
  );
}
