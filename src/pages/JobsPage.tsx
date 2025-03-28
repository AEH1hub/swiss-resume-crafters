
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, Search, MapPin, Building, Calendar, ExternalLink, ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  salary: string;
  description: string;
  requirements: string[];
  posted_date: string;
  url: string;
  category: string;
}

const JobsPage = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("all");
  const [session, setSession] = useState<any>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
    };

    checkSession();

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const fetchJobs = async () => {
      setIsLoading(true);
      
      try {
        // In a real app, this would fetch from your database
        // For demo purposes, we're using placeholder data
        const placeholderJobs: Job[] = [
          {
            id: "1",
            title: "Software Engineer",
            company: "Tech Innovations AG",
            location: "Zürich, Switzerland",
            type: "Full-time",
            salary: "CHF 90,000 - 120,000",
            description: "Join our dynamic team developing cutting-edge software solutions for the finance industry.",
            requirements: ["5+ years of experience", "JavaScript/TypeScript", "React", "Node.js"],
            posted_date: "2025-03-15",
            url: "https://www.jobs.ch",
            category: "technology"
          },
          {
            id: "2",
            title: "Financial Analyst",
            company: "Swiss Banking Group",
            location: "Geneva, Switzerland",
            type: "Full-time",
            salary: "CHF 85,000 - 110,000",
            description: "Analyze financial data and prepare reports to help guide investment decisions.",
            requirements: ["Bachelor's in Finance", "Excel proficiency", "Financial modeling", "German language"],
            posted_date: "2025-03-18",
            url: "https://www.jobs.ch",
            category: "finance"
          },
          {
            id: "3",
            title: "Hotel Receptionist",
            company: "Luxury Swiss Hotels",
            location: "Lucerne, Switzerland",
            type: "Full-time",
            salary: "CHF 60,000 - 70,000",
            description: "Greet guests and manage check-ins/check-outs at our 5-star hotel.",
            requirements: ["Customer service experience", "English fluency", "French or German", "Hospitality background"],
            posted_date: "2025-03-20",
            url: "https://www.hoteljob.ch",
            category: "hospitality"
          },
          {
            id: "4",
            title: "Warehouse Associate",
            company: "Swiss Logistics Solutions",
            location: "Basel, Switzerland",
            type: "Full-time",
            salary: "CHF 55,000 - 65,000",
            description: "Handle inventory management and order fulfillment in our modern warehouse facility.",
            requirements: ["Physical stamina", "Attention to detail", "Basic computer skills", "Forklift certificate a plus"],
            posted_date: "2025-03-12",
            url: "https://www.jobs.ch",
            category: "logistics"
          },
          {
            id: "5",
            title: "Construction Worker",
            company: "Swiss Building Projects",
            location: "Bern, Switzerland",
            type: "Full-time",
            salary: "CHF 60,000 - 75,000",
            description: "Join our construction team working on residential and commercial projects throughout Switzerland.",
            requirements: ["2+ years construction experience", "Knowledge of safety procedures", "Team player", "Valid work permit"],
            posted_date: "2025-03-10",
            url: "https://www.bauarbeiter.ch",
            category: "construction"
          },
          {
            id: "6",
            title: "Cleaner",
            company: "Swiss Cleaning Services",
            location: "Zurich, Switzerland",
            type: "Part-time",
            salary: "CHF 25 - 30 per hour",
            description: "Provide thorough cleaning services for commercial office buildings.",
            requirements: ["Previous cleaning experience", "Attention to detail", "Flexible schedule", "References"],
            posted_date: "2025-03-22",
            url: "https://www.jobs.ch",
            category: "cleaning"
          },
          {
            id: "7",
            title: "Airline Pilot",
            company: "Swiss International Air Lines",
            location: "Zurich, Switzerland",
            type: "Full-time",
            salary: "CHF 100,000 - 150,000",
            description: "Fly domestic and international routes for Switzerland's flagship carrier.",
            requirements: ["ATPL license", "2,000+ flight hours", "Type rating for Airbus/Boeing", "Perfect health record"],
            posted_date: "2025-03-05",
            url: "https://www.swiss.com/careers",
            category: "aviation"
          },
          {
            id: "8",
            title: "Administrative Assistant",
            company: "Swiss Government Office",
            location: "Bern, Switzerland",
            type: "Full-time",
            salary: "CHF 70,000 - 80,000",
            description: "Provide administrative support for a government department.",
            requirements: ["Administrative experience", "German fluency", "Excellent organization", "Swiss citizenship preferred"],
            posted_date: "2025-03-25",
            url: "https://www.admin.ch",
            category: "administration"
          }
        ];
        
        setJobs(placeholderJobs);
        setFilteredJobs(placeholderJobs);
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to fetch job listings",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchJobs();
  }, [toast]);

  useEffect(() => {
    let results = jobs;
    
    // Filter by search term
    if (searchTerm) {
      results = results.filter(job => 
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filter by category
    if (category && category !== "all") {
      results = results.filter(job => job.category === category);
    }
    
    setFilteredJobs(results);
  }, [searchTerm, category, jobs]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleCategoryChange = (value: string) => {
    setCategory(value);
  };

  const handleApplyClick = (url: string) => {
    // Open in new tab
    window.open(url, "_blank");
  };

  const handleJobClick = (jobId: string) => {
    // FIX: This was causing a build error - the element doesn't have a click method
    // We let the click propagate naturally instead
    // document.getElementById(`apply-btn-${jobId}`)?.click();
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-CH', options);
  };

  const getJobSiteInfo = () => {
    return [
      {
        name: "jobs.ch",
        description: "Switzerland's largest job portal with thousands of listings across all industries.",
        url: "https://www.jobs.ch"
      },
      {
        name: "Indeed Switzerland",
        description: "Global job search engine with many Swiss opportunities.",
        url: "https://ch.indeed.com"
      },
      {
        name: "LinkedIn Jobs",
        description: "Professional networking site with job listings and career opportunities.",
        url: "https://www.linkedin.com/jobs"
      },
      {
        name: "Swiss Federal Government",
        description: "Official job portal for positions within the Swiss federal administration.",
        url: "https://www.stelle.admin.ch"
      },
      {
        name: "Xing",
        description: "Professional networking platform popular in German-speaking countries.",
        url: "https://www.xing.com/jobs"
      }
    ];
  };

  const handleCreateResumeClick = () => {
    if (!session) {
      toast({
        title: "Authentication required",
        description: "Please sign in to create a resume",
      });
      navigate("/login");
      return;
    }
    
    navigate("/templates");
  };

  return (
    <MainLayout>
      <div className="py-12 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-5xl font-bold mb-4">Find Your Next Opportunity</h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Browse job listings across Switzerland and create the perfect resume to stand out.
            </p>
          </div>

          <div className="mb-8 bg-gray-50 dark:bg-gray-800 p-6 rounded-lg shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div className="col-span-2">
                <Label htmlFor="search" className="mb-2 block">Search Jobs</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <Input
                    id="search"
                    placeholder="Search by title, company, or keywords..."
                    value={searchTerm}
                    onChange={handleSearch}
                    className="pl-10"
                  />
                </div>
              </div>
              <div>
                <Button 
                  className="w-full bg-swiss-red hover:bg-swiss-red/90"
                  onClick={handleCreateResumeClick}
                >
                  Create Resume for These Jobs
                </Button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Tabs 
                defaultValue="all" 
                value={category} 
                onValueChange={handleCategoryChange}
                className="mb-6"
              >
                <TabsList className="w-full overflow-x-auto flex-nowrap whitespace-nowrap mb-4">
                  <TabsTrigger value="all">All Jobs</TabsTrigger>
                  <TabsTrigger value="technology">Technology</TabsTrigger>
                  <TabsTrigger value="finance">Finance</TabsTrigger>
                  <TabsTrigger value="hospitality">Hospitality</TabsTrigger>
                  <TabsTrigger value="logistics">Logistics</TabsTrigger>
                  <TabsTrigger value="construction">Construction</TabsTrigger>
                  <TabsTrigger value="cleaning">Cleaning</TabsTrigger>
                  <TabsTrigger value="aviation">Aviation</TabsTrigger>
                  <TabsTrigger value="administration">Administration</TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="mt-0">
                  {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                      <Loader2 className="h-8 w-8 animate-spin text-swiss-red" />
                    </div>
                  ) : (
                    <>
                      {filteredJobs.length === 0 ? (
                        <div className="text-center py-12">
                          <p className="text-gray-500 dark:text-gray-400">No jobs found. Try adjusting your search.</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {filteredJobs.map(job => (
                            <Card 
                              key={job.id} 
                              className="hover:shadow-md transition-shadow cursor-pointer"
                              onClick={() => handleJobClick(job.id)}
                            >
                              <CardHeader className="pb-2">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <CardTitle className="text-xl">{job.title}</CardTitle>
                                    <CardDescription className="flex items-center mt-1">
                                      <Building className="h-4 w-4 mr-1" />
                                      {job.company}
                                    </CardDescription>
                                  </div>
                                  <Badge variant={job.type === "Full-time" ? "default" : "outline"}>
                                    {job.type}
                                  </Badge>
                                </div>
                              </CardHeader>
                              <CardContent className="pb-2">
                                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
                                  <MapPin className="h-4 w-4 mr-1" />
                                  {job.location}
                                  <span className="mx-2">•</span>
                                  <Calendar className="h-4 w-4 mr-1" />
                                  Posted {formatDate(job.posted_date)}
                                </div>
                                <p className="text-sm mb-3">{job.description}</p>
                                <div className="flex flex-wrap gap-2 mt-2">
                                  {job.requirements.map((req, index) => (
                                    <Badge key={index} variant="secondary" className="font-normal">
                                      {req}
                                    </Badge>
                                  ))}
                                </div>
                              </CardContent>
                              <CardFooter className="flex justify-between items-center">
                                <p className="text-sm font-medium">{job.salary}</p>
                                <Button 
                                  id={`apply-btn-${job.id}`}
                                  variant="outline" 
                                  size="sm" 
                                  className="text-swiss-red hover:text-white hover:bg-swiss-red"
                                  onClick={() => handleApplyClick(job.url)}
                                >
                                  Apply Now <ExternalLink className="ml-1 h-3 w-3" />
                                </Button>
                              </CardFooter>
                            </Card>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </TabsContent>
                
                {/* All other category tabs share the same content */}
                {["technology", "finance", "hospitality", "logistics", "construction", "cleaning", "aviation", "administration"].map((cat) => (
                  <TabsContent key={cat} value={cat} className="mt-0">
                    {isLoading ? (
                      <div className="flex justify-center items-center h-64">
                        <Loader2 className="h-8 w-8 animate-spin text-swiss-red" />
                      </div>
                    ) : (
                      <>
                        {filteredJobs.length === 0 ? (
                          <div className="text-center py-12">
                            <p className="text-gray-500 dark:text-gray-400">No jobs found in this category. Try another category.</p>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {filteredJobs.map(job => (
                              <Card 
                                key={job.id} 
                                className="hover:shadow-md transition-shadow cursor-pointer"
                                onClick={() => handleJobClick(job.id)}
                              >
                                <CardHeader className="pb-2">
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <CardTitle className="text-xl">{job.title}</CardTitle>
                                      <CardDescription className="flex items-center mt-1">
                                        <Building className="h-4 w-4 mr-1" />
                                        {job.company}
                                      </CardDescription>
                                    </div>
                                    <Badge variant={job.type === "Full-time" ? "default" : "outline"}>
                                      {job.type}
                                    </Badge>
                                  </div>
                                </CardHeader>
                                <CardContent className="pb-2">
                                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
                                    <MapPin className="h-4 w-4 mr-1" />
                                    {job.location}
                                    <span className="mx-2">•</span>
                                    <Calendar className="h-4 w-4 mr-1" />
                                    Posted {formatDate(job.posted_date)}
                                  </div>
                                  <p className="text-sm mb-3">{job.description}</p>
                                  <div className="flex flex-wrap gap-2 mt-2">
                                    {job.requirements.map((req, index) => (
                                      <Badge key={index} variant="secondary" className="font-normal">
                                        {req}
                                      </Badge>
                                    ))}
                                  </div>
                                </CardContent>
                                <CardFooter className="flex justify-between items-center">
                                  <p className="text-sm font-medium">{job.salary}</p>
                                  <Button 
                                    id={`apply-btn-${job.id}`}
                                    variant="outline" 
                                    size="sm" 
                                    className="text-swiss-red hover:text-white hover:bg-swiss-red"
                                    onClick={() => handleApplyClick(job.url)}
                                  >
                                    Apply Now <ExternalLink className="ml-1 h-3 w-3" />
                                  </Button>
                                </CardFooter>
                              </Card>
                            ))}
                          </div>
                        )}
                      </>
                    )}
                  </TabsContent>
                ))}
              </Tabs>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Top Swiss Job Sites</CardTitle>
                  <CardDescription>
                    Explore more opportunities on these official job platforms
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {getJobSiteInfo().map((site, index) => (
                      <div key={index} className="group">
                        <a 
                          href={site.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-start p-3 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                        >
                          <div>
                            <h3 className="font-medium group-hover:text-swiss-red flex items-center">
                              {site.name}
                              <ArrowUpRight className="ml-1 h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                              {site.description}
                            </p>
                          </div>
                        </a>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full bg-swiss-red hover:bg-swiss-red/90"
                    onClick={handleCreateResumeClick}
                  >
                    Create Your Resume Now
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default JobsPage;
