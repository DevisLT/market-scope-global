import { useState } from "react";
import { AdminLayout } from "@/components/admin";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useAdminCategories,
  useCreateCategory,
  useUpdateCategory,
  useAdminLocations,
  useCreateLocation,
  useUpdateLocation,
} from "@/hooks/useDataManagement";
import { useSoftDeleteCategory, useSoftDeleteLocation } from "@/hooks/useDeletedItems";
import type { Category } from "@/hooks/useCategories";
import type { Location, LocationType } from "@/hooks/useLocations";
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  FolderTree,
  MapPin,
  Search,
} from "lucide-react";
import { format } from "date-fns";

type EditingCategory = Partial<Category> & { id?: string };
type EditingLocation = Partial<Location> & { id?: string };

export default function DataManagement() {
  const [activeTab, setActiveTab] = useState("categories");
  const [categorySearch, setCategorySearch] = useState("");
  const [locationSearch, setLocationSearch] = useState("");

  // Category state
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<EditingCategory | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);

  // Location state
  const [locationDialogOpen, setLocationDialogOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<EditingLocation | null>(null);
  const [deletingLocation, setDeletingLocation] = useState<Location | null>(null);

  // Queries
  const { data: categories, isLoading: categoriesLoading } = useAdminCategories();
  const { data: locations, isLoading: locationsLoading } = useAdminLocations();

  // Mutations
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const softDeleteCategory = useSoftDeleteCategory();
  const createLocation = useCreateLocation();
  const updateLocation = useUpdateLocation();
  const softDeleteLocation = useSoftDeleteLocation();

  // Filter data
  const filteredCategories = categories?.filter((c) =>
    c.name.toLowerCase().includes(categorySearch.toLowerCase()) ||
    c.slug.toLowerCase().includes(categorySearch.toLowerCase())
  );

  const filteredLocations = locations?.filter((l) =>
    l.name.toLowerCase().includes(locationSearch.toLowerCase()) ||
    l.slug.toLowerCase().includes(locationSearch.toLowerCase())
  );

  // Category handlers
  const handleCreateCategory = () => {
    setEditingCategory({ name: "", slug: "", is_active: true });
    setCategoryDialogOpen(true);
  };

  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    setCategoryDialogOpen(true);
  };

  const handleSaveCategory = () => {
    if (!editingCategory?.name || !editingCategory?.slug) {
      return;
    }

    if (editingCategory.id) {
      updateCategory.mutate(
        { id: editingCategory.id, ...editingCategory },
        { onSuccess: () => setCategoryDialogOpen(false) }
      );
    } else {
      createCategory.mutate(
        {
          name: editingCategory.name,
          slug: editingCategory.slug,
          description: editingCategory.description,
          icon: editingCategory.icon,
          is_active: editingCategory.is_active ?? true,
        },
        { onSuccess: () => setCategoryDialogOpen(false) }
      );
    }
  };

  const handleConfirmDeleteCategory = () => {
    if (deletingCategory) {
      softDeleteCategory.mutate(
        { categoryId: deletingCategory.id, categoryName: deletingCategory.name },
        { onSuccess: () => setDeletingCategory(null) }
      );
    }
  };

  // Location handlers
  const handleCreateLocation = () => {
    setEditingLocation({ name: "", slug: "", type: "country", is_active: true });
    setLocationDialogOpen(true);
  };

  const handleEditLocation = (location: Location) => {
    setEditingLocation(location);
    setLocationDialogOpen(true);
  };

  const handleSaveLocation = () => {
    if (!editingLocation?.name || !editingLocation?.slug || !editingLocation?.type) {
      return;
    }

    if (editingLocation.id) {
      updateLocation.mutate(
        { id: editingLocation.id, ...editingLocation },
        { onSuccess: () => setLocationDialogOpen(false) }
      );
    } else {
      createLocation.mutate(
        {
          name: editingLocation.name,
          slug: editingLocation.slug,
          type: editingLocation.type as LocationType,
          country_code: editingLocation.country_code,
          currency_code: editingLocation.currency_code,
          is_active: editingLocation.is_active ?? true,
        },
        { onSuccess: () => setLocationDialogOpen(false) }
      );
    }
  };

  const handleConfirmDeleteLocation = () => {
    if (deletingLocation) {
      softDeleteLocation.mutate(
        { locationId: deletingLocation.id, locationName: deletingLocation.name },
        { onSuccess: () => setDeletingLocation(null) }
      );
    }
  };

  const isSaving =
    createCategory.isPending ||
    updateCategory.isPending ||
    createLocation.isPending ||
    updateLocation.isPending;

  return (
    <AdminLayout
      title="Data Management"
      description="Manage categories, locations, and reference data"
    >
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-[hsl(var(--admin-bg-muted))] border-[hsl(var(--admin-border))]">
          <TabsTrigger
            value="categories"
            className="data-[state=active]:bg-[hsl(var(--admin-accent))] data-[state=active]:text-[hsl(var(--admin-accent-foreground))]"
          >
            <FolderTree className="h-4 w-4 mr-2" />
            Categories
          </TabsTrigger>
          <TabsTrigger
            value="locations"
            className="data-[state=active]:bg-[hsl(var(--admin-accent))] data-[state=active]:text-[hsl(var(--admin-accent-foreground))]"
          >
            <MapPin className="h-4 w-4 mr-2" />
            Locations
          </TabsTrigger>
        </TabsList>

        {/* Categories Tab */}
        <TabsContent value="categories">
          <Card className="bg-[hsl(var(--admin-bg-elevated))] border-[hsl(var(--admin-border))]">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-[hsl(var(--admin-foreground))]">
                    Categories
                  </CardTitle>
                  <CardDescription className="text-[hsl(var(--admin-foreground-muted))]">
                    Manage product categories
                  </CardDescription>
                </div>
                <Button
                  onClick={handleCreateCategory}
                  className="bg-[hsl(var(--admin-accent))] hover:bg-[hsl(var(--admin-accent))]/90 text-[hsl(var(--admin-accent-foreground))]"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Category
                </Button>
              </div>
              <div className="relative mt-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[hsl(var(--admin-foreground-muted))]" />
                <Input
                  placeholder="Search categories..."
                  value={categorySearch}
                  onChange={(e) => setCategorySearch(e.target.value)}
                  className="pl-10 max-w-md bg-[hsl(var(--admin-bg-muted))] border-[hsl(var(--admin-border))] text-[hsl(var(--admin-foreground))]"
                />
              </div>
            </CardHeader>
            <CardContent>
              {categoriesLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-[hsl(var(--admin-accent))]" />
                </div>
              ) : (
                <div className="overflow-auto max-h-[50vh] rounded-lg border border-[hsl(var(--admin-border))]">
                  <Table>
                    <TableHeader className="sticky top-0 bg-[hsl(var(--admin-bg-elevated))] z-10">
                      <TableRow className="border-[hsl(var(--admin-border))]">
                        <TableHead className="text-[hsl(var(--admin-foreground-muted))]">Name</TableHead>
                        <TableHead className="text-[hsl(var(--admin-foreground-muted))]">Slug</TableHead>
                        <TableHead className="text-[hsl(var(--admin-foreground-muted))]">Description</TableHead>
                        <TableHead className="text-[hsl(var(--admin-foreground-muted))]">Status</TableHead>
                        <TableHead className="text-[hsl(var(--admin-foreground-muted))]">Created</TableHead>
                        <TableHead className="text-[hsl(var(--admin-foreground-muted))] w-[120px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredCategories?.map((category) => (
                        <TableRow key={category.id} className="border-[hsl(var(--admin-border))] hover:bg-[hsl(var(--admin-bg-muted))]">
                          <TableCell className="font-medium text-[hsl(var(--admin-foreground))]">
                            {category.icon && <span className="mr-2">{category.icon}</span>}
                            {category.name}
                          </TableCell>
                          <TableCell className="text-[hsl(var(--admin-foreground-muted))] font-mono text-sm">
                            {category.slug}
                          </TableCell>
                          <TableCell className="text-[hsl(var(--admin-foreground-muted))] max-w-[200px] truncate">
                            {category.description || "—"}
                          </TableCell>
                          <TableCell>
                            <Badge className={category.is_active
                              ? "bg-[hsl(var(--admin-success))]/20 text-[hsl(var(--admin-success))]"
                              : "bg-[hsl(var(--admin-danger))]/20 text-[hsl(var(--admin-danger))]"
                            }>
                              {category.is_active ? "Active" : "Inactive"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-[hsl(var(--admin-foreground-muted))] text-sm">
                            {format(new Date(category.created_at), "MMM d, yyyy")}
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEditCategory(category)}
                                className="text-[hsl(var(--admin-foreground-muted))] hover:text-[hsl(var(--admin-accent))]"
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setDeletingCategory(category)}
                                className="text-[hsl(var(--admin-foreground-muted))] hover:text-[hsl(var(--admin-danger))]"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
              {!categoriesLoading && filteredCategories?.length === 0 && (
                <div className="text-center py-8 text-[hsl(var(--admin-foreground-muted))]">
                  No categories found.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Locations Tab */}
        <TabsContent value="locations">
          <Card className="bg-[hsl(var(--admin-bg-elevated))] border-[hsl(var(--admin-border))]">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-[hsl(var(--admin-foreground))]">
                    Locations
                  </CardTitle>
                  <CardDescription className="text-[hsl(var(--admin-foreground-muted))]">
                    Manage markets, cities, and countries
                  </CardDescription>
                </div>
                <Button
                  onClick={handleCreateLocation}
                  className="bg-[hsl(var(--admin-accent))] hover:bg-[hsl(var(--admin-accent))]/90 text-[hsl(var(--admin-accent-foreground))]"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Location
                </Button>
              </div>
              <div className="relative mt-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[hsl(var(--admin-foreground-muted))]" />
                <Input
                  placeholder="Search locations..."
                  value={locationSearch}
                  onChange={(e) => setLocationSearch(e.target.value)}
                  className="pl-10 max-w-md bg-[hsl(var(--admin-bg-muted))] border-[hsl(var(--admin-border))] text-[hsl(var(--admin-foreground))]"
                />
              </div>
            </CardHeader>
            <CardContent>
              {locationsLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-[hsl(var(--admin-accent))]" />
                </div>
              ) : (
                <div className="overflow-auto max-h-[50vh] rounded-lg border border-[hsl(var(--admin-border))]">
                  <Table>
                    <TableHeader className="sticky top-0 bg-[hsl(var(--admin-bg-elevated))] z-10">
                      <TableRow className="border-[hsl(var(--admin-border))]">
                        <TableHead className="text-[hsl(var(--admin-foreground-muted))]">Name</TableHead>
                        <TableHead className="text-[hsl(var(--admin-foreground-muted))]">Slug</TableHead>
                        <TableHead className="text-[hsl(var(--admin-foreground-muted))]">Type</TableHead>
                        <TableHead className="text-[hsl(var(--admin-foreground-muted))]">Country</TableHead>
                        <TableHead className="text-[hsl(var(--admin-foreground-muted))]">Currency</TableHead>
                        <TableHead className="text-[hsl(var(--admin-foreground-muted))]">Status</TableHead>
                        <TableHead className="text-[hsl(var(--admin-foreground-muted))] w-[120px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredLocations?.map((location) => (
                        <TableRow key={location.id} className="border-[hsl(var(--admin-border))] hover:bg-[hsl(var(--admin-bg-muted))]">
                          <TableCell className="font-medium text-[hsl(var(--admin-foreground))]">
                            {location.name}
                          </TableCell>
                          <TableCell className="text-[hsl(var(--admin-foreground-muted))] font-mono text-sm">
                            {location.slug}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="capitalize border-[hsl(var(--admin-border))] text-[hsl(var(--admin-foreground))]">
                              {location.type}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-[hsl(var(--admin-foreground))]">
                            {location.country_code || "—"}
                          </TableCell>
                          <TableCell className="text-[hsl(var(--admin-foreground))]">
                            {location.currency_code || "—"}
                          </TableCell>
                          <TableCell>
                            <Badge className={location.is_active
                              ? "bg-[hsl(var(--admin-success))]/20 text-[hsl(var(--admin-success))]"
                              : "bg-[hsl(var(--admin-danger))]/20 text-[hsl(var(--admin-danger))]"
                            }>
                              {location.is_active ? "Active" : "Inactive"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEditLocation(location)}
                                className="text-[hsl(var(--admin-foreground-muted))] hover:text-[hsl(var(--admin-accent))]"
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setDeletingLocation(location)}
                                className="text-[hsl(var(--admin-foreground-muted))] hover:text-[hsl(var(--admin-danger))]"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
              {!locationsLoading && filteredLocations?.length === 0 && (
                <div className="text-center py-8 text-[hsl(var(--admin-foreground-muted))]">
                  No locations found.
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Category Dialog */}
      <Dialog open={categoryDialogOpen} onOpenChange={setCategoryDialogOpen}>
        <DialogContent className="bg-[hsl(var(--admin-bg-elevated))] border-[hsl(var(--admin-border))] text-[hsl(var(--admin-foreground))]">
          <DialogHeader>
            <DialogTitle>
              {editingCategory?.id ? "Edit Category" : "Create Category"}
            </DialogTitle>
            <DialogDescription className="text-[hsl(var(--admin-foreground-muted))]">
              {editingCategory?.id ? "Update category details" : "Add a new product category"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cat-name">Name *</Label>
                <Input
                  id="cat-name"
                  value={editingCategory?.name || ""}
                  onChange={(e) =>
                    setEditingCategory((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="bg-[hsl(var(--admin-bg-muted))] border-[hsl(var(--admin-border))]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cat-slug">Slug *</Label>
                <Input
                  id="cat-slug"
                  value={editingCategory?.slug || ""}
                  onChange={(e) =>
                    setEditingCategory((prev) => ({ ...prev, slug: e.target.value }))
                  }
                  className="bg-[hsl(var(--admin-bg-muted))] border-[hsl(var(--admin-border))]"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="cat-icon">Icon (emoji or text)</Label>
              <Input
                id="cat-icon"
                value={editingCategory?.icon || ""}
                onChange={(e) =>
                  setEditingCategory((prev) => ({ ...prev, icon: e.target.value }))
                }
                className="bg-[hsl(var(--admin-bg-muted))] border-[hsl(var(--admin-border))]"
                placeholder="🥕"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cat-desc">Description</Label>
              <Textarea
                id="cat-desc"
                value={editingCategory?.description || ""}
                onChange={(e) =>
                  setEditingCategory((prev) => ({ ...prev, description: e.target.value }))
                }
                className="bg-[hsl(var(--admin-bg-muted))] border-[hsl(var(--admin-border))]"
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="cat-active">Active</Label>
              <Switch
                id="cat-active"
                checked={editingCategory?.is_active ?? true}
                onCheckedChange={(checked) =>
                  setEditingCategory((prev) => ({ ...prev, is_active: checked }))
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCategoryDialogOpen(false)} className="border-[hsl(var(--admin-border))]">
              Cancel
            </Button>
            <Button
              onClick={handleSaveCategory}
              disabled={isSaving || !editingCategory?.name || !editingCategory?.slug}
              className="bg-[hsl(var(--admin-accent))] hover:bg-[hsl(var(--admin-accent))]/90"
            >
              {isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {editingCategory?.id ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Location Dialog */}
      <Dialog open={locationDialogOpen} onOpenChange={setLocationDialogOpen}>
        <DialogContent className="bg-[hsl(var(--admin-bg-elevated))] border-[hsl(var(--admin-border))] text-[hsl(var(--admin-foreground))]">
          <DialogHeader>
            <DialogTitle>
              {editingLocation?.id ? "Edit Location" : "Create Location"}
            </DialogTitle>
            <DialogDescription className="text-[hsl(var(--admin-foreground-muted))]">
              {editingLocation?.id ? "Update location details" : "Add a new location"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="loc-name">Name *</Label>
                <Input
                  id="loc-name"
                  value={editingLocation?.name || ""}
                  onChange={(e) =>
                    setEditingLocation((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="bg-[hsl(var(--admin-bg-muted))] border-[hsl(var(--admin-border))]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="loc-slug">Slug *</Label>
                <Input
                  id="loc-slug"
                  value={editingLocation?.slug || ""}
                  onChange={(e) =>
                    setEditingLocation((prev) => ({ ...prev, slug: e.target.value }))
                  }
                  className="bg-[hsl(var(--admin-bg-muted))] border-[hsl(var(--admin-border))]"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="loc-type">Type *</Label>
              <Select
                value={editingLocation?.type || "country"}
                onValueChange={(value) =>
                  setEditingLocation((prev) => ({ ...prev, type: value as LocationType }))
                }
              >
                <SelectTrigger className="bg-[hsl(var(--admin-bg-muted))] border-[hsl(var(--admin-border))]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-[hsl(var(--admin-bg-elevated))] border-[hsl(var(--admin-border))]">
                  <SelectItem value="country">Country</SelectItem>
                  <SelectItem value="city">City</SelectItem>
                  <SelectItem value="market">Market</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="loc-country">Country Code</Label>
                <Input
                  id="loc-country"
                  value={editingLocation?.country_code || ""}
                  onChange={(e) =>
                    setEditingLocation((prev) => ({ ...prev, country_code: e.target.value }))
                  }
                  className="bg-[hsl(var(--admin-bg-muted))] border-[hsl(var(--admin-border))]"
                  placeholder="RW"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="loc-currency">Currency Code</Label>
                <Input
                  id="loc-currency"
                  value={editingLocation?.currency_code || ""}
                  onChange={(e) =>
                    setEditingLocation((prev) => ({ ...prev, currency_code: e.target.value }))
                  }
                  className="bg-[hsl(var(--admin-bg-muted))] border-[hsl(var(--admin-border))]"
                  placeholder="RWF"
                />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="loc-active">Active</Label>
              <Switch
                id="loc-active"
                checked={editingLocation?.is_active ?? true}
                onCheckedChange={(checked) =>
                  setEditingLocation((prev) => ({ ...prev, is_active: checked }))
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setLocationDialogOpen(false)} className="border-[hsl(var(--admin-border))]">
              Cancel
            </Button>
            <Button
              onClick={handleSaveLocation}
              disabled={isSaving || !editingLocation?.name || !editingLocation?.slug}
              className="bg-[hsl(var(--admin-accent))] hover:bg-[hsl(var(--admin-accent))]/90"
            >
              {isSaving && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {editingLocation?.id ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Category Confirmation */}
      <AlertDialog open={!!deletingCategory} onOpenChange={() => setDeletingCategory(null)}>
        <AlertDialogContent className="bg-[hsl(var(--admin-bg-elevated))] border-[hsl(var(--admin-border))] text-[hsl(var(--admin-foreground))]">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Category</AlertDialogTitle>
            <AlertDialogDescription className="text-[hsl(var(--admin-foreground-muted))]">
              Are you sure you want to delete "{deletingCategory?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-[hsl(var(--admin-border))]">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDeleteCategory}
              className="bg-[hsl(var(--admin-danger))] hover:bg-[hsl(var(--admin-danger))]/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Location Confirmation */}
      <AlertDialog open={!!deletingLocation} onOpenChange={() => setDeletingLocation(null)}>
        <AlertDialogContent className="bg-[hsl(var(--admin-bg-elevated))] border-[hsl(var(--admin-border))] text-[hsl(var(--admin-foreground))]">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Location</AlertDialogTitle>
            <AlertDialogDescription className="text-[hsl(var(--admin-foreground-muted))]">
              Are you sure you want to delete "{deletingLocation?.name}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-[hsl(var(--admin-border))]">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDeleteLocation}
              className="bg-[hsl(var(--admin-danger))] hover:bg-[hsl(var(--admin-danger))]/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
}
