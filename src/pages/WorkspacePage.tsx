import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { CustomerProfileCard } from '../components/workspace/CustomerProfileCard';
import { ConversationView } from '../components/workspace/ConversationView';
import { InternalNotesView } from '../components/workspace/InternalNotesView';
import { AiAssistancePanel } from '../components/workspace/AiAssistancePanel';
import { ResolutionModal } from '../components/workspace/ResolutionModal';
import { FollowUpModal } from '../components/workspace/FollowUpModal';
import { 
  ArrowLeft, 
  CheckCircle2, 
  Calendar, 
  AlertCircle,
  FileCheck,
  Check,
  UserCheck
} from 'lucide-react';
import { CaseStatus, PriorityLevel } from '../types';

export const WorkspacePage: React.FC = () => {
  const { caseId } = useParams<{ caseId: string }>();
  const navigate = useNavigate();
  const { 
    cases, 
    agents, 
    currentUserAgent,
    updateCaseStatus, 
    updateCasePriority, 
    reassignCase, 
    addCaseMessage, 
    addInternalNote, 
    deleteInternalNote, 
    resolveCase, 
    scheduleFollowUp, 
    completeFollowUp 
  } = useApp();

  const [isResolveModalOpen, setIsResolveModalOpen] = useState(false);
  const [isFollowUpModalOpen, setIsFollowUpModalOpen] = useState(false);
  const [injectedReplyText, setInjectedReplyText] = useState('');

  // Find the requested case or default to first
  const currentCase = cases.find(c => c.id === caseId) || cases[0];

  if (!currentCase) {
    return (
      <div className="p-12 text-center bg-white rounded-3xl border border-slate-200">
        <AlertCircle className="w-10 h-10 text-slate-400 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-slate-800">No Case Selected</h3>
        <p className="text-xs text-slate-500 mt-1 mb-4">Please return to the call queue to pick a ticket.</p>
        <button
          onClick={() => navigate('/queue')}
          className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold"
        >
          Open Call Queue
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4 pb-12 animate-in fade-in duration-300">
      
      {/* Top Case Action Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        
        {/* Left: Back button & Title Info */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/queue')}
            className="p-2 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition"
            title="Back to Call Queue"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono font-extrabold text-indigo-600 text-base">
                {currentCase.id}
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-xs font-bold text-slate-900 truncate max-w-sm">
                {currentCase.title}
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-semibold">
                {currentCase.channel}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-400">
              <span>Customer: <strong className="text-slate-700">{currentCase.customer.name}</strong></span>
              <span>•</span>
              <span>Wait time: <strong className="text-slate-700">{currentCase.waitingTimeMinutes} mins</strong></span>
              <span>•</span>
              <span>SLA: <strong className="text-rose-600">{currentCase.slaDue}</strong></span>
            </div>
          </div>
        </div>

        {/* Right: Interactive Dropdowns & Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap self-end lg:self-auto">
          
          {/* Priority dropdown */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-xl">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Priority:</span>
            <select
              value={currentCase.priority}
              onChange={e => updateCasePriority(currentCase.id, e.target.value as PriorityLevel)}
              className="text-xs font-bold bg-transparent outline-none cursor-pointer text-slate-800"
            >
              <option value="Critical">🔴 Critical (P1)</option>
              <option value="High">🟠 High (P2)</option>
              <option value="Medium">🟡 Medium (P3)</option>
              <option value="Low">🟢 Low (P4)</option>
            </select>
          </div>

          {/* Status dropdown */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-xl">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Status:</span>
            <select
              value={currentCase.status}
              onChange={e => updateCaseStatus(currentCase.id, e.target.value as CaseStatus)}
              className="text-xs font-bold bg-transparent outline-none cursor-pointer text-slate-800"
            >
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Escalated">Escalated</option>
              <option value="Pending Follow-up">Pending Follow-up</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
            </select>
          </div>

          {/* Agent assignment */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-xl">
            <UserCheck className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={currentCase.assignedAgentId}
              onChange={e => reassignCase(currentCase.id, e.target.value)}
              className="text-xs font-bold bg-transparent outline-none cursor-pointer text-slate-800 max-w-[130px] truncate"
            >
              {agents.map(a => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
          </div>

          {/* Schedule Follow-up */}
          <button
            onClick={() => setIsFollowUpModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold shadow-sm transition"
          >
            <Calendar className="w-3.5 h-3.5 text-indigo-600" />
            <span>Follow-up</span>
          </button>

          {/* Resolve / Close button */}
          {currentCase.status !== 'Resolved' && currentCase.status !== 'Closed' ? (
            <button
              onClick={() => setIsResolveModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-200 transition"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Resolve Case</span>
            </button>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
              <Check className="w-3.5 h-3.5" />
              <span>Resolved</span>
            </span>
          )}

        </div>
      </div>

      {/* Main Workspace 3-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        
        {/* Left Column (Cols 1-3): Customer Profile, Follow-up card, Internal Notes */}
        <div className="lg:col-span-3 space-y-4">
          <CustomerProfileCard customer={currentCase.customer} />

          {/* Follow-up Info Card if scheduled */}
          {currentCase.followUp && (
            <div className={`p-4 rounded-2xl border shadow-sm space-y-2 text-xs ${
              currentCase.followUp.completed 
                ? 'bg-slate-50 border-slate-200 text-slate-500' 
                : 'bg-amber-50/70 border-amber-200 text-amber-950'
            }`}>
              <div className="flex items-center justify-between">
                <span className="font-bold flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-amber-600" />
                  Scheduled Follow-up
                </span>
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                  currentCase.followUp.completed ? 'bg-slate-200 text-slate-600' : 'bg-amber-200 text-amber-800'
                }`}>
                  {currentCase.followUp.completed ? 'COMPLETED' : 'PENDING'}
                </span>
              </div>
              <p className="text-[11px] font-mono text-slate-700">
                {currentCase.followUp.scheduledDate} at {currentCase.followUp.scheduledTime} via {currentCase.followUp.method}
              </p>
              <p className="text-[11px] leading-relaxed text-slate-600">{currentCase.followUp.notes}</p>
              
              {!currentCase.followUp.completed && (
                <button
                  onClick={() => completeFollowUp(currentCase.id)}
                  className="w-full mt-1 py-1.5 px-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold text-[11px] transition"
                >
                  Mark Follow-up as Completed
                </button>
              )}
            </div>
          )}

          {/* Resolution notes card if resolved */}
          {currentCase.resolutionNotes && (
            <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-2xl text-xs space-y-1.5">
              <span className="font-bold text-emerald-900 flex items-center gap-1.5">
                <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
                Case Resolution Record
              </span>
              <p className="text-emerald-800 text-[11px] leading-relaxed">
                {currentCase.resolutionNotes}
              </p>
              <p className="text-[10px] text-emerald-600 font-mono mt-1">
                Resolved by {currentCase.resolvedBy || 'Agent'} on {currentCase.resolvedAt ? new Date(currentCase.resolvedAt).toLocaleDateString() : 'Today'}
              </p>
            </div>
          )}

          <InternalNotesView
            notes={currentCase.internalNotes}
            onAddNote={(text, isPinned) => addInternalNote(currentCase.id, text, isPinned)}
            onDeleteNote={noteId => deleteInternalNote(currentCase.id, noteId)}
          />
        </div>

        {/* Center Column (Cols 4-8): Conversation History & Message Composer */}
        <div className="lg:col-span-5">
          <ConversationView
            currentCase={currentCase}
            onSendMessage={text => addCaseMessage(currentCase.id, text, 'agent')}
            injectedReplyText={injectedReplyText}
            onClearInjectedReply={() => setInjectedReplyText('')}
          />
        </div>

        {/* Right Column (Cols 9-12): AI Assistance Panel */}
        <div className="lg:col-span-4">
          <AiAssistancePanel
            insights={currentCase.aiInsights}
            caseId={currentCase.id}
            onInsertReply={text => setInjectedReplyText(text)}
          />
        </div>

      </div>

      {/* Resolution Confirmation Modal */}
      <ResolutionModal
        isOpen={isResolveModalOpen}
        caseId={currentCase.id}
        customerName={currentCase.customer.name}
        onClose={() => setIsResolveModalOpen(false)}
        onConfirmResolve={notes => resolveCase(currentCase.id, notes)}
      />

      {/* Follow-up Scheduling Modal */}
      <FollowUpModal
        isOpen={isFollowUpModalOpen}
        caseId={currentCase.id}
        customerName={currentCase.customer.name}
        agents={agents}
        currentAgentName={currentUserAgent.name}
        onClose={() => setIsFollowUpModalOpen(false)}
        onSchedule={data => scheduleFollowUp(currentCase.id, data)}
      />

    </div>
  );
};
