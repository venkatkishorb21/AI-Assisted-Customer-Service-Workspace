import React from 'react';
import { CustomerProfile } from '../../types';
import { 
  Building, 
  Mail, 
  Phone, 
  MapPin
} from 'lucide-react';

interface CustomerProfileCardProps {
  customer: CustomerProfile;
}

export const CustomerProfileCard: React.FC<CustomerProfileCardProps> = ({ customer }) => {
  const getTierColor = (tier: CustomerProfile['tier']) => {
    switch (tier) {
      case 'Enterprise VIP':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Growth Corporate':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Standard Pro':
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm space-y-4">
      {/* Profile Header */}
      <div className="flex items-start gap-3.5">
        <img
          src={customer.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80'}
          alt={customer.name}
          className="w-12 h-12 rounded-2xl object-cover ring-2 ring-indigo-500/20 shadow-sm"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-slate-900 truncate">{customer.name}</h3>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getTierColor(customer.tier)}`}>
              {customer.tier}
            </span>
          </div>
          <p className="text-xs font-semibold text-slate-600 flex items-center gap-1.5 mt-0.5">
            <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{customer.company}</span>
          </p>
          <p className="text-[11px] text-slate-400 font-mono mt-0.5">ID: {customer.id}</p>
        </div>
      </div>

      {/* Contact Details */}
      <div className="pt-2 border-t border-slate-100 space-y-2 text-xs">
        <div className="flex items-center justify-between text-slate-600">
          <span className="flex items-center gap-1.5 text-slate-400">
            <Mail className="w-3.5 h-3.5" />
            <span>Email</span>
          </span>
          <a href={`mailto:${customer.email}`} className="font-medium text-indigo-600 hover:underline truncate max-w-[180px]">
            {customer.email}
          </a>
        </div>

        <div className="flex items-center justify-between text-slate-600">
          <span className="flex items-center gap-1.5 text-slate-400">
            <Phone className="w-3.5 h-3.5" />
            <span>Direct Line</span>
          </span>
          <a href={`tel:${customer.phone}`} className="font-mono font-medium text-slate-800 hover:text-indigo-600">
            {customer.phone}
          </a>
        </div>

        <div className="flex items-center justify-between text-slate-600">
          <span className="flex items-center gap-1.5 text-slate-400">
            <MapPin className="w-3.5 h-3.5" />
            <span>Location</span>
          </span>
          <span className="font-medium text-slate-800">{customer.location}</span>
        </div>
      </div>

      {/* Account Highlights */}
      <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-center text-xs">
        <div className="bg-slate-50 p-2 rounded-xl">
          <span className="text-[10px] text-slate-400 block font-medium">Annual Contract</span>
          <span className="font-bold text-slate-800 text-xs mt-0.5 block">{customer.lifetimeValue}</span>
        </div>
        <div className="bg-slate-50 p-2 rounded-xl">
          <span className="text-[10px] text-slate-400 block font-medium">Satisfaction Score</span>
          <span className="font-bold text-emerald-600 text-xs mt-0.5 block">{customer.satisfactionScore}% CSAT</span>
        </div>
      </div>

      {/* Ticket History stats */}
      <div className="pt-1 flex items-center justify-between text-[11px] text-slate-500 bg-indigo-50/50 p-2.5 rounded-xl border border-indigo-100">
        <span>Lifetime Tickets: <strong className="text-slate-800">{customer.totalTicketsCount}</strong></span>
        <span>Open Tickets: <strong className="text-indigo-700">{customer.openTicketsCount}</strong></span>
      </div>
    </div>
  );
};
