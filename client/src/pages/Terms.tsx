import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Shield, FileText, UserCheck, Home, DollarSign, Building2, Clock, AlertCircle } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const Terms = (): JSX.Element => {
  const [activeSection, setActiveSection] = useState<string>('introduction');

  const termsSections = [
    {
      id: 'introduction',
      title: 'Introduction & Acceptance',
      icon: FileText,
      content: `
        <p>Welcome to PristinePrimer Real Estate. These Terms and Conditions govern your use of our website and services. By accessing our platform, you agree to be bound by these terms.</p>
        <p><strong>Last Updated:</strong> ${new Date().toLocaleDateString()}</p>
        <p>Our services include property listings, real estate brokerage, property management, and related real estate services in Kenya.</p>
      `
    },
    {
      id: 'definitions',
      title: 'Definitions',
      icon: UserCheck,
      content: `
        <p><strong>"Platform"</strong> refers to PristinePrimer Real Estate website and mobile applications.</p>
        <p><strong>"User"</strong> includes buyers, sellers, tenants, landlords, and visitors to our platform.</p>
        <p><strong>"Property"</strong> includes residential, commercial, land, and rental properties listed on our platform.</p>
        <p><strong>"Agent"</strong> refers to licensed real estate agents representing PristinePrimer Real Estate.</p>
      `
    },
    {
      id: 'user-obligations',
      title: 'User Obligations',
      icon: UserCheck,
      content: `
        <h4>Account Registration</h4>
        <p>Users must provide accurate information during registration and maintain updated profile details.</p>
        
        <h4>Property Information</h4>
        <p>Sellers and landlords must provide truthful property information, including accurate pricing, features, and legal status.</p>
        
        <h4>Legal Compliance</h4>
        <p>All users must comply with Kenyan real estate laws, including the Land Act, Rent Restriction Act, and relevant county regulations.</p>
      `
    },
    {
      id: 'property-listings',
      title: 'Property Listings',
      icon: Home,
      content: `
        <h4>Listing Accuracy</h4>
        <p>All property listings must accurately represent the property's condition, location, size, and legal status.</p>
        
        <h4>Photography & Media</h4>
        <p>Property images must be current and not misleading. Virtual tours and floor plans should accurately represent the property.</p>
        
        <h4>Pricing Transparency</h4>
        <p>All prices must be clearly stated in Kenyan Shillings. Additional fees (agency, legal, stamp duty) must be disclosed.</p>
        
        <h4>Listing Duration</h4>
        <p>Property listings remain active for 90 days unless sold, rented, or removed by the seller/landlord.</p>
      `
    },
    {
      id: 'transactions',
      title: 'Transactions & Fees',
      icon: DollarSign,
      content: `
        <h4>Agency Commission</h4>
        <p>Sales: 2-5% of final sale price<br>
        Rentals: 1 month's rent for 1-year lease<br>
        Property Management: 8-12% of monthly rent</p>
        
        <h4>Payment Terms</h4>
        <p>Commission payable upon successful transaction completion. All payments in Kenyan Shillings unless otherwise agreed.</p>
        
        <h4>Refund Policy</h4>
        <p>Commission fees are non-refundable once services have been rendered. Exceptions may apply as per Kenyan consumer protection laws.</p>
      `
    },
    {
      id: 'legal-compliance',
      title: 'Legal Compliance',
      icon: Shield,
      content: `
        <h4>Kenyan Real Estate Laws</h4>
        <p>All transactions comply with:<br>
        • The Land Act, 2012<br>
        • The Land Registration Act, 2012<br>
        • The Physical Planning Act<br>
        • Relevant County Government Regulations</p>
        
        <h4>Due Diligence</h4>
        <p>We conduct title searches, land reference verification, and legal due diligence for all property transactions.</p>
        
        <h4>Dispute Resolution</h4>
        <p>Disputes shall first be resolved through mediation. Unresolved disputes may be referred to Kenyan courts.</p>
      `
    },
    {
      id: 'property-management',
      title: 'Property Management',
      icon: Building2,
      content: `
        <h4>Management Scope</h4>
        <p>Our services include tenant screening, rent collection, maintenance coordination, and property inspections.</p>
        
        <h4>Owner Responsibilities</h4>
        <p>Property owners must maintain adequate insurance, provide necessary documentation, and fund major repairs.</p>
        
        <h4>Tenant Relations</h4>
        <p>We handle tenant communications, lease enforcement, and ensure compliance with rental agreements.</p>
        
        <h4>Emergency Protocols</h4>
        <p>24/7 emergency contact available for urgent maintenance issues affecting property safety or habitability.</p>
      `
    },
    {
      id: 'intellectual-property',
      title: 'Intellectual Property',
      icon: FileText,
      content: `
        <h4>Content Ownership</h4>
        <p>All website content, including property descriptions, photographs, and virtual tours, are protected by copyright.</p>
        
        <h4>Platform Usage</h4>
        <p>Users may not copy, distribute, or use platform content for commercial purposes without written permission.</p>
        
        <h4>Brand Protection</h4>
        <p>PristinePrimer trademarks and logos may not be used without express written consent.</p>
      `
    },
    {
      id: 'liability',
      title: 'Liability & Disclaimers',
      icon: AlertCircle,
      content: `
        <h4>Information Accuracy</h4>
        <p>While we strive for accuracy, we cannot guarantee all property information is error-free. Users should verify details independently.</p>
        
        <h4>Transaction Risks</h4>
        <p>We facilitate transactions but are not liable for market fluctuations, property value changes, or buyer/seller decisions.</p>
        
        <h4>Service Limitations</h4>
        <p>Our liability is limited to commission fees paid. We are not liable for indirect or consequential damages.</p>
      `
    },
    {
      id: 'termination',
      title: 'Termination & Amendments',
      icon: Clock,
      content: `
        <h4>Account Termination</h4>
        <p>We reserve the right to suspend or terminate accounts for violations of these terms, fraudulent activity, or misuse of services.</p>
        
        <h4>Service Changes</h4>
        <p>We may modify or discontinue services with 30 days' notice to affected users.</p>
        
        <h4>Terms Updates</h4>
        <p>These terms may be updated periodically. Continued use of our services constitutes acceptance of updated terms.</p>
      `
    },
    {
      id: 'contact',
      title: 'Contact & Support',
      icon: Shield,
      content: `
        <h4>Legal Inquiries</h4>
        <p>For legal matters or terms clarification:<br>
        Email: legal@pristineprimer.com<br>
        Phone: +254 743 012 966</p>
        
        <h4>Complaints Procedure</h4>
        <p>Submit complaints in writing via email. We aim to respond within 5 business days and resolve within 30 days.</p>
        
        <h4>Governing Law</h4>
        <p>These terms are governed by Kenyan law. Any legal proceedings shall be conducted in Kenyan courts.</p>
      `
    }
  ];

  const quickFacts = [
    { icon: Clock, text: 'Commission: 2-5% on sales' },
    { icon: DollarSign, text: 'Rental Fee: 1 month rent' },
    { icon: Building2, text: 'Management: 8-12% monthly' },
    { icon: Shield, text: 'Legal compliance guaranteed' }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1">
        {/* Hero Section with Glassmorphism */}
        <section className="relative py-20 overflow-hidden">
          {/* Background with gradient and blur */}
          <div className="absolute inset-0 bg-gradient-to-br from-teal/5 via-blue-50/30 to-purple-50/20 backdrop-blur-sm"></div>
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=2073&q=80')] bg-cover bg-center opacity-5"></div>
          
          <div className="relative container mx-auto px-4 text-center">
            {/* Glassmorphism Card */}
            <div className="bg-white/70 backdrop-blur-md rounded-2xl p-8 md:p-12 shadow-2xl border border-white/20 max-w-4xl mx-auto">
              <div className="w-20 h-20 bg-teal/10 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm border border-white/20">
                <Shield className="h-10 w-10 text-teal" />
              </div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-medium mb-4 bg-gradient-to-r from-teal to-blue-600 bg-clip-text text-transparent">
                Terms & Conditions
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Legal framework governing our real estate services in Kenya
              </p>
              
              {/* Quick Facts Glass Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto mb-8">
                {quickFacts.map((fact, index) => (
                  <div 
                    key={index}
                    className="bg-white/50 backdrop-blur-md rounded-xl p-4 border border-white/20 shadow-lg"
                  >
                    <fact.icon className="h-6 w-6 text-teal mx-auto mb-2" />
                    <p className="text-sm font-medium text-center">{fact.text}</p>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  asChild 
                  className="bg-teal hover:bg-teal/90 text-white backdrop-blur-sm border border-white/20"
                >
                  <Link to="/contact">Contact Legal Team</Link>
                </Button>
                <Button 
                  asChild 
                  variant="outline"
                  className="bg-white/50 hover:bg-white/70 backdrop-blur-sm border border-white/30"
                >
                  <a href="#terms-content">Read Terms</a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Terms Content */}
        <section id="terms-content" className="py-16 bg-gradient-to-b from-blue-50/30 to-white">
          <div className="container mx-auto px-4">
            <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto">
              
              {/* Sidebar Navigation - Glassmorphism */}
              <div className="lg:w-80 flex-shrink-0">
                <div className="bg-white/70 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/20 sticky top-24">
                  <h3 className="font-semibold mb-4 text-lg">Table of Contents</h3>
                  <nav className="space-y-2">
                    {termsSections.map((section) => (
                      <button
                        key={section.id}
                        onClick={() => setActiveSection(section.id)}
                        className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 ${
                          activeSection === section.id
                            ? 'bg-teal/10 text-teal border border-teal/20 shadow-md'
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
                  {termsSections.map((section) => (
                    <div
                      key={section.id}
                      id={section.id}
                      className={`bg-white/70 backdrop-blur-md rounded-2xl shadow-xl border border-white/20 overflow-hidden transition-all duration-300 ${
                        activeSection === section.id ? 'ring-2 ring-teal/20' : ''
                      }`}
                    >
                      {/* Section Header */}
                      <div className="bg-gradient-to-r from-white to-blue-50/50 px-6 py-4 border-b border-white/20">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-teal/10 rounded-full flex items-center justify-center">
                            <section.icon className="h-5 w-5 text-teal" />
                          </div>
                          <h2 className="text-xl font-semibold text-foreground">
                            {section.title}
                          </h2>
                        </div>
                      </div>

                      {/* Section Content */}
                      <div className="p-6">
                        <div 
                          className="prose prose-teal max-w-none"
                          dangerouslySetInnerHTML={{ __html: section.content }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Acceptance Card */}
                <div className="mt-8 bg-gradient-to-r from-teal/10 to-blue-100/30 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-teal/20">
                  <div className="text-center">
                    <Shield className="h-12 w-12 text-teal mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-4">Acceptance of Terms</h3>
                    <p className="text-muted-foreground mb-6">
                      By using our platform and services, you acknowledge that you have read, understood, 
                      and agree to be bound by these Terms and Conditions.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Button 
                        asChild
                        className="bg-teal hover:bg-teal/90 text-white"
                      >
                        <Link to="/contact">Questions? Contact Us</Link>
                      </Button>
                      <Button 
                        asChild
                        variant="outline"
                      >
                        <Link to="/">Back to Home</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-teal to-blue-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 md:p-12 max-w-4xl mx-auto border border-white/20">
              <h2 className="text-2xl md:text-3xl font-medium mb-4">
                Need Legal Clarification?
              </h2>
              <p className="text-lg mb-8 text-white/90 max-w-2xl mx-auto">
                Our legal team is available to explain any terms and ensure you're comfortable with our services.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  asChild
                  size="lg"
                  className="bg-white text-teal hover:bg-white/90"
                >
                  <a href="tel:+254743012966">
                    Call Legal Team
                  </a>
                </Button>
                <Button 
                  asChild
                  variant="outline"
                  size="lg"
                  className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-teal"
                >
                  <Link to="/contact">
                    Send Email
                  </Link>
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

export default Terms;