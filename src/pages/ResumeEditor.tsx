
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Download, Eye, Save, Plus, Trash2, MoveVertical, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

// Simple Resume Preview Component
const ResumePreview = ({ formData }: { formData: any }) => {
  return (
    <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-[21cm] mx-auto">
      {/* Header */}
      <div className="border-b pb-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          {formData.personalInfo.firstName} {formData.personalInfo.lastName}
        </h1>
        <p className="text-lg text-gray-600">{formData.personalInfo.jobTitle}</p>
        
        <div className="mt-2 text-sm text-gray-500 flex flex-wrap items-center gap-x-4 gap-y-1">
          {formData.personalInfo.email && (
            <span className="inline-flex items-center">
              {formData.personalInfo.email}
            </span>
          )}
          {formData.personalInfo.phone && (
            <span className="inline-flex items-center">
              {formData.personalInfo.phone}
            </span>
          )}
          {formData.personalInfo.location && (
            <span className="inline-flex items-center">
              {formData.personalInfo.location}
            </span>
          )}
        </div>
      </div>
      
      {/* Summary */}
      {formData.summary && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">Professional Summary</h2>
          <p className="text-gray-700">{formData.summary}</p>
        </div>
      )}
      
      {/* Work Experience */}
      {formData.experience.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Work Experience</h2>
          <div className="space-y-4">
            {formData.experience.map((exp: any, i: number) => (
              <div key={i} className="pb-3 border-b border-gray-100 last:border-0">
                <div className="flex justify-between mb-1">
                  <h3 className="font-medium text-gray-900">{exp.title}</h3>
                  <span className="text-sm text-gray-500">
                    {exp.startDate} - {exp.endDate || 'Present'}
                  </span>
                </div>
                <div className="text-gray-600 mb-2">{exp.company}, {exp.location}</div>
                <p className="text-sm text-gray-700">{exp.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Education */}
      {formData.education.length > 0 && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Education</h2>
          <div className="space-y-4">
            {formData.education.map((edu: any, i: number) => (
              <div key={i} className="pb-3 border-b border-gray-100 last:border-0">
                <div className="flex justify-between mb-1">
                  <h3 className="font-medium text-gray-900">{edu.degree}</h3>
                  <span className="text-sm text-gray-500">
                    {edu.startDate} - {edu.endDate || 'Present'}
                  </span>
                </div>
                <div className="text-gray-600 mb-2">{edu.institution}, {edu.location}</div>
                {edu.description && <p className="text-sm text-gray-700">{edu.description}</p>}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Skills */}
      {formData.skills.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Skills</h2>
          <div className="flex flex-wrap gap-2">
            {formData.skills.map((skill: string, i: number) => (
              <span 
                key={i}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// Editor component for experience items
const ExperienceEditor = ({ 
  experience, 
  updateExperience, 
  removeExperience 
}: { 
  experience: any[]; 
  updateExperience: (experiences: any[]) => void; 
  removeExperience: (index: number) => void; 
}) => {
  const handleChange = (index: number, field: string, value: string) => {
    const updatedExperience = [...experience];
    updatedExperience[index] = { ...updatedExperience[index], [field]: value };
    updateExperience(updatedExperience);
  };

  return (
    <div className="space-y-6">
      {experience.map((exp, index) => (
        <Card key={index} className="group relative">
          <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => removeExperience(index)}
              className="h-8 w-8 text-gray-500 hover:text-red-500"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
          <CardContent className="p-4 space-y-4">
            <div className="flex items-center gap-2 mb-2 text-gray-400">
              <MoveVertical className="h-4 w-4" />
              <span className="text-sm">Drag to reorder</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`job-title-${index}`}>Job Title</Label>
                <Input
                  id={`job-title-${index}`}
                  value={exp.title}
                  onChange={(e) => handleChange(index, 'title', e.target.value)}
                  placeholder="Software Engineer"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`company-${index}`}>Company</Label>
                <Input
                  id={`company-${index}`}
                  value={exp.company}
                  onChange={(e) => handleChange(index, 'company', e.target.value)}
                  placeholder="Company Name"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`location-${index}`}>Location</Label>
                <Input
                  id={`location-${index}`}
                  value={exp.location}
                  onChange={(e) => handleChange(index, 'location', e.target.value)}
                  placeholder="Zurich, Switzerland"
                />
              </div>
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <Label htmlFor={`start-date-${index}`}>Start Date</Label>
                    <Input
                      id={`start-date-${index}`}
                      value={exp.startDate}
                      onChange={(e) => handleChange(index, 'startDate', e.target.value)}
                      placeholder="MM/YYYY"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`end-date-${index}`}>End Date</Label>
                    <Input
                      id={`end-date-${index}`}
                      value={exp.endDate}
                      onChange={(e) => handleChange(index, 'endDate', e.target.value)}
                      placeholder="MM/YYYY or Present"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor={`description-${index}`}>Description</Label>
              <Textarea
                id={`description-${index}`}
                value={exp.description}
                onChange={(e) => handleChange(index, 'description', e.target.value)}
                placeholder="Describe your responsibilities and achievements"
                rows={4}
              />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

// Education editor component
const EducationEditor = ({ 
  education, 
  updateEducation, 
  removeEducation 
}: { 
  education: any[]; 
  updateEducation: (education: any[]) => void; 
  removeEducation: (index: number) => void; 
}) => {
  const handleChange = (index: number, field: string, value: string) => {
    const updatedEducation = [...education];
    updatedEducation[index] = { ...updatedEducation[index], [field]: value };
    updateEducation(updatedEducation);
  };

  return (
    <div className="space-y-6">
      {education.map((edu, index) => (
        <Card key={index} className="group relative">
          <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => removeEducation(index)}
              className="h-8 w-8 text-gray-500 hover:text-red-500"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
          <CardContent className="p-4 space-y-4">
            <div className="flex items-center gap-2 mb-2 text-gray-400">
              <MoveVertical className="h-4 w-4" />
              <span className="text-sm">Drag to reorder</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`degree-${index}`}>Degree</Label>
                <Input
                  id={`degree-${index}`}
                  value={edu.degree}
                  onChange={(e) => handleChange(index, 'degree', e.target.value)}
                  placeholder="Bachelor of Science in Computer Science"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`institution-${index}`}>Institution</Label>
                <Input
                  id={`institution-${index}`}
                  value={edu.institution}
                  onChange={(e) => handleChange(index, 'institution', e.target.value)}
                  placeholder="ETH Zurich"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`edu-location-${index}`}>Location</Label>
                <Input
                  id={`edu-location-${index}`}
                  value={edu.location}
                  onChange={(e) => handleChange(index, 'location', e.target.value)}
                  placeholder="Zurich, Switzerland"
                />
              </div>
              <div className="space-y-2">
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-2">
                    <Label htmlFor={`edu-start-date-${index}`}>Start Date</Label>
                    <Input
                      id={`edu-start-date-${index}`}
                      value={edu.startDate}
                      onChange={(e) => handleChange(index, 'startDate', e.target.value)}
                      placeholder="MM/YYYY"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`edu-end-date-${index}`}>End Date</Label>
                    <Input
                      id={`edu-end-date-${index}`}
                      value={edu.endDate}
                      onChange={(e) => handleChange(index, 'endDate', e.target.value)}
                      placeholder="MM/YYYY or Present"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor={`edu-description-${index}`}>Description (Optional)</Label>
              <Textarea
                id={`edu-description-${index}`}
                value={edu.description}
                onChange={(e) => handleChange(index, 'description', e.target.value)}
                placeholder="Notable achievements, activities, or relevant coursework"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

// Skills editor component
const SkillsEditor = ({ 
  skills, 
  updateSkills 
}: { 
  skills: string[]; 
  updateSkills: (skills: string[]) => void; 
}) => {
  const [newSkill, setNewSkill] = useState("");

  const addSkill = () => {
    if (newSkill.trim()) {
      updateSkills([...skills, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const removeSkill = (index: number) => {
    const updatedSkills = [...skills];
    updatedSkills.splice(index, 1);
    updateSkills(updatedSkills);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add a skill and press Enter"
        />
        <Button onClick={addSkill} type="button">Add</Button>
      </div>
      
      <div className="flex flex-wrap gap-2 mt-4">
        {skills.map((skill, index) => (
          <div 
            key={index} 
            className="bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full text-sm flex items-center gap-1 group"
          >
            {skill}
            <button 
              type="button"
              onClick={() => removeSkill(index)}
              className="text-gray-400 hover:text-red-500 p-1 rounded-full focus:outline-none"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

const ResumeEditor = () => {
  const { toast } = useToast();
  const [activeView, setActiveView] = useState("edit");
  const [formData, setFormData] = useState({
    title: "My Professional Resume",
    template: "modern",
    personalInfo: {
      firstName: "John",
      lastName: "Müller",
      jobTitle: "Senior Software Engineer",
      email: "john.mueller@example.ch",
      phone: "+41 76 123 45 67",
      location: "Zurich, Switzerland",
      linkedin: "",
      website: ""
    },
    summary: "Experienced software engineer with over 8 years of expertise in developing scalable applications, specializing in React, Node.js, and cloud architectures. Proven track record of leading technical teams and delivering high-quality software solutions in the financial technology sector.",
    experience: [
      {
        title: "Senior Software Engineer",
        company: "Swiss Financial Tech",
        location: "Zurich, Switzerland",
        startDate: "01/2020",
        endDate: "Present",
        description: "Lead the development of mission-critical payment processing systems serving over 500,000 users. Implemented microservices architecture that improved system reliability by 35%. Mentored junior developers and established code quality standards."
      },
      {
        title: "Software Developer",
        company: "Digi Solutions GmbH",
        location: "Bern, Switzerland",
        startDate: "03/2016",
        endDate: "12/2019",
        description: "Developed and maintained web applications for enterprise clients using React and Node.js. Implemented CI/CD pipelines that reduced deployment time by 40%. Collaborated with cross-functional teams to deliver projects on schedule."
      }
    ],
    education: [
      {
        degree: "Master of Science in Computer Science",
        institution: "ETH Zurich",
        location: "Zurich, Switzerland",
        startDate: "09/2014",
        endDate: "06/2016",
        description: "Focus on distributed systems and software engineering."
      },
      {
        degree: "Bachelor of Science in Computer Science",
        institution: "University of Bern",
        location: "Bern, Switzerland",
        startDate: "09/2011",
        endDate: "06/2014",
        description: ""
      }
    ],
    skills: [
      "JavaScript", "TypeScript", "React", "Node.js", "AWS", "Docker", "Kubernetes", "GraphQL", "REST APIs", "Agile Methodologies", "CI/CD", "Team Leadership"
    ],
    isPublic: false
  });

  // Handle changes to personal information
  const handlePersonalInfoChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      personalInfo: {
        ...formData.personalInfo,
        [field]: value
      }
    });
  };

  // Handle changes to the basic info (title, template, etc.)
  const handleBasicInfoChange = (field: string, value: string | boolean) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };

  // Add new experience entry
  const addExperience = () => {
    setFormData({
      ...formData,
      experience: [
        ...formData.experience,
        {
          title: "",
          company: "",
          location: "",
          startDate: "",
          endDate: "",
          description: ""
        }
      ]
    });
  };

  // Update experience entries
  const updateExperience = (experiences: any[]) => {
    setFormData({
      ...formData,
      experience: experiences
    });
  };

  // Remove experience entry
  const removeExperience = (index: number) => {
    const updatedExperience = [...formData.experience];
    updatedExperience.splice(index, 1);
    setFormData({
      ...formData,
      experience: updatedExperience
    });
  };

  // Add new education entry
  const addEducation = () => {
    setFormData({
      ...formData,
      education: [
        ...formData.education,
        {
          degree: "",
          institution: "",
          location: "",
          startDate: "",
          endDate: "",
          description: ""
        }
      ]
    });
  };

  // Update education entries
  const updateEducation = (education: any[]) => {
    setFormData({
      ...formData,
      education: education
    });
  };

  // Remove education entry
  const removeEducation = (index: number) => {
    const updatedEducation = [...formData.education];
    updatedEducation.splice(index, 1);
    setFormData({
      ...formData,
      education: updatedEducation
    });
  };

  // Update skills
  const updateSkills = (skills: string[]) => {
    setFormData({
      ...formData,
      skills: skills
    });
  };

  // Handle save
  const handleSave = () => {
    toast({
      title: "Resume saved",
      description: "Your resume has been saved successfully.",
    });
  };

  // Handle download
  const handleDownload = () => {
    toast({
      title: "Download initiated",
      description: "Download functionality will be implemented in the next phase.",
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/dashboard" className="text-gray-500 hover:text-gray-900 dark:hover:text-gray-300">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <Input
              value={formData.title}
              onChange={(e) => handleBasicInfoChange('title', e.target.value)}
              className="w-64 h-9 text-lg font-medium"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="hidden sm:flex sm:space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setActiveView(activeView === "edit" ? "preview" : "edit")}
              >
                {activeView === "edit" ? (
                  <>
                    <Eye className="h-4 w-4 mr-2" />
                    Preview
                  </>
                ) : (
                  <>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </>
                )}
              </Button>
              
              <Button variant="ghost" size="sm" onClick={handleDownload}>
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>
            
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
          </div>
        </div>
      </header>
      
      {/* Mobile View Toggle */}
      <div className="sm:hidden bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-4 py-2">
          <Tabs value={activeView} onValueChange={setActiveView} className="w-full">
            <TabsList className="w-full">
              <TabsTrigger value="edit" className="flex-1">Edit</TabsTrigger>
              <TabsTrigger value="preview" className="flex-1">Preview</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Edit Panel */}
        {activeView === "edit" && (
          <div className="w-full md:w-1/2 lg:w-2/5 overflow-y-auto border-r border-gray-200 dark:border-gray-800">
            <div className="p-6 space-y-8">
              <Tabs defaultValue="personal" className="w-full">
                <TabsList className="mb-6 grid grid-cols-5 gap-2">
                  <TabsTrigger value="personal">Personal</TabsTrigger>
                  <TabsTrigger value="summary">Summary</TabsTrigger>
                  <TabsTrigger value="experience">Experience</TabsTrigger>
                  <TabsTrigger value="education">Education</TabsTrigger>
                  <TabsTrigger value="skills">Skills</TabsTrigger>
                </TabsList>
                
                {/* Personal Info Tab */}
                <TabsContent value="personal" className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="first-name">First Name</Label>
                      <Input
                        id="first-name"
                        value={formData.personalInfo.firstName}
                        onChange={(e) => handlePersonalInfoChange('firstName', e.target.value)}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="last-name">Last Name</Label>
                      <Input
                        id="last-name"
                        value={formData.personalInfo.lastName}
                        onChange={(e) => handlePersonalInfoChange('lastName', e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="job-title">Job Title</Label>
                    <Input
                      id="job-title"
                      value={formData.personalInfo.jobTitle}
                      onChange={(e) => handlePersonalInfoChange('jobTitle', e.target.value)}
                      placeholder="e.g. Senior Software Engineer"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.personalInfo.email}
                      onChange={(e) => handlePersonalInfoChange('email', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={formData.personalInfo.phone}
                      onChange={(e) => handlePersonalInfoChange('phone', e.target.value)}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={formData.personalInfo.location}
                      onChange={(e) => handlePersonalInfoChange('location', e.target.value)}
                      placeholder="e.g. Zurich, Switzerland"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="linkedin">LinkedIn (Optional)</Label>
                    <Input
                      id="linkedin"
                      value={formData.personalInfo.linkedin}
                      onChange={(e) => handlePersonalInfoChange('linkedin', e.target.value)}
                      placeholder="e.g. linkedin.com/in/yourprofile"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="website">Website (Optional)</Label>
                    <Input
                      id="website"
                      value={formData.personalInfo.website}
                      onChange={(e) => handlePersonalInfoChange('website', e.target.value)}
                      placeholder="e.g. yourwebsite.com"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between space-x-2 pt-4 border-t">
                    <div className="space-y-0.5">
                      <Label htmlFor="public-resume">Public Resume</Label>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Allow others to view your resume via a shareable link
                      </p>
                    </div>
                    <Switch
                      id="public-resume"
                      checked={formData.isPublic}
                      onCheckedChange={(checked) => handleBasicInfoChange('isPublic', checked)}
                    />
                  </div>
                </TabsContent>
                
                {/* Summary Tab */}
                <TabsContent value="summary" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="summary">Professional Summary</Label>
                    <Textarea
                      id="summary"
                      value={formData.summary}
                      onChange={(e) => handleBasicInfoChange('summary', e.target.value)}
                      placeholder="A brief overview of your professional background and key strengths"
                      rows={6}
                    />
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Keep your summary concise and impactful, around 3-5 sentences.
                    </p>
                  </div>
                </TabsContent>
                
                {/* Experience Tab */}
                <TabsContent value="experience" className="space-y-6">
                  <ExperienceEditor
                    experience={formData.experience}
                    updateExperience={updateExperience}
                    removeExperience={removeExperience}
                  />
                  
                  <Button
                    onClick={addExperience}
                    variant="outline"
                    className="w-full"
                    type="button"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Experience
                  </Button>
                </TabsContent>
                
                {/* Education Tab */}
                <TabsContent value="education" className="space-y-6">
                  <EducationEditor
                    education={formData.education}
                    updateEducation={updateEducation}
                    removeEducation={removeEducation}
                  />
                  
                  <Button
                    onClick={addEducation}
                    variant="outline"
                    className="w-full"
                    type="button"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Education
                  </Button>
                </TabsContent>
                
                {/* Skills Tab */}
                <TabsContent value="skills" className="space-y-4">
                  <div className="space-y-2">
                    <Label>Skills</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Add relevant skills that showcase your expertise
                    </p>
                  </div>
                  
                  <SkillsEditor
                    skills={formData.skills}
                    updateSkills={updateSkills}
                  />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        )}
        
        {/* Preview Panel (always visible on larger screens, toggleable on mobile) */}
        {(activeView === "preview" || window.innerWidth >= 768) && (
          <div className={`flex-1 bg-gray-50 dark:bg-gray-900 p-8 overflow-auto ${
            activeView === "edit" && window.innerWidth < 768 ? "hidden" : ""
          }`}>
            <div className="max-w-[21cm] mx-auto bg-white shadow-xl rounded-lg overflow-hidden transform transition-transform duration-300 hover:scale-[1.01]">
              <div className="sticky top-0 z-10 bg-white border-b p-4 flex justify-between items-center">
                <div className="text-sm text-gray-500">
                  <Select defaultValue={formData.template}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select template" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="modern">Modern</SelectItem>
                      <SelectItem value="classic">Classic</SelectItem>
                      <SelectItem value="minimalist">Minimalist</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button variant="outline" size="sm" onClick={handleDownload}>
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
              </div>
              
              <div className="p-1">
                <ResumePreview formData={formData} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeEditor;
