import { Link } from 'react-router-dom';
import { Bed, Bath, Square, MapPin, Heart } from 'lucide-react';
import { Property, PropertyImage } from '@/types/property';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { propertiesAPI } from '@/services/api';
import { useState, MouseEvent } from 'react';

interface PropertyCardProps {
  property: Property;
  viewMode?: 'grid' | 'list';
}

const PropertyCard = ({ property, viewMode = 'grid' }: PropertyCardProps) => {
  const [isFavorited, setIsFavorited] = useState<boolean>(property.is_favorited);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [imageError, setImageError] = useState<boolean>(false);
  const [imageLoading, setImageLoading] = useState<boolean>(true);

  // Fix image URL - construct full URL for Django media files
  const getImageUrl = (imagePath: string): string => {
    if (!imagePath) {
      console.log('❌ No image path provided for property:', property.id);
      return '';
    }
    
    // If it's already a full URL, return as is
    if (imagePath.startsWith('http')) {
      console.log('✅ Image is already full URL:', imagePath);
      return imagePath;
    }
    
    // Construct full URL for Django media files
    const baseUrl = 'http://localhost:8000';
    const fullUrl = `${baseUrl}${imagePath}`;
    console.log('🔄 Constructed image URL:', fullUrl, 'from path:', imagePath);
    return fullUrl;
  };

  const handleFavoriteToggle = async (e: MouseEvent<HTMLButtonElement>): Promise<void> => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      await propertiesAPI.toggleFavorite(property.id);
      setIsFavorited(!isFavorited);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    } finally {
      setIsLoading(false);
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

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.error('❌ Image failed to load:', e.currentTarget.src);
    setImageError(true);
    setImageLoading(false);
    e.currentTarget.src = '/placeholder-property.jpg';
  };

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.log('✅ Image loaded successfully:', e.currentTarget.src);
    setImageError(false);
    setImageLoading(false);
  };

  const isLandOnly = property.property_type === 'land';
  const statusLabel = getStatusLabel(property.status, property.property_type);
  
  // FIX: Get the image path correctly - check different possible locations
  const getImagePath = (): string => {
    // Case 1: Check if primary_image is a string (direct path)
    if (typeof property.primary_image === 'string') {
      console.log('📸 Using primary_image as string path:', property.primary_image);
      return property.primary_image;
    }
    
    // Case 2: Check if primary_image is an object with image property
    if (property.primary_image && typeof property.primary_image === 'object' && 'image' in property.primary_image) {
      console.log('📸 Using primary_image.image path:', property.primary_image.image);
      return property.primary_image.image;
    }
    
    // Case 3: Check first image in images array
    if (property.images && property.images.length > 0 && property.images[0].image) {
      console.log('📸 Using first image from images array:', property.images[0].image);
      return property.images[0].image;
    }
    
    console.log('❌ No valid image path found for property:', property.id);
    return '';
  };

  const imagePath = getImagePath();
  const imageUrl = imagePath ? getImageUrl(imagePath) : '';

  // Debug logging for this specific property
  console.log('🏠 PropertyCard Debug:', {
    propertyId: property.id,
    propertyTitle: property.title,
    primary_image: property.primary_image,
    images: property.images,
    imagePath: imagePath,
    imageUrl: imageUrl,
    imageError: imageError,
    imageLoading: imageLoading
  });

  // Conditional styling based on viewMode
  const isListView = viewMode === 'list';

  return (
    <Link to={`/property/${property.id}`}>
      <Card className={`group overflow-hidden hover:shadow-elegant transition-smooth cursor-pointer ${
        isListView ? 'flex' : 'h-full'
      }`}>
        {/* Image */}
        <div className={`relative overflow-hidden ${
          isListView ? 'w-64 h-48 flex-shrink-0' : 'h-56'
        }`}>
          {imageUrl && !imageError ? (
            <>
              {imageLoading && (
                <div className="absolute inset-0 bg-muted flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              )}
              <img
                src={imageUrl}
                alt={property.title}
                className={`w-full h-full object-cover group-hover:scale-110 transition-smooth ${
                  imageLoading ? 'opacity-0' : 'opacity-100'
                }`}
                loading="lazy"
                onError={handleImageError}
                onLoad={handleImageLoad}
              />
            </>
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <span className="text-muted-foreground">No Image Available</span>
            </div>
          )}
          
          {/* Status Badge */}
          <div className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold ${
            property.status === 'sold' || property.status === 'rented' 
              ? 'bg-destructive text-destructive-foreground' 
              : 'bg-primary text-primary-foreground'
          }`}>
            {statusLabel}
          </div>
          
          {/* Favorite Button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-3 left-3 bg-background/80 hover:bg-background"
            onClick={handleFavoriteToggle}
            disabled={isLoading}
          >
            <Heart 
              className={`h-5 w-5 ${isFavorited ? 'fill-destructive text-destructive' : ''}`} 
            />
          </Button>

          {/* Featured Badge */}
          {property.featured && (
            <div className="absolute bottom-3 left-3 bg-gold text-gold-foreground px-3 py-1 rounded-full text-xs font-semibold">
              Featured
            </div>
          )}
        </div>

        <CardContent className={`p-5 ${isListView ? 'flex-1' : ''}`}>
          {/* Price */}
          <div className="text-2xl font-bold text-primary mb-2">
            {formatPrice(property.price)}
            {property.property_type === 'rental' && <span className="text-base text-muted-foreground">/month</span>}
          </div>

          {/* Title */}
          <h3 className={`font-semibold text-foreground mb-2 ${
            isListView ? 'text-xl line-clamp-2' : 'text-lg line-clamp-1'
          }`}>
            {property.title}
          </h3>

          {/* Location */}
          <div className="flex items-center gap-1 text-muted-foreground text-sm mb-4">
            <MapPin className="h-4 w-4" />
            <span className={isListView ? 'line-clamp-2' : 'line-clamp-1'}>
              {property.city}, {property.state}
            </span>
          </div>

          {/* Property Details */}
          {!isLandOnly && (
            <div className={`flex items-center gap-4 text-sm text-muted-foreground ${
              isListView ? 'mb-4' : ''
            }`}>
              {property.bedrooms && (
                <div className="flex items-center gap-1">
                  <Bed className="h-4 w-4" />
                  <span>{property.bedrooms} Beds</span>
                </div>
              )}
              {property.bathrooms && (
                <div className="flex items-center gap-1">
                  <Bath className="h-4 w-4" />
                  <span>{property.bathrooms} Baths</span>
                </div>
              )}
              {property.square_feet && (
                <div className="flex items-center gap-1">
                  <Square className="h-4 w-4" />
                  <span>{property.square_feet.toLocaleString()} sqft</span>
                </div>
              )}
            </div>
          )}

          {/* Land Details */}
          {isLandOnly && property.lot_size && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Square className="h-4 w-4" />
              <span>{property.lot_size} acres</span>
            </div>
          )}

          {/* Description (only in list view) */}
          {isListView && property.description && (
            <p className="text-muted-foreground text-sm mt-3 line-clamp-3">
              {property.description}
            </p>
          )}

          {/* Property Type */}
          <div className="mt-3 pt-3 border-t border-border">
            <span className="text-xs text-muted-foreground uppercase tracking-wide">
              {getPropertyTypeLabel(property.property_type)}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default PropertyCard;