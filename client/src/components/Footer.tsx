import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MessageCircle, Music, Youtube, Instagram, Send, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // TODO: Replace with actual API call - POST /api/newsletter/subscribe
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      toast.success('Successfully subscribed to newsletter!');
      setEmail('');
    } catch (error) {
      toast.error('Failed to subscribe. Please try again.');
      console.error('Newsletter subscription error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-[#577A26] text-black mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Company Info */}
          <div>
            <Link to="/" className="flex items-center gap-2 text-xl font-bold mb-3">
              <img 
                src="/logorealestate.png"  
                alt="PristinePrimier Real Estate" 
                className="h-6 w-auto"
              />
              
            </Link>
            <p className="text-sm text-black/80 mb-3">
              Your trusted partner in real estate. Finding your perfect home, one property at a time.
            </p>
            <div className="flex gap-3">
              <a 
                href="https://www.tiktok.com/@pristineprimer.re?_t=ZM-90NhiAPtt8d&_r=1" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-black transition-base" 
                aria-label="TikTok"
              >
                <Music className="h-4 w-4" />
              </a>
              <a 
                href="https://youtube.com/@pristineprimierre?si=5tWPIODLQIQj_rzG" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-black transition-base" 
                aria-label="YouTube"
              >
                <Youtube className="h-4 w-4" />
              </a>
              <a 
                href="https://www.instagram.com/pristineprimier.re?igsh=ZmFna3p4d2RuZXF4" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-black transition-base" 
                aria-label="Instagram"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a 
                href="https://x.com/PristinePrimier?t=rtYfB5-tSYumWfICk6vKfA&s=09" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-black transition-base" 
                aria-label="X (Twitter)"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-3 text-black">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/buy" className="text-black/80 hover:text-black transition-base">
                  Buy a House
                </Link>
              </li>
              <li>
                <Link to="/sell" className="text-black/80 hover:text-black transition-base">
                  Sell a House
                </Link>
              </li>
              <li>
                <Link to="/rent" className="text-black/80 hover:text-black transition-base">
                  Rent Property
                </Link>
              </li>
              <li>
                <Link to="/manage" className="text-black/80 hover:text-black transition-base">
                  Property Management
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-black/80 hover:text-black transition-base">
                  Our Services
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold mb-3 text-black">Our Services</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/buy" className="text-black/80 hover:text-black transition-base">
                  Property Sales
                </Link>
              </li>
              <li>
                <Link to="/rent" className="text-black/80 hover:text-black transition-base">
                  Rental Services
                </Link>
              </li>
              <li>
                <Link to="/manage" className="text-black/80 hover:text-black transition-base">
                  Property Management
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-black/80 hover:text-black transition-base">
                  All Services
                </Link>
              </li>
              <li>
                <Link to="/auth" className="text-black/80 hover:text-black transition-base">
                  Get Started
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-3 text-black">Contact Us</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2 text-black/80">
                <MessageCircle className="h-4 w-4" />
                <a 
                  href="https://wa.me/254743012966" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-black transition-base"
                >
                  +254 743 012 966
                </a>
              </li>
              <li className="flex items-center gap-2 text-black/80">
                <Mail className="h-4 w-4" />
                <span>info@pristineprimier.com</span>
              </li>
              <li className="text-black/80 text-xs">
                Connect with us on social media<br />
                for instant updates and<br />
                property listings
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="border-t border-black/20 mt-6 pt-6">
          <div className="max-w-md mx-auto text-center">
            <h3 className="font-semibold text-black mb-2">Subscribe to Our Newsletter</h3>
            <p className="text-sm text-black/80 mb-3">
              Get the latest property listings and real estate news.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-white/10 border-black/20 text-black placeholder:text-black/50 focus:border-black"
              />
              <Button 
                type="submit" 
                variant="outline" 
                disabled={loading}
                className="border-black text-black hover:bg-black hover:text-white"
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black" />
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-1" />
                    Subscribe
                  </>
                )}
              </Button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-black/20 mt-6 pt-4 text-center text-xs text-black/60">
          <p>&copy; {new Date().getFullYear()} PristinePrimier Real Estate. All rights reserved.</p>
          
          {/* Implimenta Link */}
          <div className="mt-2">
            <a 
              href="https://www.implimenta.tech/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-pink-500 hover:text-pink-600 transition-colors font-medium"
            >
              <span>❤️</span>
              Made by Implimenta
            </a>
          </div>

          <div className="flex justify-center gap-4 mt-1">
            <Link to="/privacy" className="hover:text-black/80 transition-base">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-black/80 transition-base">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;