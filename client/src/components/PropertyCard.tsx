import { Link } from 'react-router-dom';
import { Bed, Bath, Square, MapPin, Heart } from 'lucide-react';
import { Property } from '@/types/property';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { propertiesAPI } from '@/services/api';
import { useState, MouseEvent } from 'react';

interface PropertyCardProps {
  property: Property;
}

const PropertyCard = ({ property }: PropertyCardProps) => {
  const [isFavorited, setIsFavorited] = useState<boolean>(property.is_favorited);
  const [isLoading, setIsLoading] = useState<boolean>(false);

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
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
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

  const isLandOnly = property.property_type === 'land';
  const primaryImage = property.primary_image || property.images?.[0];
  const statusLabel = getStatusLabel(property.status, property.property_type);

  return (
    <Link to={`/property/${property.id}`}>
      <Card className="group overflow-hidden hover:shadow-elegant transition-smooth cursor-pointer h-full">
        {/* Image */}
        <div className="relative overflow-hidden h-56">
          {primaryImage ? (
            <img
              src={primaryImage.image}
              alt={property.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-smooth"
              loading="lazy"
            />
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

        <CardContent className="p-5">
          {/* Price */}
          <div className="text-2xl font-bold text-primary mb-2">
            {formatPrice(property.price)}
            {property.property_type === 'rental' && <span className="text-base text-muted-foreground">/month</span>}
          </div>

          {/* Title */}
          <h3 className="text-lg font-semibold text-foreground mb-2 line-clamp-1">
            {property.title}
          </h3>

          {/* Location */}
          <div className="flex items-center gap-1 text-muted-foreground text-sm mb-4">
            <MapPin className="h-4 w-4" />
            <span className="line-clamp-1">
              {property.address}, {property.city}, {property.state}
            </span>
          </div>

          {/* Property Details */}
          {!isLandOnly && (
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
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