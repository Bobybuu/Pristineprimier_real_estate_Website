import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { inquiryApi, type InquiryData } from '@/services/inquiryApi';

interface ContactFormProps {
  propertyId?: string;
  formType?: 'inquiry' | 'valuation' | 'management' | 'general';
  onSubmit?: (data: any) => void;
}

const ContactForm = ({ propertyId, formType = 'inquiry', onSubmit }: ContactFormProps) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    address: '',
    sqft: '',
    serviceType: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let response;

      switch (formType) {
        case 'inquiry':
          if (propertyId) {
            // Property-specific inquiry
            response = await inquiryApi.submitPropertyInquiry(propertyId, formData);
          } else {
            // General inquiry
            response = await inquiryApi.submitGeneralInquiry(formData);
          }
          break;

        case 'valuation':
          response = await inquiryApi.submitValuationRequest(formData);
          break;

        case 'management':
          response = await inquiryApi.submitManagementRequest(formData);
          break;

        case 'general':
          response = await inquiryApi.submitGeneralInquiry(formData);
          break;

        default:
          throw new Error('Unknown form type');
      }

      toast.success('Form submitted successfully! We\'ll be in touch soon.');
      onSubmit?.(formData);

      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: '',
        address: '',
        sqft: '',
        serviceType: '',
      });

    } catch (error) {
      console.error('Form submission error:', error);
      toast.error('Failed to submit form. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Render form fields based on formType
  const renderAdditionalFields = () => {
    switch (formType) {
      case 'valuation':
        return (
          <>
            <div>
              <Label htmlFor="address">Property Address *</Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                placeholder="123 Main St, City, State ZIP"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="sqft">Square Footage</Label>
              <Input
                id="sqft"
                name="sqft"
                type="number"
                value={formData.sqft}
                onChange={handleChange}
                placeholder="2000"
                className="mt-1"
              />
            </div>
          </>
        );

      case 'management':
        return (
          <>
            <div>
              <Label htmlFor="address">Property Address *</Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                placeholder="123 Main St, City, State ZIP"
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="serviceType">Service Type *</Label>
              <select
                id="serviceType"
                name="serviceType"
                value={formData.serviceType}
                onChange={handleChange}
                required
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background mt-1"
              >
                <option value="">Select a service</option>
                <option value="rent-collection">Rent Collection</option>
                <option value="maintenance">Maintenance</option>
                <option value="tenant-screening">Tenant Screening</option>
                <option value="full-management">Full Management</option>
              </select>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  const getSubmitButtonText = () => {
    if (loading) return 'Submitting...';
    
    switch (formType) {
      case 'inquiry': return 'Send Inquiry';
      case 'valuation': return 'Get Valuation';
      case 'management': return 'Request Management';
      case 'general': return 'Send Message';
      default: return 'Submit Request';
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Full Name *</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="John Doe"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="john@example.com"
            className="mt-1"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="phone">Phone Number *</Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            required
            placeholder="(555) 123-4567"
            className="mt-1"
          />
        </div>

        {/* Additional field slots based on form type */}
        {formType === 'valuation' && (
          <div>
            <Label htmlFor="sqft">Square Footage</Label>
            <Input
              id="sqft"
              name="sqft"
              type="number"
              value={formData.sqft}
              onChange={handleChange}
              placeholder="2000"
              className="mt-1"
            />
          </div>
        )}

        {formType === 'management' && (
          <div>
            <Label htmlFor="serviceType">Service Type *</Label>
            <select
              id="serviceType"
              name="serviceType"
              value={formData.serviceType}
              onChange={handleChange}
              required
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background mt-1"
            >
              <option value="">Select a service</option>
              <option value="rent-collection">Rent Collection</option>
              <option value="maintenance">Maintenance</option>
              <option value="tenant-screening">Tenant Screening</option>
              <option value="full-management">Full Management</option>
            </select>
          </div>
        )}
      </div>

      {renderAdditionalFields()}

      <div>
        <Label htmlFor="message">Message *</Label>
        <Textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
          rows={5}
          placeholder={
            formType === 'inquiry'
              ? 'Tell us more about your requirements...'
              : formType === 'valuation'
              ? 'Provide additional property details...'
              : formType === 'management'
              ? 'Describe your property management needs...'
              : 'How can we help you?'
          }
          className="mt-1"
        />
      </div>

      <Button type="submit" variant="teal" size="lg" disabled={loading} className="w-full">
        {getSubmitButtonText()}
      </Button>
    </form>
  );
};

export default ContactForm;