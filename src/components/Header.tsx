import React from 'react';
import { School, PlusCircle, Search, ShieldCheck, BookOpen, AlertCircle, LogOut, UserCheck, User, LogIn } from 'lucide-react';
import { AdminUser } from '../utils/auth';
import { ParentUser } from '../types';

interface HeaderProps {
  currentTab: 'submit' | 'track' | 'admin' | 'charter';
  onSelectTab: (tab: 'submit' | 'track' | 'admin' | 'charter') => void;
  urgentCount?: number;
  adminUser?: AdminUser | null;
  onLogout?: () => void;
  parentUser?: ParentUser | null;
  onParentLogout?: () => void;
  onOpenParentAuth?: (mode: 'login' | 'register') => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  currentTab, 
  onSelectTab, 
  urgentCount = 0,
  adminUser = null,
  onLogout,
  parentUser = null,
  onParentLogout,
  onOpenParentAuth
}) => {
  return (
    <header className="no-print sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Zone 1: Single text element wordmark with school crest */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl overflow-hidden border border-emerald-200 bg-emerald-50 flex items-center justify-center shrink-0 shadow-xs">
              <img 
                src="/src/assets/images/nouar_school_crest_1790538305455.jpg" 
                alt="شعار مدرسة نوار محمد" 
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLElement).style.display = 'none';
                }}
              />
              <School className="w-6 h-6 text-emerald-700 hidden" />
            </div>
            <div>
              <button 
                onClick={() => onSelectTab('submit')}
                className="text-right group focus:outline-hidden"
              >
                <div className="text-xl sm:text-2xl font-extrabold text-stone-900 tracking-tight group-hover:text-emerald-700 transition-colors">
                  مدرسة نوار محمد الابتدائية
                </div>
                <div className="text-xs font-medium text-emerald-800 flex items-center gap-1.5">
                  <span className="inline-block w-2 h-2 rounded-full bg-emerald-500"></span>
                  منصة تواصل الأولياء والرصد الوقائي
                </div>
              </button>
            </div>
          </div>

          {/* Zone 2: Clean text navigation links with active state indicator */}
          <nav className="hidden md:flex items-center gap-1 bg-stone-100/80 p-1.5 rounded-xl border border-stone-200/60">
            <button
              onClick={() => onSelectTab('submit')}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
                currentTab === 'submit'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
              }`}
            >
              <PlusCircle className="w-4 h-4 text-emerald-600" />
              <span>طرح انشغال جديد</span>
            </button>

            <button
              onClick={() => onSelectTab('track')}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
                currentTab === 'track'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
              }`}
            >
              <Search className="w-4 h-4 text-emerald-600" />
              <span>متابعة انشغالاتي والردود</span>
            </button>

            <button
              onClick={() => onSelectTab('admin')}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
                currentTab === 'admin'
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>فضاء الإدارة والرصد الوقائي</span>
              {urgentCount > 0 && (
                <span className="bg-rose-500 text-white text-xs px-1.5 py-0.2 rounded-full font-bold tabular-nums">
                  {urgentCount}
                </span>
              )}
              {adminUser && (
                <span className="w-2 h-2 rounded-full bg-emerald-400 ml-1"></span>
              )}
            </button>

            <button
              onClick={() => onSelectTab('charter')}
              className={`flex items-center gap-2 px-3 py-2 text-sm font-semibold rounded-lg transition-all ${
                currentTab === 'charter'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/50'
              }`}
            >
              <BookOpen className="w-4 h-4 text-stone-500" />
              <span>دليل الولي</span>
            </button>
          </nav>

          {/* Zone 3: Admin / Parent Status & Quick Action */}
          <div className="flex items-center gap-2">
            {/* If Admin is logged in */}
            {adminUser ? (
              <div className="flex items-center gap-2">
                <div className="hidden sm:flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-emerald-900">
                  <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{adminUser.name}</span>
                </div>
                {onLogout && (
                  <button
                    onClick={onLogout}
                    className="text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 transition-colors flex items-center gap-1"
                    title="تسجيل الخروج من فضاء الإدارة"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">خروج الإدارة</span>
                  </button>
                )}
              </div>
            ) : parentUser ? (
              /* If Parent is logged in */
              <div className="flex items-center gap-2">
                <div className="hidden sm:flex items-center gap-1.5 bg-stone-100 border border-stone-200 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-stone-800">
                  <User className="w-3.5 h-3.5 text-emerald-700" />
                  <span>{parentUser.fullName}</span>
                </div>
                {onParentLogout && (
                  <button
                    onClick={onParentLogout}
                    className="text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-stone-200 hover:bg-stone-100 text-stone-600 transition-colors flex items-center gap-1"
                    title="تسجيل خروج حساب الولي"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">خروج</span>
                  </button>
                )}
              </div>
            ) : (
              /* If nobody is logged in */
              <div className="flex items-center gap-1.5">
                {onOpenParentAuth && (
                  <button
                    onClick={() => onOpenParentAuth('login')}
                    className="text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-stone-200 hover:bg-stone-50 text-stone-700 transition-colors hidden sm:flex items-center gap-1"
                  >
                    <LogIn className="w-3.5 h-3.5 text-emerald-600" />
                    <span>دخول الولي</span>
                  </button>
                )}

                <button
                  onClick={() => onSelectTab('admin')}
                  className="text-xs font-semibold px-3 py-2 rounded-lg border border-stone-300 bg-stone-50 text-stone-700 hover:bg-stone-100 transition-colors flex items-center gap-1.5"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
                  <span>دخول الإدارة</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation bar */}
        <div className="md:hidden flex items-center justify-around py-2.5 border-t border-stone-200 text-xs font-semibold">
          <button
            onClick={() => onSelectTab('submit')}
            className={`flex flex-col items-center gap-1 py-1 px-2 rounded-md ${
              currentTab === 'submit' ? 'text-emerald-700 font-bold' : 'text-stone-500'
            }`}
          >
            <PlusCircle className="w-4 h-4" />
            <span>طرح انشغال</span>
          </button>
          <button
            onClick={() => onSelectTab('track')}
            className={`flex flex-col items-center gap-1 py-1 px-2 rounded-md ${
              currentTab === 'track' ? 'text-emerald-700 font-bold' : 'text-stone-500'
            }`}
          >
            <Search className="w-4 h-4" />
            <span>متابعة التذاكر</span>
          </button>
          <button
            onClick={() => onSelectTab('admin')}
            className={`flex flex-col items-center gap-1 py-1 px-2 rounded-md ${
              currentTab === 'admin' ? 'text-emerald-700 font-bold' : 'text-stone-500'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{adminUser ? 'لوحة الإدارة' : 'دخول الإدارة'}</span>
          </button>
          <button
            onClick={() => onSelectTab('charter')}
            className={`flex flex-col items-center gap-1 py-1 px-2 rounded-md ${
              currentTab === 'charter' ? 'text-emerald-700 font-bold' : 'text-stone-500'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>الدليل</span>
          </button>
        </div>
      </div>
    </header>
  );
};
