// src/pages/CreateProperty.tsx
import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Upload, 
  MapPin, 
  Home, 
  DollarSign, 
  Ruler, 
  Bath, 
  Bed, 
  Calendar,
  Plus,
  X,
  Save,
  Camera
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { propertyApi, type PropertyData } from '@/services/propertyApi';

interface PropertyFormData {
  // Basic Information
  title: string;
  description: string;
  property_type: string;
  status: string;
  
  // Location
  address: string;
  city: string;
  state: string;
  zip_code: string;
  latitude: string;
  longitude: string;
  
  // Pricing
  price: string;
  price_unit: string;
  
  // Property Details
  bedrooms: string;
  bathrooms: string;
  square_feet: string;
  lot_size: string;
  year_built: string;
  
  // Amenities
  has_garage: boolean;
  has_pool: boolean;
  has_garden: boolean;
  has_fireplace: boolean;
  has_central_air: boolean;
  
  // Metadata
  featured: boolean;
}

interface ImageFile {
  file: File;
  preview: string;
  caption: string;
  is_primary: boolean;
}

const CreateProperty = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [images, setImages] = useState<ImageFile[]>([]);

  const [formData, setFormData] = useState<PropertyFormData>({
    // Basic Information
    title: '',
    description: '',
    property_type: '',
    status: 'draft',
    
    // Location
    address: '',
    city: '',
    state: '',
    zip_code: '',
    latitude: '',
    longitude: '',
    
    // Pricing
    price: '',
    price_unit: 'total',
    
    // Property Details
    bedrooms: '',
    bathrooms: '',
    square_feet: '',
    lot_size: '',
    year_built: '',
    
    // Amenities
    has_garage: false,
    has_pool: false,
    has_garden: false,
    has_fireplace: false,
    has_central_air: false,
    
    // Metadata
    featured: false,
  });

  // Check if user is seller or agent
  if (!user || (user.user_type !== 'seller' && user.user_type !== 'agent')) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-muted-foreground mb-4">
            You need to be a seller or agent to create property listings.
          </p>
          <Button asChild variant="hero">
            <button onClick={() => navigate('/dashboard')}>Go to Dashboard</button>
          </Button>
        </div>
      </div>
    );
  }

  const propertyTypes = [
    { value: 'land', label: 'Land' },
    { value: 'commercial', label: 'Commercial' },
    { value: 'rental', label: 'Rental' },
    { value: 'apartment', label: 'Apartment' },
    { value: 'sale', label: 'For Sale' },
  ];

  const priceUnits = [
    { value: 'total', label: 'Total Price' },
    { value: 'per_sqft', label: 'Price per Sq Ft' },
    { value: 'per_month', label: 'Price per Month' },
  ];

  const handleInputChange = (field: keyof PropertyFormData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newImages: ImageFile[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type.startsWith('image/')) {
        const preview = URL.createObjectURL(file);
        newImages.push({
          file,
          preview,
          caption: '',
          is_primary: images.length + newImages.length === 0 // First image is primary
        });
      }
    }

    setImages(prev => [...prev, ...newImages]);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => {
      const newImages = prev.filter((_, i) => i !== index);
      // If we removed the primary image, set the first remaining image as primary
      if (prev[index].is_primary && newImages.length > 0) {
        newImages[0].is_primary = true;
      }
      return newImages;
    });
  };

  const setPrimaryImage = (index: number) => {
    setImages(prev => 
      prev.map((img, i) => ({
        ...img,
        is_primary: i === index
      }))
    );
  };

  const updateImageCaption = (index: number, caption: string) => {
    setImages(prev => 
      prev.map((img, i) => 
        i === index ? { ...img, caption } : img
      )
    );
  };

  const nextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, 4));
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  // Updated handleSubmit using Property API Service
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Convert form data to API format
      const propertyData: PropertyData = {
        ...formData,
        price: formData.price ? parseFloat(formData.price) : null,
        bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : null,
        bathrooms: formData.bathrooms ? parseFloat(formData.bathrooms) : null,
        square_feet: formData.square_feet ? parseInt(formData.square_feet) : null,
        lot_size: formData.lot_size ? parseFloat(formData.lot_size) : null,
        year_built: formData.year_built ? parseInt(formData.year_built) : null,
        latitude: formData.latitude ? parseFloat(formData.latitude) : null,
        longitude: formData.longitude ? parseFloat(formData.longitude) : null,
      };

      console.log('Creating property:', propertyData);

      // Use the property API service
      const createdProperty = await propertyApi.createProperty(propertyData);
      
      console.log('Property created successfully:', createdProperty);

      // Upload images if any
      if (images.length > 0) {
        const imageFiles = images.map(img => img.file);
        const captions = images.map(img => img.caption);
        const isPrimary = images.map(img => img.is_primary);
        
        await propertyApi.uploadImages(createdProperty.id.toString(), imageFiles, captions, isPrimary);
        console.log('Images uploaded successfully');
        toast.success('Property and images uploaded successfully!');
      } else {
        toast.success('Property created successfully!');
      }

      navigate('/dashboard');

    } catch (error: any) {
      console.error('Property creation error:', error);
      
      if (error.message.includes('400')) {
        toast.error('Please check your input data and try again.');
      } else if (error.message.includes('401')) {
        toast.error('Please log in to create properties.');
      } else if (error.message.includes('403')) {
        toast.error('You do not have permission to create properties.');
      } else if (error.message.includes('404')) {
        toast.error('Property creation service unavailable. Please try again later.');
      } else {
        toast.error('Failed to create property. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { number: 1, title: 'Basic Info', icon: Home },
    { number: 2, title: 'Location', icon: MapPin },
    { number: 3, title: 'Details', icon: Ruler },
    { number: 4, title: 'Media', icon: Camera },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 bg-secondary py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Create New Property Listing</h1>
            <p className="text-muted-foreground">
              Fill in the details below to list your property
            </p>
          </div>

          {/* Progress Steps */}
          <div className="flex justify-between mb-8">
            {steps.map((step, index) => {
              const StepIcon = step.icon;
              const isActive = step.number === currentStep;
              const isCompleted = step.number < currentStep;
              
              return (
                <div key={step.number} className="flex flex-col items-center flex-1">
                  <div className={`flex items-center justify-center w-12 h-12 rounded-full border-2 ${
                    isActive 
                      ? 'border-primary bg-primary text-primary-foreground' 
                      : isCompleted
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-muted-foreground text-muted-foreground'
                  }`}>
                    {isCompleted ? (
                      <div className="w-6 h-6">✓</div>
                    ) : (
                      <StepIcon className="w-6 h-6" />
                    )}
                  </div>
                  <span className={`mt-2 text-sm font-medium ${
                    isActive || isCompleted ? 'text-primary' : 'text-muted-foreground'
                  }`}>
                    {step.title}
                  </span>
                </div>
              );
            })}
          </div>

          <form onSubmit={handleSubmit}>
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Home className="h-5 w-5" />
                    Basic Information
                  </CardTitle>
                  <CardDescription>
                    Enter the basic details about your property
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="title">Property Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      placeholder="Beautiful modern apartment in downtown"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Describe your property in detail..."
                      rows={6}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="property_type">Property Type *</Label>
                      <Select
                        value={formData.property_type}
                        onValueChange={(value) => handleInputChange('property_type', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select property type" />
                        </SelectTrigger>
                        <SelectContent>
                          {propertyTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="status">Status</Label>
                      <Select
                        value={formData.status}
                        onValueChange={(value) => handleInputChange('status', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="draft">Draft</SelectItem>
                          <SelectItem value="pending">Pending Review</SelectItem>
                          <SelectItem value="published">Published</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="featured"
                      checked={formData.featured}
                      onCheckedChange={(checked) => handleInputChange('featured', checked)}
                    />
                    <Label htmlFor="featured">Feature this property</Label>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 2: Location */}
            {currentStep === 2 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Location Details
                  </CardTitle>
                  <CardDescription>
                    Where is your property located?
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="address">Street Address *</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      placeholder="123 Main Street"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        placeholder="New York"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">State *</Label>
                      <Input
                        id="state"
                        value={formData.state}
                        onChange={(e) => handleInputChange('state', e.target.value)}
                        placeholder="NY"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="zip_code">ZIP Code *</Label>
                      <Input
                        id="zip_code"
                        value={formData.zip_code}
                        onChange={(e) => handleInputChange('zip_code', e.target.value)}
                        placeholder="10001"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="latitude">Latitude (Optional)</Label>
                      <Input
                        id="latitude"
                        type="number"
                        step="any"
                        value={formData.latitude}
                        onChange={(e) => handleInputChange('latitude', e.target.value)}
                        placeholder="40.7128"
                      />
                    </div>
                    <div>
                      <Label htmlFor="longitude">Longitude (Optional)</Label>
                      <Input
                        id="longitude"
                        type="number"
                        step="any"
                        value={formData.longitude}
                        onChange={(e) => handleInputChange('longitude', e.target.value)}
                        placeholder="-74.0060"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 3: Property Details & Pricing */}
            {currentStep === 3 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Ruler className="h-5 w-5" />
                    Property Details & Pricing
                  </CardTitle>
                  <CardDescription>
                    Specify the property features and pricing
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Pricing */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="price" className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        Price *
                      </Label>
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        min="0.01"
                        value={formData.price}
                        onChange={(e) => handleInputChange('price', e.target.value)}
                        placeholder="500000"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="price_unit">Price Unit</Label>
                      <Select
                        value={formData.price_unit}
                        onValueChange={(value) => handleInputChange('price_unit', value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {priceUnits.map((unit) => (
                            <SelectItem key={unit.value} value={unit.value}>
                              {unit.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Property Details */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <Label htmlFor="bedrooms" className="flex items-center gap-2">
                        <Bed className="h-4 w-4" />
                        Bedrooms
                      </Label>
                      <Input
                        id="bedrooms"
                        type="number"
                        value={formData.bedrooms}
                        onChange={(e) => handleInputChange('bedrooms', e.target.value)}
                        placeholder="3"
                      />
                    </div>
                    <div>
                      <Label htmlFor="bathrooms" className="flex items-center gap-2">
                        <Bath className="h-4 w-4" />
                        Bathrooms
                      </Label>
                      <Input
                        id="bathrooms"
                        type="number"
                        step="0.5"
                        value={formData.bathrooms}
                        onChange={(e) => handleInputChange('bathrooms', e.target.value)}
                        placeholder="2.5"
                      />
                    </div>
                    <div>
                      <Label htmlFor="square_feet">Square Feet</Label>
                      <Input
                        id="square_feet"
                        type="number"
                        value={formData.square_feet}
                        onChange={(e) => handleInputChange('square_feet', e.target.value)}
                        placeholder="2000"
                      />
                    </div>
                    <div>
                      <Label htmlFor="year_built" className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Year Built
                      </Label>
                      <Input
                        id="year_built"
                        type="number"
                        value={formData.year_built}
                        onChange={(e) => handleInputChange('year_built', e.target.value)}
                        placeholder="2020"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="lot_size">Lot Size (acres)</Label>
                    <Input
                      id="lot_size"
                      type="number"
                      step="0.01"
                      value={formData.lot_size}
                      onChange={(e) => handleInputChange('lot_size', e.target.value)}
                      placeholder="0.25"
                    />
                  </div>

                  {/* Amenities */}
                  <div className="space-y-4">
                    <h3 className="font-semibold">Amenities</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { key: 'has_garage', label: 'Garage' },
                        { key: 'has_pool', label: 'Swimming Pool' },
                        { key: 'has_garden', label: 'Garden' },
                        { key: 'has_fireplace', label: 'Fireplace' },
                        { key: 'has_central_air', label: 'Central Air' },
                      ].map((amenity) => (
                        <div key={amenity.key} className="flex items-center space-x-2">
                          <Switch
                            id={amenity.key}
                            checked={formData[amenity.key as keyof PropertyFormData] as boolean}
                            onCheckedChange={(checked) => 
                              handleInputChange(amenity.key as keyof PropertyFormData, checked)
                            }
                          />
                          <Label htmlFor={amenity.key}>{amenity.label}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 4: Media */}
            {currentStep === 4 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Camera className="h-5 w-5" />
                    Property Photos
                  </CardTitle>
                  <CardDescription>
                    Upload photos of your property. The first image will be used as the main photo.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Image Upload Area */}
                  <div 
                    className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-semibold mb-2">Upload Property Photos</h3>
                    <p className="text-muted-foreground text-sm mb-4">
                      Drag and drop images here or click to browse
                    </p>
                    <Button type="button" variant="outline">
                      <Plus className="h-4 w-4 mr-2" />
                      Select Images
                    </Button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </div>

                  {/* Image Preview Grid */}
                  {images.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {images.map((image, index) => (
                        <div key={index} className="relative group">
                          <div className={`border-2 rounded-lg overflow-hidden ${
                            image.is_primary ? 'border-primary' : 'border-muted'
                          }`}>
                            <img
                              src={image.preview}
                              alt={`Property image ${index + 1}`}
                              className="w-full h-48 object-cover"
                            />
                            <div className="p-3">
                              <Input
                                value={image.caption}
                                onChange={(e) => updateImageCaption(index, e.target.value)}
                                placeholder="Image caption..."
                                className="mb-2"
                              />
                              <div className="flex justify-between items-center">
                                <Button
                                  type="button"
                                  variant={image.is_primary ? "default" : "outline"}
                                  size="sm"
                                  onClick={() => setPrimaryImage(index)}
                                >
                                  {image.is_primary ? 'Primary' : 'Set Primary'}
                                </Button>
                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => removeImage(index)}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                          {image.is_primary && (
                            <Badge className="absolute top-2 left-2">Primary</Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
              >
                Previous
              </Button>

              {currentStep < 4 ? (
                <Button
                  type="button"
                  variant="hero"
                  onClick={nextStep}
                >
                  Next Step
                </Button>
              ) : (
                <Button
                  type="submit"
                  variant="hero"
                  disabled={loading}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {loading ? 'Creating...' : 'Create Property'}
                </Button>
              )}
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CreateProperty;