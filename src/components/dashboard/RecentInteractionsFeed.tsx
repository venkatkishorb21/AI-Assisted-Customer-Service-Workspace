import React from 'react';
import { useApp } from '../../context/AppContext';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, CheckCircle, Clock, PhoneCall, AlertTriangle, ArrowUpRight } from 'lucide-react';

export const RecentInteractionsFeed: React.FC = () => {
  const { cases } = useApp();
  const navigate = useNavigate();

  // Create an interaction feed from cases
  const interactions = cases.flatMap(c => {
    const list = [];
    if (c.status === 'Resolved' && c.resolvedAt) {
      list.push({
        id: `res-${c.id}`,
        caseId: c.id,
        type: 'resolution',
        customer: c.customer.name,
        company: c.customer.company,
        title: `Case ${c.id} Resolved`,
        detail: c.resolutionNotes || 'Customer issue resolved and verified.',
        time: 'Just now',
        agent: c.resolvedBy || c.assignedAgentName
      });
    }
    if (c.followUp && !c.followUp.completed) {
      list.push({
        id: `fu-${c.id}`,
        caseId: c.id,
        type: 'followup',
        customer: c.customer.name,
        company: c.customer.company,
        title: `Follow-up Scheduled: ${c.followUp.method}`,
        detail: c.followUp.notes || 'Scheduled customer check-in.',
        time: `${c.followUp.scheduledDate} @ ${c.followUp.scheduledTime}`,
        agent: c.followUp.assignedAgent
      });
    }
    if (c.transcript.length > 0) {
      const lastMsg = c.transcript[c.transcript.length - 1];
      list.push({
        id: `msg-${c.id}-${lastMsg.id}`,
        caseId: c.id,
        type: 'message',
        customer: c.customer.name,
        company: c.customer.company,
        title: `${lastMsg.senderName}: "${lastMsg.text.slice(0, 50)}..."`,
        detail: `Category: ${c.category} • Priority: ${c.priority}`,
        time: lastMsg.timestamp,
        agent: c.assignedAgentName
      });
    }
    return list;
  }).slice(0, 6);

  return (
    <div className="bg-white rounded-2xl p-5 lg:p-6 border border-slate-200/90 shadow-sm flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">Recent Interactions</h3>
            <p className="text-xs text-slate-500">Live omni-channel logs and customer touches</p>
          </div>
        </div>
      </div>

      <div className="divide-y divide-slate-100 flex-1 overflow-y-auto max-h-[380px] -mx-2 px-2">
        {interactions.map(item => (
          <div
            key={item.id}
            onClick={() => navigate(`/workspace/${item.caseId}`)}
            className="py-3 px-2 rounded-xl hover:bg-slate-50 cursor-pointer transition flex items-start justify-between gap-3 group"
          >
            <div className="flex items-start gap-3 min-w-0">
              <div className="mt-0.5 shrink-0">
                {item.type === 'resolution' && (
                  <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                )}
                {item.type === 'followup' && (
                  <div className="w-7 h-7 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center">
                    <Clock className="w-4 h-4" />
                  </div>
                )}
                {item.type === 'message' && (
                  <div className="w-7 h-7 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center">
                    <PhoneCall className="w-4 h-4" />
                  </div>
                )}
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs text-slate-800 truncate">{item.customer}</span>
                  <span className="text-[10px] text-slate-400 font-mono">({item.caseId})</span>
                </div>
                <p className="text-xs text-slate-600 font-medium truncate mt-0.5">{item.title}</p>
                <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400">
                  <span>Handler: {item.agent}</span>
                  <span>•</span>
                  <span>{item.time}</span>
                </div>
              </div>
            </div>

            <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 transition shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
};
