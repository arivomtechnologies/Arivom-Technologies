import { TestBed } from '@angular/core/testing';
import { AiAssistantService } from './ai-assistant.service';

describe('AiAssistantService', () => {
  let service: AiAssistantService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AiAssistantService]
    });
    service = TestBed.inject(AiAssistantService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize with a welcoming message', () => {
    expect(service.messages().length).toBeGreaterThanOrEqual(1);
    expect(service.messages()[0].role).toBe('model');
  });

  it('should handle toggleChat, openChat, and closeChat', () => {
    expect(service.isOpen()).toBe(false);
    service.openChat();
    expect(service.isOpen()).toBe(true);
    service.closeChat();
    expect(service.isOpen()).toBe(false);
    service.toggleChat();
    expect(service.isOpen()).toBe(true);
  });

  it('should respond to user message via Gemini API or fallback', async () => {
    const mockResponse = {
      candidates: [
        {
          content: {
            parts: [{ text: 'Our mobile app development starts from ₹45,000 INR.' }]
          }
        }
      ]
    };

    // Mock fetch to return instantly
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    } as any);

    await service.sendMessage('What is your pricing for mobile apps?');
    const msgs = service.messages();
    const lastMsg = msgs[msgs.length - 1];
    expect(lastMsg.role).toBe('model');
    expect(lastMsg.text).toContain('₹45,000');

    fetchSpy.mockRestore();
  });

  it('should clear chat history', () => {
    service.clearChat();
    expect(service.messages().length).toBe(1);
    expect(service.messages()[0].text).toContain('Chat history cleared');
  });
});
