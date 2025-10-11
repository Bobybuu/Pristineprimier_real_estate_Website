import { Link } from 'react-router-dom';
import { Home, Mail, Phone, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <Link to="/" className="flex items-center gap-2 text-xl font-bold mb-4">
              <Home className="h-6 w-6" />
              PristinePrimier
            </Link>
            <p className="text-sm text-primary-foreground/80 mb-4">
              Your trusted partner in real estate. Finding your perfect home, one property at a time.
            </p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-teal transition-base" aria-label="Facebook">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-teal transition-base" aria-label="Twitter">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-teal transition-base" aria-label="Instagram">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-teal transition-base" aria-label="LinkedIn">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/buy" className="text-primary-foreground/80 hover:text-primary-foreground transition-base">
                  Buy a House
                </Link>
              </li>
              <li>
                <Link to="/sell" className="text-primary-foreground/80 hover:text-primary-foreground transition-base">
                  Sell a House
                </Link>
              </li>
              <li>
                <Link to="/rent" className="text-primary-foreground/80 hover:text-primary-foreground transition-base">
                  Rent Property
                </Link>
              </li>
              <li>
                <Link to="/manage" className="text-primary-foreground/80 hover:text-primary-foreground transition-base">
                  Property Management
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-primary-foreground/80 hover:text-primary-foreground transition-base">
                  Services
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/about" className="text-primary-foreground/80 hover:text-primary-foreground transition-base">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/agents" className="text-primary-foreground/80 hover:text-primary-foreground transition-base">
                  Our Agents
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-primary-foreground/80 hover:text-primary-foreground transition-base">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-primary-foreground/80 hover:text-primary-foreground transition-base">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2 text-primary-foreground/80">
                <Phone className="h-4 w-4" />
                <span>(555) 123-4567</span>
              </li>
              <li className="flex items-center gap-2 text-primary-foreground/80">
                <Mail className="h-4 w-4" />
                <span>info@pristineprimier.com</span>
              </li>
              <li className="text-primary-foreground/80">
                123 Real Estate Blvd<br />
                Suite 100<br />
                Los Angeles, CA 90001
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center text-sm text-primary-foreground/60">
          <p>&copy; {new Date().getFullYear()} PristinePrimier Real Estate. All rights reserved.</p>
          <div className="flex justify-center gap-4 mt-2">
            <Link to="/privacy" className="hover:text-primary-foreground/80 transition-base">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-primary-foreground/80 transition-base">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
