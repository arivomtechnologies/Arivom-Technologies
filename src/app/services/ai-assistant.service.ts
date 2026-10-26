import { Injectable, signal } from '@angular/core';

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  status?: 'sent' | 'received' | 'error';
}

export const ARIVOM_SYSTEM_INSTRUCTION = `
You are the official AI Engineering Assistant for Arivom Technologies (https://arivomtechnologies.com).
Your purpose is to assist website visitors, prospective clients, founders, and enterprises by answering questions about Arivom's software engineering services, pricing, technical stack, architecture capabilities, and project delivery timelines.

About Arivom Technologies:
- Company: Enterprise Software Engineering & Architecture Consulting Studio
- Locations: Chennai and Tirunelveli, Tamil Nadu, India
- Contact Email: arivomtechnologies@gmail.com
- Phone / WhatsApp: +91 866 768 4683 (WhatsApp: https://wa.me/918667684683)
- Website: https://arivomtechnologies.com/

Core Service Offerings & Pricing (in Indian Rupees):
1. Starter Business Websites & Brand Portals:
   - Price: ₹10,000 – ₹15,000 INR
   - Timeline: 1 – 2 Weeks
   - Includes: 5–8 custom responsive pages, SEO meta tags, instant contact forms, lightning sub-second load times, 30-day warranty.
2. Custom Web Applications & Enterprise Portals:
   - Price: ₹35,000 – ₹75,000 INR
   - Timeline: 2 – 4 Weeks
   - Includes: Modern Angular (Signals, Standalone) or React, role-based access control, analytics dashboards, RESTful APIs, high performance.
3. Cross-Platform Mobile Applications:
   - Price: ₹45,000 – ₹95,000 INR
   - Timeline: 3 – 6 Weeks
   - Includes: Single codebase for iOS and Android with React Native, offline-first sync, push notifications, native bridge modules.
4. Distributed Cloud Microservices & High-Scale Backends:
   - Price: ₹80,000 – ₹1,80,000+ INR (or milestone-based retainer)
   - Timeline: 4 – 8 Weeks
   - Includes: Java 21, Spring Boot 3, Spring Cloud, gRPC/REST APIs, PostgreSQL, MongoDB, Docker, Kubernetes, AWS/GCP CI/CD pipelines.
5. AI Solutions & SaaS MVPs:
   - Custom quote based on scope.
   - Includes: Gemini / OpenAI LLM integration, Retrieval-Augmented Generation (RAG), vector search, prompt pipelines, SaaS subscription flows.

Key Technology Stack:
- Backend: Java 21, Spring Boot 3, Spring Cloud, Spring Security, REST & gRPC
- Frontend: Angular (Signals, Standalone Components, SSR), Tailwind CSS, GSAP Motion
- Mobile: React Native (iOS & Android)
- Databases: PostgreSQL (ACID relational) & MongoDB (Document & Streams)
- Cloud & DevOps: Docker, Kubernetes, GitHub Actions, AWS, GCP, Cloudflare

Tone & Rules:
- Friendly, highly technical yet accessible, concise, and trustworthy.
- Format responses cleanly with brief bullet points or bold text where appropriate.
- Whenever pricing is asked, provide the standard range in INR and suggest booking a quick discovery call.
- Always offer to connect via WhatsApp (+91 866 768 4683) or email (arivomtechnologies@gmail.com) for concrete quotes or technical scoping.
`;

@Injectable({
  providedIn: 'root'
})
export class AiAssistantService {
  // Built-in API Key provided for live Gemini AI generation (decoded at runtime)
  private readonly DEFAULT_API_KEY = typeof atob === 'function'
    ? atob('QVEuQWI4Uk42S29INWREbVRjYU85WGFEcm91andmamM4VWxWSERYdVhuSW1FM0ZxQUJtdVE=')
    : '';

  // Supported models with automatic fallback
  private readonly GEMINI_MODELS = ['gemini-flash-lite-latest', 'gemini-3.8-flash'];

  // Signals
  readonly isTyping = signal<boolean>(false);
  readonly isOpen = signal<boolean>(false);

  readonly messages = signal<ChatMessage[]>([
    {
      id: 'msg-welcome',
      role: 'model',
      text: 'Hello! 👋 I am **Arivom AI**, your software consulting assistant.\n\nAsk me about our **services**, **pricing**, **tech stack** (Spring Boot, Angular, React Native), or how we can build your next project!',
      timestamp: new Date(),
      status: 'received'
    }
  ]);

  toggleChat(): void {
    this.isOpen.update(open => !open);
  }

  openChat(): void {
    this.isOpen.set(true);
  }

  closeChat(): void {
    this.isOpen.set(false);
  }

  clearChat(): void {
    this.messages.set([
      {
        id: 'msg-welcome-' + Date.now(),
        role: 'model',
        text: 'Chat history cleared. How can I assist you with your project today?',
        timestamp: new Date(),
        status: 'received'
      }
    ]);
  }

  async sendMessage(userText: string): Promise<void> {
    const trimmed = userText.trim();
    if (!trimmed || this.isTyping()) return;

    // 1. Add user message to state
    const userMessage: ChatMessage = {
      id: 'user-' + Date.now(),
      role: 'user',
      text: trimmed,
      timestamp: new Date(),
      status: 'sent'
    };

    this.messages.update(list => [...list, userMessage]);
    this.isTyping.set(true);

    try {
      await this.callGeminiApi(trimmed);
    } catch (error: any) {
      console.error('Error in AiAssistantService:', error);
      // Fallback gracefully to smart knowledge base
      await this.simulateLocalResponse(trimmed);
    } finally {
      this.isTyping.set(false);
    }
  }

  private async callGeminiApi(latestUserMessage: string): Promise<void> {
    const contents = this.messages()
      .filter(m => m.status !== 'error')
      .map(m => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.text }]
      }));

    const payload = {
      system_instruction: {
        parts: [{ text: ARIVOM_SYSTEM_INSTRUCTION }]
      },
      contents: contents,
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 800
      }
    };

    let lastError: Error | null = null;

    // Attempt generation across supported models
    for (const model of this.GEMINI_MODELS) {
      try {
        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${this.DEFAULT_API_KEY}`;
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        });

        if (response.ok) {
          const data = await response.json();
          const replyText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

          if (replyText) {
            this.messages.update(list => [
              ...list,
              {
                id: 'model-' + Date.now(),
                role: 'model',
                text: replyText,
                timestamp: new Date(),
                status: 'received'
              }
            ]);
            return;
          }
        } else {
          const errJson = await response.json().catch(() => null);
          const errMsg = errJson?.error?.message || `HTTP ${response.status}`;
          lastError = new Error(errMsg);
        }
      } catch (err: any) {
        lastError = err;
      }
    }

    // If models are unreachable, trigger local knowledge fallback
    console.warn('Live Gemini API unavailable, using local knowledge base fallback:', lastError);
    await this.simulateLocalResponse(latestUserMessage);
  }

  /**
   * Built-in intelligent knowledge response engine.
   * Ensures instant, reliable answers even during network spikes or offline usage.
   */
  private async simulateLocalResponse(query: string): Promise<void> {
    await new Promise(r => setTimeout(r, 400));

    const q = query.toLowerCase();
    let reply = '';

    if (q.includes('price') || q.includes('cost') || q.includes('rate') || q.includes('budget') || q.includes('how much') || q.includes('inr')) {
      reply = `Here is our transparent pricing structure for standard software projects:\n\n` +
        `• **Starter Websites**: ₹10,000 – ₹15,000 (1–2 weeks, responsive 5–8 pages, SEO)\n` +
        `• **Custom Web Apps**: ₹35,000 – ₹75,000 (2–4 weeks, Angular/React + APIs + Auth)\n` +
        `• **Mobile Apps**: ₹45,000 – ₹95,000 (3–6 weeks, React Native iOS & Android)\n` +
        `• **Cloud Microservices & Backends**: ₹80,000 – ₹1,80,000+ (Java 21, Spring Boot 3, PostgreSQL)\n\n` +
        `💡 You can also use our interactive **Project Estimator** on this page, or message us on WhatsApp at [+91 866 768 4683](https://wa.me/918667684683) for a tailored proposal!`;
    } else if (q.includes('service') || q.includes('offer') || q.includes('what do you do') || q.includes('build')) {
      reply = `At **Arivom Technologies**, we specialize in end-to-end enterprise software development:\n\n` +
        `1. **Web Development**: Ultra-fast websites & single-page web applications (Angular, React, Tailwind CSS)\n` +
        `2. **Mobile App Development**: Cross-platform iOS & Android apps built with React Native\n` +
        `3. **Enterprise Backend Engineering**: High-throughput microservices using Java 21, Spring Boot 3 & Spring Cloud\n` +
        `4. **Databases & DevOps**: PostgreSQL, MongoDB, Docker, Kubernetes & CI/CD automations\n` +
        `5. **AI Integration**: Custom LLM features with Google Gemini & OpenAI\n\n` +
        `Which type of project are you planning?`;
    } else if (q.includes('mobile') || q.includes('ios') || q.includes('android') || q.includes('react native')) {
      reply = `Yes! We engineer production-grade mobile apps using **React Native**, giving you a single, maintainable codebase that runs natively on both iOS and Android.\n\n` +
        `• Native performance & smooth 60fps animations\n` +
        `• Offline caching & SQLite/WatermelonDB storage\n` +
        `• Push notifications, biometric login, and camera/location integrations\n` +
        `• Delivery in 3 to 6 weeks starting from ₹45,000 INR.\n\n` +
        `Would you like to discuss your app's core features?`;
    } else if (q.includes('backend') || q.includes('spring') || q.includes('java') || q.includes('microservice') || q.includes('cloud')) {
      reply = `Backend architecture is our core strength! We build resilient enterprise systems using:\n\n` +
        `• **Java 21 & Spring Boot 3 / Spring Cloud**\n` +
        `• **PostgreSQL & MongoDB** with connection pooling and schema migrations\n` +
        `• **Docker & Kubernetes** containerization\n` +
        `• REST & gRPC API contracts with automated testing\n` +
        `• Sub-100ms latency, high concurrent user throughput, and bank-grade security.`;
    } else if (q.includes('contact') || q.includes('hire') || q.includes('reach') || q.includes('whatsapp') || q.includes('email') || q.includes('phone') || q.includes('talk') || q.includes('human')) {
      reply = `We'd love to partner with you! Here is how you can connect directly with our engineering leads:\n\n` +
        `• **WhatsApp / Direct Call**: [+91 866 768 4683](https://wa.me/918667684683)\n` +
        `• **Email**: [arivomtechnologies@gmail.com](mailto:arivomtechnologies@gmail.com)\n` +
        `• **Locations**: Chennai & Tirunelveli, India\n\n` +
        `We typically reply within 1–2 hours during business hours!`;
    } else if (q.includes('hello') || q.includes('hi') || q.includes('hey') || q.includes('namaste')) {
      reply = `Hello! 👋 Great to have you here at **Arivom Technologies**.\n\n` +
        `I can help you explore our services, estimate project costs, understand our tech stack, or connect you with our team.\n\n` +
        `What can I help you build today?`;
    } else {
      reply = `Thank you for reaching out to **Arivom Technologies**!\n\n` +
        `We build high-performance web applications, React Native mobile apps, and Java 21 / Spring Boot cloud microservices.\n\n` +
        `• Check out our **Pricing & Estimator** tab for immediate ballparks.\n` +
        `• For direct scoping, message us on WhatsApp at [+91 866 768 4683](https://wa.me/918667684683) or email [arivomtechnologies@gmail.com](mailto:arivomtechnologies@gmail.com).`;
    }

    this.messages.update(list => [
      ...list,
      {
        id: 'model-' + Date.now(),
        role: 'model',
        text: reply,
        timestamp: new Date(),
        status: 'received'
      }
    ]);
  }
}
