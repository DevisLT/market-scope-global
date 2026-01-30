import { Layout } from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Lock, Eye, Database, UserCheck, Globe } from "lucide-react";

const sections = [
  {
    icon: Database,
    title: "Information We Collect",
    content: `We collect information you provide directly to us, such as when you create an account, update your profile, use our services, or contact us. This may include:

• Account information (name, email, phone number, password)
• Profile information (company name, role, location preferences)
• Payment information (processed securely through our payment provider)
• Usage data (price searches, viewed markets, features used)
• Communications (messages with other users, support inquiries)`,
  },
  {
    icon: Eye,
    title: "How We Use Your Information",
    content: `We use the information we collect to:

• Provide, maintain, and improve our services
• Process transactions and send related notifications
• Send you technical notices, updates, and support messages
• Respond to your comments, questions, and customer service requests
• Communicate about products, services, and events offered by Priceflow
• Monitor and analyze trends, usage, and activities in connection with our services
• Detect, investigate, and prevent fraudulent transactions and abuse
• Personalize and improve your experience on our platform`,
  },
  {
    icon: UserCheck,
    title: "Information Sharing",
    content: `We do not sell, trade, or otherwise transfer your personal information to outside parties except as described below:

• Service Providers: We may share information with third-party vendors who perform services on our behalf (payment processing, data analysis, email delivery)
• Legal Requirements: We may disclose information if required by law or if we believe such action is necessary to comply with legal obligations
• Business Transfers: In connection with any merger, sale, or acquisition of company assets
• With Your Consent: We may share information with your explicit consent

When you post prices or communicate with other users, that information may be visible to other platform users.`,
  },
  {
    icon: Lock,
    title: "Data Security",
    content: `We implement appropriate technical and organizational measures to protect your personal information:

• Encryption of data in transit (TLS/SSL) and at rest
• Regular security assessments and penetration testing
• Access controls limiting employee access to personal data
• Secure data centers with physical and environmental safeguards
• Regular backups and disaster recovery procedures

While we strive to protect your information, no method of transmission over the internet is 100% secure.`,
  },
  {
    icon: Globe,
    title: "International Data Transfers",
    content: `Priceflow operates globally, and your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place:

• Standard Contractual Clauses approved by relevant authorities
• Data processing agreements with all third-party providers
• Compliance with applicable international data protection laws

By using our services, you consent to the transfer of your information to countries outside your residence.`,
  },
  {
    icon: Shield,
    title: "Your Rights and Choices",
    content: `You have certain rights regarding your personal information:

• Access: Request a copy of your personal data
• Correction: Update or correct inaccurate information
• Deletion: Request deletion of your personal data
• Portability: Receive your data in a structured, machine-readable format
• Opt-out: Unsubscribe from marketing communications
• Restrict Processing: Limit how we use your data

To exercise these rights, contact us at privacy@priceflow.com. We will respond within 30 days.`,
  },
];

export default function Privacy() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="secondary" className="mb-4">
              <Shield className="w-4 h-4 mr-1" />
              Legal
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Privacy Policy
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Your privacy is important to us. This policy explains how Priceflow
              collects, uses, and protects your personal information.
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
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <section.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h2 className="text-xl font-semibold mb-4">{section.title}</h2>
                      <div className="text-muted-foreground whitespace-pre-line">
                        {section.content}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Contact */}
            <Card className="bg-primary/5 border-primary/20">
              <CardContent className="pt-6">
                <h2 className="text-xl font-semibold mb-4">Contact Us</h2>
                <p className="text-muted-foreground">
                  If you have any questions about this Privacy Policy or our data
                  practices, please contact us:
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
