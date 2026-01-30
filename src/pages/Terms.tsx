import { Layout } from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText } from "lucide-react";

const sections = [
  {
    title: "1. Acceptance of Terms",
    content: `By accessing or using Priceflow's services, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing our services.

These terms apply to all users of the service, including without limitation sellers, buyers, industry users, and visitors.`,
  },
  {
    title: "2. Description of Service",
    content: `Priceflow provides a market price intelligence platform that enables users to:

• View real-time and historical market prices for various products
• Track price trends and receive alerts
• Connect with other market participants through messaging
• Submit and update price information (for authorized users)
• Access analytics and market reports

We reserve the right to modify, suspend, or discontinue any part of our services at any time without notice.`,
  },
  {
    title: "3. User Accounts",
    content: `To access certain features of our service, you must register for an account. You agree to:

• Provide accurate, current, and complete information during registration
• Maintain and promptly update your account information
• Maintain the security of your password and accept all risks of unauthorized access
• Notify us immediately if you discover any security breach or unauthorized use

You are responsible for all activities that occur under your account.`,
  },
  {
    title: "4. User Conduct",
    content: `You agree not to use our services to:

• Violate any applicable laws or regulations
• Submit false, misleading, or inaccurate price information
• Impersonate any person or entity
• Interfere with or disrupt the service or servers
• Attempt to gain unauthorized access to any portion of the service
• Use automated systems (bots, scrapers) without explicit permission
• Harass, abuse, or harm other users
• Transmit spam, chain letters, or other unsolicited communications

We reserve the right to terminate accounts that violate these guidelines.`,
  },
  {
    title: "5. Data Accuracy and Liability",
    content: `While we strive to provide accurate price information:

• Price data is provided "as is" without warranty of any kind
• We do not guarantee the accuracy, completeness, or timeliness of any data
• Users should verify important price information before making business decisions
• We are not liable for any losses arising from reliance on our data

Users who contribute price data are responsible for the accuracy of their submissions.`,
  },
  {
    title: "6. Intellectual Property",
    content: `The service and its original content, features, and functionality are owned by Priceflow and are protected by international copyright, trademark, and other intellectual property laws.

You may not:
• Copy, modify, or distribute our content without permission
• Use our trademarks or branding without written consent
• Reverse engineer or attempt to extract source code
• Create derivative works based on our service`,
  },
  {
    title: "7. Subscription and Payment",
    content: `Certain features require a paid subscription:

• Subscription fees are billed in advance on a monthly or annual basis
• All fees are non-refundable except as expressly set forth in these terms
• We may change our fees upon 30 days notice
• Failure to pay may result in suspension or termination of your account

Free trial periods, if offered, will automatically convert to paid subscriptions unless cancelled.`,
  },
  {
    title: "8. Termination",
    content: `We may terminate or suspend your account and access to the service immediately, without prior notice or liability, for any reason, including:

• Breach of these Terms
• Request by law enforcement or government agencies
• Extended periods of inactivity
• Unexpected technical or security issues

Upon termination, your right to use the service will immediately cease.`,
  },
  {
    title: "9. Limitation of Liability",
    content: `In no event shall Priceflow, its directors, employees, partners, agents, or suppliers be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation:

• Loss of profits, data, or business opportunities
• Trading losses or financial damages
• Procurement of substitute goods or services

This applies regardless of the basis of liability and even if we have been advised of the possibility of such damages.`,
  },
  {
    title: "10. Changes to Terms",
    content: `We reserve the right to modify or replace these Terms at any time. We will provide notice of any material changes by:

• Posting the new Terms on this page
• Updating the "Last updated" date
• Sending an email to registered users

Your continued use of the service after any changes constitutes acceptance of the new Terms.`,
  },
];

export default function Terms() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="secondary" className="mb-4">
              <FileText className="w-4 h-4 mr-1" />
              Legal
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Terms of Service
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Please read these terms carefully before using Priceflow's services.
            </p>
            <p className="text-sm text-muted-foreground mt-4">
              Last updated: January 30, 2026
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto space-y-8">
            {sections.map((section) => (
              <Card key={section.title}>
                <CardContent className="pt-6">
                  <h2 className="text-xl font-semibold mb-4">{section.title}</h2>
                  <div className="text-muted-foreground whitespace-pre-line">
                    {section.content}
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Contact */}
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="pt-6">
                <h2 className="text-xl font-semibold mb-4">Questions?</h2>
                <p className="text-muted-foreground">
                  If you have any questions about these Terms of Service, please contact us:
                </p>
                <ul className="mt-4 space-y-2 text-muted-foreground">
                  <li>Email: legal@priceflow.com</li>
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
