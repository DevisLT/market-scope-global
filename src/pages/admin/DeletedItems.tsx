import { useState } from "react";
import { AdminLayout } from "@/components/admin";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
  useDeletedUsers,
  useDeletedProducts,
  useDeletedCategories,
  useDeletedLocations,
  useDeletedMessages,
  useRestoreUser,
  useRestoreProduct,
  useRestoreCategory,
  useRestoreLocation,
  useRestoreMessage,
  usePermanentlyDelete,
} from "@/hooks/useDeletedItems";
import {
  Trash2,
  RotateCcw,
  Loader2,
  Users,
  Package,
  FolderTree,
  MapPin,
  MessageSquare,
  AlertTriangle,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

type DeleteTarget = {
  table: "profiles" | "products" | "categories" | "locations" | "messages";
  id: string;
  name?: string;
} | null;

export default function DeletedItems() {
  const [activeTab, setActiveTab] = useState("users");
  const [permanentDeleteTarget, setPermanentDeleteTarget] = useState<DeleteTarget>(null);

  // Queries
  const { data: deletedUsers, isLoading: usersLoading } = useDeletedUsers();
  const { data: deletedProducts, isLoading: productsLoading } = useDeletedProducts();
  const { data: deletedCategories, isLoading: categoriesLoading } = useDeletedCategories();
  const { data: deletedLocations, isLoading: locationsLoading } = useDeletedLocations();
  const { data: deletedMessages, isLoading: messagesLoading } = useDeletedMessages();

  // Restore mutations
  const restoreUser = useRestoreUser();
  const restoreProduct = useRestoreProduct();
  const restoreCategory = useRestoreCategory();
  const restoreLocation = useRestoreLocation();
  const restoreMessage = useRestoreMessage();
  const permanentlyDelete = usePermanentlyDelete();

  const totalDeleted = 
    (deletedUsers?.length || 0) +
    (deletedProducts?.length || 0) +
    (deletedCategories?.length || 0) +
    (deletedLocations?.length || 0) +
    (deletedMessages?.length || 0);

  const handlePermanentDelete = () => {
    if (permanentDeleteTarget) {
      permanentlyDelete.mutate(permanentDeleteTarget);
      setPermanentDeleteTarget(null);
    }
  };

  return (
    <AdminLayout
      title="Deleted Items"
      description="Restore or permanently delete removed items"
    >
      {/* Summary */}
      <Card className="mb-6 bg-[hsl(var(--admin-bg-elevated))] border-[hsl(var(--admin-border))]">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-[hsl(var(--admin-warning))]/10">
                <Trash2 className="h-6 w-6 text-[hsl(var(--admin-warning))]" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[hsl(var(--admin-foreground))]">
                  {totalDeleted} items in trash
                </h3>
                <p className="text-sm text-[hsl(var(--admin-foreground-muted))]">
                  Items can be restored or permanently deleted
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-[hsl(var(--admin-bg-muted))] border-[hsl(var(--admin-border))]">
          <TabsTrigger
            value="users"
            className="data-[state=active]:bg-[hsl(var(--admin-accent))] data-[state=active]:text-[hsl(var(--admin-accent-foreground))]"
          >
            <Users className="h-4 w-4 mr-2" />
            Users
            {(deletedUsers?.length || 0) > 0 && (
              <Badge className="ml-2 bg-[hsl(var(--admin-danger))]">{deletedUsers?.length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger
            value="products"
            className="data-[state=active]:bg-[hsl(var(--admin-accent))] data-[state=active]:text-[hsl(var(--admin-accent-foreground))]"
          >
            <Package className="h-4 w-4 mr-2" />
            Products
            {(deletedProducts?.length || 0) > 0 && (
              <Badge className="ml-2 bg-[hsl(var(--admin-danger))]">{deletedProducts?.length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger
            value="categories"
            className="data-[state=active]:bg-[hsl(var(--admin-accent))] data-[state=active]:text-[hsl(var(--admin-accent-foreground))]"
          >
            <FolderTree className="h-4 w-4 mr-2" />
            Categories
            {(deletedCategories?.length || 0) > 0 && (
              <Badge className="ml-2 bg-[hsl(var(--admin-danger))]">{deletedCategories?.length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger
            value="locations"
            className="data-[state=active]:bg-[hsl(var(--admin-accent))] data-[state=active]:text-[hsl(var(--admin-accent-foreground))]"
          >
            <MapPin className="h-4 w-4 mr-2" />
            Locations
            {(deletedLocations?.length || 0) > 0 && (
              <Badge className="ml-2 bg-[hsl(var(--admin-danger))]">{deletedLocations?.length}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger
            value="messages"
            className="data-[state=active]:bg-[hsl(var(--admin-accent))] data-[state=active]:text-[hsl(var(--admin-accent-foreground))]"
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            Messages
            {(deletedMessages?.length || 0) > 0 && (
              <Badge className="ml-2 bg-[hsl(var(--admin-danger))]">{deletedMessages?.length}</Badge>
            )}
          </TabsTrigger>
        </TabsList>

        {/* Users Tab */}
        <TabsContent value="users">
          <Card className="bg-[hsl(var(--admin-bg-elevated))] border-[hsl(var(--admin-border))]">
            <CardHeader>
              <CardTitle className="text-[hsl(var(--admin-foreground))]">Deleted Users</CardTitle>
              <CardDescription className="text-[hsl(var(--admin-foreground-muted))]">
                Users that have been removed from the system
              </CardDescription>
            </CardHeader>
            <CardContent>
              {usersLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-[hsl(var(--admin-accent))]" />
                </div>
              ) : deletedUsers?.length === 0 ? (
                <div className="text-center py-8 text-[hsl(var(--admin-foreground-muted))]">
                  No deleted users
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="border-[hsl(var(--admin-border))]">
                      <TableHead className="text-[hsl(var(--admin-foreground-muted))]">User</TableHead>
                      <TableHead className="text-[hsl(var(--admin-foreground-muted))]">Email</TableHead>
                      <TableHead className="text-[hsl(var(--admin-foreground-muted))]">Deleted</TableHead>
                      <TableHead className="text-[hsl(var(--admin-foreground-muted))] w-[150px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {deletedUsers?.map((user) => (
                      <TableRow key={user.id} className="border-[hsl(var(--admin-border))] hover:bg-[hsl(var(--admin-bg-muted))]">
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
                              <p className="text-sm text-[hsl(var(--admin-foreground-muted))]">{user.full_name}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-[hsl(var(--admin-foreground-muted))]">
                          {user.email || "—"}
                        </TableCell>
                        <TableCell className="text-[hsl(var(--admin-foreground-muted))]">
                          {user.deleted_at && formatDistanceToNow(new Date(user.deleted_at), { addSuffix: true })}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => restoreUser.mutate({ userId: user.id, username: user.username })}
                              disabled={restoreUser.isPending}
                              className="border-[hsl(var(--admin-success))]/50 text-[hsl(var(--admin-success))]"
                            >
                              <RotateCcw className="h-4 w-4 mr-1" />
                              Restore
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setPermanentDeleteTarget({ table: "profiles", id: user.id, name: user.username })}
                              className="border-[hsl(var(--admin-danger))]/50 text-[hsl(var(--admin-danger))]"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
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
          <Card className="bg-[hsl(var(--admin-bg-elevated))] border-[hsl(var(--admin-border))]">
            <CardHeader>
              <CardTitle className="text-[hsl(var(--admin-foreground))]">Deleted Products</CardTitle>
              <CardDescription className="text-[hsl(var(--admin-foreground-muted))]">
                Products that have been removed
              </CardDescription>
            </CardHeader>
            <CardContent>
              {productsLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-[hsl(var(--admin-accent))]" />
                </div>
              ) : deletedProducts?.length === 0 ? (
                <div className="text-center py-8 text-[hsl(var(--admin-foreground-muted))]">
                  No deleted products
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="border-[hsl(var(--admin-border))]">
                      <TableHead className="text-[hsl(var(--admin-foreground-muted))]">Product</TableHead>
                      <TableHead className="text-[hsl(var(--admin-foreground-muted))]">Category</TableHead>
                      <TableHead className="text-[hsl(var(--admin-foreground-muted))]">Seller</TableHead>
                      <TableHead className="text-[hsl(var(--admin-foreground-muted))]">Deleted</TableHead>
                      <TableHead className="text-[hsl(var(--admin-foreground-muted))] w-[150px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {deletedProducts?.map((product) => (
                      <TableRow key={product.id} className="border-[hsl(var(--admin-border))] hover:bg-[hsl(var(--admin-bg-muted))]">
                        <TableCell className="font-medium text-[hsl(var(--admin-foreground))]">
                          {product.name}
                        </TableCell>
                        <TableCell className="text-[hsl(var(--admin-foreground-muted))]">
                          {product.category?.name || "—"}
                        </TableCell>
                        <TableCell className="text-[hsl(var(--admin-foreground-muted))]">
                          {product.seller?.username || "—"}
                        </TableCell>
                        <TableCell className="text-[hsl(var(--admin-foreground-muted))]">
                          {product.deleted_at && formatDistanceToNow(new Date(product.deleted_at), { addSuffix: true })}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => restoreProduct.mutate({ productId: product.id, productName: product.name })}
                              disabled={restoreProduct.isPending}
                              className="border-[hsl(var(--admin-success))]/50 text-[hsl(var(--admin-success))]"
                            >
                              <RotateCcw className="h-4 w-4 mr-1" />
                              Restore
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setPermanentDeleteTarget({ table: "products", id: product.id, name: product.name })}
                              className="border-[hsl(var(--admin-danger))]/50 text-[hsl(var(--admin-danger))]"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Categories Tab */}
        <TabsContent value="categories">
          <Card className="bg-[hsl(var(--admin-bg-elevated))] border-[hsl(var(--admin-border))]">
            <CardHeader>
              <CardTitle className="text-[hsl(var(--admin-foreground))]">Deleted Categories</CardTitle>
              <CardDescription className="text-[hsl(var(--admin-foreground-muted))]">
                Categories that have been removed
              </CardDescription>
            </CardHeader>
            <CardContent>
              {categoriesLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-[hsl(var(--admin-accent))]" />
                </div>
              ) : deletedCategories?.length === 0 ? (
                <div className="text-center py-8 text-[hsl(var(--admin-foreground-muted))]">
                  No deleted categories
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="border-[hsl(var(--admin-border))]">
                      <TableHead className="text-[hsl(var(--admin-foreground-muted))]">Name</TableHead>
                      <TableHead className="text-[hsl(var(--admin-foreground-muted))]">Slug</TableHead>
                      <TableHead className="text-[hsl(var(--admin-foreground-muted))]">Deleted</TableHead>
                      <TableHead className="text-[hsl(var(--admin-foreground-muted))] w-[150px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {deletedCategories?.map((category) => (
                      <TableRow key={category.id} className="border-[hsl(var(--admin-border))] hover:bg-[hsl(var(--admin-bg-muted))]">
                        <TableCell className="font-medium text-[hsl(var(--admin-foreground))]">
                          {category.icon && <span className="mr-2">{category.icon}</span>}
                          {category.name}
                        </TableCell>
                        <TableCell className="text-[hsl(var(--admin-foreground-muted))] font-mono">
                          {category.slug}
                        </TableCell>
                        <TableCell className="text-[hsl(var(--admin-foreground-muted))]">
                          {category.deleted_at && formatDistanceToNow(new Date(category.deleted_at), { addSuffix: true })}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => restoreCategory.mutate({ categoryId: category.id, categoryName: category.name })}
                              disabled={restoreCategory.isPending}
                              className="border-[hsl(var(--admin-success))]/50 text-[hsl(var(--admin-success))]"
                            >
                              <RotateCcw className="h-4 w-4 mr-1" />
                              Restore
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setPermanentDeleteTarget({ table: "categories", id: category.id, name: category.name })}
                              className="border-[hsl(var(--admin-danger))]/50 text-[hsl(var(--admin-danger))]"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Locations Tab */}
        <TabsContent value="locations">
          <Card className="bg-[hsl(var(--admin-bg-elevated))] border-[hsl(var(--admin-border))]">
            <CardHeader>
              <CardTitle className="text-[hsl(var(--admin-foreground))]">Deleted Locations</CardTitle>
              <CardDescription className="text-[hsl(var(--admin-foreground-muted))]">
                Locations that have been removed
              </CardDescription>
            </CardHeader>
            <CardContent>
              {locationsLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-[hsl(var(--admin-accent))]" />
                </div>
              ) : deletedLocations?.length === 0 ? (
                <div className="text-center py-8 text-[hsl(var(--admin-foreground-muted))]">
                  No deleted locations
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="border-[hsl(var(--admin-border))]">
                      <TableHead className="text-[hsl(var(--admin-foreground-muted))]">Name</TableHead>
                      <TableHead className="text-[hsl(var(--admin-foreground-muted))]">Type</TableHead>
                      <TableHead className="text-[hsl(var(--admin-foreground-muted))]">Deleted</TableHead>
                      <TableHead className="text-[hsl(var(--admin-foreground-muted))] w-[150px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {deletedLocations?.map((location) => (
                      <TableRow key={location.id} className="border-[hsl(var(--admin-border))] hover:bg-[hsl(var(--admin-bg-muted))]">
                        <TableCell className="font-medium text-[hsl(var(--admin-foreground))]">
                          {location.name}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize border-[hsl(var(--admin-border))]">
                            {location.type}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-[hsl(var(--admin-foreground-muted))]">
                          {location.deleted_at && formatDistanceToNow(new Date(location.deleted_at), { addSuffix: true })}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => restoreLocation.mutate({ locationId: location.id, locationName: location.name })}
                              disabled={restoreLocation.isPending}
                              className="border-[hsl(var(--admin-success))]/50 text-[hsl(var(--admin-success))]"
                            >
                              <RotateCcw className="h-4 w-4 mr-1" />
                              Restore
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setPermanentDeleteTarget({ table: "locations", id: location.id, name: location.name })}
                              className="border-[hsl(var(--admin-danger))]/50 text-[hsl(var(--admin-danger))]"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Messages Tab */}
        <TabsContent value="messages">
          <Card className="bg-[hsl(var(--admin-bg-elevated))] border-[hsl(var(--admin-border))]">
            <CardHeader>
              <CardTitle className="text-[hsl(var(--admin-foreground))]">Deleted Messages</CardTitle>
              <CardDescription className="text-[hsl(var(--admin-foreground-muted))]">
                Messages that have been removed
              </CardDescription>
            </CardHeader>
            <CardContent>
              {messagesLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-[hsl(var(--admin-accent))]" />
                </div>
              ) : deletedMessages?.length === 0 ? (
                <div className="text-center py-8 text-[hsl(var(--admin-foreground-muted))]">
                  No deleted messages
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="border-[hsl(var(--admin-border))]">
                      <TableHead className="text-[hsl(var(--admin-foreground-muted))]">From</TableHead>
                      <TableHead className="text-[hsl(var(--admin-foreground-muted))]">To</TableHead>
                      <TableHead className="text-[hsl(var(--admin-foreground-muted))]">Content</TableHead>
                      <TableHead className="text-[hsl(var(--admin-foreground-muted))]">Deleted</TableHead>
                      <TableHead className="text-[hsl(var(--admin-foreground-muted))] w-[150px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {deletedMessages?.map((message) => (
                      <TableRow key={message.id} className="border-[hsl(var(--admin-border))] hover:bg-[hsl(var(--admin-bg-muted))]">
                        <TableCell className="text-[hsl(var(--admin-foreground))]">
                          {message.sender?.username || "Unknown"}
                        </TableCell>
                        <TableCell className="text-[hsl(var(--admin-foreground))]">
                          {message.receiver?.username || "Unknown"}
                        </TableCell>
                        <TableCell className="text-[hsl(var(--admin-foreground-muted))] max-w-[200px] truncate">
                          {message.content}
                        </TableCell>
                        <TableCell className="text-[hsl(var(--admin-foreground-muted))]">
                          {message.deleted_at && formatDistanceToNow(new Date(message.deleted_at), { addSuffix: true })}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => restoreMessage.mutate({ messageId: message.id })}
                              disabled={restoreMessage.isPending}
                              className="border-[hsl(var(--admin-success))]/50 text-[hsl(var(--admin-success))]"
                            >
                              <RotateCcw className="h-4 w-4 mr-1" />
                              Restore
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setPermanentDeleteTarget({ table: "messages", id: message.id })}
                              className="border-[hsl(var(--admin-danger))]/50 text-[hsl(var(--admin-danger))]"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Permanent Delete Confirmation */}
      <AlertDialog open={!!permanentDeleteTarget} onOpenChange={() => setPermanentDeleteTarget(null)}>
        <AlertDialogContent className="bg-[hsl(var(--admin-bg-elevated))] border-[hsl(var(--admin-border))]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[hsl(var(--admin-foreground))] flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-[hsl(var(--admin-danger))]" />
              Permanently Delete?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-[hsl(var(--admin-foreground-muted))]">
              This action cannot be undone. This will permanently delete{" "}
              <strong>{permanentDeleteTarget?.name || "this item"}</strong> from the database.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-[hsl(var(--admin-border))] text-[hsl(var(--admin-foreground))]">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handlePermanentDelete}
              className="bg-[hsl(var(--admin-danger))] hover:bg-[hsl(var(--admin-danger))]/90 text-white"
            >
              {permanentlyDelete.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              Delete Forever
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}
