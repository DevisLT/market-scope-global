import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Layout } from "@/components/layout/Layout";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Check, Loader2 } from "lucide-react";

const plans = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for getting started",
    features: [
      "View current prices",
      "Basic search",
      "5 markets",
      "Limited historical data",
      "Email support",
    ],
    priceId: null,
    popular: false,
  },
  {
    id: "pro",
    name: "Pro",
    price: "$2",
    period: "per month",
    description: "For serious market watchers",
    features: [
      "Everything in Free",
      "Full historical data access",
      "Advanced price trend charts",
      "Unlimited markets",
      "Price alerts",
      "Priority support",
      "API access (coming soon)",
    ],
    priceId: "price_pro_monthly", // This should be replaced with actual Stripe price ID
    popular: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "Custom",
    period: "contact us",
    description: "For large organizations",
    features: [
      "Everything in Pro",
      "Custom API integrations",
      "Dedicated account manager",
      "SLA guarantee",
      "White-label options",
      "Custom analytics",
      "Bulk data exports",
    ],
    priceId: null,
    popular: false,
  },
];

export default function Pricing() {
  const { isAuthenticated, session } = useAuth();
  const navigate = useNavigate();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const handleSubscribe = async (plan: typeof plans[0]) => {
    if (!plan.priceId) {
      if (plan.id === "enterprise") {
        window.location.href = "mailto:enterprise@priceflow.com";
        return;
      }
      // Free plan - just redirect to register/dashboard
      if (isAuthenticated) {
        navigate("/dashboard");
      } else {
        navigate("/register");
      }
      return;
    }

    if (!isAuthenticated) {
      navigate("/register");
      return;
    }

    setLoadingPlan(plan.id);
    try {
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: {
          priceId: plan.priceId,
          successUrl: `${window.location.origin}/dashboard?success=true`,
          cancelUrl: `${window.location.origin}/pricing`,
        },
      });

      if (error) throw error;

      if (data?.url) {
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL returned");
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Failed to start checkout";
      toast.error(errorMessage);
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Start free, upgrade when you need more. No hidden fees, cancel anytime.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <Card
              key={plan.id}
              className={`relative ${
                plan.popular ? "border-primary shadow-lg scale-105" : ""
              }`}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                  Most Popular
                </Badge>
              )}
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="pt-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground">/{plan.period}</span>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-primary flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button
                  className="w-full"
                  variant={plan.popular ? "default" : "outline"}
                  onClick={() => handleSubscribe(plan)}
                  disabled={loadingPlan === plan.id}
                >
                  {loadingPlan === plan.id && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {plan.id === "enterprise"
                    ? "Contact Sales"
                    : plan.id === "free"
                    ? "Get Started"
                    : "Start Free Trial"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-20 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold mb-2">Can I cancel anytime?</h3>
              <p className="text-muted-foreground">
                Yes, you can cancel your subscription at any time. You'll continue to
                have access until the end of your billing period.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">What payment methods do you accept?</h3>
              <p className="text-muted-foreground">
                We accept all major credit cards (Visa, MasterCard, American Express)
                through our secure payment processor, Stripe.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Is there a free trial?</h3>
              <p className="text-muted-foreground">
                Yes! All new accounts start with a 14-day free trial of Pro features.
                No credit card required to start.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Can I switch plans?</h3>
              <p className="text-muted-foreground">
                Absolutely. You can upgrade or downgrade your plan at any time. Changes
                take effect immediately, and we'll prorate any charges.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
