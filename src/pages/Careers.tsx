import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Briefcase,
  MapPin,
  Clock,
  Heart,
  Zap,
  Globe,
  Users,
  Coffee,
  Laptop,
  Plane,
  GraduationCap,
  ArrowRight,
} from "lucide-react";

const benefits = [
  { icon: Heart, title: "Health & Wellness", description: "Comprehensive health, dental, and vision insurance" },
  { icon: Laptop, title: "Remote First", description: "Work from anywhere in the world" },
  { icon: Coffee, title: "Unlimited PTO", description: "Take the time you need to recharge" },
  { icon: GraduationCap, title: "Learning Budget", description: "$2,000/year for courses and conferences" },
  { icon: Plane, title: "Team Retreats", description: "Quarterly in-person meetups globally" },
  { icon: Zap, title: "Equity Package", description: "Own a piece of what we're building" },
];

const jobs = [
  {
    title: "Senior Frontend Engineer",
    department: "Engineering",
    location: "Remote (US/EU)",
    type: "Full-time",
    description: "Build beautiful, performant interfaces that help users make data-driven decisions.",
  },
  {
    title: "Backend Engineer",
    department: "Engineering",
    location: "Remote (Global)",
    type: "Full-time",
    description: "Design and scale our real-time data pipeline processing millions of price updates daily.",
  },
  {
    title: "Product Designer",
    department: "Design",
    location: "Remote (US/EU)",
    type: "Full-time",
    description: "Create intuitive experiences that make complex market data accessible to everyone.",
  },
  {
    title: "Data Scientist",
    department: "Data",
    location: "Remote (Global)",
    type: "Full-time",
    description: "Build ML models for price prediction and anomaly detection in global markets.",
  },
  {
    title: "Customer Success Manager",
    department: "Sales",
    location: "New York, NY",
    type: "Full-time",
    description: "Help enterprise customers get the most value from Priceflow's platform.",
  },
  {
    title: "Marketing Manager",
    department: "Marketing",
    location: "Remote (US)",
    type: "Full-time",
    description: "Drive awareness and growth for Priceflow across global markets.",
  },
];

const values = [
  {
    icon: Globe,
    title: "Think Global",
    description: "We're building for users in 150+ countries. Diverse perspectives make us stronger.",
  },
  {
    icon: Zap,
    title: "Move Fast",
    description: "We ship early and iterate quickly. Perfect is the enemy of good.",
  },
  {
    icon: Users,
    title: "User Obsessed",
    description: "Every decision starts with the question: how does this help our users?",
  },
  {
    icon: Heart,
    title: "Be Kind",
    description: "We treat each other with respect, empathy, and honesty.",
  },
];

export default function Careers() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="secondary" className="mb-4">
              <Briefcase className="w-4 h-4 mr-1" />
              Join Our Team
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Build the Future of{" "}
              <span className="text-gradient">Market Intelligence</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Join a remote-first team of passionate people working to democratize
              access to market price data worldwide.
            </p>
            <Button size="lg" asChild>
              <a href="#positions">
                View Open Positions
                <ArrowRight className="w-5 h-5 ml-2" />
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {[
              { label: "Team Members", value: "45+" },
              { label: "Countries", value: "12" },
              { label: "Remote First", value: "100%" },
              { label: "Funding Raised", value: "$25M" },
            ].map((stat) => (
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

      {/* Our Values */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Values</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              The principles that define how we work together
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

      {/* Benefits */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Benefits & Perks</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We take care of our team so they can do their best work
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {benefits.map((benefit) => (
              <div key={benefit.title} className="flex gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <benefit.icon className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Positions */}
      <section id="positions" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Open Positions</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Find your next opportunity with us
            </p>
          </div>
          <div className="max-w-4xl mx-auto space-y-4">
            {jobs.map((job) => (
              <Card key={job.title} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <Badge variant="outline" className="mb-2">
                        {job.department}
                      </Badge>
                      <CardTitle>{job.title}</CardTitle>
                      <CardDescription className="mt-2">{job.description}</CardDescription>
                    </div>
                    <Button className="md:flex-shrink-0">
                      Apply Now
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {job.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {job.type}
                    </span>
                  </div>
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
            Don't See Your Role?
          </h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            We're always looking for talented people. Send us your resume and we'll
            keep you in mind for future opportunities.
          </p>
          <Button size="lg" variant="secondary" asChild>
            <Link to="/contact">Get in Touch</Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
}
