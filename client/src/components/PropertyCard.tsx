import { Link } from 'react-router-dom';
import { Bed, Bath, Square, MapPin, Heart, Droplets, Zap, Car, Fence } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Property } from '@/types/property';
import { propertyApi, PLACEHOLDER_IMAGE } from '@/services/propertyApi';
import { useState, MouseEvent } from 'react';

interface PropertyCardProps {
  property: Property;
  viewMode?: 'grid' | 'list';
}

const PropertyCard = ({ property, viewMode = 'grid' }: PropertyCardProps) => {
  const [isFavorited, setIsFavorited] = useState<boolean>(property.is_favorited || false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [imageError, setImageError] = useState<boolean>(false);
  const [imageLoading, setImageLoading] = useState<boolean>(true);

  // Use the propertyApi method to get the correct image URL
  const imageUrl = propertyApi.getPrimaryImageUrl(property);

  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  const handleFavoriteToggle = async (e: MouseEvent<HTMLButtonElement>): Promise<void> => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isLoading) return;
    
    setIsLoading(true);
    try {
      await propertyApi.toggleFavorite(property.id.toString());
      setIsFavorited(!isFavorited);
    } catch (error) {
      console.error('Error toggling favorite:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatPrice = (price: string | number): string => {
    const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
    const formatted = new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
      minimumFractionDigits: 0,
    }).format(numericPrice);
    return formatted.replace('KES', 'Ksh');
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

  const getLandTypeLabel = (landType?: string): string => {
    const landTypeMap: Record<string, string> = {
      residential: 'Residential',
      agricultural: 'Agricultural',
      commercial: 'Commercial',
      industrial: 'Industrial',
      mixed_use: 'Mixed Use',
    };
    return landType ? landTypeMap[landType] || landType : 'Land';
  };

  const getStatusLabel = (status: Property['status'], propertyType: Property['property_type']): string => {
    if (propertyType === 'rental') return 'For Rent';
    if (propertyType === 'sale') return 'For Sale';
    if (status === 'rented') return 'Rented';
    if (status === 'sold') return 'Sold';
    return 'Available';
  };

  // SAFE land-specific utility functions with null checks
  const getWaterStatus = (): { hasWater: boolean; waterTypes: string[]; displayText: string } => {
    const waterTypes: string[] = [];
    
    // Safe checks with default values
    if (property.has_borehole === true) waterTypes.push('Borehole');
    if (property.has_piped_water === true) waterTypes.push('Piped');
    if (property.water_supply_types && Array.isArray(property.water_supply_types)) {
      waterTypes.push(...property.water_supply_types);
    }
    
    const hasWater = waterTypes.length > 0;
    const displayText = waterTypes.length > 0 ? waterTypes.join(', ') : 'No Water';
    
    return { hasWater, waterTypes, displayText };
  };

  const getElectricityStatus = (): { hasElectricity: boolean; displayText: string } => {
    // Safe check with default
    const electricity = property.electricity_availability || 'none';
    const hasElectricity = electricity === 'on_site' || electricity === 'nearby';
    const displayText = electricity === 'on_site' ? 'Electricity' :
                       electricity === 'nearby' ? 'Electricity Nearby' :
                       electricity === 'planned' ? 'Electricity Planned' : 'No Electricity';
    
    return { hasElectricity, displayText };
  };

  const getRoadAccessStatus = (): { hasRoadAccess: boolean; displayText: string } => {
    // Safe checks with defaults
    const hasRoadAccess = !!property.road_access_type || 
                         (property.distance_to_main_road !== null && property.distance_to_main_road !== undefined);
    let displayText = 'No Road Access';
    
    if (property.road_access_type) {
      displayText = property.road_access_type;
    } else if (property.distance_to_main_road) {
      displayText = `${property.distance_to_main_road}km to main road`;
    }
    
    return { hasRoadAccess, displayText };
  };

  const getSizeDisplay = (): string => {
    // Safe checks with defaults
    if (property.size_acres) {
      return `${property.size_acres} acre${property.size_acres !== 1 ? 's' : ''}`;
    }
    if (property.lot_size) {
      return property.lot_size;
    }
    if (property.plot_dimensions) {
      return property.plot_dimensions;
    }
    return 'Size not specified';
  };

  const getPriceDisplay = (): string => {
    const basePrice = formatPrice(property.price);
    
    if (property.price_per_unit) {
      return `${basePrice} (${property.price_per_unit})`;
    }
    
    if (property.is_negotiable) {
      return `${basePrice} (Negotiable)`;
    }
    
    return basePrice;
  };

  const isLandOnly = property.property_type === 'land';
  const statusLabel = getStatusLabel(property.status, property.property_type);
  const { hasWater, waterTypes, displayText: waterDisplay } = getWaterStatus();
  const { hasElectricity, displayText: electricityDisplay } = getElectricityStatus();
  const { hasRoadAccess, displayText: roadDisplay } = getRoadAccessStatus();

  // Debug logging for this specific property
  console.log('🏠 PropertyCard Debug:', {
    propertyId: property.id,
    propertyTitle: property.title,
    landType: property.land_type,
    has_borehole: property.has_borehole,
    has_piped_water: property.has_piped_water,
    electricity_availability: property.electricity_availability,
    road_access_type: property.road_access_type,
    distance_to_main_road: property.distance_to_main_road,
    waterStatus: getWaterStatus(),
    electricityStatus: getElectricityStatus(),
    roadAccess: getRoadAccessStatus()
  });

  const isListView = viewMode === 'list';

  return (
    <Link to={`/property/${property.id}`}>
      <Card className={`group overflow-hidden hover:shadow-elegant transition-smooth cursor-pointer ${
        isListView ? 'flex' : 'h-full'
      }`}>
        {/* Image Section */}
        <div className={`relative overflow-hidden ${
          isListView ? 'w-64 h-48 flex-shrink-0' : 'h-56'
        }`}>
          {imageLoading && !imageError && (
            <div className="absolute inset-0 bg-muted flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          )}
          <img
            src={imageError ? PLACEHOLDER_IMAGE : imageUrl}
            alt={property.title}
            className={`w-full h-full object-cover group-hover:scale-110 transition-smooth ${
              imageLoading && !imageError ? 'opacity-0' : 'opacity-100'
            }`}
            loading="lazy"
            onError={handleImageError}
            onLoad={handleImageLoad}
          />
          
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

          {/* Land Type Badge for Land Properties */}
          {isLandOnly && property.land_type && (
            <div className="absolute bottom-3 right-3 bg-green-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
              {getLandTypeLabel(property.land_type)}
            </div>
          )}
        </div>

        <CardContent className={`p-5 ${isListView ? 'flex-1' : ''}`}>
          {/* Price */}
          <div className="text-2xl font-bold text-primary mb-2">
            {getPriceDisplay()}
            {property.property_type === 'rental' && <span className="text-base text-muted-foreground">/month</span>}
          </div>

          {/* Title */}
          <h3 className={`font-semibold text-foreground mb-2 ${
            isListView ? 'text-xl line-clamp-2' : 'text-lg line-clamp-1'
          }`}>
            {property.title}
          </h3>

          {/* Location */}
          <div className="flex items-center gap-1 text-muted-foreground text-sm mb-3">
            <MapPin className="h-4 w-4" />
            <span className={isListView ? 'line-clamp-2' : 'line-clamp-1'}>
              {property.city}, {property.state}
              {property.landmarks && ` • ${property.landmarks}`}
            </span>
          </div>

          {/* Land Utilities Section - Only show if we have land data */}
          {isLandOnly && (
            <div className="flex flex-wrap gap-2 mb-4">
              {/* Water Status */}
              <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                hasWater ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-600'
              }`}>
                <Droplets className="h-3 w-3" />
                <span>{waterDisplay}</span>
              </div>

              {/* Electricity Status */}
              <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                hasElectricity ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-600'
              }`}>
                <Zap className="h-3 w-3" />
                <span>{electricityDisplay}</span>
              </div>

              {/* Road Access */}
              <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                hasRoadAccess ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
              }`}>
                <Car className="h-3 w-3" />
                <span>{roadDisplay}</span>
              </div>

              {/* Fencing - Only show if we have the data */}
              {property.is_fenced && (
                <div className="flex items-center gap-1 px-2 py-1 rounded-full text-xs bg-orange-100 text-orange-800">
                  <Fence className="h-3 w-3" />
                  <span>Fenced</span>
                </div>
              )}
            </div>
          )}

          {/* Property Details for non-land properties */}
          {!isLandOnly && property.bedrooms && property.bathrooms && (
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
          {isLandOnly && (
            <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
              <div className="flex items-center gap-1">
                <Square className="h-4 w-4" />
                <span>{getSizeDisplay()}</span>
              </div>
              
              {/* Plot Information - Only show if we have the data */}
              {property.num_plots_available && property.total_plots && (
                <div className="text-xs bg-gray-100 px-2 py-1 rounded">
                  {property.num_plots_available}/{property.total_plots} plots available
                </div>
              )}
            </div>
          )}

          {/* Description (only in list view) */}
          {isListView && property.description && (
            <p className="text-muted-foreground text-sm mt-3 line-clamp-3">
              {property.description}
            </p>
          )}

          {/* Property Type and Additional Info */}
          <div className="mt-3 pt-3 border-t border-border flex justify-between items-center">
            <span className="text-xs text-muted-foreground uppercase tracking-wide">
              {getPropertyTypeLabel(property.property_type)}
              {isLandOnly && property.land_type && ` • ${getLandTypeLabel(property.land_type)}`}
            </span>
            
            {/* Title Deed Status for Land - Only show if we have the data */}
            {isLandOnly && property.title_deed_status && (
              <span className={`text-xs px-2 py-1 rounded ${
                property.title_deed_status === 'freehold' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-blue-100 text-blue-800'
              }`}>
                {property.title_deed_status === 'freehold' ? 'Freehold' : 'Leasehold'}
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default PropertyCard;