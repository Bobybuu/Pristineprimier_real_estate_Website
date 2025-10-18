import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Lock, Eye, User, Database, Mail, Phone, Trash2 } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const Privacy = (): JSX.Element => {
  const [activeSection, setActiveSection] = useState<string>('introduction');

  const privacySections = [
    {
      id: 'introduction',
      title: 'Introduction & Scope',
      icon: Shield,
      content: `
        <p>PristinePrimer Real Estate is committed to protecting your privacy and personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our real estate services in Kenya.</p>
        <p><strong>Last Updated:</strong> ${new Date().toLocaleDateString()}</p>
        <p>This policy applies to all users of our platform, including buyers, sellers, tenants, landlords, and property seekers.</p>
      `
    },
    {
      id: 'information-collection',
      title: 'Information We Collect',
      icon: Database,
      content: `
        <h4>Personal Information</h4>
        <p>• Contact details (name, email, phone number)<br>
        • Identity documents (ID, passport copies for verification)<br>
        • KRA PIN certificate<br>
        • Proof of income and employment details</p>
        
        <h4>Property Information</h4>
        <p>• Property details and characteristics<br>
        • Location data and coordinates<br>
        • Property ownership documents<br>
        • Financial information (pricing, rental rates)</p>
        
        <h4>Technical Information</h4>
        <p>• IP addresses and device information<br>
        • Browser type and version<br>
        • Usage data and analytics<br>
        • Cookies and tracking technologies</p>
      `
    },
    {
      id: 'data-usage',
      title: 'How We Use Your Information',
      icon: Eye,
      content: `
        <h4>Service Provision</h4>
        <p>• Facilitate property transactions and viewings<br>
        • Verify user identities and property ownership<br>
        • Process payments and commissions<br>
        • Provide property management services</p>
        
        <h4>Communication</h4>
        <p>• Send property recommendations and updates<br>
        • Respond to inquiries and provide support<br>
        • Send service-related notifications<br>
        • Marketing communications (with consent)</p>
        
        <h4>Legal Compliance</h4>
        <p>• Comply with Kenyan real estate regulations<br>
        • Prevent fraud and unauthorized activities<br>
        • Fulfill legal obligations and court orders<br>
        • Protect our rights and property</p>
      `
    },
    {
      id: 'data-sharing',
      title: 'Information Sharing',
      icon: User,
      content: `
        <h4>With Your Consent</h4>
        <p>We share information with other parties only when you explicitly consent, such as connecting buyers with sellers or sharing contact details for property viewings.</p>
        
        <h4>Service Providers</h4>
        <p>• Legal professionals for transaction processing<br>
        • Financial institutions for payment processing<br>
        • Maintenance contractors for property services<br>
        • Marketing partners (with strict data protection)</p>
        
        <h4>Legal Requirements</h4>
        <p>We may disclose information when required by Kenyan law, including to government agencies, law enforcement, or in response to legal processes.</p>
        
        <h4>Business Transfers</h4>
        <p>In case of merger, acquisition, or sale of assets, user information may be transferred as a business asset.</p>
      `
    },
    {
      id: 'data-protection',
      title: 'Data Protection & Security',
      icon: Lock,
      content: `
        <h4>Security Measures</h4>
        <p>• SSL encryption for data transmission<br>
        • Secure servers with firewalls<br>
        • Regular security audits and updates<br>
        • Access controls and authentication</p>
        
        <h4>Data Retention</h4>
        <p>• Active user data: Until account deletion<br>
        • Transaction records: 7 years (legal requirement)<br>
        • Property listings: 90 days after sale/rental<br>
        • Marketing data: Until consent withdrawal</p>
        
        <h4>International Transfers</h4>
        <p>Your data is primarily stored and processed in Kenya. Any international transfers comply with data protection laws and ensure adequate protection.</p>
      `
    },
    {
      id: 'user-rights',
      title: 'Your Rights & Choices',
      icon: Shield,
      content: `
        <h4>Access and Correction</h4>
        <p>You have the right to access your personal information and request corrections to inaccurate data.</p>
        
        <h4>Data Portability</h4>
        <p>You can request a copy of your data in a machine-readable format.</p>
        
        <h4>Withdrawal of Consent</h4>
        <p>You may withdraw consent for marketing communications at any time through your account settings or by contacting us.</p>
        
        <h4>Data Deletion</h4>
        <p>You can request deletion of your personal data, subject to legal retention requirements for transaction records.</p>
        
        <h4>Opt-out Options</h4>
        <p>• Unsubscribe from marketing emails<br>
        • Adjust cookie preferences in browser<br>
        • Limit location sharing in device settings</p>
      `
    },
    {
      id: 'cookies-tracking',
      title: 'Cookies & Tracking',
      icon: Eye,
      content: `
        <h4>Types of Cookies Used</h4>
        <p><strong>Essential Cookies:</strong> Required for platform functionality<br>
        <strong>Analytics Cookies:</strong> Help us understand user behavior<br>
        <strong>Marketing Cookies:</strong> Used for personalized advertising<br>
        <strong>Preference Cookies:</strong> Remember your settings</p>
        
        <h4>Third-Party Tracking</h4>
        <p>We use Google Analytics to analyze website traffic and improve user experience. You can opt-out through Google's Ads Settings.</p>
        
        <h4>Managing Cookies</h4>
        <p>You can control cookie settings through your browser. Note that disabling essential cookies may affect platform functionality.</p>
      `
    },
    {
      id: 'kenyan-compliance',
      title: 'Kenyan Law Compliance',
      icon: Shield,
      content: `
        <h4>Data Protection Act, 2019</h4>
        <p>We comply with Kenya's Data Protection Act, ensuring:<br>
        • Lawful processing of personal data<br>
        • Data minimization and purpose limitation<br>
        • Data accuracy and storage limitation<br>
        • Accountability and transparency</p>
        
        <h4>Real Estate Regulations</h4>
        <p>• Estate Agents Act compliance<br>
        • Anti-Money Laundering regulations<br>
        • Consumer protection laws<br>
        • Tax compliance requirements</p>
        
        <h4>Data Commissioner Registration</h4>
        <p>We are registered with the Office of the Data Protection Commissioner as required by Kenyan law.</p>
      `
    },
    {
      id: 'children-privacy',
      title: "Children's Privacy",
      icon: User,
      content: `
        <h4>Age Restrictions</h4>
        <p>Our services are not directed to individuals under 18 years of age. We do not knowingly collect personal information from children.</p>
        
        <h4>Parental Controls</h4>
        <p>If you believe a child has provided us with personal information, please contact us immediately, and we will take steps to delete such information.</p>
      `
    },
    {
      id: 'updates-changes',
      title: 'Policy Updates',
      icon: Shield,
      content: `
        <h4>Notification of Changes</h4>
        <p>We will notify users of significant changes to this Privacy Policy through email notifications or platform announcements.</p>
        
        <h4>Review Period</h4>
        <p>We encourage you to review this policy periodically. Continued use of our services after changes constitutes acceptance of the updated policy.</p>
        
        <h4>Archive Access</h4>
        <p>Previous versions of this Privacy Policy are available upon request.</p>
      `
    },
    {
      id: 'contact-dpo',
      title: 'Contact & Data Protection Officer',
      icon: Mail,
      content: `
        <h4>Data Protection Officer</h4>
        <p>For privacy-related inquiries and data protection matters:<br>
        <strong>Email:</strong> dpo@pristineprimer.com<br>
        <strong>Phone:</strong> +254 743 012 966<br>
        <strong>Address:</strong> Nairobi, Kenya</p>
        
        <h4>Complaints Procedure</h4>
        <p>If you have concerns about our data handling, contact our DPO first. Unresolved issues may be escalated to the Office of the Data Protection Commissioner in Kenya.</p>
        
        <h4>Response Time</h4>
        <p>We aim to respond to all privacy inquiries within 5 business days.</p>
      `
    }
  ];

  const privacyHighlights = [
    { icon: Lock, text: 'SSL Encrypted Data' },
    { icon: Shield, text: 'DPA 2019 Compliant' },
    { icon: Trash2, text: 'Right to Delete Data' },
    { icon: Eye, text: 'Transparent Practices' }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1">
        {/* Hero Section with Glassmorphism */}
        <section className="relative py-20 overflow-hidden">
          {/* Background with gradient and blur */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/40 via-purple-50/30 to-teal/10 backdrop-blur-sm"></div>
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1553877522-43269d4ea984?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center opacity-5"></div>
          
          <div className="relative container mx-auto px-4 text-center">
            {/* Glassmorphism Card */}
            <div className="bg-white/70 backdrop-blur-md rounded-2xl p-8 md:p-12 shadow-2xl border border-white/20 max-w-4xl mx-auto">
              <div className="w-20 h-20 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm border border-white/20">
                <Lock className="h-10 w-10 text-blue-600" />
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-medium mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Privacy Policy
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                How we protect and manage your personal information in Kenya
              </p>
              
              {/* Privacy Highlights Glass Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto mb-8">
                {privacyHighlights.map((highlight, index) => (
                  <div 
                    key={index}
                    className="bg-white/50 backdrop-blur-md rounded-xl p-4 border border-white/20 shadow-lg"
                  >
                    <highlight.icon className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                    <p className="text-sm font-medium text-center">{highlight.text}</p>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  asChild 
                  className="bg-blue-600 hover:bg-blue-700 text-white backdrop-blur-sm border border-white/20"
                >
                  <a href="#privacy-content">Read Policy</a>
                </Button>
                <Button 
                  asChild 
                  variant="outline"
                  className="bg-white/50 hover:bg-white/70 backdrop-blur-sm border border-white/30"
                >
                  <Link to="/contact">Contact DPO</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Privacy Content */}
        <section id="privacy-content" className="py-16 bg-gradient-to-b from-blue-50/20 to-white">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto">
              
              {/* Sidebar Navigation - Glassmorphism */}
              <div className="lg:w-80 flex-shrink-0">
                <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/20 sticky top-24">
                  <h3 className="font-semibold mb-4 text-lg">Policy Sections</h3>
                  <nav className="space-y-2">
                    {privacySections.map((section) => (
                      <button
                        key={section.id}
                        onClick={() => setActiveSection(section.id)}
                        className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 ${
                          activeSection === section.id
                            ? 'bg-blue-500/10 text-blue-600 border border-blue-500/20 shadow-md'
                            : 'text-muted-foreground hover:bg-white/50 hover:text-foreground'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <section.icon className="h-4 w-4 flex-shrink-0" />
                          <span className="text-sm font-medium">{section.title}</span>
                        </div>
                      </button>
                    ))}
                  </nav>
                </div>
              </div>

              {/* Main Content - Glassmorphism Cards */}
              <div className="flex-1">
                <div className="space-y-6">
                  {privacySections.map((section) => (
                    <div
                      key={section.id}
                      id={section.id}
                      className={`bg-white/70 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 overflow-hidden transition-all duration-300 ${
                        activeSection === section.id ? 'ring-2 ring-blue-500/20' : ''
                      }`}
                    >
                      {/* Section Header */}
                      <div className="bg-gradient-to-r from-white to-blue-50/50 px-6 py-4 border-b border-white/20">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-500/10 rounded-full flex items-center justify-center">
                            <section.icon className="h-5 w-5 text-blue-600" />
                          </div>
                          <h2 className="text-xl font-semibold text-foreground">
                            {section.title}
                          </h2>
                        </div>
                      </div>

                      {/* Section Content */}
                      <div className="p-6">
                        <div 
                          className="prose prose-blue max-w-none"
                          dangerouslySetInnerHTML={{ __html: section.content }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Your Rights Card */}
                <div className="mt-8 bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-blue-500/20">
                  <div className="text-center">
                    <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-4">Exercise Your Rights</h3>
                    <p className="text-muted-foreground mb-6">
                      You have control over your personal data. Contact our Data Protection Officer to exercise your rights under Kenyan data protection laws.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Button 
                        asChild
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        <a href="mailto:dpo@pristineprimer.com">Email DPO</a>
                      </Button>
                      <Button 
                        asChild
                        variant="outline"
                      >
                        <a href="tel:+254743012966">Call +254 743 012 966</a>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 md:p-12 max-w-4xl mx-auto border border-white/20">
              <h2 className="text-2xl md:text-3xl font-medium mb-4">
                Privacy Concerns?
              </h2>
              <p className="text-lg mb-8 text-white/90 max-w-2xl mx-auto">
                Our Data Protection Officer is available to address any privacy questions or data-related requests you may have.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  asChild
                  size="lg"
                  className="bg-white text-blue-600 hover:bg-white/90"
                >
                  <a href="mailto:dpo@pristineprimer.com">
                    <Mail className="h-5 w-5 mr-2" />
                    Email DPO
                  </a>
                </Button>
                <Button 
                  asChild
                  variant="outline"
                  size="lg"
                  className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-blue-600"
                >
                  <a href="tel:+254743012966">
                    <Phone className="h-5 w-5 mr-2" />
                    Call Now
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Privacy;