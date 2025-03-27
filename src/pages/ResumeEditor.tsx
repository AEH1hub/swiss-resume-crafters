
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Save, Download, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ResumeData {
  personal: {
    name: string;
    title: string;
    email: string;
    phone: string;
    address: string;
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
    address: ""
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
  const [session, setSession] = useState<any>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

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
      const { data, error } = await supabase
        .from("resumes")
        .insert({
          user_id: session.user.id,
          title: resumeData.personal.name ? `${resumeData.personal.name}'s Resume` : "Untitled Resume",
          content: resumeData,
          template: templateName,
        })
        .select();

      if (error) {
        throw error;
      }

      toast({
        title: "Success",
        description: "Your resume has been saved",
      });
      
      // Navigate to dashboard or preview
      navigate("/dashboard");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save resume",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const downloadResume = () => {
    // In a real app, this would generate a PDF
    toast({
      title: "Download initiated",
      description: "Your resume is being prepared for download",
    });
  };

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
              <Button onClick={downloadResume}>
                <Download className="mr-2 h-4 w-4" />
                Download
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
                  <div className="aspect-[8.5/11] bg-white dark:bg-gray-800 rounded-md border overflow-hidden">
                    {/* Template preview would be here */}
                    <div className="h-full w-full p-6 flex flex-col">
                      <div className="text-center mb-4">
                        <h2 className="text-lg font-bold">
                          {resumeData.personal.name || "Your Name"}
                        </h2>
                        <p className="text-sm">
                          {resumeData.personal.title || "Professional Title"}
                        </p>
                      </div>
                      {/* Simple preview of resume content */}
                      <div className="flex-1 overflow-hidden text-xs">
                        <div className="mb-2">
                          <h3 className="font-semibold">Contact</h3>
                          <p>{resumeData.personal.email || "email@example.com"}</p>
                          <p>{resumeData.personal.phone || "123-456-7890"}</p>
                        </div>
                        <div className="mb-2">
                          <h3 className="font-semibold">Experience</h3>
                          {resumeData.experience.map((exp, i) => (
                            <div key={i} className="mb-1">
                              {exp.title && <p>{exp.title} at {exp.company}</p>}
                            </div>
                          ))}
                        </div>
                        {/* More sections would be previewed here */}
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
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                    <div>
                      <Label htmlFor="address">Address</Label>
                      <Input
                        id="address"
                        value={resumeData.personal.address}
                        onChange={(e) => handleInputChange("personal", "address", e.target.value)}
                        placeholder="123 Main St, City, Country"
                      />
                    </div>
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
                          placeholder="City, Country"
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
                          placeholder="University of Example"
                        />
                      </div>
                      <div>
                        <Label htmlFor={`edu-location-${index}`}>Location</Label>
                        <Input
                          id={`edu-location-${index}`}
                          value={edu.location}
                          onChange={(e) => handleInputChange("education", "location", e.target.value, index)}
                          placeholder="City, Country"
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
    </MainLayout>
  );
};

export default ResumeEditor;
