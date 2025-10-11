import { Link } from 'react-router-dom';
import { Bed, Bath, Square, MapPin } from 'lucide-react';
import { Property } from '@/lib/mockData';
import { Card, CardContent } from '@/components/ui/card';

interface PropertyCardProps {
  property: Property;
}

const PropertyCard = ({ property }: PropertyCardProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const isLandOnly = property.type === 'land';

  return (
    <Link to={`/property/${property.id}`}>
      <Card className="group overflow-hidden hover:shadow-elegant transition-smooth cursor-pointer h-full">
        {/* Image */}
        <div className="relative overflow-hidden h-56">
          <img
            src={property.images[0]}
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-smooth"
            loading="lazy"
          />
          <div className="absolute top-3 right-3 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold">
            {property.status === 'rent' ? 'For Rent' : 'For Sale'}
          </div>
          {property.isFeatured && (
            <div className="absolute top-3 left-3 bg-gold text-gold-foreground px-3 py-1 rounded-full text-xs font-semibold">
              Featured
            </div>
          )}
        </div>

        <CardContent className="p-5">
          {/* Price */}
          <div className="text-2xl font-bold text-primary mb-2">
            {formatPrice(property.price)}
            {property.status === 'rent' && <span className="text-base text-muted-foreground">/month</span>}
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
              {property.beds && (
                <div className="flex items-center gap-1">
                  <Bed className="h-4 w-4" />
                  <span>{property.beds} Beds</span>
                </div>
              )}
              {property.baths && (
                <div className="flex items-center gap-1">
                  <Bath className="h-4 w-4" />
                  <span>{property.baths} Baths</span>
                </div>
              )}
              {property.sqft && (
                <div className="flex items-center gap-1">
                  <Square className="h-4 w-4" />
                  <span>{property.sqft.toLocaleString()} sqft</span>
                </div>
              )}
            </div>
          )}

          {/* Land Details */}
          {isLandOnly && property.lotSize && (
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Square className="h-4 w-4" />
              <span>{property.lotSize}</span>
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
};

export default PropertyCard;
