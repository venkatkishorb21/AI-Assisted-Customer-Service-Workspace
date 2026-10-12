import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface KpiCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  change?: string;
  isPositiveChange?: boolean;
  icon: LucideIcon;
  iconBgColor?: string;
  iconTextColor?: string;
  badge?: string;
  badgeColor?: string;
  onClick?: () => void;
}

export const KpiCard: React.FC<KpiCardProps> = ({
  title,
  value,
  subtitle,
  change,
  isPositiveChange = true,
  icon: Icon,
  iconBgColor = 'bg-indigo-50',
  iconTextColor = 'text-indigo-600',
  badge,
  badgeColor = 'bg-slate-100 text-slate-700',
  onClick
}) => {
  return (
    <div 
      onClick={onClick}
      className={`bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm hover:shadow-md transition-all duration-200 ${
        onClick ? 'cursor-pointer hover:border-indigo-300' : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{title}</p>
          <div className="flex items-baseline gap-2 mt-1.5">
            <h3 className="text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">{value}</h3>
            {badge && (
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${badgeColor}`}>
                {badge}
              </span>
            )}
          </div>
        </div>

        <div className={`p-3 rounded-xl ${iconBgColor} ${iconTextColor} shrink-0 shadow-inner`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="mt-3.5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
        {change && (
          <div className="flex items-center gap-1 font-semibold">
            {isPositiveChange ? (
              <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
            ) : (
              <TrendingDown className="w-3.5 h-3.5 text-rose-600" />
            )}
            <span className={isPositiveChange ? 'text-emerald-700' : 'text-rose-700'}>
              {change}
            </span>
            <span className="text-slate-400 font-normal ml-0.5">vs yesterday</span>
          </div>
        )}
        {subtitle && !change && (
          <span className="text-slate-500">{subtitle}</span>
        )}
      </div>
    </div>
  );
};
