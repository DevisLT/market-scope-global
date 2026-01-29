import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Layout } from "@/components/layout/Layout";
import {
  TrendingUp,
  TrendingDown,
  Globe,
  BarChart3,
  Users,
  Shield,
  Zap,
  ArrowRight,
  Check,
  Building2,
  ShoppingCart,
  Factory,
} from "lucide-react";

const features = [
  {
    icon: TrendingUp,
    title: "Real-Time Prices",
    description: "Get instant access to current market prices with exact timestamps across all product categories.",
  },
  {
    icon: BarChart3,
    title: "Historical Trends",
    description: "Analyze price movements with interactive charts showing daily, weekly, and monthly patterns.",
  },
  {
    icon: Globe,
    title: "Global Markets",
    description: "Compare prices across countries, cities, and local markets with multi-currency support.",
  },
  {
    icon: Users,
    title: "Direct Communication",
    description: "Connect directly with sellers, buyers, and industry players through secure messaging.",
  },
  {
    icon: Shield,
    title: "Verified Data",
    description: "All price entries are verified and time-stamped for accuracy and reliability.",
  },
  {
    icon: Zap,
    title: "Smart Alerts",
    description: "Set price alerts and get notified when markets move in your favor.",
  },
];

const userTypes = [
  {
    icon: ShoppingCart,
    title: "For Sellers",
    description: "Farmers, traders, and shop owners",
    benefits: ["Add and update product prices", "View price history and trends", "Connect with buyers directly"],
    color: "bg-green-500",
  },
  {
    icon: Users,
    title: "For Buyers",
    description: "Consumers and resellers",
    benefits: ["View current market prices", "Compare prices by location", "Access historical data"],
    color: "bg-blue-500",
  },
  {
    icon: Factory,
    title: "For Industries",
    description: "Bulk buyers and distributors",
    benefits: ["Advanced analytics dashboard", "Post bulk demand listings", "Market intelligence reports"],
    color: "bg-purple-500",
  },
];

const pricingPlans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for getting started",
    features: ["View current prices", "Basic search", "5 markets", "Email support"],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Pro",
    price: "$2",
    period: "per month",
    description: "For serious market watchers",
    features: [
      "Everything in Free",
      "Historical data access",
      "Price trend charts",
      "Unlimited markets",
      "Price alerts",
      "Priority support",
    ],
    cta: "Start Free Trial",
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "contact us",
    description: "For large organizations",
    features: [
      "Everything in Pro",
      "API access",
      "Custom integrations",
      "Dedicated account manager",
      "SLA guarantee",
      "White-label options",
    ],
    cta: "Contact Sales",
    popular: false,
  },
];

export default function Landing() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="secondary" className="mb-4">
              🌍 Trusted by 10,000+ users worldwide
            </Badge>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              Global Market Prices,{" "}
              <span className="text-gradient">Real-Time Insights</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Make data-driven decisions with accurate, time-stamped market prices for
              every product across every market worldwide.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="text-lg px-8">
                <Link to="/register">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="text-lg px-8">
                <Link to="/prices">View Live Prices</Link>
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16 max-w-4xl mx-auto">
            {[
              { label: "Active Markets", value: "500+" },
              { label: "Products Tracked", value: "10K+" },
              { label: "Countries", value: "150+" },
              { label: "Daily Updates", value: "1M+" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Live Price Preview */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Live Market Snapshot</h2>
            <p className="text-muted-foreground">Real-time prices updated every minute</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {[
              { name: "Tomatoes", price: "$2.50/kg", change: "+5.2%", up: true },
              { name: "Petrol", price: "$1.45/L", change: "-2.1%", up: false },
              { name: "Cement", price: "$12.00/bag", change: "+0.8%", up: true },
              { name: "Rice", price: "$1.80/kg", change: "-1.5%", up: false },
              { name: "Wheat", price: "$0.95/kg", change: "+3.4%", up: true },
            ].map((item) => (
              <Card key={item.name} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <h4 className="font-medium mb-2">{item.name}</h4>
                  <p className="text-2xl font-bold mb-1">{item.price}</p>
                  <div className={`flex items-center justify-center gap-1 text-sm ${item.up ? "text-green-600" : "text-red-600"}`}>
                    {item.up ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                    {item.change}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything You Need for Market Intelligence
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Powerful features designed to give you a competitive edge in any market.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature) => (
              <Card key={feature.title} className="border-2 hover:border-primary/50 transition-colors">
                <CardHeader>
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* User Types */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Built for Everyone in the Market</h2>
            <p className="text-xl text-muted-foreground">Tailored experiences for every user type</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {userTypes.map((type) => (
              <Card key={type.title} className="relative overflow-hidden">
                <div className={`absolute top-0 left-0 right-0 h-1 ${type.color}`} />
                <CardHeader>
                  <div className={`w-12 h-12 rounded-xl ${type.color} flex items-center justify-center mb-4`}>
                    <type.icon className="w-6 h-6 text-white" />
                  </div>
                  <CardTitle>{type.title}</CardTitle>
                  <CardDescription>{type.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {type.benefits.map((benefit) => (
                      <li key={benefit} className="flex items-center gap-2 text-sm">
                        <Check className="w-4 h-4 text-primary" />
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-xl text-muted-foreground">Start free, upgrade when you need more</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingPlans.map((plan) => (
              <Card
                key={plan.name}
                className={`relative ${plan.popular ? "border-primary shadow-lg scale-105" : ""}`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">Most Popular</Badge>
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
                        <Check className="w-4 h-4 text-primary" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button
                    className="w-full"
                    variant={plan.popular ? "default" : "outline"}
                    asChild
                  >
                    <Link to="/register">{plan.cta}</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Make Smarter Decisions?
          </h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Join thousands of traders, buyers, and industries using PriceScope Global
            to stay ahead of market trends.
          </p>
          <Button size="lg" variant="secondary" asChild className="text-lg px-8">
            <Link to="/register">
              Start Your Free Trial
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
}
