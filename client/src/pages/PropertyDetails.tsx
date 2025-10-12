import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Bed, Bath, Square, MapPin, Share2, Calendar, Home as HomeIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { Facebook, Twitter, Mail } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ContactForm from '@/components/ContactForm';
import { Button } from '@/components/ui/button';
import { propertiesAPI } from '@/services/api';
import { Property } from '@/types/property';
import LoadingSpinner from '@/components/LoadingSpinner';

const PropertyDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<Property | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadProperty();
    }
  }, [id]);

  const loadProperty = async () => {
    setLoading(true);
    setError(null);
    try {
      const propertyId = parseInt(id!);
      const propertyData = await propertiesAPI.getById(propertyId);
      setProperty(propertyData);
    } catch (err: any) {
      setError(err.message || 'Failed to load property');
      console.error('Failed to load property:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: string): string => {
    const numericPrice = parseFloat(price);
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(numericPrice);
  };

  const getImageUrl = (imagePath: string): string => {
    if (!imagePath) return '';
    
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    
    const baseUrl = 'http://localhost:8000';
    return `${baseUrl}${imagePath}`;
  };

  const handleShare = (platform: 'facebook' | 'twitter' | 'email') => {
    const url = window.location.href;
    const text = `Check out this property: ${property?.title}`;

    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'email':
        window.location.href = `mailto:?subject=${encodeURIComponent(text)}&body=${encodeURIComponent(url)}`;
        break;
    }
  };

  const getPropertyTypeLabel = (type: Property['property_type']): string => {
    const typeMap: Record<Property['property_type'], string> = {
      land: 'Land',
      commercial: 'Commercial',
      rental: 'Rental',
      apartment: 'Apartment',
      sale: 'For Sale',
    };
    return typeMap[type] || type;
  };

  const getStatusLabel = (status: Property['status'], propertyType: Property['property_type']): string => {
    if (propertyType === 'rental') return 'For Rent';
    if (propertyType === 'sale') return 'For Sale';
    if (status === 'rented') return 'Rented';
    if (status === 'sold') return 'Sold';
    return 'Available';
  };

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <LoadingSpinner size="lg" />
            <p className="text-muted-foreground mt-4">Loading property details...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="mb-4">Property Not Found</h2>
            <p className="text-muted-foreground mb-4">{error || 'The property you are looking for does not exist.'}</p>
            <Button asChild variant="hero">
              <Link to="/buy">Browse Properties</Link>
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const isLandOnly = property.property_type === 'land';
  const images = property.images || [];
  const primaryImage = property.primary_image || images[0];
  const displayImages = primaryImage ? [primaryImage, ...images.filter(img => img.id !== primaryImage.id)] : images;

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
                {/* Image Gallery with Slider */}
                <div className="mb-8">
                  <div className="relative rounded-lg overflow-hidden mb-4 h-96 bg-muted group">
                    {displayImages.length > 0 ? (
                      <img
                        src={getImageUrl(displayImages[selectedImage]?.image)}
                        alt={property.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/placeholder-property.jpg';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-muted-foreground">No Image Available</span>
                      </div>
                    )}
                    
                    {/* Navigation Buttons */}
                    {displayImages.length > 1 && (
                      <>
                        <Button
                          variant="outline"
                          size="icon"
                          className="absolute left-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 backdrop-blur-sm"
                          onClick={() => setSelectedImage((prev) => (prev === 0 ? displayImages.length - 1 : prev - 1))}
                        >
                          <ChevronLeft className="h-5 w-5" />
                        </Button>
                        
                        <Button
                          variant="outline"
                          size="icon"
                          className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 backdrop-blur-sm"
                          onClick={() => setSelectedImage((prev) => (prev === displayImages.length - 1 ? 0 : prev + 1))}
                        >
                          <ChevronRight className="h-5 w-5" />
                        </Button>
                        
                        {/* Image Counter */}
                        <div className="absolute bottom-4 right-4 bg-background/80 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
                          {selectedImage + 1} / {displayImages.length}
                        </div>
                      </>
                    )}
                  </div>
                  
                  {/* Thumbnail Navigation */}
                  {displayImages.length > 1 && (
                    <div className="grid grid-cols-4 gap-2">
                      {displayImages.map((image, index) => (
                        <button
                          key={image.id}
                          onClick={() => setSelectedImage(index)}
                          className={`relative rounded-lg overflow-hidden h-24 transition-all ${
                            selectedImage === index ? 'ring-2 ring-primary' : 'opacity-70 hover:opacity-100'
                          }`}
                        >
                          <img 
                            src={getImageUrl(image.image)} 
                            alt={`View ${index + 1}`} 
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/placeholder-property.jpg';
                            }}
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Property Info */}
                <div className="mb-8">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          property.status === 'sold' || property.status === 'rented' 
                            ? 'bg-destructive text-destructive-foreground' 
                            : 'bg-primary text-primary-foreground'
                        }`}>
                          {getStatusLabel(property.status, property.property_type)}
                        </span>
                        {property.featured && (
                          <span className="bg-gold text-gold-foreground px-3 py-1 rounded-full text-xs font-semibold">
                            Featured
                          </span>
                        )}
                      </div>
                      <h1 className="mb-2">{property.title}</h1>
                      <div className="flex items-center gap-2 text-muted-foreground mb-4">
                        <MapPin className="h-5 w-5" />
                        <span>
                          {property.address}, {property.city}, {property.state} {property.zip_code}
                        </span>
                      </div>
                    </div>
                    <Button variant="outline" size="icon" onClick={() => handleShare('email')}>
                      <Share2 className="h-5 w-5" />
                    </Button>
                  </div>

                  <div className="text-3xl font-bold text-primary mb-6">
                    {formatPrice(property.price)}
                    {property.property_type === 'rental' && <span className="text-lg text-muted-foreground">/month</span>}
                  </div>

                  {!isLandOnly && (
                    <div className="flex flex-wrap gap-6 mb-6 p-6 bg-secondary rounded-lg">
                      {property.bedrooms && (
                        <div className="flex items-center gap-2">
                          <Bed className="h-5 w-5 text-primary" />
                          <div>
                            <div className="text-2xl font-semibold">{property.bedrooms}</div>
                            <div className="text-sm text-muted-foreground">Bedrooms</div>
                          </div>
                        </div>
                      )}
                      {property.bathrooms && (
                        <div className="flex items-center gap-2">
                          <Bath className="h-5 w-5 text-primary" />
                          <div>
                            <div className="text-2xl font-semibold">{property.bathrooms}</div>
                            <div className="text-sm text-muted-foreground">Bathrooms</div>
                          </div>
                        </div>
                      )}
                      {property.square_feet && (
                        <div className="flex items-center gap-2">
                          <Square className="h-5 w-5 text-primary" />
                          <div>
                            <div className="text-2xl font-semibold">{property.square_feet.toLocaleString()}</div>
                            <div className="text-sm text-muted-foreground">Square Feet</div>
                          </div>
                        </div>
                      )}
                      {property.year_built && (
                        <div className="flex items-center gap-2">
                          <Calendar className="h-5 w-5 text-primary" />
                          <div>
                            <div className="text-2xl font-semibold">{property.year_built}</div>
                            <div className="text-sm text-muted-foreground">Year Built</div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {isLandOnly && property.lot_size && (
                    <div className="p-6 bg-secondary rounded-lg mb-6">
                      <div className="flex items-center gap-2">
                        <Square className="h-5 w-5 text-primary" />
                        <div>
                          <div className="text-2xl font-semibold">{property.lot_size}</div>
                          <div className="text-sm text-muted-foreground">Lot Size (acres)</div>
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
                <div className="mb-8">
                  <h2 className="text-2xl font-semibold mb-4">Features & Amenities</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {property.has_garage && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <div className="w-2 h-2 rounded-full bg-teal"></div>
                        <span>Garage</span>
                      </div>
                    )}
                    {property.has_pool && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <div className="w-2 h-2 rounded-full bg-teal"></div>
                        <span>Swimming Pool</span>
                      </div>
                    )}
                    {property.has_garden && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <div className="w-2 h-2 rounded-full bg-teal"></div>
                        <span>Garden</span>
                      </div>
                    )}
                    {property.has_fireplace && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <div className="w-2 h-2 rounded-full bg-teal"></div>
                        <span>Fireplace</span>
                      </div>
                    )}
                    {property.has_central_air && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <div className="w-2 h-2 rounded-full bg-teal"></div>
                        <span>Central Air</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Share Section */}
                <div className="border-t pt-8">
                  <h3 className="text-lg font-semibold mb-4">Share This Property</h3>
                  <div className="flex gap-3">
                    <Button variant="outline" size="sm" onClick={() => handleShare('facebook')}>
                      <Facebook className="h-4 w-4 mr-2" />
                      Facebook
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleShare('twitter')}>
                      <Twitter className="h-4 w-4 mr-2" />
                      Twitter
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
                  <ContactForm propertyId={property.id.toString()} formType="inquiry" />
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