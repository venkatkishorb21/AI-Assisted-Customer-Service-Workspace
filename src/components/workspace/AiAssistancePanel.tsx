import React, { useState } from 'react';
import { AiSuggestionData } from '../../types';
import { 
  Bot, 
  Sparkles, 
  Copy, 
  Check, 
  ArrowRight, 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  FileText, 
  Info,
  Zap,
  BookOpen
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface AiAssistancePanelProps {
  insights: AiSuggestionData;
  onInsertReply: (text: string) => void;
  caseId: string;
}

export const AiAssistancePanel: React.FC<AiAssistancePanelProps> = ({
  insights,
  onInsertReply,
  caseId
}) => {
  const { addToast, addInternalNote } = useApp();
  const [copied, setCopied] = useState(false);
  const [actionExecuted, setActionExecuted] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(insights.suggestedResponse);
    setCopied(true);
    addToast('Copied to Clipboard', 'Suggested response copied to your clipboard.', 'info');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInsert = () => {
    onInsertReply(insights.suggestedResponse);
    addToast('Inserted into Reply', 'Suggested draft placed in message composer.', 'success');
  };

  const handleExecuteAction = () => {
    setActionExecuted(true);
    addInternalNote(caseId, `⚡ Copilot Action Executed: ${insights.recommendedAction} [Playbook: ${insights.applicablePolicy}]`);
    addToast('Action Dispatched', `Recommended action "${insights.recommendedAction.slice(0, 45)}..." initiated and saved to internal notes.`, 'success');
  };

  const getEscalationColor = (risk: AiSuggestionData['escalationRisk']) => {
    switch (risk) {
      case 'High':
        return {
          bg: 'bg-rose-50 border-rose-200 text-rose-900',
          badge: 'bg-rose-600 text-white',
          icon: <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0" />
        };
      case 'Moderate':
        return {
          bg: 'bg-amber-50 border-amber-200 text-amber-900',
          badge: 'bg-amber-600 text-white',
          icon: <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
        };
      case 'Low':
        return {
          bg: 'bg-emerald-50 border-emerald-200 text-emerald-900',
          badge: 'bg-emerald-600 text-white',
          icon: <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
        };
    }
  };

  const riskStyle = getEscalationColor(insights.escalationRisk);

  return (
    <div className="bg-white rounded-2xl border border-indigo-100 shadow-md overflow-hidden flex flex-col h-full">
      
      {/* AI Panel Header */}
      <div className="p-4 bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 text-white border-b border-indigo-950">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-cyan-300 flex items-center justify-center border border-indigo-500/30">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xs font-bold text-white tracking-wide">AI Assistance Copilot</h3>
                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-cyan-400/20 text-cyan-300 border border-cyan-400/30">
                  CONFIDENCE {insights.confidenceScore}%
                </span>
              </div>
              <p className="text-[10px] text-slate-400">OnGround Intelligence Core v2.4</p>
            </div>
          </div>
          <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" style={{ animationDuration: '6s' }} />
        </div>

        {/* Explicit Demo Disclaimer Badge */}
        <div className="mt-3 px-2.5 py-1.5 rounded-lg bg-indigo-950/70 border border-indigo-800/60 flex items-center gap-2 text-[10px] text-indigo-200">
          <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>
            <strong>Deterministic Simulation:</strong> Sample rules engine active. No external LLM API connected.
          </span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-4 overflow-y-auto space-y-4 text-xs divide-y divide-slate-100 flex-1">
        
        {/* 1. Escalation Warning */}
        <div className={`p-3 rounded-xl border ${riskStyle.bg} space-y-1.5`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 font-bold text-[11px]">
              {riskStyle.icon}
              <span>Escalation Risk: {insights.escalationRisk.toUpperCase()}</span>
            </div>
            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${riskStyle.badge}`}>
              Risk Level: {insights.escalationRisk}
            </span>
          </div>
          <p className="text-[11px] leading-relaxed">
            {insights.escalationTriggerReason}
          </p>
        </div>

        {/* 2. Conversation Summary */}
        <div className="pt-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-indigo-600" />
              Conversation Summary
            </span>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
              Tone: {insights.sentiment}
            </span>
          </div>

          <p className="text-slate-600 text-xs leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-100">
            {insights.summary}
          </p>

          {/* Key concerns pills */}
          {insights.keyConcerns.length > 0 && (
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Key Concerns Flagged:</span>
              <div className="flex flex-wrap gap-1.5">
                {insights.keyConcerns.map((c, i) => (
                  <span key={i} className="text-[10px] font-medium bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md border border-indigo-100">
                    • {c}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 3. Suggested Customer Response */}
        <div className="pt-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              Suggested Customer Response
            </span>
          </div>

          <div className="bg-indigo-50/60 p-3 rounded-xl border border-indigo-100 text-slate-800 text-xs leading-relaxed italic relative">
            {insights.suggestedResponse}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleInsert}
              className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold text-xs shadow-sm transition"
            >
              <span>Insert into Reply Box</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={handleCopy}
              className="px-3 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-lg font-semibold text-xs transition"
              title="Copy to clipboard"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* 4. Recommended Next Action */}
        <div className="pt-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-cyan-600" />
              Recommended Next Action
            </span>
            <span className="text-[10px] font-mono font-bold text-slate-400">
              {insights.applicablePolicy.split(' ')[0]}
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700">
            <p className="font-semibold text-slate-900">{insights.recommendedAction}</p>
            <div className="mt-2 flex items-center justify-between">
              <span className="text-[10px] text-slate-400">Standard Playbook</span>
              <button
                onClick={handleExecuteAction}
                disabled={actionExecuted}
                className={`text-[10px] font-bold px-2.5 py-1 rounded-md transition ${
                  actionExecuted
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-indigo-100 hover:bg-indigo-200 text-indigo-800'
                }`}
              >
                {actionExecuted ? '✓ Action Initiated' : 'Trigger Action Dispatch'}
              </button>
            </div>
          </div>
        </div>

        {/* 5. Explanation for the Recommendation */}
        <div className="pt-3 space-y-1.5">
          <span className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-slate-500" />
            Explanation for Recommendation
          </span>
          <div className="p-2.5 rounded-xl bg-slate-100 text-[11px] text-slate-600 leading-relaxed border border-slate-200/80">
            <p>{insights.explanation}</p>
            <p className="text-[10px] text-slate-400 mt-1 font-mono">
              Policy Rule: {insights.applicablePolicy}
            </p>
          </div>
        </div>

      </div>

    </div>
  );
};
