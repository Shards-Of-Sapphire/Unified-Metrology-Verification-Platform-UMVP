import React, { useState } from 'react';
import { Sparkles, Send, Bot, User, X, RefreshCw, Globe, HelpCircle } from 'lucide-react';

interface AiAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export const AiAssistantModal: React.FC<AiAssistantModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'assistant',
      text: 'Namaste! I am DoCA Saathi, your multilingual Legal Metrology AI assistant. Ask me anything regarding the Legal Metrology Act, 2009, verification procedures, statutory fees, or consumer protection guidelines.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState<'English' | 'Hindi' | 'Tamil' | 'Bengali'>('English');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSendMessage = async (customPrompt?: string) => {
    const textToSend = customPrompt || inputMessage;
    if (!textToSend.trim()) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!customPrompt) setInputMessage('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          language: selectedLanguage,
        }),
      });

      const data = await res.json();
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'assistant',
        text: data.reply || 'Thank you for your query. All commercial weighing instruments must conform to the Legal Metrology Act 2009 standards.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'assistant',
          text: 'Under Section 24 of the Legal Metrology Act, 2009, every person having any weight or measure in possession for use in transaction must get it verified before use.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-xl w-full shadow-2xl overflow-hidden text-slate-100 flex flex-col h-[620px] max-h-[92vh]">
        {/* Header */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-slate-950 font-bold shadow-md">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-white tracking-wide">DoCA AI SAATHI</h2>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Multilingual AI
                </span>
              </div>
              <p className="text-xs text-slate-400">Department of Consumer Affairs Virtual Guidance</p>
            </div>
          </div>

          {/* Language Selector */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-slate-800 px-2 py-1 rounded-lg border border-slate-700 text-xs">
              <Globe className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value as any)}
                className="bg-transparent text-white text-xs focus:outline-none"
              >
                <option value="English" className="bg-slate-900">English</option>
                <option value="Hindi" className="bg-slate-900">हिन्दी (Hindi)</option>
                <option value="Tamil" className="bg-slate-900">தமிழ் (Tamil)</option>
                <option value="Bengali" className="bg-slate-900">বাংলা (Bengali)</option>
              </select>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Preset FAQ chips */}
        <div className="bg-slate-950/70 px-4 py-2 border-b border-slate-800 flex items-center gap-2 overflow-x-auto text-[11px] whitespace-nowrap scrollbar-none">
          <button
            onClick={() => handleSendMessage('What are the statutory re-verification intervals for electronic scales?')}
            className="px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700"
          >
            Re-verification frequency?
          </button>
          <button
            onClick={() => handleSendMessage('What is the penalty under Section 30 for using unverified measures?')}
            className="px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700"
          >
            Section 30 Penalties?
          </button>
          <button
            onClick={() => handleSendMessage('How does the digital QR certificate verification protect against fraud?')}
            className="px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700"
          >
            QR Verification Security?
          </button>
        </div>

        {/* Message Stream */}
        <div className="flex-1 p-5 overflow-y-auto space-y-3 bg-slate-900/50">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 text-xs leading-relaxed ${
                msg.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.sender === 'assistant' && (
                <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
              )}
              <div
                className={`max-w-[85%] rounded-2xl p-3.5 shadow ${
                  msg.sender === 'user'
                    ? 'bg-blue-600 text-white rounded-br-xs'
                    : 'bg-slate-800/90 text-slate-200 border border-slate-700/80 rounded-bl-xs'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.text}</div>
                <div className="text-[10px] text-slate-400 text-right mt-1.5 font-mono">
                  {msg.timestamp}
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-amber-300/80 p-2">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              DoCA Saathi is formulating legal reference...
            </div>
          )}
        </div>

        {/* Input Form */}
        <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="p-3 bg-slate-950 border-t border-slate-800 flex gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder={`Ask in ${selectedLanguage} about metrology rules, fees, or inspections...`}
            className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
          />
          <button
            type="submit"
            disabled={isLoading || !inputMessage.trim()}
            className="px-4 py-2.5 bg-amber-400 hover:bg-amber-300 disabled:bg-slate-800 text-slate-950 rounded-xl text-xs font-bold transition-all shadow flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            Send
          </button>
        </form>
      </div>
    </div>
  );
};
