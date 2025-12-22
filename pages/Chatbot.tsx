import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, RefreshCcw } from 'lucide-react';
import { ChatMessage } from '../types';

export const Chatbot: React.FC = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', sender: 'bot', text: 'Hello! I am your AI Finance Assistant. You can ask me about profit/loss, invoice creation, or salary reports.', timestamp: new Date() }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Simulate AI Latency and N8N Processing
    setTimeout(() => {
      let botText = "I'm sorry, I couldn't process that.";
      const lowerInput = userMsg.text.toLowerCase();

      if (lowerInput.includes('profit')) {
        botText = "📈 **Profit/Loss Report (Oct 2023)**\n\n• Revenue: $128,430\n• Expenses: $62,465\n• **Net Profit: $65,965**\n\nStatus: ✅ Profit";
      } else if (lowerInput.includes('salary') || lowerInput.includes('payroll')) {
        botText = "💰 **Payroll Summary**\n\nPayroll for October has been calculated.\n• Total Salaries: $450,000\n• Pending Disbursals: 2\n\nWould you like me to send the payslips via WhatsApp?";
      } else if (lowerInput.includes('invoice')) {
        botText = "I can help with that. Please provide the Client Name and Amount to generate a draft invoice.";
      } else if (lowerInput.includes('attendance')) {
        botText = "📊 **Attendance Summary**\n\nToday's Attendance:\n• Present: 38\n• Late: 3\n• Absent: 1";
      }

      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: botText,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white shadow-sm">
            <Bot size={24} />
          </div>
          <div>
            <h2 className="font-bold text-slate-900">Finance AI Assistant</h2>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-xs text-slate-500">Online | Powered by OpenAI & n8n</span>
            </div>
          </div>
        </div>
        <button 
          onClick={() => setMessages([])}
          className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-full transition-colors"
          title="Clear Chat"
        >
          <RefreshCcw size={18} />
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`flex gap-3 max-w-[80%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-green-600 text-white'}`}>
                {msg.sender === 'user' ? <User size={16} /> : <Bot size={16} />}
              </div>
              <div className={`p-4 rounded-2xl shadow-sm whitespace-pre-line ${
                msg.sender === 'user' 
                  ? 'bg-blue-600 text-white rounded-tr-none' 
                  : 'bg-white text-slate-700 border border-slate-100 rounded-tl-none'
              }`}>
                <p className="text-sm leading-relaxed">{msg.text}</p>
                <span className={`text-[10px] mt-2 block opacity-70 ${msg.sender === 'user' ? 'text-blue-100' : 'text-slate-400'}`}>
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
             <div className="flex gap-3 max-w-[80%]">
               <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center flex-shrink-0">
                 <Bot size={16} />
               </div>
               <div className="bg-white p-4 rounded-2xl rounded-tl-none border border-slate-100 shadow-sm">
                 <div className="flex gap-1">
                   <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></span>
                   <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-75"></span>
                   <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce delay-150"></span>
                 </div>
               </div>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-slate-100">
        <div className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your query (e.g., 'Show profit loss', 'Create invoice')..."
            className="w-full pl-4 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-700"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Send size={18} />
          </button>
        </div>
        <div className="mt-2 flex gap-2 justify-center">
          {['Show Profit/Loss', 'Attendance Summary', 'Salary Report'].map((suggestion) => (
             <button 
               key={suggestion}
               onClick={() => setInput(suggestion)}
               className="text-xs px-3 py-1 bg-slate-100 text-slate-600 rounded-full hover:bg-slate-200 transition-colors"
             >
               {suggestion}
             </button>
          ))}
        </div>
      </div>
    </div>
  );
};