import { Link } from 'react-router-dom';
import { ArrowRight, Home as HomeIcon, DollarSign, Building2, Star } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SearchBar from '@/components/SearchBar';
import PropertyCard from '@/components/PropertyCard';
import { Button } from '@/components/ui/button';
import { mockProperties, mockTestimonials } from '@/lib/mockData';
import heroImage from '@/assets/hero-home.jpg';

const Index = () => {
  // TODO: Replace with actual API call - GET /api/properties/featured
  const featuredProperties = mockProperties.filter((p) => p.isFeatured);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="relative h-[600px] md:h-[700px] flex items-center justify-center overflow-hidden">
          {/* Background Image with Overlay */}
          <div className="absolute inset-0">
            <img src={heroImage} alt="Luxury real estate" className="w-full h-full object-cover" />
            <div className="absolute inset-0 gradient-overlay" />
          </div>

          {/* Hero Content */}
          <div className="relative z-10 container mx-auto px-4 text-center">
            <h1 className="text-white mb-6 animate-fade-in">
              Find Your Dream Home
            </h1>
            <p className="text-white/90 text-lg md:text-xl mb-8 max-w-2xl mx-auto animate-fade-in">
              Discover premium properties with PristinePrimier - Your trusted partner in real estate excellence
            </p>

            {/* Search Bar */}
            <div className="flex justify-center animate-fade-in">
              <SearchBar
                onSearch={(filters) => {
                  // TODO: Navigate to /buy with filters
                  console.log('Search filters:', filters);
                }}
              />
            </div>
          </div>
        </section>

        {/* Quick Action CTAs */}
        <section className="py-16 bg-secondary">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Link to="/buy">
                <div className="group bg-card p-8 rounded-lg shadow-md hover:shadow-elegant transition-smooth text-center cursor-pointer">
                  <div className="w-16 h-16 bg-teal/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-teal/20 transition-base">
                    <HomeIcon className="h-8 w-8 text-teal" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Buy a House</h3>
                  <p className="text-muted-foreground mb-4">
                    Explore thousands of properties ready for you
                  </p>
                  <span className="text-teal font-medium flex items-center justify-center gap-2 group-hover:gap-3 transition-base">
                    Browse Listings <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </Link>

              <Link to="/sell">
                <div className="group bg-card p-8 rounded-lg shadow-md hover:shadow-elegant transition-smooth text-center cursor-pointer">
                  <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-accent/20 transition-base">
                    <DollarSign className="h-8 w-8 text-accent" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Sell a House</h3>
                  <p className="text-muted-foreground mb-4">
                    Get the best price for your property
                  </p>
                  <span className="text-accent font-medium flex items-center justify-center gap-2 group-hover:gap-3 transition-base">
                    Get Started <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </Link>

              <Link to="/manage">
                <div className="group bg-card p-8 rounded-lg shadow-md hover:shadow-elegant transition-smooth text-center cursor-pointer">
                  <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-gold/20 transition-base">
                    <Building2 className="h-8 w-8 text-gold" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Manage Property</h3>
                  <p className="text-muted-foreground mb-4">
                    Professional property management services
                  </p>
                  <span className="text-gold font-medium flex items-center justify-center gap-2 group-hover:gap-3 transition-base">
                    Learn More <ArrowRight className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* Featured Listings */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="mb-4">Featured Properties</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Handpicked luxury properties that define elegance and comfort
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {featuredProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>

            <div className="text-center">
              <Button asChild variant="outline" size="lg">
                <Link to="/buy">
                  View All Properties <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-16 bg-secondary">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="mb-4">What Our Clients Say</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Don't just take our word for it - hear from our satisfied clients
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockTestimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="bg-card p-6 rounded-lg shadow-md hover:shadow-elegant transition-smooth"
                >
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-gold text-gold" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4">"{testimonial.content}"</p>
                  <div className="font-semibold">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 gradient-hero text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="mb-4">Ready to Find Your Perfect Home?</h2>
            <p className="text-lg mb-8 max-w-2xl mx-auto text-primary-foreground/90">
              Join thousands of satisfied clients who found their dream properties with us
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild variant="gold" size="xl">
                <Link to="/buy">Browse Properties</Link>
              </Button>
              <Button asChild variant="outline" size="xl" className="bg-transparent border-2 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                <Link to="/auth">Get Started</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Index;
