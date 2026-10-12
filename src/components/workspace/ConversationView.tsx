import React, { useState, useEffect, useRef } from 'react';
import { SupportCase } from '../../types';
import { 
  Play, 
  Pause, 
  Volume2, 
  Send 
} from 'lucide-react';

interface ConversationViewProps {
  currentCase: SupportCase;
  onSendMessage: (text: string) => void;
  injectedReplyText: string;
  onClearInjectedReply: () => void;
}

export const ConversationView: React.FC<ConversationViewProps> = ({
  currentCase,
  onSendMessage,
  injectedReplyText,
  onClearInjectedReply
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioSeconds, setAudioSeconds] = useState(252); // e.g. 4m 12s
  const [replyText, setReplyText] = useState('');
  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Sync injected reply from AI Copilot
  useEffect(() => {
    if (injectedReplyText) {
      setReplyText(injectedReplyText);
      onClearInjectedReply();
    }
  }, [injectedReplyText, onClearInjectedReply]);

  // Audio timer simulation
  useEffect(() => {
    let interval: any;
    if (isPlayingAudio) {
      interval = setInterval(() => {
        setAudioSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlayingAudio]);

  const formatAudioTime = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const remainder = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;
    onSendMessage(replyText);
    setReplyText('');
    setTimeout(() => {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm flex flex-col h-[600px] overflow-hidden">
      
      {/* Audio Playback & Channel Header */}
      <div className="p-4 bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsPlayingAudio(!isPlayingAudio)}
            className="w-10 h-10 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white flex items-center justify-center shadow-lg shadow-indigo-600/30 transition shrink-0"
            aria-label={isPlayingAudio ? "Pause live audio recording" : "Play live audio recording"}
          >
            {isPlayingAudio ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white">Call Recording & Live Audio Feed</span>
              <span className={`text-[10px] px-2 py-0.2 rounded-full font-bold ${
                isPlayingAudio ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-slate-800 text-slate-400'
              }`}>
                {isPlayingAudio ? 'STREAMING LIVE' : 'PAUSED'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono mt-0.5">
              Duration: {formatAudioTime(audioSeconds)} • HD Stereo Codec Opus 48kHz
            </p>
          </div>
        </div>

        {/* Audio Waveform visualization */}
        <div className="flex items-center gap-1.5 self-center sm:self-auto">
          {[40, 70, 30, 90, 60, 45, 85, 95, 50, 75, 60, 30, 80, 55].map((h, i) => (
            <div
              key={i}
              className={`w-1 rounded-full transition-all duration-300 ${
                isPlayingAudio ? 'bg-indigo-400 animate-pulse' : 'bg-slate-700'
              }`}
              style={{ height: `${isPlayingAudio ? Math.max(12, (h * (audioSeconds % 5 + 1)) % 32) : 10}px` }}
            />
          ))}
          <Volume2 className="w-4 h-4 text-slate-400 ml-2" />
        </div>
      </div>

      {/* Transcript Messages List */}
      <div className="flex-1 p-5 overflow-y-auto space-y-4 bg-slate-50/50">
        {currentCase.transcript.map(msg => {
          const isCustomer = msg.sender === 'customer';
          const isSystem = msg.sender === 'system';

          if (isSystem) {
            return (
              <div key={msg.id} className="text-center my-2">
                <span className="inline-block px-3 py-1 bg-slate-200/80 text-slate-600 rounded-full text-[11px] font-medium">
                  🤖 {msg.text} <span className="opacity-60 ml-1">({msg.timestamp})</span>
                </span>
              </div>
            );
          }

          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isCustomer ? 'justify-start' : 'justify-end'}`}
            >
              {isCustomer && (
                <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-700 font-bold flex items-center justify-center shrink-0 text-xs">
                  {msg.senderName.charAt(0)}
                </div>
              )}

              <div className={`max-w-[80%] rounded-2xl p-4 shadow-sm text-xs leading-relaxed ${
                isCustomer
                  ? 'bg-white text-slate-800 border border-slate-200 rounded-tl-sm'
                  : 'bg-indigo-600 text-white rounded-tr-sm'
              }`}>
                <div className="flex items-center justify-between gap-3 mb-1.5">
                  <span className={`font-bold ${isCustomer ? 'text-slate-900' : 'text-indigo-100'}`}>
                    {msg.senderName}
                  </span>
                  <div className="flex items-center gap-1.5">
                    {msg.sentiment === 'critical' && (
                      <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-rose-100 text-rose-700">
                        CRITICAL TONE
                      </span>
                    )}
                    {msg.sentiment === 'frustrated' && (
                      <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-700">
                        FRUSTRATED
                      </span>
                    )}
                    {msg.sentiment === 'positive' && (
                      <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-700">
                        PLEASED
                      </span>
                    )}
                    <span className={`text-[10px] font-mono ${isCustomer ? 'text-slate-400' : 'text-indigo-200'}`}>
                      {msg.timestamp}
                    </span>
                  </div>
                </div>

                <p className="whitespace-pre-wrap">{msg.text}</p>
              </div>

              {!isCustomer && (
                <div className="w-8 h-8 rounded-full bg-indigo-700 text-white font-bold flex items-center justify-center shrink-0 text-xs">
                  Agent
                </div>
              )}
            </div>
          );
        })}
        <div ref={chatBottomRef} />
      </div>

      {/* Message Composer */}
      <form onSubmit={handleSend} className="p-3.5 bg-white border-t border-slate-200 flex flex-col gap-2">
        <div className="relative">
          <textarea
            rows={2}
            value={replyText}
            onChange={e => setReplyText(e.target.value)}
            placeholder="Type your response to the customer or insert AI suggested draft from the right panel..."
            className="w-full p-3 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none pr-24"
          />
          <div className="absolute right-2.5 bottom-2.5 flex items-center gap-1.5">
            <button
              type="submit"
              disabled={!replyText.trim()}
              className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-xs transition shadow-sm"
            >
              <span>Send</span>
              <Send className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <span>Replies are logged directly to ticket history & customer transcript.</span>
          {replyText && (
            <button
              type="button"
              onClick={() => setReplyText('')}
              className="text-slate-400 hover:text-slate-600 font-semibold"
            >
              Clear
            </button>
          )}
        </div>
      </form>

    </div>
  );
};
