import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
export class App {
  // Mobile Menu State
  protected readonly mobileMenuOpen = signal<boolean>(false);

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

  // Hero Visual Showcase Active Tab
  protected readonly heroActiveTab = signal<'core-stack' | 'lacastle' | 'mobile' | 'cloud'>('core-stack');

  protected readonly heroImageData = computed(() => {
    const tab = this.heroActiveTab();
    switch (tab) {
      case 'lacastle':
        return {
          url: 'images/lacastle-showcase.jpg',
          title: 'Live Client Website Showcase',
          badge: 'Starter Package • ₹10,000 – ₹15,000',
          desc: 'High-Converting Responsive Business Web Portal'
        };
      case 'mobile':
        return {
          url: 'images/arivom-mobile-apps.jpg',
          title: 'React Native iOS & Android Apps',
          badge: 'Single Codebase • 60fps Native UI',
          desc: 'High-Performance Cross-Platform Mobile Apps'
        };
      case 'cloud':
        return {
          url: 'images/arivom-cloud-architecture.jpg',
          title: 'Enterprise Microservices & Cloud Platform',
          badge: 'Spring Boot 3 • PostgreSQL • MongoDB',
          desc: 'API Gateways, Async Queues & Scalable DB Clusters'
        };
      case 'core-stack':
      default:
        return {
          url: 'images/arivom-core-stack.jpg',
          title: 'Arivom Full-Stack Architecture',
          badge: 'Spring Boot • Angular • React Native',
          desc: 'Custom Web Apps, Mobile Systems & Microservices'
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
        'Modern Tailwind CSS design & Dark/Light mode',
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

  // Case Studies with real images
  protected readonly caseStudies: CaseStudy[] = [
    {
      id: 'realestate-case',
      title: 'Luxury Architecture & Villa Showcase Portal',
      clientName: 'Modern Architecture Studio',
      imageUrl: 'images/lacastle-showcase.jpg',
      badge: 'Starter Website Package',
      category: 'Website Development • SEO • Lead Generation',
      impact: 'Generated 40+ high-value residential inquiries within first month',
      budgetInr: '₹10,000 – ₹15,000',
      description: 'Designed and developed a high-converting digital presence showcasing residential villas, commercial landmarks, and architectural engineering with lightning-fast mobile responsiveness.',
      stack: ['Tailwind CSS', 'Modern HTML5/JS', 'SEO Optimization', 'Lead Capture Form', 'Cloud Hosting'],
      results: [
        '100% mobile responsiveness across iOS and Android devices',
        'Sub-second page load times with optimized high-resolution villa galleries',
        'Direct inquiry dispatch to client phone & email'
      ]
    },
    {
      id: 'fintech-case',
      title: 'High-Frequency FinTech Settlement Service',
      clientName: 'FinEdge Technologies',
      clientUrl: 'https://arivomtechnologies.com/',
      imageUrl: 'images/arivom-cloud-architecture.jpg',
      badge: 'Enterprise Backend Engine',
      category: 'Spring Boot 3 • PostgreSQL • Microservices',
      impact: 'Processed ₹10+ Crore monthly volume with < 35ms p99 latency',
      budgetInr: '₹3,50,000 – ₹5,00,000',
      description: 'Engineered a resilient transaction settlement engine using Spring Boot 3 virtual threads, PostgreSQL partitioning, and Kafka asynchronous messaging.',
      stack: ['Java 21', 'Spring Boot 3', 'PostgreSQL', 'Apache Kafka', 'Docker'],
      results: [
        '99.99% uptime in production',
        'Zero double-spend anomalies with ACID locking',
        'Sub-40ms execution time under peak holiday load'
      ]
    },
    {
      id: 'telehealth-case',
      title: 'Cross-Platform Telehealth & Video Booking App',
      clientName: 'HealthPulse Care',
      clientUrl: 'https://arivomtechnologies.com/',
      imageUrl: 'images/arivom-mobile-apps.jpg',
      badge: 'React Native Mobile App',
      category: 'React Native • iOS & Android • PostgreSQL',
      impact: '4.8 ★ App Store & Play Store rating with 80k+ active users',
      budgetInr: '₹1,50,000 – ₹2,40,000',
      description: 'Developed a dual-platform mobile app with React Native featuring encrypted video consultations, doctor appointments, biometric security, and offline prescriptions.',
      stack: ['React Native', 'TypeScript', 'Spring Boot', 'PostgreSQL', 'WebRTC'],
      results: [
        'Shipped to both iOS and Android stores in 7 weeks',
        'Unified 92% shared codebase between platforms',
        'HIPAA-compliant end-to-end encrypted video'
      ]
    },
    {
      id: 'fleet-case',
      title: 'Enterprise Fleet & Logistics Telemetry Suite',
      clientName: 'LogiTrack Global',
      clientUrl: 'https://arivomtechnologies.com/',
      imageUrl: 'images/arivom-core-stack.jpg',
      badge: 'Real-Time Web Portal',
      category: 'Angular • Spring Boot • MongoDB',
      impact: 'Live tracking of 4,500+ active commercial transport vehicles',
      budgetInr: '₹1,00,000 – ₹1,80,000',
      description: 'Built a real-time command center web portal with Angular signals, WebSocket live telemetry, and MongoDB time-series aggregation for fleet analytics.',
      stack: ['Angular 19', 'Tailwind CSS', 'Spring Boot', 'MongoDB', 'WebSockets'],
      results: [
        '85% reduction in dashboard load times',
        'Real-time vehicle GPS ping updates every 2 seconds',
        'Automated geofencing alert engine'
      ]
    }
  ];

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
      badgeBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
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
      badgeBg: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
      description: 'Engineering responsive, lightning-fast web applications using Angular Standalone Components, Signals, RxJS reactive patterns, and Tailwind CSS.',
      highlights: [
        'Angular Standalone Architecture & Fine-Grained Signals',
        'Tailwind CSS for responsive design & polished dark/light themes',
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
      badgeBg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
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
      badgeBg: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
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
      badgeBg: 'bg-green-500/10 text-green-400 border-green-500/20',
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
      badgeBg: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
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
      badgeBg: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
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

  // Services with INR Pricing
  protected readonly services: ServiceItem[] = [
    {
      id: 'business-website',
      title: 'Business Website & Portfolio',
      badge: 'Starting Package',
      priceInr: '₹10,000 – ₹15,000',
      icon: 'globe',
      description: 'Fast, responsive, and elegant website for your company or firm, styled with Tailwind CSS and optimized for Google search and lead generation.',
      features: [
        'Responsive on mobile, tablet & desktop',
        'Interactive contact forms with instant email/phone alerts',
        'SEO-optimized architecture & Google search submission',
        'Pixel-perfect responsiveness, sub-second speed & clean modern UI'
      ],
      deliverables: ['Production-ready website', 'Free hosting guidance', 'Mobile testing report', 'Full code transfer']
    },
    {
      id: 'fullstack-web',
      title: 'Custom Web Application',
      badge: 'Angular + Spring Boot',
      priceInr: '₹60,000 – ₹1,50,000',
      icon: 'layers',
      description: 'End-to-end development of custom web portals, customer SaaS platforms, and enterprise dashboards with clean reactive UI and Spring Boot backend.',
      features: [
        'Custom Angular frontend with Tailwind CSS styling',
        'Spring Boot RESTful & GraphQL backend APIs',
        'Role-Based Access Control, JWT & OAuth2 security',
        'Automated CI/CD deployment pipelines'
      ],
      deliverables: ['Production-ready codebase', 'Full API documentation', 'Docker configurations', '30-day post-launch warranty']
    },
    {
      id: 'mobile-apps',
      title: 'Cross-Platform Mobile Apps',
      badge: 'React Native iOS & Android',
      priceInr: '₹1,20,000 – ₹2,50,000',
      icon: 'smartphone',
      description: 'Native-feel iOS and Android applications built from a single clean codebase, slashing development costs and speeding up time to market.',
      features: [
        'Dual-platform deployment to App Store & Google Play',
        'Fluid animations, biometric login, and push notifications',
        'Offline-first synchronization with local SQLite/WatermelonDB',
        'Native device integrations (Camera, GPS, Bluetooth)'
      ],
      deliverables: ['Signed iOS & Android binaries', 'Source repository access', 'Store submission assistance', 'UI/UX asset bundle']
    },
    {
      id: 'microservices-cloud',
      title: 'Microservices & API Architecture',
      badge: 'Spring Cloud & Distributed Systems',
      priceInr: '₹3,00,000 – ₹6,00,000+',
      icon: 'cpu',
      description: 'Design and implementation of distributed, cloud-native microservices architectures capable of processing millions of requests reliably.',
      features: [
        'Spring Cloud API Gateway, Eureka/Consul service discovery',
        'Resilience4j circuit breakers, rate limits & fallback handlers',
        'Asynchronous event queues with Kafka / RabbitMQ',
        'Docker containerization & Helm/Kubernetes readiness'
      ],
      deliverables: ['Decoupled service micro-repositories', 'Swagger/OpenAPI docs', 'Centralized logging setup', 'Architecture blueprints']
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

    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  selectPlan(plan: PricingPlan): void {
    this.contactForm.projectType = plan.title;
    this.contactForm.budget = plan.priceInr;
    this.contactForm.message = `Hi Arivom Technologies, I am interested in your ${plan.title} package (${plan.priceInr}).
Ideal timeline: ${plan.duration}.
Please connect with me to discuss our requirements and kickoff.`;

    const element = document.getElementById('contact');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  setHeroTab(tab: 'core-stack' | 'lacastle' | 'mobile' | 'cloud'): void {
    this.heroActiveTab.set(tab);
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
    }, 6000);
  }
}
