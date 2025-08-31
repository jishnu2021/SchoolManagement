import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { School, Search, Plus, MapPin, Phone, Mail, Eye, Edit, Trash2, Upload, X, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import SchoolViewPopup from "./SchoolViewPopup"; 

interface SchoolData {
  id: number;
  name: string;
  address: string;
  city: string;
  state: string;
  contact: string;
  email_id: string;
  image: string;
}

interface UpdateSchoolFormData {
  name: string;
  address: string;
  city: string;
  state: string;
  contact: string;
  email_id: string;
  image?: FileList;
}

const API_BASE_URL = import.meta.env.VITE_API_URL;

const ShowSchools = () => {
  const { toast } = useToast();
  const [schools, setSchools] = useState<SchoolData[]>([]);
  const [filteredSchools, setFilteredSchools] = useState<SchoolData[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // View popup states
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedSchoolForView, setSelectedSchoolForView] = useState<SchoolData | null>(null);
  
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState<SchoolData | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset: resetForm,
    setValue,
    watch,
  } = useForm<UpdateSchoolFormData>();

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

  const fetchSchools = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(`${API_BASE_URL}/schools/getschools`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.success && result.data) {
        setSchools(result.data);
        setFilteredSchools(result.data);
      } else {
        throw new Error(result.message || 'Failed to fetch schools');
      }
    } catch (error) {
      console.error('Error fetching schools:', error);
      setError(error instanceof Error ? error.message : 'Failed to load schools');
      toast({
        title: "Error",
        description: "Failed to load schools. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle View School
  const handleViewSchool = (school: SchoolData) => {
    setSelectedSchoolForView(school);
    setIsViewModalOpen(true);
  };

  const HandleUpdateMethod = async (schoolId: number, schoolName: string) => {
    try {
      let schoolToUpdate = schools.find(school => school.id === schoolId);
      
      if (!schoolToUpdate) {
        const response = await fetch(`${API_BASE_URL}/schools/${schoolId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch school details');
        }
        
        const result = await response.json();
        if (result.success && result.data) {
          schoolToUpdate = result.data;
        } else {
          throw new Error(result.message || 'School not found');
        }
      }
      
      setSelectedSchool(schoolToUpdate);
      
      setValue('name', schoolToUpdate.name);
      setValue('address', schoolToUpdate.address);
      setValue('city', schoolToUpdate.city);
      setValue('state', schoolToUpdate.state);
      setValue('contact', schoolToUpdate.contact);
      setValue('email_id', schoolToUpdate.email_id);
      
      if (schoolToUpdate.image) {
        setImagePreview(getImageUrl(schoolToUpdate.image));
      } else {
        setImagePreview(null);
      }
      
      setIsUpdateModalOpen(true);
      
    } catch (error) {
      console.error('Error preparing update:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to load school details.",
        variant: "destructive",
      });
    }
  };
  
  const onUpdateSubmit = async (data: UpdateSchoolFormData) => {
    if (!selectedSchool) return;

    setIsUpdating(true);
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
      
      const response = await fetch(`${API_BASE_URL}/schools/${selectedSchool.id}`, {
        method: 'PUT',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || result.error || 'Failed to update school');
      }

      const updatedSchools = schools.map(school => 
        school.id === selectedSchool.id 
          ? { ...school, ...result.data }
          : school
      );
      
      setSchools(updatedSchools);
      
      const updatedFiltered = updatedSchools.filter(school =>
        school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        school.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        school.state.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredSchools(updatedFiltered);

      toast({
        title: "School Updated Successfully!",
        description: `${data.name} has been updated successfully.`,
      });

      setIsUpdateModalOpen(false);
      setSelectedSchool(null);
      resetForm();
      setImagePreview(null);
      
    } catch (error) {
      console.error('Error updating school:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update school. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const closeUpdateModal = () => {
    setIsUpdateModalOpen(false);
    setSelectedSchool(null);
    resetForm();
    setImagePreview(null);
  };

  const handleDeleteSchool = async (schoolId: number, schoolName: string) => {
    if (!window.confirm(`Are you sure you want to delete ${schoolName}?`)) {
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/schools/${schoolId}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to delete school');
      }

      const updatedSchools = schools.filter(school => school.id !== schoolId);
      setSchools(updatedSchools);
      setFilteredSchools(updatedSchools.filter(school =>
        school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        school.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        school.state.toLowerCase().includes(searchTerm.toLowerCase())
      ));

      toast({
        title: "School Deleted",
        description: `${schoolName} has been successfully deleted.`,
      });
    } catch (error) {
      console.error('Error deleting school:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete school. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Updated getImageUrl function to use the API endpoint
  const getImageUrl = (imagePath: string) => {
  console.log("The yrk us :",imagePath)
  if (!imagePath) {
    return "https://images.unsplash.com/photo-1562774053-701939374585?w=400&h=250&fit=crop";
  }

   if (imagePath.startsWith('http')) {
    return imagePath;
  }
  // Return backend URL directly (browser will call it)
  return `${API_BASE_URL}/images/${imagePath}/url?width=400&height=250&crop=fill&quality=auto&format=webp`;
};


  useEffect(() => {
    fetchSchools();
  }, []);

  useEffect(() => {
    const filtered = schools.filter(school =>
      school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      school.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      school.state.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredSchools(filtered);
  }, [searchTerm, schools]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <School className="h-12 w-12 text-primary mx-auto animate-pulse" />
          <p className="mt-2 text-muted-foreground">Loading schools...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <School className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-muted-foreground mb-2">Failed to Load Schools</h3>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={fetchSchools} variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search schools by name, city, or state..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-12 bg-white shadow-sm border-border/50"
              />
            </div>
          </div>

          <div className="mb-6 flex justify-between items-center">
            <p className="text-muted-foreground">
              Showing {filteredSchools.length} of {schools.length} schools
            </p>
            <div className="flex items-center gap-2">
              <Button
                onClick={fetchSchools}
                variant="outline"
                size="sm"
                className="text-xs"
              >
                Refresh
              </Button>
              <Link to="/add-school">
                <Button className="bg-gradient-to-r from-primary to-primary-glow hover:from-primary/90 hover:to-primary-glow/90 transition-all duration-200">
                  <Plus className="h-4 w-4 mr-2" />
                  Add New School
                </Button>
              </Link>
            </div>
          </div>

          {filteredSchools.length === 0 ? (
            <div className="text-center py-12">
              <School className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-muted-foreground mb-2">
                {schools.length === 0 ? "No schools available" : "No schools found"}
              </h3>
              <p className="text-muted-foreground">
                {schools.length === 0 
                  ? "Start by adding the first school to the directory"
                  : "Try adjusting your search criteria"
                }
              </p>
              {schools.length === 0 && (
                <Link to="/add-school" className="mt-4 inline-block">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add First School
                  </Button>
                </Link>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredSchools.map((school) => (
                <Card 
                  key={school.id} 
                  className="overflow-hidden hover:shadow-lg transition-all duration-300 border-0 group cursor-pointer bg-white"
                  style={{ boxShadow: 'var(--shadow-card)' }}
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={getImageUrl(school.image)}
                      alt={school.name}
                      className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => {
                        console.log('Image failed to load:', getImageUrl(school.image));
                        e.currentTarget.src = "https://images.unsplash.com/photo-1562774053-701939374585?w=400&h=250&fit=crop";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors duration-200">
                      {school.name}
                    </h3>
                    
                    <div className="space-y-3">
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                        <div className="text-sm text-muted-foreground">
                          <p>{school.address}</p>
                          <p className="font-medium text-foreground">{school.city}, {school.state}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{school.contact}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">{school.email_id}</span>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-4 border-t border-border/50 flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="flex-1 group-hover:border-primary group-hover:text-primary transition-colors duration-200"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewSchool(school);
                        }}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="group-hover:border-blue-500 group-hover:text-blue-500 transition-colors duration-200"
                        onClick={(e) => {
                          e.stopPropagation();
                          HandleUpdateMethod(school.id, school.name);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteSchool(school.id, school.name);
                        }}
                        className="group-hover:border-red-500 group-hover:text-red-500 transition-colors duration-200"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* School View Popup */}
      {selectedSchoolForView && (
        <SchoolViewPopup
          school={selectedSchoolForView}
          isOpen={isViewModalOpen}
          onClose={() => {
            setIsViewModalOpen(false);
            setSelectedSchoolForView(null);
          }}
          // getImageUrl={getImageUrl}
        />
      )}

      {/* Update School Dialog */}
      <Dialog open={isUpdateModalOpen} onOpenChange={setIsUpdateModalOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5 text-blue-600" />
              Update School
            </DialogTitle>
            <DialogDescription>
              Make changes to {selectedSchool?.name}. Click save when you're done.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onUpdateSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="update-name" className="text-sm font-medium">
                School Name *
              </Label>
              <Input
                id="update-name"
                placeholder="Enter school name"
                {...register("name", {
                  required: "School name is required",
                  minLength: {
                    value: 2,
                    message: "School name must be at least 2 characters"
                  }
                })}
              />
              {errors.name && (
                <p className="text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="update-address" className="text-sm font-medium">
                Address *
              </Label>
              <Input
                id="update-address"
                placeholder="Enter complete address"
                {...register("address", {
                  required: "Address is required"
                })}
              />
              {errors.address && (
                <p className="text-sm text-red-600">{errors.address.message}</p>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="update-city" className="text-sm font-medium">
                  City *
                </Label>
                <Input
                  id="update-city"
                  placeholder="Enter city"
                  {...register("city", {
                    required: "City is required"
                  })}
                />
                {errors.city && (
                  <p className="text-sm text-red-600">{errors.city.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="update-state" className="text-sm font-medium">
                  State *
                </Label>
                <Input
                  id="update-state"
                  placeholder="Enter state"
                  {...register("state", {
                    required: "State is required"
                  })}
                />
                {errors.state && (
                  <p className="text-sm text-red-600">{errors.state.message}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="update-contact" className="text-sm font-medium">
                  Contact Number *
                </Label>
                <Input
                  id="update-contact"
                  type="tel"
                  placeholder="Enter contact number"
                  {...register("contact", {
                    required: "Contact number is required",
                    pattern: {
                      value: /^[0-9]{10}$/,
                      message: "Please enter a valid 10-digit contact number"
                    }
                  })}
                />
                {errors.contact && (
                  <p className="text-sm text-red-600">{errors.contact.message}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="update-email" className="text-sm font-medium">
                  Email Address *
                </Label>
                <Input
                  id="update-email"
                  type="email"
                  placeholder="Enter email address"
                  {...register("email_id", {
                    required: "Email is required",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Please enter a valid email address"
                    }
                  })}
                />
                {errors.email_id && (
                  <p className="text-sm text-red-600">{errors.email_id.message}</p>
                )}
              </div>
            </div>
   
            <div className="space-y-2">
              <Label htmlFor="update-image" className="text-sm font-medium">
                School Image
              </Label>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Input
                    id="update-image"
                    type="file"
                    accept="image/*"
                    {...register("image")}
                  />
                  <Upload className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                </div>
                
                {imagePreview && (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="School preview"
                      className="h-32 w-48 object-cover rounded-lg border shadow-sm"
                    />
                    <div className="mt-2">
                      <p className="text-xs text-muted-foreground">
                        {watchedImage && watchedImage[0] ? 'New image selected' : 'Current image'}
                      </p>
                    </div>
                  </div>
                )}
              </div>
              {errors.image && (
                <p className="text-sm text-red-600">{errors.image.message}</p>
              )}
            </div>

            <DialogFooter className="flex gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={closeUpdateModal}
                disabled={isUpdating}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isUpdating}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
              >
                {isUpdating ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Edit className="h-4 w-4 mr-2" />
                    Update School
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ShowSchools;