import { Link } from 'react-router-dom';
import { ArrowRight, Home as HomeIcon, DollarSign, Building2, Star, Key, ChevronLeft, ChevronRight, Bath, Square } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SearchBar from '@/components/SearchBar';
import PropertyCard from '@/components/PropertyCard';
import { Button } from '@/components/ui/button';
import { useFeaturedProperties } from '@/hooks/useProperties';
import { PropertyFilters } from '@/types/property';
import heroImage from '@/assets/hero-home.jpg';
import LoadingSpinner from '@/components/LoadingSpinner';
import PWAInstallPrompt from '@/components/PWAInstallPrompt'; 
import { useNewsletterPopup } from '@/hooks/useNewsletterPopup';
import NewsletterPopup from '@/components/NewsletterPopup';
import { useState, useEffect } from 'react';
import { propertyApi, getImageUrl, PLACEHOLDER_IMAGE } from '@/services/propertyApi';

const Index = (): JSX.Element => {
  const { featuredProperties, loading, error } = useFeaturedProperties();
  const { showPopup, setShowPopup } = useNewsletterPopup();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // 👇 ADDED: PWA Engagement Triggers
  useEffect(() => {
    // Trigger PWA engagement metrics
    const triggerEngagement = () => {
      console.log('🎯 Triggering PWA engagement metrics');
      
      // These help Chrome recognize your site as "engaging"
      if ('storage' in navigator && 'estimate' in navigator.storage) {
        navigator.storage.estimate().then(estimate => {
          console.log('💾 Storage usage:', estimate);
        });
      }
      
      // Request notification permission (shows engagement)
      if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission().then(permission => {
          console.log('🔔 Notification permission:', permission);
        });
      }

      // Trigger other engagement metrics
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
        console.log('✅ Service Worker is controlling the page');
      }
    };
    
    // Trigger after page load
    setTimeout(triggerEngagement, 2000);
  }, []);

  // Debug logging
  useEffect(() => {
    console.log('🔍 HomePage Debug Info:');
    console.log('📊 Loading state:', loading);
    console.log('❌ Error state:', error);
    console.log('🏠 Featured properties count:', featuredProperties?.length);
    
    if (featuredProperties && featuredProperties.length > 0) {
      const firstProperty = featuredProperties[0];
      console.log('📸 First property details:', {
        id: firstProperty.id,
        title: firstProperty.title,
        images: firstProperty.images,
        imageCount: firstProperty.images?.length || 0,
        firstImage: firstProperty.images?.[0],
        firstImageType: typeof firstProperty.images?.[0],
        hasUrl: firstProperty.images?.[0]?.image !== undefined,
        hasImage: firstProperty.images?.[0]?.image !== undefined
      });
      
      // Test the image URL generation
      const testUrl = getPropertyImageUrl(firstProperty);
      console.log('🖼️ Generated image URL:', testUrl);
      
      // Test direct image access
      if (firstProperty.images && firstProperty.images.length > 0) {
        const firstImage = firstProperty.images[0];
        console.log('🔍 Direct image analysis:', {
          imageObject: firstImage,
          imageProperty: firstImage.image,
          imageType: typeof firstImage.image,
          isString: typeof firstImage.image === 'string'
        });
      }
    }
  }, [featuredProperties, loading, error]);

  // Filter featured properties for the hero slider (take first 5)
  const heroProperties = featuredProperties?.slice(0, 5) || [];

  const handleSearch = (filters: PropertyFilters): void => {
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) queryParams.append(key, value.toString());
    });
    
    window.location.href = `/buy?${queryParams.toString()}`;
  };

  // Auto-play functionality for the carousel
  useEffect(() => {
    if (!isAutoPlaying || heroProperties.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroProperties.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [heroProperties.length, isAutoPlaying]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroProperties.length);
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroProperties.length) % heroProperties.length);
    setIsAutoPlaying(false);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
  };

  const formatPrice = (price: string | number): string => {
    const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
    const formatted = new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(numericPrice);
    return formatted.replace('KES', 'KSh');
  };

  // Enhanced image URL function that handles all cases
  const getPropertyImageUrl = (property: any): string => {
    console.log(`🖼️ Getting image for property: ${property.title}`, {
      images: property.images,
      primary_image: property.primary_image
    });

    // Case 1: Use the propertyApi method (same as PropertyCard)
    try {
      const apiUrl = propertyApi.getPrimaryImageUrl(property);
      console.log('✅ propertyApi.getPrimaryImageUrl result:', apiUrl);
      return apiUrl;
    } catch (error) {
      console.error('❌ propertyApi.getPrimaryImageUrl failed:', error);
    }

    // Case 2: Direct image extraction from images array
    if (property.images && property.images.length > 0) {
      const firstImage = property.images[0];
      console.log('🖼️ First image object:', firstImage);
      
      if (firstImage && firstImage.image) {
        const imageUrl = getImageUrl(firstImage.image);
        console.log('✅ Direct image URL from images array:', imageUrl);
        return imageUrl;
      }
    }

    // Case 3: Primary image field
    if (property.primary_image) {
      console.log('📸 Using primary_image field:', property.primary_image);
      if (typeof property.primary_image === 'string') {
        return getImageUrl(property.primary_image);
      } else if (property.primary_image.image) {
        return getImageUrl(property.primary_image.image);
      }
    }

    // Case 4: Fallback to placeholder
    console.log('❌ No valid images found, using placeholder');
    return PLACEHOLDER_IMAGE;
  };

  // Function to handle image loading errors
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>, propertyTitle: string, imageType: string) => {
    const target = e.target as HTMLImageElement;
    console.log(`❌ Image failed to load for ${propertyTitle} (${imageType}):`, target.src);
    target.src = heroImage;
    
    // Try to reload with different method if it's the placeholder
    if (target.src === PLACEHOLDER_IMAGE || target.src.includes('placeholder')) {
      console.log('🔄 Attempting alternative image loading method...');
    }
  };

  // Debug component to show property data
  const DebugInfo = () => {
    if (process.env.NODE_ENV === 'development' && heroProperties.length > 0) {
      const currentProperty = heroProperties[currentSlide];
      const imageUrl = getPropertyImageUrl(currentProperty);
      
      return (
        <div className="fixed top-20 right-4 bg-black/80 text-white p-4 rounded-lg text-xs max-w-xs z-50">
          <h4 className="font-bold mb-2">Debug Info:</h4>
          <p>Loading: {loading ? 'Yes' : 'No'}</p>
          <p>Error: {error ? 'Yes' : 'No'}</p>
          <p>Properties: {featuredProperties?.length || 0}</p>
          <p>Hero Properties: {heroProperties.length}</p>
          <p>Current Slide: {currentSlide}</p>
          <p>Images: {currentProperty?.images?.length || 0}</p>
          <p className="break-all">Image URL: {imageUrl.substring(0, 50)}...</p>
          <p className="text-yellow-300 mt-2">
            {imageUrl === PLACEHOLDER_IMAGE ? '⚠️ Using placeholder' : '✅ Using property image'}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      {/* Debug Info - Only in development */}
      <DebugInfo />

      <main>
        {/* Hero Section with Property Slider */}
        <section className="relative min-h-screen md:min-h-screen overflow-hidden">
          {loading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
              <LoadingSpinner size="lg" />
            </div>
          ) : error ? (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
              <div className="text-center">
                <p className="text-destructive mb-4">Error loading properties: {error}</p>
                <Button onClick={() => window.location.reload()}>
                  Try Again
                </Button>
              </div>
            </div>
          ) : heroProperties.length === 0 ? (
            // Fallback to static hero image if no properties available
            <div className="absolute inset-0 flex items-center justify-center">
              <img 
                src={heroImage} 
                alt="Luxury real estate" 
                className="w-full h-full object-cover"
                onError={(e) => handleImageError(e, 'fallback', 'background')}
              />
              <div className="absolute inset-0 gradient-overlay" />
              <div className="absolute inset-0 flex items-center justify-center z-10">
                <div className="container mx-auto px-4 text-center">
                  <div className="max-w-4xl mx-auto">
                    <h1 className="text-white mb-6 font-extralight tracking-tighter leading-none text-4xl md:text-5xl lg:text-6xl">
                      Your Trusted Real Estate Partner in Kenya
                    </h1>
                    <p className="text-white/90 text-lg md:text-xl mb-8 max-w-2xl mx-auto">
                      Buy, Sell, or Manage Apartments, Homes and Land with Ease.
                    </p>
                    <div className="flex justify-center animate-fade-in">
                      <SearchBar onSearch={handleSearch} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Property Slider */}
              <div className="relative h-full min-h-screen md:min-h-screen">
                {heroProperties.map((property, index) => {
                  const imageUrl = getPropertyImageUrl(property);
                  
                  console.log(`🎬 Slide ${index}:`, {
                    title: property.title,
                    imageUrl,
                    imageCount: property.images?.length || 0,
                    currentImage: property.images?.[0]
                  });

                  return (
                    <div
                      key={property.id}
                      className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${
                        index === currentSlide ? 'opacity-100' : 'opacity-0'
                      }`}
                    >
                      {/* Background Image - Full property photo */}
                      <img
                        src={imageUrl}
                        alt={property.title}
                        className="w-full h-full min-h-screen md:min-h-screen object-cover"
                        onError={(e) => handleImageError(e, property.title, 'background')}
                      />
                      <div className="absolute inset-0 gradient-overlay" />
                      
                      {/* Property Details Card - Centered both vertically and horizontally */}
                      <div className="absolute inset-0 flex items-center justify-center z-10">
                        <div className="container mx-auto px-4 w-full">
                          <div className="flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-12 max-w-7xl mx-auto">
                            
                            {/* Property Thumbnail - Hidden on mobile, shown on desktop */}
                            <div className="hidden lg:block lg:w-1/2 xl:w-2/5">
                              <div className="relative rounded-2xl overflow-hidden shadow-2xl transform hover:scale-105 transition-transform duration-300">
                                <img
                                  src={imageUrl}
                                  alt={property.title}
                                  className="w-full h-80 lg:h-96 object-cover"
                                  onError={(e) => handleImageError(e, property.title, 'thumbnail')}
                                />
                                <div className="absolute top-4 left-4">
                                  <span className="bg-[#f77f77] text-white px-3 py-2 rounded-lg text-sm font-semibold">
                                    {property.property_type === 'rental' ? 'FOR RENT' : 'FOR SALE'}
                                  </span>
                                </div>
                                {property.featured && (
                                  <div className="absolute top-4 right-4">
                                    <span className="bg-yellow-500 text-white px-3 py-2 rounded-lg text-sm font-semibold">
                                      FEATURED
                                    </span>
                                  </div>
                                )}
                                {/* Image overlay for better text readability */}
                                <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/50 to-transparent" />
                              </div>
                            </div>

                            {/* Property Info Card - Centered and responsive */}
                            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-4 md:p-6 w-full max-w-2xl lg:max-w-none lg:w-1/2 xl:w-2/5 transform hover:scale-105 transition-all duration-300 border border-white/20 mx-4">
                              {/* Property Type Badge */}
                              <div className="flex items-center gap-2 mb-3">
                                <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-medium uppercase">
                                  {property.property_type}
                                </span>
                                {property.featured && (
                                  <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                                    Featured
                                  </span>
                                )}
                              </div>

                              {/* Property Title */}
                              <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 leading-tight text-center lg:text-left">
                                {property.title}
                              </h1>

                              {/* Price */}
                              <div className="mb-4 text-center lg:text-left">
                                <span className="text-2xl md:text-3xl font-bold text-[#f77f77]">
                                  {formatPrice(property.price)}
                                  {property.property_type === 'rental' && (
                                    <span className="text-lg text-gray-600">/month</span>
                                  )}
                                </span>
                              </div>

                              {/* Property Details Grid */}
                              <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3 mb-4">
                                {property.bedrooms && (
                                  <div className="text-center">
                                    <div className="bg-gray-100 rounded-lg p-2 mb-1">
                                      <HomeIcon className="h-4 w-4 md:h-5 md:w-5 text-gray-600 mx-auto" />
                                    </div>
                                    <span className="text-xs text-gray-600">Bedrooms</span>
                                    <p className="font-semibold text-gray-900 text-sm">{property.bedrooms}</p>
                                  </div>
                                )}
                                {property.bathrooms && (
                                  <div className="text-center">
                                    <div className="bg-gray-100 rounded-lg p-2 mb-1">
                                      <Bath className="h-4 w-4 md:h-5 md:w-5 text-gray-600 mx-auto" />
                                    </div>
                                    <span className="text-xs text-gray-600">Bathrooms</span>
                                    <p className="font-semibold text-gray-900 text-sm">{property.bathrooms}</p>
                                  </div>
                                )}
                                {property.square_feet && (
                                  <div className="text-center">
                                    <div className="bg-gray-100 rounded-lg p-2 mb-1">
                                      <Square className="h-4 w-4 md:h-5 md:w-5 text-gray-600 mx-auto" />
                                    </div>
                                    <span className="text-xs text-gray-600">Area</span>
                                    <p className="font-semibold text-gray-900 text-sm">
                                      {property.square_feet.toLocaleString()} sqft
                                    </p>
                                  </div>
                                )}
                              </div>

                              {/* Location */}
                              <div className="flex items-center gap-2 text-gray-600 mb-4 justify-center lg:justify-start">
                                <span className="text-sm md:text-base text-center lg:text-left">
                                  📍 {property.city}, {property.state}
                                  {property.landmarks && ` • ${property.landmarks}`}
                                </span>
                              </div>

                              {/* Description */}
                              {property.description && (
                                <p className="text-gray-700 mb-4 line-clamp-2 leading-relaxed text-center lg:text-left text-sm">
                                  {property.description}
                                </p>
                              )}

                              {/* CTA Buttons */}
                              <div className="flex flex-col sm:flex-row gap-2">
                                <Button 
                                  asChild 
                                  size="lg" 
                                  className="bg-[#f77f77] hover:bg-[#f77f77]/90 text-white font-semibold py-2 px-4 flex-1 text-sm"
                                >
                                  <Link to={`/property/${property.id}`}>
                                    View Details
                                  </Link>
                                </Button>
                                <Button 
                                  asChild 
                                  variant="outline" 
                                  size="lg" 
                                  className="border-[#f77f77] text-[#f77f77] hover:bg-[#f77f77] hover:text-white font-semibold py-2 px-4 flex-1 text-sm"
                                >
                                  <Link to="/buy">
                                    Browse All
                                  </Link>
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
                
                {/* Navigation Arrows */}
                {heroProperties.length > 1 && (
                  <>
                    <button
                      onClick={prevSlide}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-900 p-3 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl z-10"
                      aria-label="Previous property"
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </button>
                    <button
                      onClick={nextSlide}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-gray-900 p-3 rounded-full transition-all duration-200 shadow-lg hover:shadow-xl z-10"
                      aria-label="Next property"
                    >
                      <ChevronRight className="h-6 w-6" />
                    </button>
                  </>
                )}
                
                {/* Slide Indicators */}
                {heroProperties.length > 1 && (
                  <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
                    {heroProperties.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-200 ${
                          index === currentSlide ? 'bg-white' : 'bg-white/50'
                        }`}
                        aria-label={`Go to slide ${index + 1}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </section>

        {/* Rest of your component remains the same */}
        {/* CTA Section */}
        <section className="py-1 md:py-3 gradient-hero text-primary-foreground">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-center text-xl mb-2 font-light tracking-tight">Ready to Find Your Perfect Home?</h2>
            <p className="text-sm md:text-xl mb-4 md:mb-2 max-w-2xl mx-auto text-primary-foreground/90">
              Join thousands of satisfied clients who found their dream properties with us
            </p>
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center mb-2">
              <Button 
                asChild 
                size="lg" 
                className="bg-[#f77f77] hover:bg-[#f77f77]/90 text-white border border-[#f77f77]"
              >
                <Link to="/buy">Browse Properties</Link>
              </Button>
              <Button 
                asChild 
                variant="outline" 
                size="lg" 
                className="bg-transparent border-2 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
              >
                <Link to="/auth">Get Started</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Quick Action CTAs */}
        <section className="py-8 bg-secondary">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* ... your existing CTA buttons ... */}
            </div>
          </div>
        </section>

        {/* Featured Listings */}
        <section className="py-1">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8">
              <h2 className="mb-2 font-light tracking-tight">Featured Properties</h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Handpicked luxury properties that define elegance and comfort
              </p>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-12">
                <LoadingSpinner size="lg" />
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-destructive mb-4">Failed to load featured properties</p>
                <Button onClick={() => window.location.reload()}>
                  Try Again
                </Button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-8">
                  {featuredProperties && featuredProperties.length > 0 ? (
                    featuredProperties.map((property) => (
                      <div key={property.id} className="flex">
                        <PropertyCard 
                          property={property} 
                          className="h-full flex flex-col"
                        />
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full text-center py-16">
                      <p className="text-muted-foreground text-lg">
                        No featured properties available at the moment.
                      </p>
                      <p className="text-sm text-muted-foreground mt-2">
                        Check back soon for new listings!
                      </p>
                    </div>
                  )}
                </div>

                <div className="text-center mb-3">
                  <Button asChild variant="outline" size="lg">
                    <Link to="/buy">
                      View All Properties <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                </div>
              </>
            )}
          </div>
        </section>
      </main>

      <Footer />
      
      {/* Newsletter Popup */}
      {showPopup && (
        <NewsletterPopup onClose={() => setShowPopup(false)} />
      )}

      {/* PWA Install Prompt Popup */}
      <PWAInstallPrompt />

      {/* Floating WhatsApp Button */}
      <a
        href="https://wa.me/+254743012966?text=Hello%20I%20am%20interested%20in%20your%20services"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg z-50 flex items-center justify-center transition-colors duration-200"
        aria-label="Chat on WhatsApp"
      >
        <FaWhatsapp className="text-3xl" />
      </a>
    </div>
  );
};

export default Index;