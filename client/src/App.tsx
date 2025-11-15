import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Buy from "./pages/Buy";
import PropertyDetails from "./pages/PropertyDetails";
import Sell from "./pages/Sell";
import Manage from "./pages/Manage";
import Rent from "./pages/Rent";
import Services from "./pages/Services";
import Auth from "./pages/Auth";
import Dashboard from "@/pages/Dashboard";
import NotFound from "./pages/NotFound";
import Profile from "@/pages/Profile";
import CreateProperty from "@/pages/CreateProperty";
import PWAInstallPrompt from "@/components/PWAInstallPrompt"; 
import About from "./pages/About";
import Contact from "./pages/Contact";
import Faq from '@/pages/Faq';
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import { useEffect } from "react";

// 🔥 SEO IMPORTS
import SEOHead from "@/components/SEOHead";

const queryClient = new QueryClient();

const App = () => {
  
  useEffect(() => {
    // Check for service worker updates
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(registration => {
        console.log('🔄 Checking for service worker updates...');
        registration.update();
      });
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              {/* HOME PAGE */}
              <Route path="/" element={
                <>
                  <SEOHead 
                    title="PristinePrimier Real Estate Kenya | Luxury Properties for Sale & Rent"
                    description="Find your dream home in Nairobi, Karen, Westlands. Luxury houses, apartments, land for sale and rent across Kenya. Expert real estate agents and property management services."
                    keywords="real estate Kenya, property for sale Kenya, houses for sale Nairobi, luxury homes Kenya, property management Kenya"
                  />
                  <Index />
                </>
              } />
              
              {/* BUY PROPERTIES */}
              <Route path="/buy" element={
                <>
                  <SEOHead 
                    title="Properties for Sale in Kenya | Buy Houses, Apartments & Land"
                    description="Browse premium properties for sale in Nairobi, Karen, Westlands, Kilimani. Houses, apartments, land and commercial property. Find your perfect home with PristinePrimier."
                    keywords="properties for sale kenya, houses for sale nairobi, land for sale kenya, buy property kenya, real estate investment kenya"
                  />
                  <Buy />
                </>
              } />
              
              {/* PROPERTY DETAILS - Dynamic SEO handled in component */}
              <Route path="/property/:id" element={<PropertyDetails />} />
              
              {/* SELL PROPERTIES */}
              <Route path="/sell" element={
                <>
                  <SEOHead 
                    title="Sell Your Property in Kenya | Get Best Market Value"
                    description="List your property for sale with Kenya's leading real estate agency. Get the best value for your house, land or commercial property. Professional valuation and marketing services."
                    keywords="sell property kenya, list property nairobi, real estate agents kenya, property valuation kenya, sell house nairobi"
                  />
                  <Sell />
                </>
              } />
              
              {/* PROPERTY MANAGEMENT */}
              <Route path="/manage" element={
                <>
                  <SEOHead 
                    title="Property Management Services Kenya | Professional Management"
                    description="Professional property management services in Nairobi. Tenant screening, rent collection, maintenance and more. Maximize your rental income with PristinePrimier."
                    keywords="property management kenya, rental management nairobi, property managers kenya, tenant screening kenya, rent collection services"
                  />
                  <Manage />
                </>
              } />
              
              {/* RENT PROPERTIES */}
              <Route path="/rent" element={
                <>
                  <SEOHead 
                    title="Properties for Rent in Kenya | Houses & Apartments for Rent"
                    description="Find houses, apartments and commercial spaces for rent in Nairobi, Karen, Westlands. Short-term and long-term rentals available. Quality rental properties across Kenya."
                    keywords="properties for rent kenya, houses for rent nairobi, apartments for rent, rental homes kenya, short term rentals nairobi"
                  />
                  <Rent />
                </>
              } />
              
              {/* SERVICES */}
              <Route path="/services" element={
                <>
                  <SEOHead 
                    title="Real Estate Services Kenya | Comprehensive Property Solutions"
                    description="Comprehensive real estate services including property valuation, investment consulting, legal support and property management. Your trusted partner in Kenyan real estate."
                    keywords="real estate services kenya, property valuation nairobi, investment consulting, legal support kenya, property management services"
                  />
                  <Services />
                </>
              } />
              
              {/* AUTH - Minimal SEO */}
              <Route path="/auth" element={
                <>
                  <SEOHead 
                    title="Login | PristinePrimier Real Estate Kenya"
                    description="Sign in to your PristinePrimier account to manage properties, listings, and preferences."
                  />
                  <Auth />
                </>
              } />
              
              {/* ABOUT US */}
              <Route path="/about" element={
                <>
                  <SEOHead 
                    title="About PristinePrimier Real Estate Kenya | Our Story & Mission"
                    description="Learn about PristinePrimier - Kenya's trusted real estate partner. Our mission, values and commitment to excellence in property services since our establishment."
                    keywords="about pristineprimier, real estate company kenya, property agents nairobi, our story, company history kenya"
                  />
                  <About />
                </>
              } />
              
              {/* CONTACT */}
              <Route path="/contact" element={
                <>
                  <SEOHead 
                    title="Contact PristinePrimier Real Estate Kenya | Get In Touch Today"
                    description="Contact our real estate experts in Nairobi. We're here to help you buy, sell, rent or manage properties across Kenya. Call +254 729 407 573 today."
                    keywords="contact real estate kenya, pristineprimier contact, property inquiry nairobi, real estate agents contact, get in touch kenya"
                  />
                  <Contact />
                </>
              } />
              
              {/* FAQ */}
              <Route path="/faq" element={
                <>
                  <SEOHead 
                    title="FAQ | Real Estate Questions Kenya | Expert Answers"
                    description="Frequently asked questions about buying, selling, renting properties in Kenya. Expert answers from PristinePrimier real estate professionals. Get all your questions answered."
                    keywords="real estate faq kenya, property questions nairobi, buying house kenya faq, selling property questions, rental faq kenya"
                  />
                  <Faq />
                </>
              } />
              
              {/* TERMS */}
              <Route path="/terms" element={
                <>
                  <SEOHead 
                    title="Terms of Service | PristinePrimier Real Estate Kenya"
                    description="Terms and conditions for using PristinePrimier Real Estate services in Kenya. Read our terms of service and user agreements for property transactions."
                    keywords="terms of service, real estate terms kenya, pristineprimier terms, user agreement, service conditions"
                  />
                  <Terms />
                </>
              } />
              
              {/* PRIVACY */}
              <Route path="/privacy" element={
                <>
                  <SEOHead 
                    title="Privacy Policy | PristinePrimier Real Estate Kenya"
                    description="Privacy policy for PristinePrimier Real Estate Kenya. Learn how we protect your data and ensure your privacy in all property transactions."
                    keywords="privacy policy, data protection kenya, real estate privacy, personal information protection, data security kenya"
                  />
                  <Privacy />
                </>
              } />

              {/* PROTECTED ROUTES */}

              {/* DASHBOARD PROFILE */}
              <Route 
                path="/dashboard/profile" 
                element={
                  <ProtectedRoute>
                    <SEOHead 
                      title="My Profile | PristinePrimier Dashboard"
                      description="Manage your PristinePrimier account, saved properties, and preferences. Update your personal information and notification settings."
                    />
                    <Profile />
                  </ProtectedRoute>
                } 
              />
              
              {/* CREATE PROPERTY */}
              <Route 
                path="/dashboard/seller/create" 
                element={
                  <ProtectedRoute>
                    <SEOHead 
                      title="Create Property Listing | Seller Dashboard"
                      description="List your property for sale or rent on PristinePrimier Real Estate Kenya. Add photos, details, and pricing for your property listing."
                    />
                    <CreateProperty />
                  </ProtectedRoute>
                } 
              />

              {/* MAIN DASHBOARD */}
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <SEOHead 
                      title="Dashboard | PristinePrimier Real Estate"
                      description="Your PristinePrimier dashboard for managing properties, inquiries, and account settings. Track your real estate activities and performance."
                    />
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />

              {/* CREATE PROPERTY ALT ROUTE */}
              <Route 
                path="/create-property" 
                element={
                  <ProtectedRoute>
                    <SEOHead 
                      title="Create Property Listing | PristinePrimier"
                      description="Add your property to PristinePrimier's premium real estate listings in Kenya. Reach thousands of potential buyers and tenants."
                    />
                    <CreateProperty />
                  </ProtectedRoute>
                } 
              />
              
              {/* SELLER DASHBOARD */}
              <Route 
                path="/dashboard/seller" 
                element={
                  <ProtectedRoute requiredRole="seller">
                    <SEOHead 
                      title="Seller Dashboard | Manage Your Listings"
                      description="Manage your property listings, view inquiries, and track performance. Optimize your property listings for better visibility and sales."
                    />
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              
              {/* ADMIN DASHBOARD */}
              <Route 
                path="/dashboard/admin" 
                element={
                  <ProtectedRoute requiredRole="admin">
                    <SEOHead 
                      title="Admin Dashboard | PristinePrimier Real Estate"
                      description="Administrator dashboard for managing PristinePrimier Real Estate platform. Monitor system performance and user activities."
                    />
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />

              {/* PROFILE PAGE */}
              <Route 
                path="/profile" 
                element={
                  <ProtectedRoute>
                    <SEOHead 
                      title="My Profile | Account Settings"
                      description="Update your profile information, preferences, and notification settings. Manage your saved properties and search preferences."
                    />
                    <Profile />
                  </ProtectedRoute>
                } 
              />
              
              {/* 404 PAGE */}
              <Route path="*" element={
                <>
                  <SEOHead 
                    title="Page Not Found | PristinePrimier Real Estate Kenya"
                    description="The page you're looking for doesn't exist. Return to PristinePrimier Real Estate Kenya homepage to find properties for sale and rent."
                  />
                  <NotFound />
                </>
              } />
            </Routes>
            
            {/* PWA Install Prompt - Appears on all pages */}
            <PWAInstallPrompt />
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;