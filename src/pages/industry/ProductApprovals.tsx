import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  usePendingApprovals,
  useApproveProduct,
  useRejectProduct,
} from "@/hooks/useProductApprovals";
import {
  Package,
  CheckCircle,
  XCircle,
  Loader2,
  Clock,
  User,
  Tag,
} from "lucide-react";
import { format } from "date-fns";

export default function ProductApprovals() {
  const { data: pendingProducts, isLoading } = usePendingApprovals();
  const approveProduct = useApproveProduct();
  const rejectProduct = useRejectProduct();

  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");

  const handleApprove = (productId: string) => {
    approveProduct.mutate(productId);
  };

  const handleRejectClick = (productId: string) => {
    setSelectedProduct(productId);
    setRejectionReason("");
    setRejectDialogOpen(true);
  };

  const handleRejectConfirm = () => {
    if (selectedProduct && rejectionReason.trim()) {
      rejectProduct.mutate(
        { productId: selectedProduct, reason: rejectionReason },
        {
          onSuccess: () => {
            setRejectDialogOpen(false);
            setSelectedProduct(null);
            setRejectionReason("");
          },
        }
      );
    }
  };

  return (
    <Layout showFooter={false}>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Product Approvals</h1>
          <p className="text-muted-foreground">
            Review and approve products from sellers in your assigned categories
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : pendingProducts?.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
              <h3 className="text-lg font-medium">All caught up!</h3>
              <p className="text-muted-foreground">
                No products pending approval in your assigned categories
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {pendingProducts?.map((product) => (
              <Card key={product.id} className="overflow-hidden">
                {product.image_url && (
                  <div className="aspect-video bg-muted">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <CardTitle className="text-lg">{product.name}</CardTitle>
                      <CardDescription className="line-clamp-2">
                        {product.description || "No description"}
                      </CardDescription>
                    </div>
                    <Badge variant="outline" className="shrink-0">
                      <Clock className="h-3 w-3 mr-1" />
                      Pending
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-2 text-sm">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Tag className="h-3 w-3" />
                      {product.category?.name || "Uncategorized"}
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <Package className="h-3 w-3" />
                      {product.unit}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        {product.seller?.username.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">
                        {product.seller?.full_name || product.seller?.username}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Submitted {format(new Date(product.created_at), "MMM d, yyyy")}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      className="flex-1"
                      onClick={() => handleApprove(product.id)}
                      disabled={approveProduct.isPending}
                    >
                      {approveProduct.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <CheckCircle className="h-4 w-4 mr-2" />
                      )}
                      Approve
                    </Button>
                    <Button
                      variant="destructive"
                      className="flex-1"
                      onClick={() => handleRejectClick(product.id)}
                      disabled={rejectProduct.isPending}
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Reject
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Rejection Dialog */}
        <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Reject Product</DialogTitle>
              <DialogDescription>
                Please provide a reason for rejecting this product. This will be sent to
                the seller.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="rejection-reason">Reason for rejection</Label>
                <Textarea
                  id="rejection-reason"
                  placeholder="Enter the reason for rejection..."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  rows={4}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setRejectDialogOpen(false)}>
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleRejectConfirm}
                disabled={!rejectionReason.trim() || rejectProduct.isPending}
              >
                {rejectProduct.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : (
                  <XCircle className="h-4 w-4 mr-2" />
                )}
                Reject Product
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}
