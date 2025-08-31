import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { School, Upload, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

interface SchoolFormData {
  name: string;
  address: string;
  city: string;
  state: string;
  contact: string;
  email_id: string;
  image: FileList;
}
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const AddSchool = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<SchoolFormData>();

  const watchedImage = watch("image");

  useEffect(() => {
    if (watchedImage && watchedImage[0]) {
      const file = watchedImage[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, [watchedImage]);

  const onSubmit = async (data: SchoolFormData) => {
    setIsSubmitting(true);

    try {
     
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('address', data.address);
      formData.append('city', data.city);
      formData.append('state', data.state);
      formData.append('contact', data.contact);
      formData.append('email_id', data.email_id);
      
      
      if (data.image && data.image[0]) {
        formData.append('image', data.image[0]);
      }

   
      const response = await fetch(`${API_BASE_URL}/schools/add`, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || result.error || 'Failed to add school');
      }

      toast({
        title: "School Added Successfully!",
        description: `${data.name} has been added to the database.`,
      });

      reset();
      setImagePreview(null);
      
    } catch (error) {
      console.error('Error adding school:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add school. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-lg border-0" style={{ boxShadow: 'var(--shadow-form)' }}>
            <CardHeader className="text-center space-y-2">
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                School Registration
              </CardTitle>
              <CardDescription className="text-base">
                Fill in the details below to add a new school to the directory
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* School Name */}
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">
                    School Name *
                  </Label>
                  <Input
                    id="name"
                    placeholder="Enter school name"
                    className="h-12"
                    {...register("name", {
                      required: "School name is required",
                      minLength: {
                        value: 2,
                        message: "School name must be at least 2 characters"
                      }
                    })}
                  />
                  {errors.name && (
                    <p className="text-sm text-destructive">{errors.name.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address" className="text-sm font-medium">
                    Address *
                  </Label>
                  <Input
                    id="address"
                    placeholder="Enter complete address"
                    className="h-12"
                    {...register("address", {
                      required: "Address is required"
                    })}
                  />
                  {errors.address && (
                    <p className="text-sm text-destructive">{errors.address.message}</p>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city" className="text-sm font-medium">
                      City *
                    </Label>
                    <Input
                      id="city"
                      placeholder="Enter city"
                      className="h-12"
                      {...register("city", {
                        required: "City is required"
                      })}
                    />
                    {errors.city && (
                      <p className="text-sm text-destructive">{errors.city.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="state" className="text-sm font-medium">
                      State *
                    </Label>
                    <Input
                      id="state"
                      placeholder="Enter state"
                      className="h-12"
                      {...register("state", {
                        required: "State is required"
                      })}
                    />
                    {errors.state && (
                      <p className="text-sm text-destructive">{errors.state.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contact" className="text-sm font-medium">
                      Contact Number *
                    </Label>
                    <Input
                      id="contact"
                      type="tel"
                      placeholder="Enter contact number"
                      className="h-12"
                      {...register("contact", {
                        required: "Contact number is required",
                        pattern: {
                          value: /^[0-9]{10}$/,
                          message: "Please enter a valid 10-digit contact number"
                        }
                      })}
                    />
                    {errors.contact && (
                      <p className="text-sm text-destructive">{errors.contact.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email_id" className="text-sm font-medium">
                      Email Address *
                    </Label>
                    <Input
                      id="email_id"
                      type="email"
                      placeholder="Enter email address"
                      className="h-12"
                      {...register("email_id", {
                        required: "Email is required",
                        pattern: {
                          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                          message: "Please enter a valid email address"
                        }
                      })}
                    />
                    {errors.email_id && (
                      <p className="text-sm text-destructive">{errors.email_id.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image" className="text-sm font-medium">
                    School Image
                  </Label>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <Input
                        id="image"
                        type="file"
                        accept="image/*"
                        className="h-12"
                        {...register("image")}
                      />
                      <Upload className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                    </div>
                    
                    {imagePreview && (
                      <div className="mt-4">
                        <img
                          src={imagePreview}
                          alt="School preview"
                          className="h-32 w-48 object-cover rounded-lg border shadow-sm"
                          style={{ boxShadow: 'var(--shadow-image)' }}
                        />
                      </div>
                    )}
                  </div>
                  {errors.image && (
                    <p className="text-sm text-destructive">{errors.image.message}</p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-12 text-base font-medium bg-gradient-to-r from-primary to-primary-glow hover:from-primary/90 hover:to-primary-glow/90 transition-all duration-200"
                >
                  {isSubmitting ? "Adding School..." : "Add School"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AddSchool;