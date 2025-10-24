import { useState, useEffect } from "react";
import { Link } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { NewsPost } from "@shared/schema";
import {
  GraduationCap,
  Users,
  BookOpen,
  TrendingUp,
  Award,
  Target,
  Heart,
  Lightbulb,
  ChevronRight,
  MapPin,
  Mail,
  Phone,
  Calendar,
  Clock,
  CheckCircle2,
  ChevronDown,
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Menu,
  X,
  Loader2,
} from "lucide-react";
import logoImage from "@assets/logo_1761155635320.jpg";

// Placeholder images - these can be updated from the dashboard
const placeholderImage = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600'%3E%3Crect width='800' height='600' fill='%23e5e7eb'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='24' fill='%239ca3af'%3EImage Placeholder%3C/text%3E%3C/svg%3E";

export default function Home() {
  const { toast } = useToast();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [stats, setStats] = useState({
    years: 0,
    students: 0,
    programs: 0,
    successRate: 0,
  });
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  // Fetch news posts
  const { data: newsPosts = [], isLoading: newsLoading } = useQuery<NewsPost[]>({
    queryKey: ["/api/news"],
  });

  // Contact form submission
  const contactMutation = useMutation({
    mutationFn: async (data: typeof contactForm) => {
      return await apiRequest("POST", "/api/contact", data);
    },
    onSuccess: () => {
      toast({
        title: "Message Sent",
        description: "Thank you for contacting us. We'll get back to you soon!",
      });
      setContactForm({ name: "", email: "", phone: "", message: "" });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    },
  });

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const duration = 2000;
    const targets = { years: 25, students: 1200, programs: 5, successRate: 95 };
    const start = Date.now();

    const animate = () => {
      const now = Date.now();
      const progress = Math.min((now - start) / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);

      setStats({
        years: Math.floor(targets.years * easeOut),
        students: Math.floor(targets.students * easeOut),
        programs: Math.floor(targets.programs * easeOut),
        successRate: Math.floor(targets.successRate * easeOut),
      });

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          animate();
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );

    const statsElement = document.getElementById("stats-section");
    if (statsElement) observer.observe(statsElement);

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setMobileMenuOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "bg-background/95 backdrop-blur-sm shadow-md" : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-3">
              <img src={logoImage} alt="NVTI Kanda Logo" className="h-14 w-14" data-testid="img-logo" />
              <div className="hidden md:block">
                <div className="text-lg font-bold text-foreground">NVTI Kanda</div>
                <div className="text-xs text-muted-foreground">Career Training Institute</div>
              </div>
            </div>

            <nav className="hidden lg:flex items-center gap-1">
              <Button
                variant="ghost"
                onClick={() => scrollToSection("home")}
                data-testid="link-home"
                className="hover-elevate"
              >
                Home
              </Button>
              <Button
                variant="ghost"
                onClick={() => scrollToSection("about")}
                data-testid="link-about"
                className="hover-elevate"
              >
                About
              </Button>
              <Button
                variant="ghost"
                onClick={() => scrollToSection("programs")}
                data-testid="link-programs"
                className="hover-elevate"
              >
                Programs
              </Button>
              <Button
                variant="ghost"
                onClick={() => scrollToSection("news")}
                data-testid="link-news"
                className="hover-elevate"
              >
                News
              </Button>
              <Button
                variant="ghost"
                onClick={() => scrollToSection("contact")}
                data-testid="link-contact"
                className="hover-elevate"
              >
                Contact
              </Button>
            </nav>

            <div className="hidden lg:flex items-center gap-2">
              <Link href="/dashboard/login">
                <Button variant="outline" data-testid="button-login" className="hover-elevate">
                  Dashboard
                </Button>
              </Link>
              <Button onClick={() => scrollToSection("contact")} data-testid="button-apply" className="hover-elevate active-elevate-2">
                Apply Now
              </Button>
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden hover-elevate"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              data-testid="button-mobile-menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden bg-background border-t">
            <div className="px-4 py-4 space-y-2">
              <Button
                variant="ghost"
                className="w-full justify-start hover-elevate"
                onClick={() => scrollToSection("home")}
                data-testid="link-mobile-home"
              >
                Home
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start hover-elevate"
                onClick={() => scrollToSection("about")}
                data-testid="link-mobile-about"
              >
                About
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start hover-elevate"
                onClick={() => scrollToSection("programs")}
                data-testid="link-mobile-programs"
              >
                Programs
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start hover-elevate"
                onClick={() => scrollToSection("news")}
                data-testid="link-mobile-news"
              >
                News
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start hover-elevate"
                onClick={() => scrollToSection("contact")}
                data-testid="link-mobile-contact"
              >
                Contact
              </Button>
              <div className="pt-2 space-y-2">
                <Link href="/dashboard/login" className="block">
                  <Button variant="outline" className="w-full hover-elevate" data-testid="button-mobile-login">
                    Dashboard
                  </Button>
                </Link>
                <Button onClick={() => scrollToSection("contact")} className="w-full hover-elevate active-elevate-2" data-testid="button-mobile-apply">
                  Apply Now
                </Button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center justify-center">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${placeholderImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary/80 to-primary/70" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
          <img src={logoImage} alt="NVTI Kanda Logo" className="h-32 w-32 mx-auto mb-8" data-testid="img-hero-logo" />
          
          <h1 className="text-5xl md:text-6xl lg:text-hero-lg font-bold text-white mb-6">
            National Vocational Training Institute
          </h1>
          <p className="text-xl md:text-2xl lg:text-3xl text-white/95 mb-4 font-semibold">
            Kanda Career Training Institute
          </p>
          <p className="text-lg md:text-xl text-white/90 mb-12 max-w-3xl mx-auto leading-relaxed">
            Empowering Knowledge, Skills and Practice
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              onClick={() => scrollToSection("contact")}
              className="text-lg px-8 bg-chart-2 hover:bg-chart-2/90 text-white border-0 hover-elevate active-elevate-2"
              data-testid="button-hero-apply"
            >
              Apply Now
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => scrollToSection("about")}
              className="text-lg px-8 bg-white/10 backdrop-blur-sm text-white border-white/30 hover:bg-white/20 hover-elevate active-elevate-2"
              data-testid="button-hero-learn"
            >
              Learn More
            </Button>
          </div>

          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce">
            <ChevronDown className="h-8 w-8 text-white" />
          </div>
        </div>
      </section>

      {/* Quick Stats Bar */}
      <section id="stats-section" className="bg-primary py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center" data-testid="stat-years">
              <GraduationCap className="h-10 w-10 mx-auto mb-4 text-chart-2" />
              <div className="text-5xl font-bold text-chart-2 mb-2">{stats.years}+</div>
              <div className="text-sm text-white/90">Years of Excellence</div>
            </div>
            <div className="text-center" data-testid="stat-students">
              <Users className="h-10 w-10 mx-auto mb-4 text-chart-2" />
              <div className="text-5xl font-bold text-chart-2 mb-2">{stats.students}+</div>
              <div className="text-sm text-white/90">Students Enrolled</div>
            </div>
            <div className="text-center" data-testid="stat-programs">
              <BookOpen className="h-10 w-10 mx-auto mb-4 text-chart-2" />
              <div className="text-5xl font-bold text-chart-2 mb-2">{stats.programs}+</div>
              <div className="text-sm text-white/90">Programs Offered</div>
            </div>
            <div className="text-center" data-testid="stat-success">
              <TrendingUp className="h-10 w-10 mx-auto mb-4 text-chart-2" />
              <div className="text-5xl font-bold text-chart-2 mb-2">{stats.successRate}%</div>
              <div className="text-sm text-white/90">Graduate Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-6">
                About NVTI Kanda
              </h2>
              <div className="text-lg text-muted-foreground space-y-4 leading-relaxed">
                <p>
                  Kanda Career Training Institute was built by the 31st December Women's Movement with the assistance of Send School of the World (SESCO) a Japanese Non Governmental Organization (NGO). The 31st Women's Movement led by the then First Lady Nana Konadu Agyemang Rawlings then gave the Institute to the National Vocational Training Institute later part of 1999 to equip, staff and run as any other Vocational Institute under the Ministry of Employment and Social Welfare.
                </p>
              </div>

              <div className="mt-8 grid grid-cols-2 gap-4">
                <Card className="hover-elevate transition-transform hover:-translate-y-1">
                  <CardContent className="p-6">
                    <Target className="h-8 w-8 text-primary mb-3" />
                    <h3 className="font-semibold text-lg mb-2">Our Mission</h3>
                    <p className="text-sm text-muted-foreground">
                      To provide demand-driven employable skills and enhance generating capacities of basic and secondary school leavers, and such other persons through Competency Based Training (CBT) Apprenticeship, Testing and Career Development.
                    </p>
                  </CardContent>
                </Card>
                <Card className="hover-elevate transition-transform hover:-translate-y-1">
                  <CardContent className="p-6">
                    <Award className="h-8 w-8 text-primary mb-3" />
                    <h3 className="font-semibold text-lg mb-2">Our Vision</h3>
                    <p className="text-sm text-muted-foreground">
                      We will provide the best system of employable TVET skills
                    </p>
                  </CardContent>
                </Card>
              </div>

              <div className="mt-8">
                <h3 className="text-xl font-semibold mb-4">Core Values</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2" data-testid="value-excellence">
                    <div className="h-2 w-2 rounded-full bg-chart-2" />
                    <span className="text-sm font-medium">Pursuit of Excellence</span>
                  </div>
                  <div className="flex items-center gap-2" data-testid="value-teamwork">
                    <div className="h-2 w-2 rounded-full bg-chart-2" />
                    <span className="text-sm font-medium">Team work</span>
                  </div>
                  <div className="flex items-center gap-2" data-testid="value-respect">
                    <div className="h-2 w-2 rounded-full bg-chart-2" />
                    <span className="text-sm font-medium">Respect for all</span>
                  </div>
                  <div className="flex items-center gap-2" data-testid="value-integrity">
                    <div className="h-2 w-2 rounded-full bg-chart-2" />
                    <span className="text-sm font-medium">Truth, honesty and integrity</span>
                  </div>
                  <div className="flex items-center gap-2" data-testid="value-cost">
                    <div className="h-2 w-2 rounded-full bg-chart-2" />
                    <span className="text-sm font-medium">Cost effectiveness</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative rounded-lg overflow-hidden shadow-xl">
                <img
                  src={placeholderImage}
                  alt="Students collaborating at NVTI Kanda"
                  className="w-full h-auto"
                  data-testid="img-about"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Programs Section */}
      <section id="programs" className="py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Our Programs
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Choose from our diverse range of vocational training programs designed to equip you
              with market-ready skills
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Catering/Cookery",
                description:
                  "Learn professional cooking techniques, food preparation, and catering services with hands-on training in our modern kitchen facilities.",
                duration: "3-4 Years",
                icon: Heart,
              },
              {
                title: "Fashion Designing/Dressmaking",
                description:
                  "Master garment construction, pattern making, and fashion design with comprehensive training in textile and apparel production.",
                duration: "3-4 Years",
                icon: Award,
              },
              {
                title: "Cake Decoration",
                description:
                  "Develop expertise in cake design, decorating techniques, and pastry arts to create beautiful and delicious creations.",
                duration: "3-4 Years",
                icon: Lightbulb,
              },
              {
                title: "Interior Decoration",
                description:
                  "Learn space planning, color coordination, and design principles to transform living and working spaces.",
                duration: "3-4 Years",
                icon: Target,
              },
              {
                title: "ICT (Information and Communication Technology)",
                description:
                  "Gain comprehensive knowledge in computer operations, software applications, and digital communication technologies.",
                duration: "3-4 Years",
                icon: BookOpen,
              },
            ].map((program, index) => (
              <Card
                key={index}
                className="hover-elevate transition-all duration-300 hover:-translate-y-2"
                data-testid={`card-program-${index}`}
              >
                <CardContent className="p-6">
                  <program.icon className="h-12 w-12 text-primary mb-4" />
                  <h3 className="text-xl font-semibold mb-2">{program.title}</h3>
                  <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                    {program.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="text-xs">
                      <Clock className="h-3 w-3 mr-1" />
                      {program.duration}
                    </Badge>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-primary hover-elevate"
                      onClick={() => scrollToSection("admissions")}
                    >
                      Learn More
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* News Section */}
      <section id="news" className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
              News & Events
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Stay updated with the latest happenings at NVTI Kanda
            </p>
          </div>

          {newsLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : newsPosts.length > 0 ? (
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <Card className="overflow-hidden hover-elevate transition-all duration-300" data-testid="card-featured-news">
                  {newsPosts[0].featuredImage && (
                    <img
                      src={newsPosts[0].featuredImage}
                      alt={newsPosts[0].title}
                      className="w-full h-64 object-cover"
                    />
                  )}
                  <CardContent className="p-8">
                    <Badge className="mb-3">{newsPosts[0].category}</Badge>
                    <h3 className="text-2xl font-bold mb-3">
                      {newsPosts[0].title}
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      {newsPosts[0].excerpt}
                    </p>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {new Date(newsPosts[0].date).toLocaleDateString()}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                {newsPosts.slice(1, 4).map((news, index) => (
                  <Card
                    key={news.id}
                    className="hover-elevate transition-all duration-300 hover:-translate-y-1"
                    data-testid={`card-recent-news-${index}`}
                  >
                    <CardContent className="p-6">
                      <Badge variant="outline" className="mb-2 text-xs">
                        {news.category}
                      </Badge>
                      <h4 className="font-semibold mb-2 leading-tight">{news.title}</h4>
                      <div className="flex items-center justify-start">
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(news.date).toLocaleDateString()}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              No news articles available at this time.
            </div>
          )}

          <div className="text-center mt-12">
            <Button 
              variant="outline" 
              size="lg" 
              className="hover-elevate" 
              data-testid="button-view-all-news"
              onClick={() => scrollToSection("news")}
            >
              View All News
              <ChevronRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Facilities Section */}
      <section id="facilities" className="py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Our Facilities
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              State-of-the-art facilities designed to provide the best learning environment
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              placeholderImage,
              placeholderImage,
              placeholderImage,
              placeholderImage,
              placeholderImage,
              placeholderImage,
            ].map((image, index) => (
              <div
                key={index}
                className="relative group overflow-hidden rounded-lg shadow-lg hover-elevate transition-all duration-300 hover:-translate-y-2"
                data-testid={`img-facility-${index}`}
              >
                <img
                  src={image}
                  alt={`Facility ${index + 1}`}
                  className="w-full h-64 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                  <div>
                    <h4 className="text-white font-semibold text-lg mb-1">
                      {["Workshop", "Library", "Computer Lab", "Training Hall", "Sports Field", "Cafeteria"][index]}
                    </h4>
                    <p className="text-white/90 text-sm">Modern facilities for hands-on learning</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Admissions Section */}
      <section id="admissions" className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Admissions Process
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Follow these simple steps to start your journey with NVTI Kanda
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {[
              {
                step: "01",
                title: "Application Submission",
                description: "Complete and submit your application form with required documents",
                icon: BookOpen,
              },
              {
                step: "02",
                title: "Document Verification",
                description: "We review your credentials and verify all submitted documents",
                icon: CheckCircle2,
              },
              {
                step: "03",
                title: "Interview/Assessment",
                description: "Attend an interview or skills assessment based on your program",
                icon: Users,
              },
              {
                step: "04",
                title: "Acceptance & Enrollment",
                description: "Receive your acceptance letter and complete enrollment process",
                icon: GraduationCap,
              },
            ].map((step, index) => (
              <div key={index} className="relative" data-testid={`step-${index}`}>
                <Card className="h-full hover-elevate transition-all duration-300">
                  <CardContent className="p-6 text-center">
                    <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 mb-4">
                      <step.icon className="h-8 w-8 text-primary" />
                    </div>
                    <div className="text-4xl font-bold text-chart-2 mb-2">{step.step}</div>
                    <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </CardContent>
                </Card>
                {index < 3 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ChevronRight className="h-6 w-6 text-muted-foreground" />
                  </div>
                )}
              </div>
            ))}
          </div>

          <Card className="max-w-2xl mx-auto">
            <CardContent className="p-8">
              <h3 className="text-2xl font-semibold mb-6">Admission Requirements</h3>
              <p className="text-muted-foreground mb-6">Entry into our School Based Apprenticeship Training is open to persons with the following qualifications:</p>
              <div className="space-y-3">
                {[
                  "Basic Education Certificate Examinations (BECE) with passes in Mathematics, English Language and General Science",
                  "Middle School Leaving Certificate",
                  "Sponsored apprentices with basic educational background",
                  "Evidence of at least two (2) years Senior High School / SSS",
                ].map((requirement, index) => (
                  <div key={index} className="flex items-start gap-3" data-testid={`requirement-${index}`}>
                    <CheckCircle2 className="h-5 w-5 text-chart-3 mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">{requirement}</span>
                  </div>
                ))}
              </div>
              
              <h4 className="text-xl font-semibold mt-8 mb-4">Admission Procedures</h4>
              <div className="space-y-3">
                {[
                  "Purchase Admission Forms from the centre (All year round)",
                  "Complete the application Form and return to the centre",
                  "Attend selection interview and counseling",
                  "Upon successful selection, pay the requisite Fees",
                  "Register in your Department and other designated Departments",
                ].map((step, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-semibold text-primary">{index + 1}</span>
                    </div>
                    <span className="text-muted-foreground">{step}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Examinations Section */}
      <section id="examinations" className="py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Examinations & Certification
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Trainees are eligible to sit for the following test Grades during and after the 3/4 years training
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                title: "Foundation Certificate",
                description: "At the end of the 2nd Year",
                icon: BookOpen,
              },
              {
                title: "Certificate I",
                description: "At the end of the 3rd Year",
                icon: Award,
              },
              {
                title: "Certificate II",
                description: "At the end of the 4th Year",
                icon: GraduationCap,
              },
              {
                title: "Proficiency I",
                description: "At the end of 2nd Year",
                icon: Target,
              },
              {
                title: "Proficiency II",
                description: "At the end of 3rd Year",
                icon: CheckCircle2,
              },
            ].map((exam, index) => (
              <Card
                key={index}
                className="hover-elevate transition-all duration-300 hover:-translate-y-2"
                data-testid={`card-exam-${index}`}
              >
                <CardContent className="p-6 text-center">
                  <exam.icon className="h-12 w-12 text-primary mb-4 mx-auto" />
                  <h3 className="text-xl font-semibold mb-2">{exam.title}</h3>
                  <p className="text-muted-foreground text-sm">{exam.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Student Testimonials
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Hear from our graduates about their experience at NVTI Kanda
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Abena Osei",
                program: "Fashion Designing/Dressmaking",
                year: "Class of 2023",
                quote:
                  "NVTI Kanda gave me the foundation to start my own fashion business. The instructors were supportive and the facilities were excellent. I highly recommend this institute.",
              },
              {
                name: "Kwame Mensah",
                program: "Catering/Cookery",
                year: "Class of 2022",
                quote:
                  "The hands-on training I received at NVTI Kanda equipped me with the culinary skills I needed to excel in my career. I now run my own catering business and I'm grateful for the quality education.",
              },
              {
                name: "Akosua Agyeman",
                program: "ICT",
                year: "Class of 2023",
                quote:
                  "The practical approach to learning at NVTI Kanda made all the difference. I graduated confident and job-ready, and I landed my dream job in IT within weeks of completing the program.",
              },
            ].map((testimonial, index) => (
              <Card key={index} className="hover-elevate transition-all duration-300" data-testid={`card-testimonial-${index}`}>
                <CardContent className="p-8">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Users className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <div className="font-semibold text-lg">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.program}</div>
                      <div className="text-xs text-muted-foreground">{testimonial.year}</div>
                    </div>
                  </div>
                  <p className="text-muted-foreground italic leading-relaxed">
                    "{testimonial.quote}"
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Get In Touch
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Have questions? We're here to help you start your journey with NVTI Kanda
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            <div>
              <Card>
                <CardContent className="p-8">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      contactMutation.mutate(contactForm);
                    }}
                    className="space-y-6"
                    data-testid="form-contact"
                  >
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium mb-2">
                        Full Name
                      </label>
                      <Input
                        id="name"
                        placeholder="John Doe"
                        value={contactForm.name}
                        onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                        required
                        data-testid="input-name"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium mb-2">
                        Email Address
                      </label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="john@example.com"
                        value={contactForm.email}
                        onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                        required
                        data-testid="input-email"
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium mb-2">
                        Phone Number
                      </label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="+233 XX XXX XXXX"
                        value={contactForm.phone}
                        onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                        data-testid="input-phone"
                      />
                    </div>
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium mb-2">
                        Message
                      </label>
                      <Textarea
                        id="message"
                        placeholder="Tell us how we can help you..."
                        rows={4}
                        value={contactForm.message}
                        onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                        required
                        data-testid="input-message"
                      />
                    </div>
                    <Button
                      type="submit"
                      className="w-full hover-elevate active-elevate-2"
                      size="lg"
                      disabled={contactMutation.isPending}
                      data-testid="button-submit-contact"
                    >
                      {contactMutation.isPending ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Sending...
                        </>
                      ) : (
                        "Send Message"
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardContent className="p-8 space-y-6">
                  <div className="flex items-start gap-4" data-testid="contact-location">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <MapPin className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Location</h3>
                      <p className="text-muted-foreground">Kanda, Accra, Ghana</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4" data-testid="contact-email">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Mail className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Email</h3>
                      <p className="text-muted-foreground">info@nvtikanda.edu.gh</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4" data-testid="contact-phone">
                    <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Phone className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Phone</h3>
                      <p className="text-muted-foreground">+233 XX XXX XXXX</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="h-64 bg-muted rounded-lg overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3970.7158!2d-0.2040!3d5.6037!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNcKwMzYnMTMuMyJOIDDCsDEyJzE0LjQiVw!5e0!3m2!1sen!2sgh!4v1234567890"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="NVTI Kanda Location"
                  data-testid="map-location"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary py-12 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <img src={logoImage} alt="NVTI Kanda Logo" className="h-12 w-12" />
                <div>
                  <div className="font-bold">NVTI Kanda</div>
                  <div className="text-sm text-white/80">Career Training Institute</div>
                </div>
              </div>
              <p className="text-white/80 text-sm leading-relaxed">
                Empowering Knowledge, Skills and Practice since 1999
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <div className="space-y-2">
                <button
                  onClick={() => scrollToSection("about")}
                  className="block text-white/80 hover:text-white text-sm transition-colors"
                >
                  About Us
                </button>
                <button
                  onClick={() => scrollToSection("programs")}
                  className="block text-white/80 hover:text-white text-sm transition-colors"
                >
                  Programs
                </button>
                <button
                  onClick={() => scrollToSection("admissions")}
                  className="block text-white/80 hover:text-white text-sm transition-colors"
                >
                  Admissions
                </button>
                <button
                  onClick={() => scrollToSection("contact")}
                  className="block text-white/80 hover:text-white text-sm transition-colors"
                >
                  Contact
                </button>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Programs</h3>
              <div className="space-y-2 text-white/80 text-sm">
                <div>Catering/Cookery</div>
                <div>Fashion Designing/Dressmaking</div>
                <div>Cake Decoration</div>
                <div>Interior Decoration</div>
                <div>ICT</div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Follow Us</h3>
              <div className="flex gap-3">
                <a
                  href="#"
                  className="h-10 w-10 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors hover-elevate"
                  data-testid="link-facebook"
                >
                  <Facebook className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  className="h-10 w-10 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors hover-elevate"
                  data-testid="link-twitter"
                >
                  <Twitter className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  className="h-10 w-10 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors hover-elevate"
                  data-testid="link-linkedin"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
                <a
                  href="#"
                  className="h-10 w-10 rounded-lg bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors hover-elevate"
                  data-testid="link-instagram"
                >
                  <Instagram className="h-5 w-5" />
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-white/20 pt-8 text-center text-sm text-white/80">
            <p>
              &copy; {new Date().getFullYear()} National Vocational Training Institute Kanda. All rights
              reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
