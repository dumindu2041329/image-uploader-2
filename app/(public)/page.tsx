import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PublicNav } from "@/components/layout/PublicNav";
import { Footer } from "@/components/layout/Footer";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { 
  Upload, 
  Database, 
  Tags, 
  User, 
  LayoutGrid, 
  Moon,
  ArrowRight,
  Check,
  Star,
  Image as ImageIcon,
  Search,
  Shield,
  Zap,
  ChevronRight,
  Quote,
} from "lucide-react";

// Features data
const features = [
  {
    icon: Upload,
    title: "Drag & Drop Upload",
    description: "Simply drag your images onto the upload zone or click to browse. Support for multiple files at once.",
  },
  {
    icon: Database,
    title: "Local-First Storage",
    description: "Your images are stored securely in your browser's IndexedDB. No servers, no uploads to the cloud.",
  },
  {
    icon: Tags,
    title: "Tags & Search",
    description: "Organize your images with custom tags and find them instantly with powerful search filters.",
  },
  {
    icon: User,
    title: "Profile Customization",
    description: "Personalize your experience with custom avatars, bios, and display preferences.",
  },
  {
    icon: LayoutGrid,
    title: "Responsive Gallery",
    description: "Beautiful grid layout that adapts to any screen size. Perfect on desktop, tablet, or mobile.",
  },
  {
    icon: Moon,
    title: "Dark Mode",
    description: "Easy on the eyes with automatic dark mode support. Follows your system preference or set manually.",
  },
];

// How it works steps
const steps = [
  {
    step: "01",
    icon: User,
    title: "Create Your Account",
    description: "Sign up in seconds with just your email. Your data stays on your device.",
  },
  {
    step: "02",
    icon: Upload,
    title: "Upload Your Images",
    description: "Drag and drop or browse to upload. All images are stored locally in your browser.",
  },
  {
    step: "03",
    icon: LayoutGrid,
    title: "Organize & Enjoy",
    description: "Add tags, rename files, and browse your gallery anytime—even offline.",
  },
];

// Testimonials data
const testimonials = [
  {
    name: "Sarah Chen",
    role: "Freelance Designer",
    avatar: "SC",
    content: "Finally, an image organizer that respects my privacy! I love that everything stays on my device. The interface is beautiful too.",
    rating: 5,
  },
  {
    name: "Marcus Johnson",
    role: "Photography Enthusiast",
    avatar: "MJ",
    content: "I've tried many image managers, but ImageVault's tagging system is by far the most intuitive. Great for organizing my photo collections.",
    rating: 5,
  },
  {
    name: "Emily Rodriguez",
    role: "Content Creator",
    avatar: "ER",
    content: "The drag and drop is so smooth! Being able to work offline is a game-changer for me when I'm traveling.",
    rating: 5,
  },
];

// Pricing plans
const pricingPlans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for personal use",
    features: [
      "Unlimited image uploads",
      "Local browser storage",
      "Tags & organization",
      "Dark mode support",
      "Basic profile",
    ],
    cta: "Get Started",
    href: "/auth/sign-up",
    popular: false,
  },
  {
    name: "Pro",
    price: "$9",
    period: "/month",
    description: "For power users",
    features: [
      "Everything in Free",
      "Cloud backup (coming soon)",
      "Advanced search filters",
      "Bulk operations",
      "Priority support",
      "Custom themes",
    ],
    cta: "Coming Soon",
    href: "#",
    popular: true,
  },
  {
    name: "Team",
    price: "$29",
    period: "/month",
    description: "For collaborative teams",
    features: [
      "Everything in Pro",
      "Team workspaces",
      "Shared galleries",
      "Admin controls",
      "API access",
      "SSO integration",
    ],
    cta: "Coming Soon",
    href: "#",
    popular: false,
  },
];

// FAQ data
const faqs = [
  {
    question: "Where are my images stored?",
    answer: "All your images are stored locally in your browser using IndexedDB. This means your data never leaves your device unless you explicitly export it. Your images persist across browser sessions but are tied to this specific browser.",
  },
  {
    question: "Is my data secure?",
    answer: "Yes! Since everything is stored locally on your device, your images are as secure as your computer. We don't have access to your files because they never touch our servers. For authentication, passwords are hashed client-side using SHA-256.",
  },
  {
    question: "What happens if I clear my browser data?",
    answer: "Clearing your browser data, including site data or IndexedDB, will remove your stored images and account. We recommend periodically downloading important images as backups.",
  },
  {
    question: "Can I access my images on another device?",
    answer: "Currently, since all data is stored locally, your images are only available on the device and browser where you uploaded them. Cloud sync is planned for our Pro tier in a future update.",
  },
  {
    question: "What image formats are supported?",
    answer: "ImageVault supports all common web image formats including JPEG, PNG, GIF, WebP, and SVG. The maximum file size depends on your browser's storage limits, typically several gigabytes.",
  },
  {
    question: "Is this really free?",
    answer: "Yes! The Free tier gives you unlimited local storage and all core features at no cost. Pro and Team tiers (coming soon) will add cloud features and collaboration tools.",
  },
];

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col scroll-smooth">
      <PublicNav />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-20 md:py-32">
          <div className="container">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Hero Content */}
              <div className="space-y-8">
                <Badge variant="secondary" className="px-4 py-1.5">
                  <Zap className="h-3 w-3 mr-1" />
                  100% Free & Private
                </Badge>
                
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                  Upload, preview, and organize images —{" "}
                  <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                    instantly.
                  </span>
                </h1>
                
                <p className="text-xl text-muted-foreground max-w-lg">
                  A beautiful, privacy-first image manager that runs entirely in your browser. 
                  No servers, no cloud uploads—your photos stay on your device.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/auth/sign-up">
                    <Button size="lg" className="text-lg px-8 w-full sm:w-auto">
                      Get Started Free
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <a href="#demo">
                    <Button size="lg" variant="outline" className="text-lg px-8 w-full sm:w-auto">
                      View Demo
                    </Button>
                  </a>
                </div>

                <div className="flex items-center gap-4 pt-4">
                  <div className="flex -space-x-2">
                    {["S", "M", "E", "J"].map((initial, i) => (
                      <div
                        key={i}
                        className="h-8 w-8 rounded-full bg-primary/10 border-2 border-background flex items-center justify-center text-xs font-semibold text-primary"
                      >
                        {initial}
                      </div>
                    ))}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <span className="font-semibold text-foreground">1,200+</span> users already organizing
                  </div>
                </div>
              </div>

              {/* Hero Mock UI */}
              <div id="demo" className="relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-secondary/20 rounded-3xl blur-3xl" />
                <div className="relative glass rounded-2xl p-6 space-y-4">
                  {/* Mock Upload Card */}
                  <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary/50 transition-colors">
                    <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-sm font-medium">Drop images here or click to upload</p>
                    <p className="text-xs text-muted-foreground mt-1">PNG, JPG, GIF up to 10MB</p>
                  </div>

                  {/* Mock Gallery Grid */}
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      "bg-gradient-to-br from-pink-500 to-orange-400",
                      "bg-gradient-to-br from-blue-500 to-cyan-400",
                      "bg-gradient-to-br from-green-500 to-emerald-400",
                      "bg-gradient-to-br from-purple-500 to-pink-400",
                      "bg-gradient-to-br from-yellow-500 to-orange-400",
                      "bg-gradient-to-br from-indigo-500 to-blue-400",
                    ].map((gradient, i) => (
                      <div
                        key={i}
                        className={`aspect-square rounded-lg ${gradient} flex items-center justify-center`}
                      >
                        <ImageIcon className="h-6 w-6 text-white/50" />
                      </div>
                    ))}
                  </div>

                  {/* Mock Tags */}
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary">vacation</Badge>
                    <Badge variant="secondary">family</Badge>
                    <Badge variant="secondary">2024</Badge>
                    <Badge variant="outline">+ Add tag</Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 md:py-32 bg-muted/30">
          <div className="container">
            <div className="text-center mb-16">
              <Badge variant="outline" className="mb-4">Features</Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Everything you need to manage your images
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Powerful features wrapped in a simple, intuitive interface. No learning curve required.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, i) => {
                const Icon = feature.icon;
                return (
                  <Card key={i} className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                    <CardHeader>
                      <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <CardTitle className="text-xl">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-base">
                        {feature.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-20 md:py-32">
          <div className="container">
            <div className="text-center mb-16">
              <Badge variant="outline" className="mb-4">How It Works</Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Get started in minutes
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Three simple steps to organize your image collection.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {steps.map((step, i) => {
                const Icon = step.icon;
                return (
                  <div key={i} className="relative">
                    {i < steps.length - 1 && (
                      <div className="hidden md:block absolute top-16 left-1/2 w-full h-0.5 bg-border" />
                    )}
                    <div className="relative flex flex-col items-center text-center">
                      <div className="text-6xl font-bold text-muted/20 mb-4">
                        {step.step}
                      </div>
                      <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mb-6 relative z-10">
                        <Icon className="h-8 w-8 text-primary" />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                      <p className="text-muted-foreground">{step.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 md:py-32 bg-muted/30">
          <div className="container">
            <div className="text-center mb-16">
              <Badge variant="outline" className="mb-4">Testimonials</Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Loved by creators everywhere
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                See what our users have to say about ImageVault.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {testimonials.map((testimonial, i) => (
                <Card key={i} className="relative">
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold">
                        {testimonial.avatar}
                      </div>
                      <div>
                        <CardTitle className="text-base">{testimonial.name}</CardTitle>
                        <CardDescription>{testimonial.role}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-0.5 mb-3">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <Quote className="h-8 w-8 text-muted-foreground/20 mb-2" />
                    <p className="text-muted-foreground">{testimonial.content}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-20 md:py-32">
          <div className="container">
            <div className="text-center mb-16">
              <Badge variant="outline" className="mb-4">Pricing</Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Simple, transparent pricing
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Start for free, upgrade when you need more.
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                ⚠️ Note: Billing is not implemented. Pro and Team tiers are for demonstration only.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {pricingPlans.map((plan, i) => (
                <Card 
                  key={i} 
                  className={`relative ${plan.popular ? "border-primary shadow-lg scale-105" : ""}`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className="bg-primary">Most Popular</Badge>
                    </div>
                  )}
                  <CardHeader className="text-center pb-2">
                    <CardTitle className="text-xl">{plan.name}</CardTitle>
                    <CardDescription>{plan.description}</CardDescription>
                    <div className="pt-4">
                      <span className="text-4xl font-bold">{plan.price}</span>
                      <span className="text-muted-foreground">{plan.period}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ul className="space-y-3">
                      {plan.features.map((feature, j) => (
                        <li key={j} className="flex items-center gap-2 text-sm">
                          <Check className="h-4 w-4 text-primary flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Link href={plan.href} className="block">
                      <Button 
                        className="w-full" 
                        variant={plan.popular ? "default" : "outline"}
                        disabled={plan.cta === "Coming Soon"}
                      >
                        {plan.cta}
                        {plan.cta !== "Coming Soon" && <ChevronRight className="ml-1 h-4 w-4" />}
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="py-20 md:py-32 bg-muted/30">
          <div className="container">
            <div className="text-center mb-16">
              <Badge variant="outline" className="mb-4">FAQ</Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Frequently asked questions
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Everything you need to know about ImageVault.
              </p>
            </div>

            <div className="max-w-3xl mx-auto">
              <Accordion type="single">
                {faqs.map((faq, i) => (
                  <AccordionItem key={i} value={`faq-${i}`}>
                    <AccordionTrigger>{faq.question}</AccordionTrigger>
                    <AccordionContent>{faq.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-20 md:py-32">
          <div className="container">
            <div className="relative overflow-hidden rounded-3xl bg-primary px-6 py-20 text-center text-primary-foreground">
              <div className="absolute inset-0 bg-grid-white/10" />
              <div className="relative">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Ready to organize your images?
                </h2>
                <p className="text-xl opacity-90 max-w-2xl mx-auto mb-8">
                  Join thousands of users who trust ImageVault for their image management needs.
                  Get started for free today.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/auth/sign-up">
                    <Button size="lg" variant="secondary" className="text-lg px-8">
                      Get Started Free
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <Link href="/auth/sign-in">
                    <Button size="lg" variant="outline" className="text-lg px-8 bg-transparent border-primary-foreground/30 hover:bg-primary-foreground/10">
                      Sign In
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
