import React from 'react';
import { useApp } from '../../context/AppContext';
import { Compass, Map, Bookmark, User } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, t, saved, user } = useApp();

  const totalSaved = saved.favorites.length + saved.wantToTry.length;

  const tabs = [
    {
      id: 'explore' as const,
      label: t.navExplore,
      icon: Compass,
    },
    {
      id: 'map' as const,
      label: t.navMap,
      icon: Map,
    },
    {
      id: 'saved' as const,
      label: t.navSaved,
      icon: Bookmark,
      badge: totalSaved > 0 ? totalSaved : undefined,
    },
    {
      id: 'profile' as const,
      label: t.navProfile,
      icon: User,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-[#FFFDF8]/95 backdrop-blur-md border-t border-[#E9DFCB] pb-safe shadow-[0_-4px_20px_rgba(79,99,64,0.06)]">
      <div className="max-w-md mx-auto flex items-center justify-around px-2 py-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              id={`nav-tab-${tab.id}`}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-2xl transition-all duration-200 ${
                isActive
                  ? 'text-[#4F6340] font-semibold scale-105'
                  : 'text-[#4F6340]/60 hover:text-[#4F6340] font-normal'
              }`}
            >
              <div className="relative">
                <div
                  className={`p-1 rounded-xl transition-colors ${
                    isActive ? 'bg-[#A8B98A]/25' : 'bg-transparent'
                  }`}
                >
                  <Icon
                    size={21}
                    strokeWidth={isActive ? 2.2 : 1.75}
                    className={isActive ? 'text-[#4F6340]' : 'text-[#4F6340]/70'}
                  />
                </div>

                {tab.badge !== undefined && (
                  <span className="absolute -top-0.5 -right-1 min-w-[17px] h-[17px] px-1 bg-[#A8B98A] text-[#FFFDF8] text-[10px] font-bold rounded-full flex items-center justify-center shadow-xs">
                    {tab.badge}
                  </span>
                )}
              </div>

              <span className="text-[11px] mt-0.5 tracking-tight">{tab.label}</span>

              {isActive && (
                <span className="w-1 h-1 rounded-full bg-[#4F6340] mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
