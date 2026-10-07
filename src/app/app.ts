import { Component, signal, computed, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export type PageName = 'home' | 'about' | 'services' | 'clients' | 'pricing' | 'tech-stack' | 'case-studies' | 'reviews' | 'estimator' | 'faq';

export interface TechItem {
  id: string;
  name: string;
  category: 'backend' | 'frontend' | 'mobile' | 'database' | 'architecture';
  categoryLabel: string;
  tagline: string;
  icon: string;
  color: string;
  badgeBg: string;
  description: string;
  highlights: string[];
  useCases: string[];
}

export interface ServiceItem {
  id: string;
  title: string;
  badge: string;
  priceInr: string;
  icon: string;
  imageUrl?: string;
  tagline?: string;
  duration?: string;
  themeColor?: string;
  description: string;
  features: string[];
  deliverables: string[];
}

export interface CaseStudy {
  id: string;
  title: string;
  clientName: string;
  clientUrl?: string;
  imageUrl: string;
  badge: string;
  category: string;
  impact: string;
  budgetInr: string;
  description: string;
  stack: string[];
  results: string[];
}

export interface ClientReview {
  id: string;
  clientName: string;
  role: string;
  company: string;
  website: string;
  projectTitle: string;
  rating: number;
  reviewText: string;
  avatarText: string;
  badge: string;
  deliverable: string;
  budgetInr: string;
  verified: boolean;
}

export interface PricingPlan {
  id: string;
  title: string;
  badge: string;
  priceInr: string;
  duration: string;
  popular?: boolean;
  description: string;
  idealFor: string;
  features: string[];
}

export interface FaqItem {
  question: string;
  answer: string;
  isOpen: boolean;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit, OnDestroy {
  // Navigation State
  protected readonly currentPage = signal<PageName>('home');
  protected readonly servicesDropdownOpen = signal<boolean>(false);
  protected readonly caseStudyFilter = signal<string>('all');
  protected readonly contactModalOpen = signal<boolean>(false);

  // Mobile Sidebar Tree View State
  protected readonly mobileMenuOpen = signal<boolean>(false);
  protected readonly mobileTreeServicesOpen = signal<boolean>(true);
  protected readonly mobileTreePortfolioOpen = signal<boolean>(false);
  protected readonly mobileTreePricingOpen = signal<boolean>(false);
  protected readonly mobileTreeCompanyOpen = signal<boolean>(false);

  toggleMobileTreeNode(node: 'services' | 'portfolio' | 'pricing' | 'company'): void {
    switch (node) {
      case 'services':
        this.mobileTreeServicesOpen.update(v => !v);
        break;
      case 'portfolio':
        this.mobileTreePortfolioOpen.update(v => !v);
        break;
      case 'pricing':
        this.mobileTreePricingOpen.update(v => !v);
        break;
      case 'company':
        this.mobileTreeCompanyOpen.update(v => !v);
        break;
    }
  }

  // Email Copy State
  protected readonly emailCopied = signal<boolean>(false);
  protected readonly contactEmail = 'arivomtechnologies@gmail.com';
  protected readonly websiteUrl = 'https://arivomtechnologies.com/';

  // Active Tech Category Filter
  protected readonly activeTechFilter = signal<string>('all');

  // Selected Tech for Detail Modal
  protected readonly selectedTech = signal<TechItem | null>(null);

  // Architecture Comparison Mode
  protected readonly architectureMode = signal<'monolith' | 'microservices'>('microservices');

  // Hero Banner Carousel (3 to 5 movable slides)
  protected readonly activeHeroSlide = signal<number>(0);
  protected readonly isSlidePaused = signal<boolean>(false);
  private heroSlideInterval: any = null;

  protected readonly heroSlides = [
    {
      id: 'starter-web',
      image: 'images/hero-banner-starter.jpg',
      badge: 'Starter Package',
      badgeColor: 'bg-emerald-600/90 text-white',
      badgeBgLight: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      title: 'Business Websites & Brand Portals',
      headline: 'Lightning-Fast Websites for Growing Businesses',
      desc: 'Sub-second load speeds, 100% fluid responsive design, built-in SEO and contact forms engineered to convert visitors into loyal clients.',
      techBadge: 'Starter Web • ₹10K–₹15K',
      priceTag: '₹10,000 – ₹15,000',
      timeline: '1 – 2 Weeks Delivery',
      bullets: [
        '5 to 8 Custom Responsive Pages',
        'Mobile, Tablet & Desktop Pixel-Perfect Layout',
        'SEO Meta Tags & Instant Inquiry Forms',
        'Full Source Ownership & Free 30-Day Support'
      ],
      primaryCta: 'Get Starter Website',
      primaryTarget: 'contact',
      stats: '100% On-Time'
    },
    {
      id: 'enterprise-web',
      image: 'images/hero-banner-web.jpg',
      badge: 'Enterprise Software',
      badgeColor: 'bg-orange-600/90 text-white',
      badgeBgLight: 'bg-orange-50 text-orange-800 border-orange-200',
      title: 'Custom Web Apps & Admin Portals',
      headline: 'Full-Stack Scalable Cloud Platforms',
      desc: 'Reactive Angular 19 single-page applications powered by Spring Boot 3 microservices with robust role-based security and realtime analytics.',
      techBadge: 'Spring Boot 3 + Angular',
      priceTag: '₹60,000 – ₹1,50,000+',
      timeline: '3 – 6 Weeks Sprint',
      bullets: [
        'Angular Standalone Frontend with Reactive Signals',
        'Spring Boot 3 REST APIs & Spring Security JWT',
        'PostgreSQL or MongoDB Database Architecture',
        'Real-time Analytics Dashboards & Data Exports'
      ],
      primaryCta: 'Explore Enterprise Apps',
      primaryTarget: 'pricing',
      stats: 'Zero Tech Debt'
    },
    {
      id: 'mobile-engineering',
      image: 'images/hero-banner-mobile.jpg',
      badge: 'Mobile Engineering',
      badgeColor: 'bg-cyan-600/90 text-white',
      badgeBgLight: 'bg-cyan-50 text-cyan-800 border-cyan-200',
      title: 'Cross-Platform Mobile Apps',
      headline: 'React Native iOS & Android Native UI',
      desc: 'Deploy to Apple App Store and Google Play Store from a unified codebase with fluid 60 FPS performance, offline caching, and biometric login.',
      techBadge: 'React Native 60 FPS',
      priceTag: '₹1,20,000 – ₹2,50,000',
      timeline: '5 – 8 Weeks Delivery',
      bullets: [
        'Single Codebase for iOS & Android',
        'Biometric Auth (FaceID / Fingerprint)',
        'Push Notifications & Offline-First Caching',
        'Camera, GPS Geolocation & Native Device APIs'
      ],
      primaryCta: 'Build Mobile App',
      primaryTarget: 'contact',
      stats: '60 FPS Native'
    },
    {
      id: 'cloud-devops',
      image: 'images/hero-banner-cloud.jpg',
      badge: 'Cloud & Architecture',
      badgeColor: 'bg-indigo-600/90 text-white',
      badgeBgLight: 'bg-indigo-50 text-indigo-800 border-indigo-200',
      title: 'Distributed Cloud Microservices',
      headline: 'Resilient Event-Driven Topologies',
      desc: 'Scalable cloud infrastructure containerized with Docker and Kubernetes, automated CI/CD pipelines, and high-availability database clusters.',
      techBadge: 'Docker • K8s • PostgreSQL',
      priceTag: 'Custom Architecture',
      timeline: 'Continuous Milestones',
      bullets: [
        'Microservices Decomposition & API Gateways',
        'Docker Containerization & Kubernetes Clusters',
        'PostgreSQL Read-Replicas & Redis Caching',
        'Prometheus & Grafana Health Monitoring'
      ],
      primaryCta: 'Consult Cloud Architects',
      primaryTarget: 'tech-stack',
      stats: '99.99% Uptime'
    },
    {
      id: 'fintech-suite',
      image: 'images/hero-banner-fintech.jpg',
      badge: 'FinTech Solutions',
      badgeColor: 'bg-amber-600/90 text-white',
      badgeBgLight: 'bg-amber-50 text-amber-800 border-amber-200',
      title: 'Bank-Grade Payment Gateways',
      headline: 'High-Throughput Financial Systems',
      desc: 'PCI-DSS ready transaction processing backends handling 10,000+ TPS with automated audit logs, cryptographic encryption, and zero downtime.',
      techBadge: 'Bank-Grade Security',
      priceTag: 'High-Volume Scale',
      timeline: 'Enterprise SLA',
      bullets: [
        'PCI-DSS Ready Architectural Security',
        'Razorpay, Stripe & UPI Gateway Integrations',
        'Idempotent Transactions & Immutable Ledgers',
        'Automated Fraud Detection & Instant Webhooks'
      ],
      primaryCta: 'Discuss FinTech Scope',
      primaryTarget: 'contact',
      stats: '10K+ TPS'
    }
  ];

  nextHeroSlide(): void {
    this.activeHeroSlide.update(idx => (idx + 1) % this.heroSlides.length);
  }

  prevHeroSlide(): void {
    this.activeHeroSlide.update(idx => (idx - 1 + this.heroSlides.length) % this.heroSlides.length);
  }

  goToHeroSlide(index: number): void {
    this.activeHeroSlide.set(index);
  }

  pauseHeroSlide(): void {
    this.isSlidePaused.set(true);
  }

  resumeHeroSlide(): void {
    this.isSlidePaused.set(false);
  }

  // Dynamic Contextual Pre-Footer CTA based on current page
  protected readonly pageCta = computed(() => {
    const page = this.currentPage();
    switch (page) {
      case 'pricing':
        return {
          badge: 'ESTIMATES & KICKOFF',
          title: 'Get Your Custom\nProject Estimate',
          subtitle: 'Need a custom milestone package? Connect with our senior engineers for an accurate timeline and milestone breakdown in INR.',
          primaryBtn: 'Calculate Budget &rarr;',
          action: () => this.navigateTo('estimator'),
          trust1: 'Fixed INR Milestones',
          trust2: '100% Code Handover',
          trust3: 'Zero Hidden Costs'
        };
      case 'services':
        return {
          badge: "LET'S BUILD TOGETHER",
          title: "Let's Build Your\nEnterprise Solution",
          subtitle: 'From ₹10K business portals to high-throughput Spring Boot microservices, we engineer resilient solutions tailored to your business.',
          primaryBtn: 'Start Your Project &rarr;',
          action: () => this.openContactModal(),
          trust1: 'Full-Stack Architecture',
          trust2: 'Spring Boot 3 & Angular',
          trust3: '30-Day Launch Warranty'
        };
      case 'case-studies':
        return {
          badge: 'PROVEN EXPERTISE',
          title: 'Ready to Start a\nSimilar Success Story?',
          subtitle: 'Inspired by our work with La Castle Homes and FinTech platforms? Discuss your product requirements with our lead engineers today.',
          primaryBtn: 'Kickoff Discovery &rarr;',
          action: () => this.openContactModal(),
          trust1: '24+ Delivered Systems',
          trust2: 'Production Ready',
          trust3: 'Fast Turnaround'
        };
      case 'tech-stack':
        return {
          badge: 'TECHNICAL CONSULTATION',
          title: 'Talk to Our Senior\nEngineering Team',
          subtitle: 'Have specific architectural constraints or considering Monolith vs Microservices? Book a direct discovery call with our tech leads.',
          primaryBtn: 'Schedule Tech Call &rarr;',
          action: () => this.openContactModal(),
          trust1: 'Spring Boot 3 & Java 21',
          trust2: 'Angular Signals',
          trust3: 'React Native 60fps'
        };
      case 'about':
        return {
          badge: 'PARTNER WITH US',
          title: 'Work With Arivom\nTechnologies Directly',
          subtitle: 'Experience true engineering craftsmanship with zero agency fluff, direct senior developer access, and transparent milestone contracts.',
          primaryBtn: 'Discuss Your Goals &rarr;',
          action: () => this.openContactModal(),
          trust1: 'No Middlemen',
          trust2: 'Direct Git Commits',
          trust3: 'Milestone Transparency'
        };
      case 'reviews':
        return {
          badge: 'JOIN OUR CLIENTS',
          title: 'Become Our Next\nClient Success Story',
          subtitle: 'Join founders, firms, and companies who trust Arivom Technologies for high-performance software and on-time launches.',
          primaryBtn: 'Start Project Today &rarr;',
          action: () => this.openContactModal(),
          trust1: '5.0 Verified Rating',
          trust2: '92% Client Retention',
          trust3: 'Direct Communication'
        };
      case 'estimator':
        return {
          badge: 'LOCK IN TIMELINE',
          title: 'Lock In Your Scope &\nKickoff Milestones',
          subtitle: 'Ready to turn your calculated estimate into an active sprint backlog? Our lead engineers are ready to scope your MVP within 12 hours.',
          primaryBtn: 'Apply Estimate &rarr;',
          action: () => this.applyEstimateToContact(),
          trust1: 'Sprint Backlog in 24h',
          trust2: 'Clear Deliverables',
          trust3: 'Instant Roadmap'
        };
      case 'faq':
        return {
          badge: 'HERE TO HELP',
          title: 'Still Have Technical\nor Pricing Questions?',
          subtitle: 'Every project is unique. Send us your requirements or questions, and our senior engineers will personally reply in under 12 hours.',
          primaryBtn: 'Ask an Engineer &rarr;',
          action: () => this.openContactModal(),
          trust1: 'Quick Response (< 12h)',
          trust2: 'Free Initial Review',
          trust3: 'No Obligations'
        };
      case 'clients':
        return {
          badge: 'SCALE YOUR PLATFORM',
          title: 'Bring Your Digital Vision\nto Life with Confidence',
          subtitle: 'Explore our multi-industry engineering capabilities and partner with senior engineers who treat your product like their own.',
          primaryBtn: 'Get Free Proposal &rarr;',
          action: () => this.openContactModal(),
          trust1: 'Dedicated Engineers',
          trust2: 'Guaranteed Timelines',
          trust3: 'Enterprise Quality'
        };
      case 'home':
      default:
        return {
          badge: "LET'S WORK TOGETHER",
          title: 'Turn Your Ideas into\nPowerful Digital Solutions',
          subtitle: 'Get a free consultation, project estimate and roadmap from our senior engineering team.',
          primaryBtn: 'Contact Us &rarr;',
          action: () => this.openContactModal(),
          trust1: 'Fast Response (< 12h)',
          trust2: 'Transparent Pricing',
          trust3: 'Dedicated Devs'
        };
    }
  });

  // Estimator Form State
  protected readonly estimatorProjectType = signal<string>('mvp');
  protected readonly estimatorPlatform = signal<string>('web');
  protected readonly estimatorDatabase = signal<string>('postgres');
  protected readonly estimatorArchitecture = signal<string>('monolith');
  protected readonly estimatorTimeline = signal<string>('fast');

  // Contact Form Model
  protected contactForm = {
    name: '',
    email: '',
    projectType: 'Starter Website (₹10,000 - ₹15,000)',
    architecture: 'Modular Monolith / Modern Web',
    budget: '₹10,000 - ₹15,000 (Website Build)',
    timeline: '1 - 2 Weeks',
    message: ''
  };

  protected readonly formSubmitted = signal<boolean>(false);

  // Pricing Plans in INR
  protected readonly pricingPlans: PricingPlan[] = [
    {
      id: 'website-starter',
      title: 'Starter Business Website',
      badge: 'Popular for Businesses',
      priceInr: '₹10,000 – ₹15,000',
      duration: '1 – 2 Weeks',
      popular: true,
      description: 'High-speed, SEO-optimized business website or portfolio portal. Perfect for construction firms, consultants, clinics, and startups.',
      idealFor: 'Startups, Local Businesses, Real Estate & Professional Portfolios',
      features: [
        '5 to 8 Custom Responsive Pages',
        'Modern Tailwind CSS design & clean responsive layout',
        'Mobile, Tablet & Desktop 100% fluid responsiveness',
        'Interactive Contact & Inquiry Form with instant dispatch',
        'SEO Meta tags, Google Analytics & Fast Cloud Hosting setup',
        'Full source code ownership & 30-day post-launch support'
      ]
    },
    {
      id: 'web-application',
      title: 'Custom Web Application',
      badge: 'Angular + Spring Boot',
      priceInr: '₹60,000 – ₹1,50,000',
      duration: '3 – 6 Weeks',
      description: 'Full-stack dynamic web portal, management SaaS, or customer portal with clean reactive UI and robust enterprise Spring Boot backend.',
      idealFor: 'SaaS platforms, Booking engines, B2B portals, Admin suites',
      features: [
        'Modern Angular standalone frontend with Signals & RxJS',
        'Spring Boot 3 RESTful APIs & Spring Security',
        'PostgreSQL or MongoDB database architecture',
        'JWT Auth, Role-Based Access Control (RBAC)',
        'Interactive dashboards, charts & data export (PDF/Excel)',
        'Docker containerized deployment & CI/CD pipeline'
      ]
    },
    {
      id: 'mobile-app',
      title: 'Cross-Platform Mobile App',
      badge: 'React Native iOS & Android',
      priceInr: '₹1,20,000 – ₹2,50,000',
      duration: '5 – 8 Weeks',
      description: 'Single codebase targeting both Apple App Store and Google Play Store with fluid 60fps native performance.',
      idealFor: 'Consumer apps, on-demand delivery, telehealth, field operations',
      features: [
        'iOS & Android native deployment from single codebase',
        'Biometric authentication (FaceID / Fingerprint)',
        'Push notifications & offline-first data caching',
        'Camera, GPS geolocation & hardware API integrations',
        'App Store Connect & Google Play Console release management',
        '60-day post-launch warranty & updates'
      ]
    },
    {
      id: 'enterprise-microservices',
      title: 'Enterprise Microservices & Cloud',
      badge: 'Distributed Systems',
      priceInr: '₹3,00,000 – ₹6,00,000+',
      duration: '8 – 14 Weeks',
      description: 'High-throughput distributed systems engineered with Spring Cloud, Kafka, Docker, Kubernetes, and polyglot persistence.',
      idealFor: 'FinTech, high-concurrency SaaS, multi-tenant global scale',
      features: [
        'Spring Cloud API Gateway, Circuit Breakers (Resilience4j)',
        'Kafka / RabbitMQ asynchronous event streaming',
        'PostgreSQL + MongoDB polyglot database clustering',
        'Sub-50ms latency architecture & virtual threads (Loom)',
        'Kubernetes orchestration & automated scaling policies',
        'Dedicated senior architect support & SLA guarantee'
      ]
    }
  ];

  // Client Reviews & Testimonials
  protected readonly clientReviews: ClientReview[] = [
    {
      id: 'lacastle',
      clientName: 'Er. R. Vignesh',
      role: 'Managing Director',
      company: 'La Castle Homes',
      website: 'https://lacastlehomes.com/',
      projectTitle: 'Luxury Construction & Modern Architecture Portal',
      rating: 5,
      reviewText: 'Arivom Technologies built our official web platform (lacastlehomes.com) with exceptional craftsmanship. It showcases our luxury residential villas, commercial landmarks, and construction portfolio with astonishing speed and elegance. Inquiries from prospective homeowners across Tamil Nadu started coming in immediately. Delivered right within our ₹10,000 – ₹15,000 budget and on schedule!',
      avatarText: 'LC',
      badge: 'Verified Client • Live Website',
      deliverable: 'Responsive Website Build (lacastlehomes.com)',
      budgetInr: '₹10,000 – ₹15,000',
      verified: true
    },
    {
      id: 'finedge',
      clientName: 'Karthik Narayanan',
      role: 'Chief Technology Officer',
      company: 'FinEdge Payment Technologies',
      website: 'https://arivomtechnologies.com/',
      projectTitle: 'Spring Boot 3 & PostgreSQL Settlement Microservice',
      rating: 5,
      reviewText: 'Their mastery of Java 21, Spring Boot, and PostgreSQL is unmatched. Arivom Technologies engineered a resilient transaction settlement engine that processes over ₹10 Crore monthly volume with sub-35ms p99 response times. Zero double-spend anomalies, zero downtime.',
      avatarText: 'FE',
      badge: 'FinTech Microservices',
      deliverable: 'Spring Boot Backend & Kafka Pipeline',
      budgetInr: '₹3,80,000',
      verified: true
    },
    {
      id: 'logitrack',
      clientName: 'Suresh Kumar',
      role: 'VP of Engineering',
      company: 'LogiTrack Solutions',
      website: 'https://arivomtechnologies.com/',
      projectTitle: 'Real-Time Fleet & Logistics Command Center',
      rating: 5,
      reviewText: 'Our dispatch team monitors 4,500+ commercial vehicles in real-time. Arivom Technologies delivered a reactive Angular 19 dashboard powered by WebSocket telemetry and MongoDB time-series aggregation that cut page load time by 85%. Flawless execution.',
      avatarText: 'LT',
      badge: 'Enterprise Web Portal',
      deliverable: 'Angular Web Portal + MongoDB Telemetry',
      budgetInr: '₹1,20,000',
      verified: true
    },
    {
      id: 'healthpulse',
      clientName: 'Dr. Anita Menon',
      role: 'Co-Founder & Product Lead',
      company: 'HealthPulse Telemedicine',
      website: 'https://arivomtechnologies.com/',
      projectTitle: 'Cross-Platform React Native iOS & Android App',
      rating: 5,
      reviewText: 'We needed to ship to both Apple App Store and Google Play on an aggressive timeline. Arivom Technologies delivered our React Native mobile application in just 7 weeks with encrypted video consults, biometric auth, and offline medical records. Over 80k active users and a 4.8-star store rating!',
      avatarText: 'HP',
      badge: 'Mobile App (iOS & Android)',
      deliverable: 'React Native Dual-Store App',
      budgetInr: '₹1,90,000',
      verified: true
    }
  ];

  // Case Studies matching mockup
  protected readonly caseStudies: CaseStudy[] = [
    {
      id: 'lacastle',
      title: 'La Castle Homes',
      clientName: 'La Castle Homes',
      clientUrl: 'https://lacastlehomes.com/',
      imageUrl: 'images/lacastle-showcase.jpg',
      badge: 'Real Estate Website',
      category: 'Web Applications',
      impact: '40+ High-Value Villa Inquiries in First Month',
      budgetInr: '₹10,000 – ₹15,000',
      description: 'A modern, responsive real estate platform with advanced property search, enquiry management and admin dashboard.',
      stack: ['React.js / Web', 'Spring Boot APIs', 'PostgreSQL', 'Tailwind CSS'],
      results: [
        '100% mobile responsiveness across all devices',
        'Sub-1.2s page load time with optimized villa photography',
        'Automated inquiry capture with instant WhatsApp & email dispatch'
      ]
    },
    {
      id: 'fintech-gateway',
      title: 'Payment Gateway Platform',
      clientName: 'FinTech Startup',
      clientUrl: 'https://arivomtechnologies.com/',
      imageUrl: 'images/cs-fintech-gateway.jpg',
      badge: 'FinTech',
      category: 'FinTech',
      impact: '₹10+ Crore Monthly Settlements with < 35ms Latency',
      budgetInr: '₹3,80,000',
      description: 'Secure and scalable payment processing solution with real-time transaction monitoring, multi-currency support, and fraud prevention.',
      stack: ['Spring Boot 3', 'Angular', 'PostgreSQL', 'Apache Kafka'],
      results: [
        '99.999% transaction settlement uptime',
        'Zero double-spend anomalies with distributed ACID locking',
        'PCI-DSS compliant end-to-end transaction security'
      ]
    },
    {
      id: 'smart-farm',
      title: 'Smart Farm Monitoring',
      clientName: 'AgriSense IoT',
      clientUrl: 'https://arivomtechnologies.com/',
      imageUrl: 'images/cs-smart-farm.jpg',
      badge: 'IoT',
      category: 'IoT',
      impact: '35% Irrigation Cost Reduction Across 2,000+ Acres',
      budgetInr: '₹2,40,000',
      description: 'IoT-based solution to monitor soil health, weather and crop conditions in real-time with satellite telemetry and automated alerts.',
      stack: ['Spring Boot', 'React Native', 'MongoDB', 'MQTT'],
      results: [
        'Real-time soil sensor telemetry under 100ms latency',
        'Offline caching for rural areas with periodic sync',
        'Automated solenoid valve triggers for drip irrigation'
      ]
    },
    {
      id: 'fitness-app',
      title: 'Fitness & Wellness App',
      clientName: 'FitFlow Mobile',
      clientUrl: 'https://arivomtechnologies.com/',
      imageUrl: 'images/cs-fitness-app.jpg',
      badge: 'Mobile Apps',
      category: 'Mobile Apps',
      impact: '4.8 ★ App Store Rating & 120,000+ Active Users',
      budgetInr: '₹1,90,000',
      description: 'Cross-platform mobile application with personalized workout and diet plans, live video coaches, and wearable device integration.',
      stack: ['React Native', 'Firebase', 'Node.js', 'WatermelonDB'],
      results: [
        'Single codebase targeting Apple iOS & Google Play Store',
        'Fluid 60fps animations & offline workout routine caching',
        'Apple Health & Google Fit bi-directional sensor sync'
      ]
    },
    {
      id: 'legacy-microservices',
      title: 'Legacy to Microservices',
      clientName: 'Enterprise Logistics',
      clientUrl: 'https://arivomtechnologies.com/',
      imageUrl: 'images/cs-microservices-migration.jpg',
      badge: 'Architecture Migration',
      category: 'Architecture Migration',
      impact: 'Zero-Downtime Migration & 4x Peak Throughput Capacity',
      budgetInr: '₹5,20,000',
      description: 'Migrated monolithic application to microservices with improved performance, isolated failure domains, and automated Kubernetes scaling.',
      stack: ['Spring Boot 3', 'Docker', 'Kubernetes', 'Kafka'],
      results: [
        'Zero-downtime blue/green migration for 5M monthly orders',
        'Decoupled microservice teams for faster independent deployments',
        'Sub-40ms p99 response times during holiday shopping peaks'
      ]
    }
  ];

  // Filtered Case Studies
  protected readonly filteredCaseStudies = computed(() => {
    const filter = this.caseStudyFilter().toLowerCase();
    if (filter === 'all') {
      return this.caseStudies;
    }
    return this.caseStudies.filter(cs => 
      cs.category.toLowerCase().includes(filter) || 
      cs.badge.toLowerCase().includes(filter)
    );
  });

  // Core Technologies
  protected readonly technologies: TechItem[] = [
    {
      id: 'springboot',
      name: 'Spring Boot 3 & Java',
      category: 'backend',
      categoryLabel: 'Backend Engineering',
      tagline: 'High-throughput enterprise APIs & resilient backend engines',
      icon: 'leaf',
      color: 'from-emerald-500 to-teal-400',
      badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      description: 'Leveraging Java 21 LTS and Spring Boot 3 for bulletproof enterprise applications, virtual threads, reactive pipelines, and rock-solid business logic.',
      highlights: [
        'Spring Boot 3, Spring Web, Spring Data JPA & Security',
        'Virtual Threads (Project Loom) for ultra-high concurrency',
        'RESTful APIs, gRPC & GraphQL architectures',
        'Kafka & RabbitMQ asynchronous message queues',
        'JUnit 5, Mockito & Testcontainers integration testing'
      ],
      useCases: ['Enterprise Backends', 'FinTech Payment Gateways', 'High-Load SaaS APIs', 'Healthcare Engines']
    },
    {
      id: 'angular',
      name: 'Modern Angular',
      category: 'frontend',
      categoryLabel: 'Web Frontend',
      tagline: 'Reactive enterprise web portals, dashboards & single-page applications',
      icon: 'sparkles',
      color: 'from-red-500 to-rose-400',
      badgeBg: 'bg-rose-50 text-rose-700 border-rose-200',
      description: 'Engineering responsive, lightning-fast web applications using Angular Standalone Components, Signals, RxJS reactive patterns, and Tailwind CSS.',
      highlights: [
        'Angular Standalone Architecture & Fine-Grained Signals',
        'Tailwind CSS for responsive design & clean UI aesthetics',
        'RxJS reactive state streams & robust HTTP interceptors',
        'Role-Based Access Control (RBAC) & Protected Routing',
        'Enterprise Admin Portals with interactive charts & data tables'
      ],
      useCases: ['Enterprise Web Apps', 'B2B Admin Dashboards', 'Customer Portals', 'Real-Time Analytics']
    },
    {
      id: 'react-native',
      name: 'React Native (iOS & Android)',
      category: 'mobile',
      categoryLabel: 'Mobile App Development',
      tagline: 'Native cross-platform mobile apps for Apple iOS & Android devices',
      icon: 'smartphone',
      color: 'from-cyan-500 to-blue-400',
      badgeBg: 'bg-cyan-50 text-cyan-700 border-cyan-200',
      description: 'Single codebase targeting both App Store and Google Play with fluid 60fps native animations, biometric auth, offline caching, and device integrations.',
      highlights: [
        'Cross-platform iOS and Android native performance',
        'Expo & Bare React Native development workflows',
        'Offline-first caching with WatermelonDB / MMKV / SQLite',
        'Biometric authentication (FaceID / Fingerprint) & Push Notifications',
        'App Store Connect & Google Play Console automated releases'
      ],
      useCases: ['Consumer Mobile Apps', 'On-Demand Service Apps', 'Field Worker Tablets', 'FinTech Mobile Wallets']
    },
    {
      id: 'postgresql',
      name: 'PostgreSQL Database',
      category: 'database',
      categoryLabel: 'Relational Database',
      tagline: 'ACID-compliant relational data modeling, indexing & optimization',
      icon: 'database',
      color: 'from-blue-500 to-indigo-400',
      badgeBg: 'bg-blue-50 text-blue-700 border-blue-200',
      description: 'The world\'s most advanced open-source relational database. Mastered for complex schemas, transactional integrity, JSONB semi-structured storage, and high-performance tuning.',
      highlights: [
        'Relational schema architecture & normal form normalization',
        'High-performance indexing (B-Tree, GIN, GiST, BRIN)',
        'JSONB queries for hybrid SQL/NoSQL flexibility',
        'PgBouncer connection pooling & transaction management',
        'Database replication, automated backups & point-in-time recovery'
      ],
      useCases: ['Transactional Banking', 'Billing & Invoicing', 'Relational Core Data', 'Inventory Management']
    },
    {
      id: 'mongodb',
      name: 'MongoDB NoSQL',
      category: 'database',
      categoryLabel: 'Document Database',
      tagline: 'Flexible document modeling, rapid iteration & scalable aggregation',
      icon: 'server',
      color: 'from-green-500 to-emerald-400',
      badgeBg: 'bg-green-50 text-green-700 border-green-200',
      description: 'Modern NoSQL document database designed for rapid schema iteration, unstructured feeds, polymorphic data payloads, and complex aggregation pipelines.',
      highlights: [
        'Document-oriented JSON schema design & versioning',
        'Multi-stage Aggregation Pipeline execution',
        'Horizontal sharding, replica set clusters & failover',
        'Change Streams for real-time WebSocket push updates',
        'Time-series collections for IoT & event telemetry'
      ],
      useCases: ['Activity Feeds & Logs', 'E-Commerce Catalogs', 'Real-Time Notifications', 'IoT Telemetry']
    },
    {
      id: 'monolithic',
      name: 'Modular Monoliths',
      category: 'architecture',
      categoryLabel: 'Software Architecture',
      tagline: 'Simplified deployment, ultra-fast development & cohesive codebases',
      icon: 'layers',
      color: 'from-amber-500 to-orange-400',
      badgeBg: 'bg-amber-50 text-amber-800 border-amber-200',
      description: 'Pragmatic, high-velocity engineering for startups and medium products. Clean domain modularity without the operational complexity or latency of distributed networks.',
      highlights: [
        'Domain-Driven Design (DDD) with strictly separated modules',
        'Zero network latency for internal module communication',
        'Single-step CI/CD pipeline & minimal cloud infrastructure costs',
        'Easier transactional rollbacks and single database transactions',
        'Ready for seamless future extraction into microservices when needed'
      ],
      useCases: ['MVP Product Launches', 'Cost-Sensitive SaaS', 'Internal Business Tools', 'Mid-scale Platforms']
    },
    {
      id: 'microservices',
      name: 'Distributed Microservices',
      category: 'architecture',
      categoryLabel: 'Software Architecture',
      tagline: 'Independently scalable, fault-tolerant & cloud-native service clusters',
      icon: 'cpu',
      color: 'from-purple-500 to-violet-400',
      badgeBg: 'bg-purple-50 text-purple-700 border-purple-200',
      description: 'Decoupled services built with Spring Cloud, Docker, and Kubernetes for high concurrency, independent deployability, and isolated failure domains.',
      highlights: [
        'Spring Cloud Gateway & distributed service discovery',
        'Resilience4j circuit breakers, rate limiting & retry policies',
        'Distributed tracing (Zipkin / OpenTelemetry) & central logging',
        'Docker containerization & Kubernetes orchestrations',
        'Event-Driven architecture via Kafka / RabbitMQ asynchronous buses'
      ],
      useCases: ['Large Enterprise Platforms', 'Multi-tenant Global SaaS', 'High-Concurrency Systems', 'Independent Team Scaling']
    }
  ];

  // Filtered Technologies
  protected readonly filteredTechnologies = computed(() => {
    const filter = this.activeTechFilter();
    if (filter === 'all') {
      return this.technologies;
    }
    return this.technologies.filter(tech => tech.category === filter);
  });

  // Services with INR Pricing (High-Impact Modern Solutions with Generated Images)
  protected readonly services: ServiceItem[] = [
    {
      id: 'ai-saas-products',
      title: 'AI & Multi-Tenant SaaS Products',
      badge: 'AI & Cloud SaaS',
      imageUrl: 'images/service-ai-saas.jpg',
      tagline: 'Intelligent Automations • LLM Integrations • Multi-Tenant',
      priceInr: '₹80,000 – ₹2,80,000+',
      duration: 'Agile MVP • 3–8 Weeks',
      themeColor: 'purple',
      icon: 'sparkles',
      description: 'End-to-end engineered software-as-a-service platforms with generative AI workflows, intelligent copilots, Stripe/Razorpay subscription billing, and isolated multi-tenant data partitioning.',
      features: [
        'OpenAI / Anthropic LLM API orchestrations & vector RAG search',
        'Multi-tenant workspace isolation with role-based permissions (RBAC)',
        'Automated recurring billing, usage quotas & invoicing webhooks',
        'Angular reactive control centers with real-time audit event feeds'
      ],
      deliverables: ['Production SaaS codebase', 'AI prompt pipelines & guardrails', 'Subscription gateway setup', '30-day launch warranty']
    },
    {
      id: 'cloud-devops-migration',
      title: 'Cloud Migration & Kubernetes DevOps',
      badge: 'DevOps & Migration',
      imageUrl: 'images/service-cloud-devops.jpg',
      tagline: 'Zero Downtime • Docker • Auto-Scaling Infrastructure',
      priceInr: '₹75,000 – ₹3,50,000+',
      duration: 'Sprint Delivery • 2–6 Weeks',
      themeColor: 'amber',
      icon: 'cpu',
      description: 'Modernize legacy codebases into containerized microservices. Zero-downtime database cutovers, automated GitHub Actions CI/CD pipelines, and cost-optimized AWS/DigitalOcean clusters.',
      features: [
        'Monolith-to-microservice decomposition & domain boundaries',
        'Docker containerization & production Kubernetes (EKS/K8s) clusters',
        'Zero-downtime live database migration with automated rollback safety',
        'Prometheus, Grafana & centralized logging with proactive health alerts'
      ],
      deliverables: ['Infrastructure as Code (IaC)', 'Zero-downtime deployment runs', 'Security hardening report', '24/7 cluster monitoring config']
    },
    {
      id: 'enterprise-erp-crm',
      title: 'Custom Enterprise ERP & Operations Suites',
      badge: 'Enterprise Systems',
      imageUrl: 'images/service-enterprise-erp.jpg',
      tagline: 'Workflow Automation • Supply Chain • Real-Time Dashboards',
      priceInr: '₹1,20,000 – ₹5,00,000+',
      duration: 'Milestone Roadmap • 6–16 Weeks',
      themeColor: 'blue',
      icon: 'layers',
      description: 'Tailored enterprise software automating operational bottlenecks: warehouse inventories, vendor procurement, field dispatch tracking, and financial compliance with sub-second report generation.',
      features: [
        'Spring Boot 3 backend engine with high-throughput ACID transactions',
        'Fine-grained audit logs, approval workflows & digital signatures',
        'Exportable executive analytics (Excel, PDF, CSV) & scheduled digests',
        'Offline-capable field operator apps with background data synchronization'
      ],
      deliverables: ['Custom enterprise suite', 'Complete source repository ownership', 'REST/GraphQL documentation', 'Staff training walkthrough']
    },
    {
      id: 'ecommerce-omnichannel',
      title: 'Omnichannel E-Commerce & Retail Systems',
      badge: 'High-Volume Commerce',
      imageUrl: 'images/service-ecommerce-omni.jpg',
      tagline: 'Sub-Second Checkout • Inventory Sync • Payment Gateways',
      priceInr: '₹60,000 – ₹2,20,000+',
      duration: 'Turnkey Launch • 3–6 Weeks',
      themeColor: 'emerald',
      icon: 'shopping-bag',
      description: 'High-speed headless commerce portals engineered for extreme peak traffic. Instant UPI/card checkouts, automated WhatsApp order notifications, and unified multi-location stock synchronization.',
      features: [
        'Ultra-fast product discovery with faceted search & Redis caching',
        'Seamless Razorpay, Stripe, UPI & Cashfree payment integrations',
        'Automated abandoned-cart recovery & real-time WhatsApp tracking alerts',
        'Multi-warehouse stock reservation with zero overselling anomalies'
      ],
      deliverables: ['Headless commerce portal', 'Payment gateway webhooks verification', 'Catalog management dashboard', 'SEO product indexing']
    },
    {
      id: 'database-engineering',
      title: 'Database Design & Optimization',
      badge: 'PostgreSQL & MongoDB',
      priceInr: '₹35,000 – ₹80,000',
      icon: 'database',
      description: 'Expert database architecture, indexing, query optimization, and data modeling to ensure zero query bottlenecks and rock-solid data integrity.',
      features: [
        'PostgreSQL relational schema modeling & indexing audits',
        'MongoDB document design & aggregation pipelines',
        'Connection pooling, query tuning & cache layer (Redis)',
        'Data migration, replication & backup strategies'
      ],
      deliverables: ['Optimized schema DDL/migrations', 'Query performance report', 'Indexing strategy document', 'High availability setup']
    },
    {
      id: 'dedicated-freelance',
      title: 'Dedicated Freelance Retainer',
      badge: 'Monthly Staff Augmentation',
      priceInr: '₹80,000 – ₹1,50,000 / month',
      icon: 'user-check',
      description: 'Hire our senior engineering expertise on a monthly freelance contract to accelerate your product roadmap, build critical features, or fix blockers.',
      features: [
        'Direct collaboration with senior engineers — no junior delegation',
        'Full alignment with your timezone, Slack, Jira, and GitHub',
        'Transparent daily or weekly sprint demos',
        'Flexible monthly or milestone billing in INR'
      ],
      deliverables: ['Direct daily commits', 'Sprint progress updates', 'Peer code reviews', 'Immediate availability']
    }
  ];

  // FAQ Items
  protected readonly faqs = signal<FaqItem[]>([
    {
      question: 'Do you really build complete websites starting at ₹10,000 to ₹15,000?',
      answer: 'Yes! For businesses, consultants, and firms needing a high-speed, modern, and professional web presence, our starting website package is ₹10,000 to ₹15,000. It includes custom design, mobile responsiveness, Tailwind CSS styling, SEO tags, contact forms, and deployment.',
      isOpen: true
    },
    {
      question: 'What is the pricing for custom Web and Mobile applications?',
      answer: 'Custom full-stack web applications (Angular + Spring Boot) range from ₹60,000 to ₹1,50,000. Cross-platform mobile applications for both Apple iOS and Android in React Native range from ₹1,20,000 to ₹2,50,000. Large enterprise microservices platforms typically range from ₹3,00,000 to ₹6,00,000+. All pricing is transparent with clear milestone deliverables.',
      isOpen: false
    },
    {
      question: 'Can you show us a real live client website you built?',
      answer: 'Absolutely! Check out our featured client showcase above for La Castle Homes (https://lacastlehomes.com/) or explore our live project portfolio.',
      isOpen: false
    },
    {
      question: 'Why choose Spring Boot and Java for our backend?',
      answer: 'Java and Spring Boot deliver enterprise-grade stability, rock-solid multithreading, high throughput, and robust security protocols. Whether you are building financial transactions, healthcare platforms, or large-scale SaaS, Spring Boot guarantees predictable performance and immense ecosystem maturity.',
      isOpen: false
    },
    {
      question: 'Should our system be built as a Monolith or Microservices?',
      answer: 'We believe in pragmatic software engineering. For fast MVPs, early startups, or teams needing fast iteration, a well-structured Modular Monolith avoids unnecessary network complexity and operational overhead. For systems needing independent deployments, high concurrency, or distributed teams, we architect robust Spring Cloud Microservices with Docker and Kubernetes.',
      isOpen: false
    },
    {
      question: 'How do you guarantee quality and code handover?',
      answer: 'Every project includes rigorous unit/integration tests, clean commit histories, automated CI/CD pipelines, Docker container configurations, API documentation (OpenAPI/Swagger), and a complete code walkthrough session before project sign-off. You own 100% of all intellectual property.',
      isOpen: false
    }
  ]);

  // Estimator Calculations in INR
  protected readonly estimatedBudgetInr = computed(() => {
    const type = this.estimatorProjectType();
    const plat = this.estimatorPlatform();
    const arch = this.estimatorArchitecture();

    if (type === 'mvp') {
      return '₹10,000 – ₹15,000';
    } else if (type === 'fullstack') {
      if (plat === 'web') return '₹60,000 – ₹1,20,000';
      if (plat === 'mobile') return '₹1,20,000 – ₹2,20,000';
      return '₹1,80,000 – ₹3,50,000';
    } else if (type === 'enterprise') {
      return arch === 'microservices' ? '₹3,00,000 – ₹6,00,000+' : '₹1,80,000 – ₹3,20,000';
    } else {
      // migration
      return '₹1,50,000 – ₹3,00,000';
    }
  });

  protected readonly estimatedDuration = computed(() => {
    let weeks = 2;
    const type = this.estimatorProjectType();
    const plat = this.estimatorPlatform();
    const arch = this.estimatorArchitecture();

    if (type === 'mvp') return '1 – 2 Weeks';
    if (type === 'fullstack') weeks = 4;
    if (type === 'enterprise') weeks = 8;
    if (type === 'migration') weeks = 6;

    if (plat === 'web-mobile') weeks += 2;
    if (arch === 'microservices') weeks += 2;

    return `${weeks} – ${weeks + 2} Weeks`;
  });

  protected readonly estimatedSprintPlan = computed(() => {
    const arch = this.estimatorArchitecture();
    const plat = this.estimatorPlatform();
    const db = this.estimatorDatabase();
    const type = this.estimatorProjectType();

    if (type === 'mvp') {
      return [
        { phase: 'Phase 1: Design & Brand Alignment', desc: 'Modern layout, typography, and responsive UX design tailored to your brand' },
        { phase: 'Phase 2: Frontend Implementation', desc: 'Tailwind CSS, high-speed image optimization, and interactive components' },
        { phase: 'Phase 3: Lead Capture & SEO Setup', desc: 'Contact forms, Google SEO meta tags, and instant WhatsApp/Email alerts' },
        { phase: 'Phase 4: Launch & Handover', desc: 'Domain linkage, fast cloud hosting, SSL security, and full source code handover' }
      ];
    }

    return [
      { phase: 'Phase 1: Architecture & Data Modeling', desc: `Domain modeling with ${db === 'postgres' ? 'PostgreSQL' : db === 'mongo' ? 'MongoDB' : 'PostgreSQL & MongoDB'}` },
      { phase: 'Phase 2: Core Backend Engine', desc: `Spring Boot 3 API with ${arch === 'monolith' ? 'Modular Monolith structure' : 'Microservices & Gateway'}` },
      { phase: 'Phase 3: Client Applications', desc: `Client delivery for ${plat === 'web' ? 'Angular Web Portal' : plat === 'mobile' ? 'React Native iOS & Android' : 'Angular Web + React Native Mobile'}` },
      { phase: 'Phase 4: Testing, Security & Launch', desc: 'Integration test suites, Docker containers, CI/CD pipeline, and production release' }
    ];
  });

  // Action Methods
  toggleMobileMenu(): void {
    this.mobileMenuOpen.update(v => !v);
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
  }

  setTechFilter(filter: string): void {
    this.activeTechFilter.set(filter);
  }

  openTechDetail(tech: TechItem): void {
    this.selectedTech.set(tech);
  }

  closeTechDetail(): void {
    this.selectedTech.set(null);
  }

  setArchitectureMode(mode: 'monolith' | 'microservices'): void {
    this.architectureMode.set(mode);
  }

  toggleFaq(index: number): void {
    this.faqs.update(items => {
      return items.map((item, i) => {
        if (i === index) {
          return { ...item, isOpen: !item.isOpen };
        }
        return item;
      });
    });
  }

  copyEmail(): void {
    navigator.clipboard.writeText(this.contactEmail).then(() => {
      this.emailCopied.set(true);
      setTimeout(() => {
        this.emailCopied.set(false);
      }, 3000);
    }).catch(() => {
      this.emailCopied.set(true);
      setTimeout(() => this.emailCopied.set(false), 3000);
    });
  }

  applyEstimateToContact(): void {
    const typeLabel = this.estimatorProjectType() === 'mvp' ? 'Starter Website (₹10,000 - ₹15,000)'
      : this.estimatorProjectType() === 'fullstack' ? 'Full-Stack Web & Mobile App'
      : this.estimatorProjectType() === 'enterprise' ? 'Large Enterprise Platform' : 'Architecture Modernization';

    this.contactForm.projectType = typeLabel;
    this.contactForm.budget = this.estimatedBudgetInr();
    this.contactForm.architecture = this.estimatorArchitecture() === 'monolith' ? 'Modular Monolith / Modern Web' : 'Microservices Architecture';
    this.contactForm.message = `Hi Arivom Technologies, I used your Project Estimator:
- Project: ${typeLabel}
- Platform: ${this.estimatorPlatform()}
- Database: ${this.estimatorDatabase()}
- Architecture: ${this.estimatorArchitecture()}
- Estimated Budget: ${this.estimatedBudgetInr()}
- Estimated Duration: ${this.estimatedDuration()}

I would like to discuss kickoff, milestones, and technical requirements.`;

    this.openContactModal();
  }

  selectPlan(plan: PricingPlan): void {
    this.contactForm.projectType = plan.title;
    this.contactForm.budget = plan.priceInr;
    this.contactForm.message = `Hi Arivom Technologies, I am interested in your ${plan.title} package (${plan.priceInr}).
Ideal timeline: ${plan.duration}.
Please connect with me to discuss our requirements and kickoff.`;

    this.openContactModal();
  }

  openContactModal(): void {
    this.contactModalOpen.set(true);
  }

  closeContactModal(): void {
    this.contactModalOpen.set(false);
  }


  submitContactForm(): void {
    if (!this.contactForm.name || !this.contactForm.email) {
      alert('Please provide your name and email address so we can respond.');
      return;
    }

    const subject = encodeURIComponent(`Project Inquiry: ${this.contactForm.projectType} [${this.contactForm.budget}] - ${this.contactForm.name}`);
    const body = encodeURIComponent(
`Hello Arivom Technologies Team,

Name: ${this.contactForm.name}
Email: ${this.contactForm.email}
Project Type: ${this.contactForm.projectType}
Architecture Preference: ${this.contactForm.architecture}
Estimated Budget (INR): ${this.contactForm.budget}
Timeline: ${this.contactForm.timeline}

Project Details:
${this.contactForm.message}

Website: https://arivomtechnologies.com/
`
    );

    const mailtoUrl = `mailto:${this.contactEmail}?subject=${subject}&body=${body}`;
    window.location.href = mailtoUrl;

    this.formSubmitted.set(true);
    setTimeout(() => {
      this.formSubmitted.set(false);
      this.closeContactModal();
    }, 4000);
  }

  // Lifecycle & Hash Sync
  ngOnInit(): void {
    this.handleHashChange();
    if (typeof window !== 'undefined') {
      window.addEventListener('hashchange', () => this.handleHashChange());
      // Auto-advance hero banner every 4.5 seconds unless paused
      this.heroSlideInterval = setInterval(() => {
        if (!this.isSlidePaused()) {
          this.nextHeroSlide();
        }
      }, 4500);
    }
  }

  ngOnDestroy(): void {
    if (this.heroSlideInterval) {
      clearInterval(this.heroSlideInterval);
    }
  }

  protected handleHashChange(): void {
    if (typeof window === 'undefined') return;
    const hash = window.location.hash.replace('#', '').toLowerCase();
    const validPages: PageName[] = ['home', 'about', 'services', 'clients', 'pricing', 'tech-stack', 'case-studies', 'reviews', 'estimator', 'faq'];
    if (validPages.includes(hash as PageName)) {
      this.currentPage.set(hash as PageName);
    }
  }

  navigateTo(page: PageName, fragment?: string): void {
    this.currentPage.set(page);
    this.closeMobileMenu();
    this.servicesDropdownOpen.set(false);
    if (typeof window !== 'undefined') {
      window.location.hash = page;
      if (fragment) {
        setTimeout(() => {
          const el = document.getElementById(fragment);
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 50);
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  }

  toggleServicesDropdown(): void {
    this.servicesDropdownOpen.update(v => !v);
  }

  closeServicesDropdown(): void {
    this.servicesDropdownOpen.set(false);
  }

  setCaseStudyFilter(filter: string): void {
    this.caseStudyFilter.set(filter);
  }
}
