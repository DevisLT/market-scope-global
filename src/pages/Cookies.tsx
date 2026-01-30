import { Layout } from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Cookie, Settings } from "lucide-react";

const cookieTypes = [
  {
    category: "Essential Cookies",
    description: "Required for the website to function properly. Cannot be disabled.",
    examples: [
      { name: "session_id", purpose: "Maintains your login session", duration: "Session" },
      { name: "csrf_token", purpose: "Protects against cross-site request forgery", duration: "Session" },
      { name: "cookie_consent", purpose: "Remembers your cookie preferences", duration: "1 year" },
    ],
  },
  {
    category: "Functional Cookies",
    description: "Enable enhanced functionality and personalization.",
    examples: [
      { name: "language", purpose: "Remembers your language preference", duration: "1 year" },
      { name: "theme", purpose: "Stores your dark/light mode preference", duration: "1 year" },
      { name: "recent_searches", purpose: "Remembers your recent market searches", duration: "30 days" },
    ],
  },
  {
    category: "Analytics Cookies",
    description: "Help us understand how visitors interact with our website.",
    examples: [
      { name: "_ga", purpose: "Google Analytics - Distinguishes users", duration: "2 years" },
      { name: "_gid", purpose: "Google Analytics - Distinguishes users", duration: "24 hours" },
      { name: "amplitude_id", purpose: "Product analytics - Usage patterns", duration: "1 year" },
    ],
  },
  {
    category: "Marketing Cookies",
    description: "Used to track visitors across websites for advertising purposes.",
    examples: [
      { name: "_fbp", purpose: "Facebook - Ad targeting", duration: "3 months" },
      { name: "_gcl_au", purpose: "Google Ads - Conversion tracking", duration: "3 months" },
      { name: "li_sugr", purpose: "LinkedIn - Ad targeting", duration: "3 months" },
    ],
  },
];

export default function Cookies() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="secondary" className="mb-4">
              <Cookie className="w-4 h-4 mr-1" />
              Legal
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Cookie Policy
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Learn about how Priceflow uses cookies and similar technologies to
              improve your experience.
            </p>
            <p className="text-sm text-muted-foreground mt-4">
              Last updated: January 30, 2026
            </p>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-xl font-semibold mb-4">What Are Cookies?</h2>
                <p className="text-muted-foreground mb-4">
                  Cookies are small text files that are placed on your device when you
                  visit a website. They are widely used to make websites work more
                  efficiently and provide information to website owners.
                </p>
                <p className="text-muted-foreground">
                  Priceflow uses cookies and similar technologies (such as web beacons
                  and local storage) to enhance your experience, analyze usage patterns,
                  and deliver personalized content.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Cookie Types */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-8">
            <h2 className="text-2xl font-bold text-center mb-8">Types of Cookies We Use</h2>
            
            {cookieTypes.map((type) => (
              <Card key={type.category}>
                <CardContent className="pt-6">
                  <h3 className="text-lg font-semibold mb-2">{type.category}</h3>
                  <p className="text-muted-foreground mb-4">{type.description}</p>
                  
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Cookie Name</TableHead>
                        <TableHead>Purpose</TableHead>
                        <TableHead>Duration</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {type.examples.map((cookie) => (
                        <TableRow key={cookie.name}>
                          <TableCell className="font-mono text-sm">{cookie.name}</TableCell>
                          <TableCell className="text-muted-foreground">{cookie.purpose}</TableCell>
                          <TableCell>{cookie.duration}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Managing Cookies */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Settings className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold mb-4">Managing Your Cookie Preferences</h2>
                    <p className="text-muted-foreground mb-4">
                      You have several options for managing cookies:
                    </p>
                    <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-6">
                      <li>
                        <strong>Browser settings:</strong> Most browsers allow you to block or
                        delete cookies through their settings menu.
                      </li>
                      <li>
                        <strong>Our cookie banner:</strong> When you first visit our site, you can
                        choose which types of cookies to accept.
                      </li>
                      <li>
                        <strong>Opt-out links:</strong> For third-party analytics and advertising
                        cookies, you can use opt-out tools provided by those services.
                      </li>
                    </ul>
                    <p className="text-muted-foreground mb-6">
                      Please note that blocking certain cookies may impact your experience and
                      the functionality of our services.
                    </p>
                    <Button>
                      <Settings className="w-4 h-4 mr-2" />
                      Manage Cookie Preferences
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Third Party Cookies */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardContent className="pt-6">
                <h2 className="text-xl font-semibold mb-4">Third-Party Cookies</h2>
                <p className="text-muted-foreground mb-4">
                  Some cookies on our site are set by third-party services that appear on our pages.
                  These include:
                </p>
                <ul className="list-disc list-inside text-muted-foreground space-y-2 mb-4">
                  <li><strong>Google Analytics:</strong> For website usage analysis</li>
                  <li><strong>Stripe:</strong> For secure payment processing</li>
                  <li><strong>Intercom:</strong> For customer support chat</li>
                  <li><strong>Social media platforms:</strong> For sharing features and advertising</li>
                </ul>
                <p className="text-muted-foreground">
                  We do not control these third-party cookies. Please refer to the respective
                  privacy policies of these services for more information.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="pt-6">
                <h2 className="text-xl font-semibold mb-4">Questions About Our Cookie Policy?</h2>
                <p className="text-muted-foreground">
                  If you have any questions about how we use cookies, please contact us:
                </p>
                <ul className="mt-4 space-y-2 text-muted-foreground">
                  <li>Email: privacy@priceflow.com</li>
                  <li>Address: 123 Market Street, Suite 500, San Francisco, CA 94102</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </Layout>
  );
}
