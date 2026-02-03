import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useIndustryCategoryAssignments,
  useAssignCategoryToIndustry,
  useUnassignCategoryFromIndustry,
} from "@/hooks/useProductApprovals";
import { useIndustryUsers } from "@/hooks/useUsers";
import { useCategories } from "@/hooks/useCategories";
import { Plus, Trash2, Loader2, Users, Tag } from "lucide-react";
import { format } from "date-fns";

export default function IndustryCategoryAssignment() {
  const { data: assignments, isLoading: assignmentsLoading } = useIndustryCategoryAssignments();
  const { data: industryUsers, isLoading: usersLoading } = useIndustryUsers();
  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const assignCategory = useAssignCategoryToIndustry();
  const unassignCategory = useUnassignCategoryFromIndustry();

  const [selectedUser, setSelectedUser] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const handleAssign = () => {
    if (selectedUser && selectedCategory) {
      assignCategory.mutate(
        { industryUserId: selectedUser, categoryId: selectedCategory },
        {
          onSuccess: () => {
            setSelectedUser("");
            setSelectedCategory("");
          },
        }
      );
    }
  };

  const isLoading = assignmentsLoading || usersLoading || categoriesLoading;

  // Get already assigned category IDs for the selected user
  const assignedCategoryIds = assignments
    ?.filter((a: any) => a.industry_user_id === selectedUser)
    .map((a: any) => a.category_id) || [];

  // Filter out already assigned categories
  const availableCategories = categories?.filter(
    (c) => !assignedCategoryIds.includes(c.id)
  );

  return (
    <AdminLayout title="Industry Category Assignment" description="Assign categories to industry users for product approvals">
      <div className="space-y-6">

        {/* Assignment Form */}
        <Card>
          <CardHeader>
            <CardTitle>Assign Category</CardTitle>
            <CardDescription>
              Select an industry user and category to create an assignment
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Select value={selectedUser} onValueChange={setSelectedUser}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select industry user" />
                  </SelectTrigger>
                  <SelectContent>
                    {industryUsers?.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          {user.full_name || user.username}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                <Select
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                  disabled={!selectedUser}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableCategories?.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        <div className="flex items-center gap-2">
                          <Tag className="h-4 w-4" />
                          {category.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button
                onClick={handleAssign}
                disabled={!selectedUser || !selectedCategory || assignCategory.isPending}
              >
                {assignCategory.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <Plus className="h-4 w-4 mr-2" />
                )}
                Assign
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Assignments Table */}
        <Card>
          <CardHeader>
            <CardTitle>Current Assignments</CardTitle>
            <CardDescription>
              Industry users and their assigned categories
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
            ) : assignments?.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Tag className="h-8 w-8 mx-auto mb-2" />
                <p>No assignments yet</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Industry User</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Assigned At</TableHead>
                    <TableHead className="w-20">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assignments?.map((assignment: any) => (
                    <TableRow key={assignment.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={assignment.industry_user?.avatar_url} />
                            <AvatarFallback>
                              {assignment.industry_user?.username?.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">
                              {assignment.industry_user?.full_name || assignment.industry_user?.username}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              @{assignment.industry_user?.username}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{assignment.category?.name}</Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {format(new Date(assignment.created_at), "MMM d, yyyy")}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive hover:text-destructive"
                          onClick={() => unassignCategory.mutate(assignment.id)}
                          disabled={unassignCategory.isPending}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
