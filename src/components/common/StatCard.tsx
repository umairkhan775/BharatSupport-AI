import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  accentColor?: 'saffron' | 'teal' | 'indigo' | 'rose';
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  accentColor = 'teal',
  onClick,
}) => {
  const accentStyles = {
    saffron: {
      bg: 'bg-bsai-saffronBg',
      border: 'border-bsai-saffron/30',
      iconColor: 'text-bsai-saffronDark',
      glow: 'hover:border-bsai-saffron',
    },
    teal: {
      bg: 'bg-bsai-tealBg',
      border: 'border-bsai-teal/30',
      iconColor: 'text-bsai-teal',
      glow: 'hover:border-bsai-teal',
    },
    indigo: {
      bg: 'bg-indigo-50',
      border: 'border-indigo-100',
      iconColor: 'text-bsai-indigo',
      glow: 'hover:border-bsai-indigo',
    },
    rose: {
      bg: 'bg-red-50',
      border: 'border-red-100',
      iconColor: 'text-red-600',
      glow: 'hover:border-red-300',
    },
  }[accentColor];

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-3xl p-5 border border-bsai-border shadow-bsai hover:shadow-bsai-lg transition-all duration-200 ${
        onClick ? 'cursor-pointer hover:-translate-y-1' : ''
      } ${accentStyles.glow}`}
    >
      <div className="flex items-center justify-between gap-3 mb-3">
        <span className="text-xs font-bold text-bsai-indigoMuted tracking-tight uppercase">
          {title}
        </span>
        <div className={`p-2.5 rounded-2xl ${accentStyles.bg} ${accentStyles.border} border`}>
          <Icon className={`w-5 h-5 ${accentStyles.iconColor}`} />
        </div>
      </div>

      <div className="flex items-baseline justify-between gap-2">
        <div className="text-2xl lg:text-3xl font-extrabold font-display text-bsai-indigo tracking-tight">
          {value}
        </div>

        {trend && (
          <div
            className={`flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${
              trend.isPositive ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-600'
            }`}
          >
            {trend.isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            <span>{trend.value}</span>
          </div>
        )}
      </div>

      {subtitle && (
        <div className="mt-2 text-[11px] font-medium text-bsai-indigoMuted">
          {subtitle}
        </div>
      )}
    </div>
  );
};
