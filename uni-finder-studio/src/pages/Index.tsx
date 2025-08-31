import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { School, Plus, Search, BookOpen, Users, Award } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center space-y-6 max-w-4xl mx-auto">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-white rounded-2xl shadow-lg" style={{ boxShadow: 'var(--shadow-card)' }}>
              <School className="h-12 w-12 text-primary" />
            </div>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold text-foreground tracking-tight">
            School Management
            <span className="block bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              Directory
            </span>
          </h1>
          
          <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Discover and manage educational institutions with our comprehensive school directory platform. 
            Add new schools and explore existing ones with ease.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
            <Link to="/schools">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-primary to-primary-glow hover:from-primary/90 hover:to-primary-glow/90 transition-all duration-200 h-12 px-8"
              >
                <Search className="h-5 w-5 mr-2" />
                Browse Schools
              </Button>
            </Link>
            <Link to="/add-school">
              <Button 
                size="lg" 
                variant="outline" 
                className="h-12 px-8 border-primary/20 hover:border-primary hover:bg-primary/5"
              >
                <Plus className="h-5 w-5 mr-2" />
                Add New School
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">Platform Features</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Everything you need to manage and discover educational institutions
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <Card className="text-center border-0 shadow-lg" style={{ boxShadow: 'var(--shadow-card)' }}>
            <CardHeader className="pb-4">
              <div className="mx-auto bg-accent p-3 rounded-full w-fit mb-4">
                <BookOpen className="h-6 w-6 text-accent-foreground" />
              </div>
              <CardTitle className="text-xl">Easy Registration</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Add new schools with our intuitive form featuring validation and image upload capabilities.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center border-0 shadow-lg" style={{ boxShadow: 'var(--shadow-card)' }}>
            <CardHeader className="pb-4">
              <div className="mx-auto bg-accent p-3 rounded-full w-fit mb-4">
                <Search className="h-6 w-6 text-accent-foreground" />
              </div>
              <CardTitle className="text-xl">Smart Search</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Find schools quickly by searching through names, cities, and states with our powerful search.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center border-0 shadow-lg" style={{ boxShadow: 'var(--shadow-card)' }}>
            <CardHeader className="pb-4">
              <div className="mx-auto bg-accent p-3 rounded-full w-fit mb-4">
                <Award className="h-6 w-6 text-accent-foreground" />
              </div>
              <CardTitle className="text-xl">Quality Directory</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-base">
                Browse through our comprehensive directory of educational institutions with detailed information.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-primary/5 to-primary-glow/5 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">Ready to Get Started?</h2>
          <p className="text-muted-foreground text-lg mb-8 max-w-2xl mx-auto">
            Join our platform today and help build the most comprehensive school directory
          </p>
          <Link to="/add-school">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-primary to-primary-glow hover:from-primary/90 hover:to-primary-glow/90 transition-all duration-200 h-12 px-8"
            >
              <Plus className="h-5 w-5 mr-2" />
              Add Your School
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Index;
