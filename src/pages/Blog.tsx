import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { Calendar, Clock, User, ArrowRight, Search } from "lucide-react";

const featuredPost = {
  title: "The Future of Real-Time Market Price Intelligence",
  excerpt: "How AI and machine learning are transforming the way we track and predict market prices across global markets.",
  author: "Sarah Chen",
  date: "Jan 28, 2026",
  readTime: "8 min read",
  category: "Industry Insights",
  image: "📊",
};

const posts = [
  {
    title: "5 Strategies for Smarter Commodity Trading",
    excerpt: "Learn how to leverage price data to make more informed trading decisions in volatile markets.",
    author: "Michael Okonkwo",
    date: "Jan 25, 2026",
    readTime: "5 min read",
    category: "Trading Tips",
  },
  {
    title: "Understanding Price Trends in Agricultural Markets",
    excerpt: "A deep dive into the factors that influence agricultural commodity prices worldwide.",
    author: "Elena Rodriguez",
    date: "Jan 22, 2026",
    readTime: "6 min read",
    category: "Market Analysis",
  },
  {
    title: "How Priceflow Verifies Market Data",
    excerpt: "An inside look at our rigorous data verification process that ensures 99.9% accuracy.",
    author: "James Liu",
    date: "Jan 18, 2026",
    readTime: "4 min read",
    category: "Product Updates",
  },
  {
    title: "Global Market Trends to Watch in 2026",
    excerpt: "Key economic indicators and market movements that will shape commodity prices this year.",
    author: "Sarah Chen",
    date: "Jan 15, 2026",
    readTime: "7 min read",
    category: "Industry Insights",
  },
  {
    title: "Building a Data-Driven Supply Chain",
    excerpt: "How enterprises are using real-time price intelligence to optimize their supply chains.",
    author: "Michael Okonkwo",
    date: "Jan 10, 2026",
    readTime: "6 min read",
    category: "Enterprise",
  },
  {
    title: "Introducing Our New API v2.0",
    excerpt: "Faster, more powerful, and easier to integrate—meet our completely redesigned API.",
    author: "James Liu",
    date: "Jan 5, 2026",
    readTime: "3 min read",
    category: "Product Updates",
  },
];

const categories = [
  "All Posts",
  "Industry Insights",
  "Trading Tips",
  "Market Analysis",
  "Product Updates",
  "Enterprise",
];

export default function Blog() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="secondary" className="mb-4">
              Priceflow Blog
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Insights & <span className="text-gradient">Market Intelligence</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Stay ahead with the latest market trends, trading strategies, and product updates from the Priceflow team.
            </p>
            <div className="max-w-md mx-auto relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search articles..."
                className="pl-10"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-4 border-b">
        <div className="container mx-auto px-4">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <Badge
                key={category}
                variant={category === "All Posts" ? "default" : "outline"}
                className="cursor-pointer whitespace-nowrap"
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Post */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <Card className="overflow-hidden">
            <div className="grid lg:grid-cols-2">
              <div className="bg-gradient-to-br from-primary/20 to-primary/5 p-12 flex items-center justify-center">
                <span className="text-9xl">{featuredPost.image}</span>
              </div>
              <div className="p-8 lg:p-12 flex flex-col justify-center">
                <Badge variant="secondary" className="w-fit mb-4">
                  {featuredPost.category}
                </Badge>
                <h2 className="text-2xl md:text-3xl font-bold mb-4">
                  {featuredPost.title}
                </h2>
                <p className="text-muted-foreground mb-6">
                  {featuredPost.excerpt}
                </p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                  <span className="flex items-center gap-1">
                    <User className="w-4 h-4" />
                    {featuredPost.author}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {featuredPost.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {featuredPost.readTime}
                  </span>
                </div>
                <Button className="w-fit">
                  Read Article
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* All Posts Grid */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-8">Latest Articles</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <Card key={post.title} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <Badge variant="outline" className="w-fit mb-2">
                    {post.category}
                  </Badge>
                  <CardTitle className="text-lg">{post.title}</CardTitle>
                  <CardDescription>{post.excerpt}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <User className="w-4 h-4" />
                      {post.author}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {post.readTime}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              Load More Articles
            </Button>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Subscribe to Our Newsletter
          </h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Get weekly market insights and trading tips delivered to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <Input
              placeholder="Enter your email"
              className="bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/60"
            />
            <Button variant="secondary">Subscribe</Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
