
import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Briefcase, Building, ExternalLink, MapPin, Search } from "lucide-react";

interface JobListing {
  title: string;
  company: string;
  location: string;
  type: string;
  description: string;
  link: string;
  industry: string;
}

const jobListings: JobListing[] = [
  {
    title: "Front-end Developer",
    company: "Tech Solutions AG",
    location: "Zurich",
    type: "Full-time",
    description: "Join our team to develop modern web applications using React and TypeScript.",
    link: "https://www.jobs.ch/en/vacancies/",
    industry: "technology"
  },
  {
    title: "Warehouse Associate",
    company: "Swiss Logistics",
    location: "Basel",
    type: "Full-time",
    description: "Looking for motivated warehouse workers to join our expanding logistics center.",
    link: "https://www.jobs.ch/en/vacancies/",
    industry: "logistics"
  },
  {
    title: "Hotel Receptionist",
    company: "Grand Hotel Zurich",
    location: "Zurich",
    type: "Part-time",
    description: "Customer-focused receptionist needed for our 5-star hotel in central Zurich.",
    link: "https://www.jobs.ch/en/vacancies/",
    industry: "hospitality"
  },
  {
    title: "Construction Worker",
    company: "Swiss Build & Co",
    location: "Bern",
    type: "Full-time",
    description: "Experienced construction workers needed for commercial building projects.",
    link: "https://www.jobs.ch/en/vacancies/",
    industry: "construction"
  },
  {
    title: "Flight Attendant",
    company: "Swiss Air",
    location: "Zurich",
    type: "Full-time",
    description: "Join our cabin crew team to provide exceptional service to our passengers.",
    link: "https://www.swiss.com/careers/en/jobs",
    industry: "aviation"
  },
  {
    title: "Office Cleaner",
    company: "CleanPro Switzerland",
    location: "Geneva",
    type: "Part-time",
    description: "Evening office cleaning positions available in the Geneva business district.",
    link: "https://www.jobs.ch/en/vacancies/",
    industry: "cleaning"
  },
  {
    title: "Financial Analyst",
    company: "Swiss Banking Group",
    location: "Zurich",
    type: "Full-time",
    description: "Financial analyst position within our investment banking division.",
    link: "https://www.ubs.com/global/en/careers.html",
    industry: "finance"
  },
  {
    title: "Delivery Driver",
    company: "Express Delivery",
    location: "Multiple Locations",
    type: "Flexible",
    description: "Delivery drivers needed for package delivery across Switzerland.",
    link: "https://www.jobs.ch/en/vacancies/",
    industry: "logistics"
  }
];

const jobSites = [
  {
    name: "jobs.ch",
    description: "Switzerland's largest job platform",
    url: "https://www.jobs.ch/en/",
    industries: ["All industries"]
  },
  {
    name: "JobScout24",
    description: "Wide range of jobs across Switzerland",
    url: "https://www.jobscout24.ch/en",
    industries: ["All industries"]
  },
  {
    name: "Swiss Air Careers",
    description: "Aviation and airline job opportunities",
    url: "https://www.swiss.com/careers/en/jobs",
    industries: ["Aviation", "Hospitality"]
  },
  {
    name: "UBS Careers",
    description: "Banking and finance positions",
    url: "https://www.ubs.com/global/en/careers.html",
    industries: ["Finance", "Banking"]
  },
  {
    name: "Credit Suisse Careers",
    description: "Financial services job opportunities",
    url: "https://www.credit-suisse.com/careers/en/apply.html",
    industries: ["Finance", "Banking"]
  },
  {
    name: "Swisscom Jobs",
    description: "Telecommunications and IT positions",
    url: "https://www.swisscom.ch/en/about/jobs.html",
    industries: ["Technology", "Telecommunications"]
  },
  {
    name: "Migros Careers",
    description: "Retail and food industry positions",
    url: "https://www.migrosjobs.ch/en/home",
    industries: ["Retail", "Food Service"]
  },
  {
    name: "Coop Jobs",
    description: "Retail and distribution positions",
    url: "https://www.coop.ch/en/jobs",
    industries: ["Retail", "Logistics"]
  }
];

const JobsPage = () => {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedIndustry, setSelectedIndustry] = React.useState("all");

  const filteredJobs = jobListings.filter(job => {
    const matchesSearch = 
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.location.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesIndustry = 
      selectedIndustry === "all" || 
      job.industry === selectedIndustry;
    
    return matchesSearch && matchesIndustry;
  });

  const industries = ["all", ...new Set(jobListings.map(job => job.industry))];

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-2">Find Jobs in Switzerland</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Browse job listings and resources to help with your job search
        </p>

        <Tabs defaultValue="jobs" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="jobs">Job Listings</TabsTrigger>
            <TabsTrigger value="resources">Job Sites & Resources</TabsTrigger>
          </TabsList>

          <TabsContent value="jobs">
            <div className="mb-6">
              <div className="flex flex-col md:flex-row gap-4 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search jobs by title, company or location"
                    className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-700 rounded-md"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <select
                  className="px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-transparent"
                  value={selectedIndustry}
                  onChange={(e) => setSelectedIndustry(e.target.value)}
                >
                  {industries.map((industry) => (
                    <option key={industry} value={industry}>
                      {industry.charAt(0).toUpperCase() + industry.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredJobs.length > 0 ? (
                  filteredJobs.map((job, index) => (
                    <Card key={index} className="overflow-hidden hover:shadow-md transition-shadow">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle>{job.title}</CardTitle>
                            <CardDescription className="flex items-center mt-1">
                              <Building className="h-4 w-4 mr-1" /> {job.company}
                            </CardDescription>
                          </div>
                          <Badge variant={job.type === "Full-time" ? "default" : "outline"}>
                            {job.type}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm mb-2">
                          <MapPin className="h-4 w-4 mr-1" /> {job.location}
                        </div>
                        <p className="text-sm mb-4">{job.description}</p>
                        <div className="flex justify-between items-center">
                          <Badge variant="secondary" className="capitalize">
                            {job.industry}
                          </Badge>
                          <a 
                            href={job.link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-swiss-red hover:underline text-sm"
                          >
                            Apply now <ExternalLink className="h-3 w-3 ml-1" />
                          </a>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-full flex justify-center py-8">
                    <p className="text-gray-500 dark:text-gray-400">No jobs found matching your criteria</p>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-8 text-center">
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Looking for more job opportunities? Check out these popular job sites in Switzerland
              </p>
              <Button variant="outline" className="mx-auto" onClick={() => document.querySelector('[data-value="resources"]')?.click()}>
                View Job Resources
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="resources">
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-4">Popular Job Sites in Switzerland</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {jobSites.map((site, index) => (
                  <Card key={index} className="overflow-hidden hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                      <CardTitle>{site.name}</CardTitle>
                      <CardDescription>{site.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-2 mb-4">
                          {site.industries.map((industry, i) => (
                            <Badge key={i} variant="secondary">
                              {industry}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <a 
                        href={site.url} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="inline-flex items-center text-swiss-red hover:underline text-sm"
                      >
                        Visit website <ExternalLink className="h-3 w-3 ml-1" />
                      </a>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h2 className="text-xl font-semibold mb-2">Resume Tips for Swiss Job Applications</h2>
              <p className="mb-4 text-gray-600 dark:text-gray-400">
                Stand out in the Swiss job market with these resume tips:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-gray-600 dark:text-gray-400">
                <li>Include a professional photo (passport-style) in the top corner of your resume</li>
                <li>List your language skills with proficiency levels (e.g., German: C1, English: Native)</li>
                <li>Include your date of birth and nationality (common practice in Switzerland)</li>
                <li>Explicitly state your work permit status if you're not Swiss</li>
                <li>Keep your resume to a maximum of 2 pages</li>
                <li>Include references or state "References available upon request"</li>
              </ul>
              <div className="mt-6">
                <Button className="bg-swiss-red hover:bg-swiss-red/90" onClick={() => navigate('/templates')}>
                  <Briefcase className="mr-2 h-4 w-4" />
                  Create Your Swiss Resume
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default JobsPage;
