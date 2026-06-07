import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Mail, ArrowLeft, CheckCircle } from "lucide-react";
import { Logo } from "@/components/Logo";

const forgotPasswordSchema = z.object({
  email: z.string().email("Please enter a valid email"),
});

type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPassword() {
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);

  const form = useForm<ForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (data: ForgotPasswordForm) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      setIsEmailSent(true);
      toast.success("Password reset email sent!");
    } catch (error: any) {
      toast.error(error.message || "Failed to send reset email");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-mesh p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-fade pointer-events-none" aria-hidden />
      <div className="w-full max-w-md relative animate-fade-in">
        {/* Logo */}
        <div className="flex items-center justify-center mb-8 animate-scale-in">
          <div className="rounded-2xl bg-white/10 backdrop-blur-md p-4 border border-white/20 shadow-[0_0_40px_rgba(255,255,255,0.15)]">
            <Logo size="2xl" />
          </div>
        </div>

        <Card className="glass-strong border-glow shadow-[var(--shadow-card)] animate-slide-up">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-gradient-neon">
              {isEmailSent ? "Check Your Email" : "Forgot Password"}
            </CardTitle>
            <CardDescription>
              {isEmailSent
                ? "We've sent you a password reset link"
                : "Enter your email and we'll send you a reset link"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {isEmailSent ? (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-accent/15 flex items-center justify-center mx-auto glow-emerald">
                  <CheckCircle className="w-8 h-8 text-accent" />
                </div>
                <p className="text-sm text-muted-foreground">
                  We've sent a password reset link to{" "}
                  <span className="font-medium text-foreground">
                    {form.getValues("email")}
                  </span>
                </p>
                <div className="bg-muted/50 rounded-lg p-4 text-left space-y-2">
                  <p className="text-sm font-medium">Didn't receive the email?</p>
                  <ul className="text-sm text-muted-foreground list-disc list-inside space-y-1">
                    <li>Check your <strong>spam/junk folder</strong></li>
                    <li>Make sure you entered the correct email</li>
                    <li>Wait a few minutes for delivery</li>
                  </ul>
                </div>
                <p className="text-sm text-muted-foreground">
                  Still nothing?{" "}
                  <button
                    onClick={() => setIsEmailSent(false)}
                    className="text-primary hover:underline font-medium"
                  >
                    Try again
                  </button>
                </p>
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/login">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Sign In
                  </Link>
                </Button>
              </div>
            ) : (
              <>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                              <Input
                                placeholder="you@example.com"
                                className="pl-10"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Send Reset Link
                    </Button>
                  </form>
                </Form>

                <p className="text-center text-sm text-muted-foreground">
                  Remember your password?{" "}
                  <Link to="/login" className="text-primary hover:underline font-medium">
                    Sign in
                  </Link>
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
