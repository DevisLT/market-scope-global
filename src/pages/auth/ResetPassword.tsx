import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Lock, CheckCircle } from "lucide-react";
import { Logo } from "@/components/Logo";

const resetPasswordSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;

export default function ResetPassword() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isValidSession, setIsValidSession] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  const form = useForm<ResetPasswordForm>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    const checkSession = async () => {
      // 1) PKCE flow: ?code=... in query string — exchange it for a session
      const url = new URL(window.location.href);
      const code = url.searchParams.get("code");
      const errorDesc = url.searchParams.get("error_description");

      if (errorDesc) {
        toast.error(decodeURIComponent(errorDesc));
        setIsChecking(false);
        return;
      }

      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (!error) {
          setIsValidSession(true);
          // Clean the URL so refresh doesn't re-exchange
          window.history.replaceState({}, "", "/reset-password");
          setIsChecking(false);
          return;
        }
        toast.error(error.message || "Reset link is invalid or expired");
      }

      // 2) Legacy hash flow: #access_token=...&refresh_token=...
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const accessToken = hashParams.get("access_token");
      const refreshToken = hashParams.get("refresh_token");
      if (accessToken && refreshToken) {
        const { error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });
        if (!error) {
          setIsValidSession(true);
          window.history.replaceState({}, "", "/reset-password");
          setIsChecking(false);
          return;
        }
      }

      // 3) Already authenticated (e.g. opened in same tab)
      const { data: { session } } = await supabase.auth.getSession();
      if (session) setIsValidSession(true);
      setIsChecking(false);
    };

    checkSession();
  }, []);

  const onSubmit = async (data: ResetPasswordForm) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: data.password,
      });

      if (error) throw error;

      setIsSuccess(true);
      toast.success("Password updated successfully!");
      
      // Sign out to clear the recovery session
      await supabase.auth.signOut();
      
      // Redirect to login after a short delay
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (error: any) {
      toast.error(error.message || "Failed to reset password");
    } finally {
      setIsLoading(false);
    }
  };

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary text-primary-foreground">
            <TrendingUp className="w-7 h-7" />
          </div>
          <span className="font-bold text-2xl">
            Price<span className="text-primary">flow</span>
          </span>
        </Link>

        <Card>
          <CardHeader className="text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              {isSuccess ? (
                <CheckCircle className="w-8 h-8 text-green-600" />
              ) : (
                <Lock className="w-8 h-8 text-primary" />
              )}
            </div>
            <CardTitle className="text-2xl">
              {isSuccess ? "Password Reset Complete" : "Set New Password"}
            </CardTitle>
            <CardDescription>
              {isSuccess
                ? "Your password has been updated successfully"
                : "Enter your new password below"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!isValidSession && !isSuccess ? (
              <div className="text-center space-y-4">
                <p className="text-sm text-muted-foreground">
                  This password reset link is invalid or has expired.
                </p>
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/forgot-password">Request New Reset Link</Link>
                </Button>
              </div>
            ) : isSuccess ? (
              <div className="text-center space-y-4">
                <p className="text-sm text-muted-foreground">
                  You can now sign in with your new password.
                </p>
                <Button className="w-full" asChild>
                  <Link to="/login">Sign In</Link>
                </Button>
              </div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="password"
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
                    Reset Password
                  </Button>
                </form>
              </Form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
