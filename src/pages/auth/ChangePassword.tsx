import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Layout } from "@/components/layout/Layout";
import { useAuth } from "@/hooks/useAuth";
import { updatePassword, updateProfile } from "@/lib/auth";
import { toast } from "sonner";
import { Loader2, Lock } from "lucide-react";
import { Navigate } from "react-router-dom";

const passwordSchema = z.object({
  newPassword: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type PasswordForm = z.infer<typeof passwordSchema>;

export default function ChangePassword() {
  const { user, profile, isLoading: authLoading, isAuthenticated, refetchProfile } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If not first login, redirect to dashboard
  if (profile && !profile.is_first_login) {
    return <Navigate to="/dashboard" replace />;
  }

  const onSubmit = async (data: PasswordForm) => {
    if (!user) return;

    setIsLoading(true);
    try {
      await updatePassword(data.newPassword);
      await updateProfile(user.id, { is_first_login: false });
      await refetchProfile();
      toast.success("Password changed successfully!");
      navigate("/dashboard");
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Failed to change password";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout showFooter={false}>
      <div className="min-h-[80vh] flex items-center justify-center p-4 bg-mesh relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-fade pointer-events-none" aria-hidden />
        <Card className="w-full max-w-md glass-strong border-glow shadow-[var(--shadow-card)] animate-slide-up relative">
          <CardHeader className="text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 glow-cyan">
              <Lock className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-2xl text-gradient-neon">Change Your Password</CardTitle>
            <CardDescription>
              For security, you must set a new password before continuing.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="text-sm text-muted-foreground">
                  Password requirements:
                  <ul className="list-disc list-inside mt-1">
                    <li>At least 8 characters</li>
                    <li>Mix of uppercase and lowercase letters</li>
                    <li>Include numbers and symbols</li>
                  </ul>
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Set New Password
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
