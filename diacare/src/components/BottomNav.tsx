import React from 'react';
import { LayoutDashboard, Sparkles, BookOpen, FileText } from 'lucide-react';

export type ActiveTab = 'dashboard' | 'special' | 'guidelines' | 'report';

interface BottomNavProps {
  activeTab: ActiveTab;
  onChangeTab: (tab: ActiveTab) => void;
  criticalAlertCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onChangeTab,
  criticalAlertCount,
}) => {
  const tabs = [
    { 
      id: 'dashboard' as ActiveTab, 
      label: 'CDSS Điều Trị', 
      icon: LayoutDashboard,
      badge: criticalAlertCount > 0 ? criticalAlertCount : undefined 
    },
    { id: 'special' as ActiveTab, label: 'Tình Huống', icon: Sparkles },
    { id: 'guidelines' as ActiveTab, label: 'Hướng Dẫn', icon: BookOpen },
    { id: 'report' as ActiveTab, label: 'Báo Cáo', icon: FileText },
  ];

  return (
    <nav className="fixed bottom-[58px] left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 md:hidden shadow-lg" aria-label="DiaCare Mobile Tabs">
      <div className="grid grid-cols-4 h-12 px-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onChangeTab(tab.id)}
              title={tab.label}
              aria-label={tab.label}
              className={`relative flex items-center justify-center p-2 rounded-xl transition ${
                isActive
                  ? 'text-teal-600 dark:text-teal-400 bg-teal-50/80 dark:bg-teal-950/40 font-bold'
                  : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
              }`}
            >
              <div className="relative flex items-center justify-center">
                <Icon className={`w-5 h-5 ${isActive ? 'scale-110' : ''} transition-transform`} />
                {tab.badge && (
                  <span className="absolute -top-1.5 -right-2 w-4 h-4 bg-red-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-bounce">
                    {tab.badge}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline ml-1.5 text-[10px] tracking-tight">{tab.label}</span>
              {isActive && (
                <span className="absolute bottom-0 w-6 h-1 bg-teal-500 rounded-t-full" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
