import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, X, Bot } from 'lucide-react';
import { useThreatContext } from '@/context/ThreatContext';
import { ScrollArea } from '@/components/ui/scroll-area';
import ReactMarkdown from 'react-markdown';

const AIAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const { chatMessages, addChatMessage, threats } = useThreatContext();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatMessages]);

  // Auto-open when new threat detected
  useEffect(() => {
    if (chatMessages.length > 1) setIsOpen(true);
  }, [chatMessages.length]);

  const handleSend = () => {
    if (!input.trim()) return;
    const userMsg = { id: crypto.randomUUID(), role: 'user' as const, content: input, timestamp: new Date() };
    addChatMessage(userMsg);
    setInput('');

    // Simple local responses (could be replaced with Lovable AI)
    setTimeout(() => {
      const activeCount = threats.filter(t => !t.blocked).length;
      let response = '';
      const lower = input.toLowerCase();
      if (lower.includes('status') || lower.includes('how')) {
        response = `**Current System Status:**\n\n• **Total Threats Detected:** ${threats.length}\n• **Active (Unblocked):** ${activeCount}\n• **Blocked:** ${threats.length - activeCount}\n\n${activeCount > 0 ? '⚠️ You have active threats. I recommend reviewing the attack table and blocking malicious IPs.' : '✅ All threats are currently blocked. Systems are secure.'}`;
      } else if (lower.includes('block') || lower.includes('prevent')) {
        response = '🛡️ **Attack Prevention Guide:**\n\n1. Click the **Block** button next to any active threat in the attack table\n2. This simulates adding a firewall rule to block the malicious IP\n3. The dashboard will update to show the threat as mitigated\n\nFor automated blocking, consider enabling auto-block for threats with severity ≥ 8.';
      } else if (lower.includes('report') || lower.includes('download')) {
        response = '📊 **Security Reports:**\n\nYou can generate a downloadable security report from the **Reports** section in the sidebar. The report includes:\n• Attack history & timeline\n• Severity analysis\n• Threat trend graphs\n• Recommended security improvements';
      } else {
        response = `I'm your AI security assistant. I can help you with:\n\n• **"What's my status?"** — Current threat overview\n• **"How to block attacks?"** — Prevention guide\n• **"Generate report"** — Security report info\n\nI also automatically alert you when new threats are detected. Current active threats: **${activeCount}**`;
      }
      addChatMessage({ id: crypto.randomUUID(), role: 'assistant', content: response, timestamp: new Date() });
    }, 800);
  };

  return (
    <>
      {/* Toggle button */}
      {!isOpen && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 h-12 w-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg cyber-glow hover:scale-110 transition-transform"
        >
          <MessageSquare className="h-5 w-5" />
          {chatMessages.length > 1 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-destructive rounded-full text-[9px] font-bold flex items-center justify-center text-destructive-foreground">
              !
            </span>
          )}
        </motion.button>
      )}

      {/* Chat panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            transition={{ type: 'spring', damping: 25 }}
            className="fixed top-0 right-0 z-50 h-screen w-96 bg-card border-l border-border flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <div className="flex items-center gap-2">
                <Bot className="h-4 w-4 text-primary" />
                <span className="text-sm font-semibold text-foreground">AI Security Assistant</span>
                <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
              </div>
              <button onClick={() => setIsOpen(false)} className="text-muted-foreground hover:text-foreground transition-colors">
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-auto p-4 space-y-4">
              {chatMessages.map(msg => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={msg.role === 'user' ? 'flex justify-end' : 'flex justify-start'}
                >
                  <div className={
                    msg.role === 'user' 
                      ? 'bg-primary/10 text-foreground rounded-lg px-3 py-2 max-w-[85%] text-xs'
                      : 'bg-secondary text-foreground rounded-lg px-3 py-2 max-w-[90%] text-xs'
                  }>
                    <div className="prose prose-invert prose-xs max-w-none [&>*]:my-1 [&_ul]:pl-4 [&_li]:my-0.5">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                    <p className="text-[9px] text-muted-foreground mt-1.5">
                      {msg.timestamp.toLocaleTimeString('en-US', { hour12: false })}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Input */}
            <div className="p-3 border-t border-border">
              <div className="flex gap-2">
                <input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSend()}
                  placeholder="Ask about threats..."
                  className="flex-1 bg-background border border-border rounded-md px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <button
                  onClick={handleSend}
                  className="px-3 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                >
                  <Send className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIAssistant;
