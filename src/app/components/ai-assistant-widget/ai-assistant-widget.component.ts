import { 
  Component, 
  inject, 
  signal, 
  ViewChild, 
  ElementRef, 
  AfterViewChecked 
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AiAssistantService, ChatMessage } from '../../services/ai-assistant.service';

@Component({
  selector: 'app-ai-assistant-widget',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ai-assistant-widget.component.html',
  styleUrl: './ai-assistant-widget.component.css'
})
export class AiAssistantWidgetComponent implements AfterViewChecked {
  protected readonly aiService = inject(AiAssistantService);

  @ViewChild('chatScrollContainer') private chatScrollContainer?: ElementRef<HTMLDivElement>;

  protected userInput = signal<string>('');
  protected showTooltip = signal<boolean>(true);
  private shouldScrollToBottom = false;

  protected readonly quickChips = [
    { label: '💼 Services Offered', query: 'What services does Arivom Technologies provide?' },
    { label: '💰 Pricing & Timeline', query: 'How much does a website or mobile app cost?' },
    { label: '📱 Mobile Development', query: 'Do you build iOS and Android apps using React Native?' },
    { label: '☕ Spring Boot Backend', query: 'Can you build Java 21 and Spring Cloud microservices?' },
    { label: '📞 Contact Human Team', query: 'How can I contact your engineering leads on WhatsApp or email?' }
  ];

  ngAfterViewChecked(): void {
    if (this.shouldScrollToBottom) {
      this.scrollToBottom();
      this.shouldScrollToBottom = false;
    }
  }

  toggleChat(): void {
    this.aiService.toggleChat();
    this.showTooltip.set(false);
    if (this.aiService.isOpen()) {
      this.shouldScrollToBottom = true;
    }
  }

  dismissTooltip(event: MouseEvent): void {
    event.stopPropagation();
    this.showTooltip.set(false);
  }

  clearHistory(): void {
    this.aiService.clearChat();
  }

  async sendQuery(queryText?: string): Promise<void> {
    const textToSend = queryText || this.userInput();
    if (!textToSend.trim() || this.aiService.isTyping()) return;

    this.userInput.set('');
    this.shouldScrollToBottom = true;
    await this.aiService.sendMessage(textToSend);
    this.shouldScrollToBottom = true;
  }

  handleKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendQuery();
    }
  }

  private scrollToBottom(): void {
    try {
      if (this.chatScrollContainer?.nativeElement) {
        const el = this.chatScrollContainer.nativeElement;
        el.scrollTop = el.scrollHeight;
      }
    } catch {
      // Ignore scroll failures
    }
  }

  /**
   * Safe HTML parser for markdown formatting in chat bubbles:
   * Supports **bold**, *italic*, [link](url), bullet points •, and line breaks.
   */
  formatMessage(text: string): string {
    if (!text) return '';

    // 1. Sanitize HTML tags
    let safe = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');

    // 2. Bold: **text**
    safe = safe.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

    // 3. Italic: *text*
    safe = safe.replace(/\*(.*?)\*/g, '<em>$1</em>');

    // 4. Markdown links: [text](url)
    safe = safe.replace(
      /\[(.*?)\]\((https?:\/\/[^\s]+|mailto:[^\s]+|tel:[^\s]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-orange-600 dark:text-orange-400 font-semibold underline hover:text-orange-700 hover:decoration-2 transition-all">$1</a>'
    );

    // 5. Line breaks: \n -> <br>
    safe = safe.replace(/\n/g, '<br>');

    return safe;
  }
}
