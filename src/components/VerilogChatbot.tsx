import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, MessageSquare } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const VerilogChatbot = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('verilog-chat', {
        body: {
          message: input,
          conversationHistory: messages
        }
      });

      if (error) throw error;

      if (data?.reply) {
        const assistantMessage: Message = {
          role: 'assistant',
          content: data.reply
        };
        setMessages(prev => [...prev, assistantMessage]);
      }
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-purple-900 to-blue-900 rounded-xl border border-purple-700 overflow-hidden mb-8">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between bg-purple-800/50 px-6 py-4 hover:bg-purple-800/70 transition-colors"
      >
        <div className="flex items-center space-x-3">
          <Bot className="h-6 w-6 text-purple-300" />
          <div className="text-left">
            <h3 className="text-white font-semibold">AI Verilog Assistant</h3>
            <p className="text-purple-300 text-sm">Ask me anything about Verilog, VHDL, or digital design</p>
          </div>
        </div>
        <MessageSquare className={`h-5 w-5 text-purple-300 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
      </button>

      {/* Chat Interface */}
      {isExpanded && (
        <div className="bg-gray-900/50">
          {/* Messages */}
          <div className="h-96 overflow-y-auto p-6 space-y-4">
            {messages.length === 0 && (
              <div className="text-center text-gray-400 py-12">
                <Bot className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p className="text-lg">Start a conversation!</p>
                <p className="text-sm mt-2">Ask about Verilog syntax, design patterns, or get help with your code</p>
              </div>
            )}

            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex items-start space-x-3 ${
                  msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                }`}
              >
                <div
                  className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    msg.role === 'user' ? 'bg-blue-600' : 'bg-purple-600'
                  }`}
                >
                  {msg.role === 'user' ? (
                    <User className="h-4 w-4 text-white" />
                  ) : (
                    <Bot className="h-4 w-4 text-white" />
                  )}
                </div>
                <div
                  className={`flex-1 rounded-lg px-4 py-3 ${
                    msg.role === 'user'
                      ? 'bg-blue-600/20 text-blue-100'
                      : 'bg-purple-600/20 text-purple-100'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center">
                  <Bot className="h-4 w-4 text-white" />
                </div>
                <div className="flex-1 rounded-lg px-4 py-3 bg-purple-600/20">
                  <Loader2 className="h-4 w-4 text-purple-300 animate-spin" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-purple-700 p-4 bg-gray-900/30">
            <div className="flex space-x-3">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
                placeholder="Ask about Verilog, VHDL, or digital design..."
                className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500"
                disabled={isLoading}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-600 text-white px-6 py-3 rounded-lg transition-all flex items-center space-x-2"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VerilogChatbot;
