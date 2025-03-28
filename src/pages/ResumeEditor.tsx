import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Loader2, 
  Save, 
  Download, 
  ArrowLeft, 
  Share2, 
  Facebook, 
  Mail, 
  Twitter, 
  Phone 
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

interface ResumeData {
  personal: {
    name: string;
    title: string;
    email: string;
    phone: string;
    address: string;
    photo?: string;
  };
  summary: string;
  experience: {
    title: string;
    company: string;
    location: string;
    startDate: string;
    endDate: string;
    description: string;
  }[];
  education: {
    degree: string;
    institution: string;
    location: string;
    startDate: string;
    endDate: string;
  }[];
  skills: string[];
  languages: {
    language: string;
    proficiency: string;
  }[];
}

const defaultResumeData: ResumeData = {
  personal: {
    name: "",
    title: "",
    email: "",
    phone: "",
    address: "",
    photo: ""
  },
  summary: "",
  experience: [
    {
      title: "",
      company: "",
      location: "",
      startDate: "",
      endDate: "",
      description: ""
    }
  ],
  education: [
    {
      degree: "",
      institution: "",
      location: "",
      startDate: "",
      endDate: ""
    }
  ],
  skills: [""],
  languages: [
    {
      language: "",
      proficiency: ""
    }
  ]
};

const ResumeEditor = () => {
  const [searchParams] = useSearchParams();
  const templateName = searchParams.get("template") || "Modern";
  const [resumeData, setResumeData] = useState<ResumeData>(defaultResumeData);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showPhoto, setShowPhoto] = useState(true);
  const [session, setSession] = useState<any>(null);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const resumeRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      if (!data.session) {
        toast({
          title: "Authentication required",
          description: "Please sign in to create and save resumes",
          variant: "destructive",
        });
        navigate("/login");
      }
    };

    checkSession();

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        if (!session) {
          navigate("/login");
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [navigate, toast]);

  useEffect(() => {
    const resumeId = searchParams.get("id");
    if (resumeId && session) {
      const fetchResume = async () => {
        setIsLoading(true);
        try {
          const { data, error } = await supabase
            .from("resumes")
            .select("*")
            .eq("id", resumeId)
            .eq("user_id", session.user.id)
            .single();

          if (error) throw error;
          
          if (data) {
            setResumeData(data.content as ResumeData);
          }
        } catch (error: any) {
          toast({
            title: "Error loading resume",
            description: error.message || "Failed to load resume data",
            variant: "destructive",
          });
        } finally {
          setIsLoading(false);
        }
      };
      
      fetchResume();
    }
  }, [searchParams, session, toast]);

  const handleInputChange = (
    section: keyof ResumeData,
    field: string,
    value: string,
    index?: number
  ) => {
    setResumeData((prev) => {
      const updated = { ...prev };
      
      if (section === "personal") {
        updated.personal = {
          ...updated.personal,
          [field]: value,
        };
      } else if (section === "summary") {
        updated.summary = value;
      } else if (section === "experience" && typeof index === "number") {
        const updatedExperience = [...updated.experience];
        updatedExperience[index] = {
          ...updatedExperience[index],
          [field]: value,
        };
        updated.experience = updatedExperience;
      } else if (section === "education" && typeof index === "number") {
        const updatedEducation = [...updated.education];
        updatedEducation[index] = {
          ...updatedEducation[index],
          [field]: value,
        };
        updated.education = updatedEducation;
      } else if (section === "skills" && typeof index === "number") {
        const updatedSkills = [...updated.skills];
        updatedSkills[index] = value;
        updated.skills = updatedSkills;
      } else if (section === "languages" && typeof index === "number") {
        const updatedLanguages = [...updated.languages];
        updatedLanguages[index] = {
          ...updatedLanguages[index],
          [field]: value,
        };
        updated.languages = updatedLanguages;
      }
      
      return updated;
    });
  };

  const addItem = (section: "experience" | "education" | "skills" | "languages") => {
    setResumeData((prev) => {
      const updated = { ...prev };
      
      if (section === "experience") {
        updated.experience = [
          ...updated.experience,
          {
            title: "",
            company: "",
            location: "",
            startDate: "",
            endDate: "",
            description: "",
          },
        ];
      } else if (section === "education") {
        updated.education = [
          ...updated.education,
          {
            degree: "",
            institution: "",
            location: "",
            startDate: "",
            endDate: "",
          },
        ];
      } else if (section === "skills") {
        updated.skills = [...updated.skills, ""];
      } else if (section === "languages") {
        updated.languages = [
          ...updated.languages,
          {
            language: "",
            proficiency: "",
          },
        ];
      }
      
      return updated;
    });
  };

  const removeItem = (section: "experience" | "education" | "skills" | "languages", index: number) => {
    setResumeData((prev) => {
      const updated = { ...prev };
      
      if (section === "experience") {
        updated.experience = updated.experience.filter((_, i) => i !== index);
      } else if (section === "education") {
        updated.education = updated.education.filter((_, i) => i !== index);
      } else if (section === "skills") {
        updated.skills = updated.skills.filter((_, i) => i !== index);
      } else if (section === "languages") {
        updated.languages = updated.languages.filter((_, i) => i !== index);
      }
      
      return updated;
    });
  };

  const saveResume = async () => {
    if (!session) {
      toast({
        title: "Authentication required",
        description: "Please sign in to save your resume",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    setIsSaving(true);
    
    try {
      const contentToSave = JSON.parse(JSON.stringify(resumeData));
      
      const resumeId = searchParams.get("id");
      
      if (resumeId) {
        const { error } = await supabase
          .from("resumes")
          .update({
            title: resumeData.personal.name ? `${resumeData.personal.name}'s Resume` : "Untitled Resume",
            content: contentToSave,
            updated_at: new Date().toISOString(),
          })
          .eq("id", resumeId)
          .eq("user_id", session.user.id);

        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Your resume has been updated",
        });
      } else {
        const { error } = await supabase
          .from("resumes")
          .insert({
            user_id: session.user.id,
            title: resumeData.personal.name ? `${resumeData.personal.name}'s Resume` : "Untitled Resume",
            content: contentToSave,
            template: templateName,
          });

        if (error) throw error;
        
        toast({
          title: "Success",
          description: "Your resume has been saved",
        });
      }
      
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Error saving resume:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to save resume",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const downloadResume = async () => {
    if (!resumeRef.current) return;
    
    setIsDownloading(true);
    
    try {
      const canvas = await html2canvas(resumeRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
      });
      
      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      const ratio = canvas.width / canvas.height;
      const imgWidth = pdfWidth;
      const imgHeight = pdfWidth / ratio;
      
      pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight);
      
      const fileName = resumeData.personal.name
        ? `${resumeData.personal.name.replace(/\s+/g, '_')}_Resume.pdf`
        : 'SVWISS_Resume.pdf';
        
      pdf.save(fileName);
      
      toast({
        title: "Download complete",
        description: "Your resume has been downloaded successfully",
      });
    } catch (error) {
      console.error("Error downloading resume:", error);
      toast({
        title: "Download failed",
        description: "There was an error generating your PDF. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDownloading(false);
    }
  };

  const shareResume = (platform: string) => {
    const title = resumeData.personal.name 
      ? `${resumeData.personal.name}'s Resume` 
      : 'SVWISS Resume';
    const url = window.location.href;
    
    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'email':
        window.open(`mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`Check out this resume: ${url}`)}`, '_blank');
        break;
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(`${title}: ${url}`)}`, '_blank');
        break;
      default:
        navigator.clipboard.writeText(url).then(() => {
          toast({
            title: "Link copied",
            description: "Resume link copied to clipboard",
          });
        });
        break;
    }
    
    setShareDialogOpen(false);
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !session) return;
    
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${session.user.id}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `resume-photos/${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('resume-assets')
        .upload(filePath, file);
        
      if (uploadError) throw uploadError;
      
      const { data } = supabase.storage
        .from('resume-assets')
        .getPublicUrl(filePath);
        
      if (data) {
        setResumeData(prev => ({
          ...prev,
          personal: {
            ...prev.personal,
            photo: data.publicUrl
          }
        }));
        
        toast({
          title: "Photo uploaded",
          description: "Your photo has been uploaded successfully",
        });
      }
    } catch (error) {
      console.error("Error uploading photo:", error);
      toast({
        title: "Upload failed",
        description: "There was an error uploading your photo. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center h-[60vh]">
          <div className="flex flex-col items-center">
            <Loader2 className="h-12 w-12 animate-spin text-swiss-red" />
            <p className="mt-4 text-lg">Loading resume data...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="py-6 md:py-12">
        <div className="container mx-auto px-4">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center">
              <Button
                variant="outline"
                size="sm"
                className="mr-4"
                onClick={() => navigate(-1)}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <h1 className="text-2xl md:text-3xl font-bold">Resume Editor</h1>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="outline"
                onClick={saveResume}
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save
                  </>
                )}
              </Button>
              
              <Button 
                variant="outline"
                onClick={() => setShareDialogOpen(true)}
              >
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
              
              <Button onClick={downloadResume} disabled={isDownloading}>
                {isDownloading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <Card>
                <CardContent className="p-4">
                  <h2 className="text-xl font-semibold mb-2">Template: {templateName}</h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                    You're using the {templateName} template. Your changes will be reflected in real-time.
                  </p>
                  
                  <div className="mb-4">
                    <div className="flex items-center">
                      <Label htmlFor="show-photo" className="mr-2">Include Photo</Label>
                      <input 
                        type="checkbox" 
                        id="show-photo" 
                        checked={showPhoto} 
                        onChange={(e) => setShowPhoto(e.target.checked)}
                        className="h-4 w-4 rounded border-gray-300"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Toggle to include or exclude a photo in your resume
                    </p>
                  </div>
                  
                  <div className="aspect-[8.5/11] bg-white dark:bg-gray-800 rounded-md border overflow-hidden">
                    <div className="h-full w-full p-6 flex flex-col" ref={resumeRef}>
                      <div className="text-center mb-4">
                        {showPhoto && resumeData.personal.photo && (
                          <div className="flex justify-center mb-2">
                            <img 
                              src={resumeData.personal.photo} 
                              alt="Profile"
                              className="w-20 h-20 rounded-full object-cover border-2 border-swiss-red"
                            />
                          </div>
                        )}
                        <h2 className="text-lg font-bold">
                          {resumeData.personal.name || "Your Name"}
                        </h2>
                        <p className="text-sm">
                          {resumeData.personal.title || "Professional Title"}
                        </p>
                      </div>
                      <div className="flex-1 overflow-hidden text-xs">
                        <div className="mb-2">
                          <h3 className="font-semibold">Contact</h3>
                          <p>{resumeData.personal.email || "email@example.com"}</p>
                          <p>{resumeData.personal.phone || "123-456-7890"}</p>
                          {resumeData.personal.address && <p>{resumeData.personal.address}</p>}
                        </div>
                        <div className="mb-2">
                          <h3 className="font-semibold">Experience</h3>
                          {resumeData.experience.map((exp, i) => (
                            <div key={i} className="mb-1">
                              {exp.title && <p>{exp.title} at {exp.company}</p>}
                            </div>
                          ))}
                        </div>
                        <div className="mb-2">
                          <h3 className="font-semibold">Education</h3>
                          {resumeData.education.map((edu, i) => (
                            <div key={i} className="mb-1">
                              {edu.degree && <p>{edu.degree} - {edu.institution}</p>}
                            </div>
                          ))}
                        </div>
                        <div className="mb-2">
                          <h3 className="font-semibold">Skills</h3>
                          <div className="flex flex-wrap">
                            {resumeData.skills.map((skill, i) => (
                              skill && <span key={i} className="mr-1">{skill},</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="md:col-span-2">
              <Tabs defaultValue="personal" className="w-full">
                <TabsList className="grid grid-cols-5 md:grid-cols-5 mb-4">
                  <TabsTrigger value="personal">Personal</TabsTrigger>
                  <TabsTrigger value="experience">Experience</TabsTrigger>
                  <TabsTrigger value="education">Education</TabsTrigger>
                  <TabsTrigger value="skills">Skills</TabsTrigger>
                  <TabsTrigger value="languages">Languages</TabsTrigger>
                </TabsList>

                <TabsContent value="personal" className="space-y-4 p-4 bg-white dark:bg-gray-800 rounded-md border">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={resumeData.personal.name}
                        onChange={(e) => handleInputChange("personal", "name", e.target.value)}
                        placeholder="John Doe"
                      />
                    </div>
                    <div>
                      <Label htmlFor="title">Professional Title</Label>
                      <Input
                        id="title"
                        value={resumeData.personal.title}
                        onChange={(e) => handleInputChange("personal", "title", e.target.value)}
                        placeholder="Software Engineer"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={resumeData.personal.email}
                        onChange={(e) => handleInputChange("personal", "email", e.target.value)}
                        placeholder="john.doe@example.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={resumeData.personal.phone}
                        onChange={(e) => handleInputChange("personal", "phone", e.target.value)}
                        placeholder="+41 123 456 789"
                      />
                    </div>
                    <div>
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        value={resumeData.personal.address}
                        onChange={(e) => handleInputChange("personal", "address", e.target.value)}
                        placeholder="123 Main St, Zurich, Switzerland"
                      />
                    </div>
                    
                    {showPhoto && (
                      <div>
                        <Label htmlFor="photo">Photo</Label>
                        <div className="flex items-center space-x-4">
                          {resumeData.personal.photo && (
                            <img 
                              src={resumeData.personal.photo} 
                              alt="Profile" 
                              className="w-16 h-16 rounded-full object-cover"
                            />
                          )}
                          <Input
                            id="photo"
                            type="file"
                            accept="image/*"
                            onChange={handlePhotoUpload}
                          />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          Recommended: Square image, at least 300x300px
                        </p>
                      </div>
                    )}
                    
                    <div>
                      <Label htmlFor="summary">Professional Summary</Label>
                      <Textarea
                        id="summary"
                        value={resumeData.summary}
                        onChange={(e) => handleInputChange("summary", "", e.target.value)}
                        placeholder="A brief summary of your professional background and career goals..."
                        rows={4}
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="experience" className="space-y-6 p-4 bg-white dark:bg-gray-800 rounded-md border">
                  {resumeData.experience.map((exp, index) => (
                    <div key={index} className="space-y-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium">Experience #{index + 1}</h3>
                        {resumeData.experience.length > 1 && (
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => removeItem("experience", index)}
                          >
                            Remove
                          </Button>
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor={`job-title-${index}`}>Job Title</Label>
                          <Input
                            id={`job-title-${index}`}
                            value={exp.title}
                            onChange={(e) => handleInputChange("experience", "title", e.target.value, index)}
                            placeholder="Software Engineer"
                          />
                        </div>
                        <div>
                          <Label htmlFor={`company-${index}`}>Company</Label>
                          <Input
                            id={`company-${index}`}
                            value={exp.company}
                            onChange={(e) => handleInputChange("experience", "company", e.target.value, index)}
                            placeholder="Acme Inc."
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor={`location-${index}`}>Location</Label>
                        <Input
                          id={`location-${index}`}
                          value={exp.location}
                          onChange={(e) => handleInputChange("experience", "location", e.target.value, index)}
                          placeholder="Zurich, Switzerland"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor={`start-date-${index}`}>Start Date</Label>
                          <Input
                            id={`start-date-${index}`}
                            value={exp.startDate}
                            onChange={(e) => handleInputChange("experience", "startDate", e.target.value, index)}
                            placeholder="Jan 2020"
                          />
                        </div>
                        <div>
                          <Label htmlFor={`end-date-${index}`}>End Date</Label>
                          <Input
                            id={`end-date-${index}`}
                            value={exp.endDate}
                            onChange={(e) => handleInputChange("experience", "endDate", e.target.value, index)}
                            placeholder="Present"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor={`description-${index}`}>Description</Label>
                        <Textarea
                          id={`description-${index}`}
                          value={exp.description}
                          onChange={(e) => handleInputChange("experience", "description", e.target.value, index)}
                          placeholder="Describe your responsibilities and achievements..."
                          rows={3}
                        />
                      </div>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    onClick={() => addItem("experience")}
                    className="w-full"
                  >
                    Add Experience
                  </Button>
                </TabsContent>

                <TabsContent value="education" className="space-y-6 p-4 bg-white dark:bg-gray-800 rounded-md border">
                  {resumeData.education.map((edu, index) => (
                    <div key={index} className="space-y-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium">Education #{index + 1}</h3>
                        {resumeData.education.length > 1 && (
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => removeItem("education", index)}
                          >
                            Remove
                          </Button>
                        )}
                      </div>
                      <div>
                        <Label htmlFor={`degree-${index}`}>Degree / Certificate</Label>
                        <Input
                          id={`degree-${index}`}
                          value={edu.degree}
                          onChange={(e) => handleInputChange("education", "degree", e.target.value, index)}
                          placeholder="Bachelor of Science in Computer Science"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`institution-${index}`}>Institution</Label>
                        <Input
                          id={`institution-${index}`}
                          value={edu.institution}
                          onChange={(e) => handleInputChange("education", "institution", e.target.value, index)}
                          placeholder="University of Zurich"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`edu-location-${index}`}>Location</Label>
                        <Input
                          id={`edu-location-${index}`}
                          value={edu.location}
                          onChange={(e) => handleInputChange("education", "location", e.target.value, index)}
                          placeholder="Zurich, Switzerland"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor={`edu-start-date-${index}`}>Start Date</Label>
                          <Input
                            id={`edu-start-date-${index}`}
                            value={edu.startDate}
                            onChange={(e) => handleInputChange("education", "startDate", e.target.value, index)}
                            placeholder="Sep 2016"
                          />
                        </div>
                        <div>
                          <Label htmlFor={`edu-end-date-${index}`}>End Date</Label>
                          <Input
                            id={`edu-end-date-${index}`}
                            value={edu.endDate}
                            onChange={(e) => handleInputChange("education", "endDate", e.target.value, index)}
                            placeholder="Jun 2020"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    onClick={() => addItem("education")}
                    className="w-full"
                  >
                    Add Education
                  </Button>
                </TabsContent>

                <TabsContent value="skills" className="space-y-6 p-4 bg-white dark:bg-gray-800 rounded-md border">
                  <div className="space-y-4">
                    <h3 className="font-medium">Skills</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Add your professional skills and competencies
                    </p>
                    {resumeData.skills.map((skill, index) => (
                      <div key={index} className="flex space-x-2">
                        <Input
                          value={skill}
                          onChange={(e) => handleInputChange("skills", "", e.target.value, index)}
                          placeholder={`Skill ${index + 1}`}
                        />
                        {resumeData.skills.length > 1 && (
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => removeItem("skills", index)}
                          >
                            &times;
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      onClick={() => addItem("skills")}
                      className="w-full"
                    >
                      Add Skill
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="languages" className="space-y-6 p-4 bg-white dark:bg-gray-800 rounded-md border">
                  {resumeData.languages.map((lang, index) => (
                    <div key={index} className="space-y-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium">Language #{index + 1}</h3>
                        {resumeData.languages.length > 1 && (
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => removeItem("languages", index)}
                          >
                            Remove
                          </Button>
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor={`language-${index}`}>Language</Label>
                          <Input
                            id={`language-${index}`}
                            value={lang.language}
                            onChange={(e) => handleInputChange("languages", "language", e.target.value, index)}
                            placeholder="English"
                          />
                        </div>
                        <div>
                          <Label htmlFor={`proficiency-${index}`}>Proficiency</Label>
                          <Input
                            id={`proficiency-${index}`}
                            value={lang.proficiency}
                            onChange={(e) => handleInputChange("languages", "proficiency", e.target.value, index)}
                            placeholder="Native / Fluent / Intermediate / Basic"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    onClick={() => addItem("languages")}
                    className="w-full"
                  >
                    Add Language
                  </Button>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
      
      <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share your resume</DialogTitle>
            <DialogDescription>
              Share your resume with others via social media or email.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <Button variant="outline" onClick={() => shareResume('facebook')} className="flex items-center justify-center">
              <Facebook className="mr-2 h-4 w-4" />
              Facebook
            </Button>
            <Button variant="outline" onClick={() => shareResume('twitter')} className="flex items-center justify-center">
              <Twitter className="mr-2 h-4 w-4" />
              Twitter
            </Button>
            <Button variant="outline" onClick={() => shareResume('email')} className="flex items-center justify-center">
              <Mail className="mr-2 h-4 w-4" />
              Email
            </Button>
            <Button variant="outline" onClick={() => shareResume('whatsapp')} className="flex items-center justify-center">
              <Phone className="mr-2 h-4 w-4" />
              WhatsApp
            </Button>
            <Button variant="secondary" onClick={() => shareResume('copy')} className="col-span-2">
              Copy Link
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default ResumeEditor;
