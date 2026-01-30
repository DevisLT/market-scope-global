import { Layout } from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  TrendingUp,
  Globe,
  Users,
  Target,
  Heart,
  Shield,
  Zap,
  Award,
} from "lucide-react";

const stats = [
  { label: "Active Markets", value: "500+" },
  { label: "Products Tracked", value: "10K+" },
  { label: "Countries", value: "150+" },
  { label: "Daily Users", value: "50K+" },
];

const values = [
  {
    icon: Target,
    title: "Accuracy",
    description: "We verify every data point to ensure you make decisions based on accurate information.",
  },
  {
    icon: Shield,
    title: "Transparency",
    description: "Every price entry is time-stamped and traceable to its source for complete transparency.",
  },
  {
    icon: Heart,
    title: "Accessibility",
    description: "Making market intelligence accessible to everyone, from small traders to large enterprises.",
  },
  {
    icon: Zap,
    title: "Speed",
    description: "Real-time updates ensure you never miss a market movement or opportunity.",
  },
];

const team = [
  { name: "Sarah Chen", role: "CEO & Co-Founder", image: "SC" },
  { name: "Michael Okonkwo", role: "CTO & Co-Founder", image: "MO" },
  { name: "Elena Rodriguez", role: "Head of Data", image: "ER" },
  { name: "James Liu", role: "Head of Product", image: "JL" },
];

export default function About() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="secondary" className="mb-4">
              Our Story
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Democratizing Market{" "}
              <span className="text-gradient">Price Intelligence</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Priceflow was founded with a simple mission: to give everyone—from
              small traders to large enterprises—access to accurate, real-time
              market price data.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Mission</h2>
              <p className="text-lg text-muted-foreground mb-6">
                In many markets around the world, price information is fragmented,
                outdated, or simply inaccessible. This creates information
                asymmetry that disadvantages smaller players.
              </p>
              <p className="text-lg text-muted-foreground mb-6">
                Priceflow bridges this gap by aggregating price data from markets
                worldwide, verifying its accuracy, and making it available to
                anyone who needs it—in real-time.
              </p>
              <div className="flex gap-4">
                <Button asChild>
                  <Link to="/register">Join Priceflow</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/contact">Contact Us</Link>
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-primary/10 rounded-2xl p-8 flex flex-col items-center justify-center text-center">
                <Globe className="w-12 h-12 text-primary mb-4" />
                <h3 className="font-semibold">Global Reach</h3>
              </div>
              <div className="bg-primary/10 rounded-2xl p-8 flex flex-col items-center justify-center text-center">
                <TrendingUp className="w-12 h-12 text-primary mb-4" />
                <h3 className="font-semibold">Real-Time Data</h3>
              </div>
              <div className="bg-primary/10 rounded-2xl p-8 flex flex-col items-center justify-center text-center">
                <Users className="w-12 h-12 text-primary mb-4" />
                <h3 className="font-semibold">Community Driven</h3>
              </div>
              <div className="bg-primary/10 rounded-2xl p-8 flex flex-col items-center justify-center text-center">
                <Award className="w-12 h-12 text-primary mb-4" />
                <h3 className="font-semibold">Verified Data</h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Values</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              The principles that guide everything we do
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value) => (
              <Card key={value.title} className="text-center">
                <CardContent className="pt-8">
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <value.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{value.title}</h3>
                  <p className="text-sm text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Leadership Team</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Meet the people building the future of market intelligence
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {team.map((member) => (
              <div key={member.name} className="text-center">
                <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 text-2xl font-bold text-primary">
                  {member.image}
                </div>
                <h3 className="font-semibold">{member.name}</h3>
                <p className="text-sm text-muted-foreground">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Join Us in Building the Future
          </h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            We're always looking for talented people who share our vision.
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link to="/careers">View Open Positions</Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
}
