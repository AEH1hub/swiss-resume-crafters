
import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { FileText, Plus, Download, Edit, Trash2, Share2, Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";

// Mock data for resumes
const mockResumes = [
  {
    id: 1,
    name: "Software Engineer Resume",
    updatedAt: "2023-10-15T14:30:00",
    template: "Modern Professional",
    isPublic: true
  },
  {
    id: 2,
    name: "Project Manager CV",
    updatedAt: "2023-10-10T09:45:00",
    template: "Executive Classic",
    isPublic: false
  },
  {
    id: 3,
    name: "Marketing Specialist Application",
    updatedAt: "2023-09-28T16:20:00",
    template: "Creative Minimal",
    isPublic: true
  }
];

const ResumeCard = ({ resume }: { resume: typeof mockResumes[0] }) => {
  const formattedDate = new Date(resume.updatedAt).toLocaleDateString("en-CH", {
    year: "numeric",
    month: "short",
    day: "numeric"
  });

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold line-clamp-1">
            {resume.name}
          </CardTitle>
          {resume.isPublic && (
            <Badge variant="outline" className="ml-2 text-xs">
              Public
            </Badge>
          )}
        </div>
        <CardDescription className="text-xs">
          Last updated: {formattedDate}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-4">
        <div className="bg-gray-100 dark:bg-gray-800 rounded-md p-4 h-48 flex items-center justify-center">
          <FileText className="h-16 w-16 text-gray-400" />
        </div>
        <div className="mt-4 text-sm">
          <div className="flex items-center">
            <span className="font-medium">Template:</span>
            <span className="ml-2 text-gray-600 dark:text-gray-400">
              {resume.template}
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2 border-t flex justify-between gap-2">
        <Link to="/editor" className="flex-1">
          <Button size="sm" variant="outline" className="w-full">
            <Edit className="h-4 w-4 mr-1" />
            Edit
          </Button>
        </Link>
        <Button size="sm" variant="outline" className="px-3">
          <Download className="h-4 w-4" />
        </Button>
        <Button size="sm" variant="outline" className="px-3">
          <Share2 className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

const EmptyState = () => (
  <div className="text-center py-12 px-4">
    <div className="bg-gray-100 dark:bg-gray-800 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
      <FileText className="h-8 w-8 text-gray-400" />
    </div>
    <h3 className="text-lg font-medium mb-2">No resumes yet</h3>
    <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
      Create your first resume to get started with Swiss Resume and showcase your professional experience.
    </p>
    <Link to="/editor">
      <Button>
        <Plus className="h-4 w-4 mr-2" />
        Create new resume
      </Button>
    </Link>
  </div>
);

const DashboardPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  
  // Filter resumes based on search query and active tab
  const filteredResumes = mockResumes.filter(resume => {
    const matchesSearch = resume.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeTab === "all") return matchesSearch;
    if (activeTab === "public") return matchesSearch && resume.isPublic;
    if (activeTab === "private") return matchesSearch && !resume.isPublic;
    
    return matchesSearch;
  });

  return (
    <MainLayout>
      <div className="py-8 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Resumes</h1>
            <p className="text-gray-500 dark:text-gray-400">
              Manage your resumes and track your job applications
            </p>
          </div>
          <Link to="/editor">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create new resume
            </Button>
          </Link>
        </div>
        
        {/* Tabs and Search */}
        <div className="mb-6">
          <Tabs defaultValue="all" onValueChange={setActiveTab}>
            <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">
              <TabsList>
                <TabsTrigger value="all">All Resumes</TabsTrigger>
                <TabsTrigger value="public">Public</TabsTrigger>
                <TabsTrigger value="private">Private</TabsTrigger>
              </TabsList>
              
              <div className="relative">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search resumes..."
                  className="pl-9 w-full sm:w-60"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            <TabsContent value="all" className="mt-0">
              {filteredResumes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredResumes.map(resume => (
                    <ResumeCard key={resume.id} resume={resume} />
                  ))}
                </div>
              ) : (
                searchQuery ? (
                  <div className="text-center py-12">
                    <h3 className="text-lg font-medium mb-2">No matching resumes</h3>
                    <p className="text-gray-500 dark:text-gray-400">
                      Try adjusting your search query or filters
                    </p>
                  </div>
                ) : (
                  <EmptyState />
                )
              )}
            </TabsContent>
            
            <TabsContent value="public" className="mt-0">
              {filteredResumes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredResumes.map(resume => (
                    <ResumeCard key={resume.id} resume={resume} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <h3 className="text-lg font-medium mb-2">No public resumes</h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Make some of your resumes public to share them easily
                  </p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="private" className="mt-0">
              {filteredResumes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredResumes.map(resume => (
                    <ResumeCard key={resume.id} resume={resume} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <h3 className="text-lg font-medium mb-2">No private resumes</h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    Private resumes are only visible to you
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </MainLayout>
  );
};

export default DashboardPage;
