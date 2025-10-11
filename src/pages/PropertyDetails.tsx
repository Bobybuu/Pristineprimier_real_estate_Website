import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Bed, Bath, Square, MapPin, Share2, Calendar, Home as HomeIcon } from 'lucide-react';
import { Facebook, Twitter, Mail } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ContactForm from '@/components/ContactForm';
import { Button } from '@/components/ui/button';
import { mockProperties } from '@/lib/mockData';
import type { Property } from '@/lib/mockData';

const PropertyDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<Property | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProperty();
  }, [id]);

  const loadProperty = async () => {
    setLoading(true);
    try {
      // TODO: Replace with actual API call - GET /api/property/{id}
      await new Promise((resolve) => setTimeout(resolve, 500));
      const found = mockProperties.find((p) => p.id === id);
      setProperty(found || null);
    } catch (error) {
      console.error('Failed to load property:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleShare = (platform: 'whatsapp' | 'facebook' | 'email') => {
    const url = window.location.href;
    const text = `Check out this property: ${property?.title}`;

    switch (platform) {
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'email':
        window.location.href = `mailto:?subject=${encodeURIComponent(text)}&body=${encodeURIComponent(url)}`;
        break;
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading property details...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="mb-4">Property Not Found</h2>
            <Button asChild variant="hero">
              <Link to="/buy">Browse Properties</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const isLandOnly = property.type === 'land';

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1">
        {/* Back Button */}
        <section className="bg-secondary py-4">
          <div className="container mx-auto px-4">
            <Button asChild variant="ghost" size="sm">
              <Link to="/buy">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Listings
              </Link>
            </Button>
          </div>
        </section>

        {/* Property Content */}
        <section className="py-8">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2">
                {/* Image Gallery */}
                <div className="mb-8">
                  <div className="relative rounded-lg overflow-hidden mb-4 h-96 bg-muted">
                    <img
                      src={property.images[selectedImage]}
                      alt={property.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {property.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={`relative rounded-lg overflow-hidden h-24 ${
                          selectedImage === index ? 'ring-2 ring-primary' : ''
                        }`}
                      >
                        <img src={image} alt={`View ${index + 1}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Property Info */}
                <div className="mb-8">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h1 className="mb-2">{property.title}</h1>
                      <div className="flex items-center gap-2 text-muted-foreground mb-4">
                        <MapPin className="h-5 w-5" />
                        <span>
                          {property.address}, {property.city}, {property.state} {property.zip}
                        </span>
                      </div>
                    </div>
                    <Button variant="outline" size="icon" onClick={() => handleShare('email')}>
                      <Share2 className="h-5 w-5" />
                    </Button>
                  </div>

                  <div className="text-3xl font-bold text-primary mb-6">
                    {formatPrice(property.price)}
                    {property.status === 'rent' && <span className="text-lg text-muted-foreground">/month</span>}
                  </div>

                  {!isLandOnly && (
                    <div className="flex flex-wrap gap-6 mb-6 p-6 bg-secondary rounded-lg">
                      {property.beds && (
                        <div className="flex items-center gap-2">
                          <Bed className="h-5 w-5 text-primary" />
                          <div>
                            <div className="text-2xl font-semibold">{property.beds}</div>
                            <div className="text-sm text-muted-foreground">Bedrooms</div>
                          </div>
                        </div>
                      )}
                      {property.baths && (
                        <div className="flex items-center gap-2">
                          <Bath className="h-5 w-5 text-primary" />
                          <div>
                            <div className="text-2xl font-semibold">{property.baths}</div>
                            <div className="text-sm text-muted-foreground">Bathrooms</div>
                          </div>
                        </div>
                      )}
                      {property.sqft && (
                        <div className="flex items-center gap-2">
                          <Square className="h-5 w-5 text-primary" />
                          <div>
                            <div className="text-2xl font-semibold">{property.sqft.toLocaleString()}</div>
                            <div className="text-sm text-muted-foreground">Square Feet</div>
                          </div>
                        </div>
                      )}
                      {property.yearBuilt && (
                        <div className="flex items-center gap-2">
                          <Calendar className="h-5 w-5 text-primary" />
                          <div>
                            <div className="text-2xl font-semibold">{property.yearBuilt}</div>
                            <div className="text-sm text-muted-foreground">Year Built</div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {isLandOnly && property.lotSize && (
                    <div className="p-6 bg-secondary rounded-lg mb-6">
                      <div className="flex items-center gap-2">
                        <Square className="h-5 w-5 text-primary" />
                        <div>
                          <div className="text-2xl font-semibold">{property.lotSize}</div>
                          <div className="text-sm text-muted-foreground">Lot Size</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Description */}
                <div className="mb-8">
                  <h2 className="text-2xl font-semibold mb-4">Description</h2>
                  <p className="text-muted-foreground leading-relaxed">{property.description}</p>
                </div>

                {/* Features */}
                {property.features && property.features.length > 0 && (
                  <div className="mb-8">
                    <h2 className="text-2xl font-semibold mb-4">Features & Amenities</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {property.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2 text-muted-foreground">
                          <div className="w-2 h-2 rounded-full bg-teal"></div>
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Share Section */}
                <div className="border-t pt-8">
                  <h3 className="text-lg font-semibold mb-4">Share This Property</h3>
                  <div className="flex gap-3">
                    <Button variant="outline" size="sm" onClick={() => handleShare('whatsapp')}>
                      <Share2 className="h-4 w-4 mr-2" />
                      WhatsApp
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleShare('facebook')}>
                      <Facebook className="h-4 w-4 mr-2" />
                      Facebook
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleShare('email')}>
                      <Mail className="h-4 w-4 mr-2" />
                      Email
                    </Button>
                  </div>
                </div>
              </div>

              {/* Contact Sidebar */}
              <div className="lg:col-span-1">
                <div className="sticky top-20 bg-card border rounded-lg p-6 shadow-lg">
                  <h3 className="text-xl font-semibold mb-4">Interested in this property?</h3>
                  <p className="text-muted-foreground text-sm mb-6">
                    Fill out the form below and we'll get in touch with you shortly.
                  </p>
                  <ContactForm propertyId={property.id} formType="inquiry" />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default PropertyDetails;
