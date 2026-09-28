/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ParentSubmissionForm } from './components/ParentSubmissionForm';
import { ParentTrackingView } from './components/ParentTrackingView';
import { AdminDashboard } from './components/AdminDashboard';
import { AdminLogin } from './components/AdminLogin';
import { ParentCharterModal } from './components/ParentCharterModal';
import { 
  ConcernTicket, 
  PreventiveAction, 
  MessageItem,
  ParentUser
} from './types';
import { 
  getStoredTickets, 
  saveTicketToStorage, 
  addMessageToTicket, 
  getStoredPreventiveActions, 
  savePreventiveActionToStorage,
  resetDemoData
} from './utils/storage';
import { 
  AdminUser, 
  getAdminSession, 
  logoutAdmin,
  getParentSession,
  logoutParent
} from './utils/auth';
import { ParentAuthModal } from './components/ParentAuthModal';
import { RotateCcw, School, MapPin, Phone, Mail, CheckCircle } from 'lucide-react';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'submit' | 'track' | 'admin' | 'charter'>('submit');
  const [tickets, setTickets] = useState<ConcernTicket[]>([]);
  const [preventiveActions, setPreventiveActions] = useState<PreventiveAction[]>([]);
  const [activeTrackingCode, setActiveTrackingCode] = useState<string | undefined>(undefined);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [parentUser, setParentUser] = useState<ParentUser | null>(null);
  const [isParentAuthOpen, setIsParentAuthOpen] = useState(false);
  const [parentAuthMode, setParentAuthMode] = useState<'login' | 'register'>('login');

  // Load from local storage
  useEffect(() => {
    setTickets(getStoredTickets());
    setPreventiveActions(getStoredPreventiveActions());
    setAdminUser(getAdminSession());
    setParentUser(getParentSession());
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleTicketSubmitted = (newTicket: ConcernTicket) => {
    const updated = saveTicketToStorage(newTicket);
    setTickets(updated);
    showToast(`تم تسجيل الانشغال بنجاح تحت رقم التذكرة: ${newTicket.id}`);
  };

  const handleUpdateTicket = (updatedTicket: ConcernTicket) => {
    const updated = saveTicketToStorage(updatedTicket);
    setTickets(updated);
    showToast(`تم تحديث القرار وحفظ الإجراء بنجاح للتذكرة ${updatedTicket.id}`);
  };

  const handleAddPreventiveAction = (action: PreventiveAction) => {
    const updated = savePreventiveActionToStorage(action);
    setPreventiveActions(updated);
    showToast(`تم اعتماد التدبير الوقائي الجديد: ${action.title}`);
  };

  const handleSendMessage = (ticketId: string, message: MessageItem) => {
    const updated = addMessageToTicket(ticketId, message);
    setTickets(updated);
  };

  const handleGoToTracking = (trackingCode: string) => {
    setActiveTrackingCode(trackingCode);
    setCurrentTab('track');
  };

  const handleLoginSuccess = (user: AdminUser) => {
    setAdminUser(user);
    showToast(`مرحباً بكم ${user.name}، تم تسجيل الدخول بنجاح`);
  };

  const handleLogout = () => {
    logoutAdmin();
    setAdminUser(null);
    showToast('تم تسجيل الخروج من فضاء الإدارة بنجاح');
  };

  const handleParentLoginSuccess = (user: ParentUser) => {
    setParentUser(user);
    showToast(`مرحباً بكم ولي الأمر ${user.fullName}، تم الدخول بنجاح`);
  };

  const handleParentLogout = () => {
    logoutParent();
    setParentUser(null);
    showToast('تم تسجيل خروج حساب ولي الأمر بنجاح');
  };

  const handleOpenParentAuth = (mode: 'login' | 'register' = 'login') => {
    setParentAuthMode(mode);
    setIsParentAuthOpen(true);
  };

  const handleResetDemo = () => {
    if (window.confirm('هل تريد استعادة البيانات النموذجية الافتراضية للمنصة؟')) {
      const { tickets: defaultTickets, actions: defaultActions } = resetDemoData();
      setTickets(defaultTickets);
      setPreventiveActions(defaultActions);
      showToast('تمت استعادة البيانات النموذجية الأولية بنجاح.');
    }
  };

  const urgentCount = tickets.filter(t => t.urgency === 'urgent' && t.status !== 'resolved').length;

  return (
    <div className="min-h-screen flex flex-col bg-stone-50 text-stone-900 font-['Cairo',sans-serif]">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-stone-900 text-white px-4 py-3 rounded-xl shadow-lg border border-stone-800 text-xs font-semibold flex items-center gap-2 animate-bounce">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Official Top Bar */}
      <Header 
        currentTab={currentTab} 
        onSelectTab={setCurrentTab} 
        urgentCount={urgentCount}
        adminUser={adminUser}
        onLogout={handleLogout}
        parentUser={parentUser}
        onParentLogout={handleParentLogout}
        onOpenParentAuth={handleOpenParentAuth}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {currentTab === 'submit' && (
          <ParentSubmissionForm 
            onSubmitSuccess={handleTicketSubmitted}
            onGoToTracking={handleGoToTracking}
            currentUser={parentUser}
            onOpenAuthModal={handleOpenParentAuth}
          />
        )}

        {currentTab === 'track' && (
          <ParentTrackingView 
            tickets={tickets}
            initialTrackingCode={activeTrackingCode}
            onSendMessage={handleSendMessage}
            onNewConcernClick={() => setCurrentTab('submit')}
            currentUser={parentUser}
            onOpenAuthModal={handleOpenParentAuth}
          />
        )}

        {currentTab === 'admin' && (
          adminUser ? (
            <AdminDashboard 
              tickets={tickets}
              preventiveActions={preventiveActions}
              onUpdateTicket={handleUpdateTicket}
              onAddPreventiveAction={handleAddPreventiveAction}
              onSendMessage={handleSendMessage}
              adminUser={adminUser}
              onLogout={handleLogout}
            />
          ) : (
            <AdminLogin 
              onLoginSuccess={handleLoginSuccess}
              onBackToParentPortal={() => setCurrentTab('submit')}
            />
          )
        )}

        {currentTab === 'charter' && (
          <ParentCharterModal 
            onClose={() => setCurrentTab('submit')}
            onGoToSubmit={() => setCurrentTab('submit')}
          />
        )}
      </main>

      {/* Parent Auth Modal */}
      <ParentAuthModal 
        isOpen={isParentAuthOpen}
        onClose={() => setIsParentAuthOpen(false)}
        onAuthSuccess={handleParentLoginSuccess}
        initialMode={parentAuthMode}
      />

      {/* Official Footer */}
      <footer className="no-print bg-white border-t border-stone-200 mt-auto py-8 text-xs text-stone-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="space-y-2">
              <div className="flex items-center gap-2 font-bold text-stone-900 text-sm">
                <School className="w-4 h-4 text-emerald-700" />
                <span>مدرسة نوار محمد الابتدائية</span>
              </div>
              <p className="text-stone-500 leading-relaxed text-[11px]">
                مؤسسة عمومية للتعليم الابتدائي تضم الأقسام التحضيرية والسنوات الأولى حتى الخامسة ابتدائي. المنصة مخصصة لتعزيز الشراكة مع أولياء الأمور وتوفير بيئة تربوية وقائية آمنة لأبنائنا.
              </p>
            </div>

            <div className="space-y-1.5 text-[11px]">
              <div className="font-bold text-stone-900 mb-2">معلومات الاتصال الميداني</div>
              <div className="flex items-center gap-2 text-stone-600">
                <MapPin className="w-3.5 h-3.5 text-stone-400" />
                <span>مقر المؤسسة: حي النصر، الدائرة التربوية لمفتشية التعليم الابتدائي</span>
              </div>
              <div className="flex items-center gap-2 text-stone-600">
                <Phone className="w-3.5 h-3.5 text-stone-400" />
                <span>أمانة المؤسسة: 021 00 00 00 / خلية الاستقبال والمتابعة</span>
              </div>
              <div className="flex items-center gap-2 text-stone-600">
                <Mail className="w-3.5 h-3.5 text-stone-400" />
                <span>البريد الإلكتروني الرسمي: contact@ecole-nouar-mohamed.dz</span>
              </div>
            </div>

            <div className="space-y-2 text-[11px] md:text-left">
              <div className="font-bold text-stone-900 mb-2">إدارة المنصة والبيانات</div>
              <p className="text-stone-500">
                منصة رقمية موثوقة ومطابقة لمعايير وزارة التربية الوطنية لحماية المعطيات الشخصية للمتمدرسين والأولياء.
              </p>
              <button
                onClick={handleResetDemo}
                className="inline-flex items-center gap-1.5 text-stone-500 hover:text-stone-800 transition-colors pt-1"
                title="استعادة البيانات الافتراضية"
              >
                <RotateCcw className="w-3 h-3 text-stone-400" />
                <span>استعادة البيانات النموذجية الأولية</span>
              </button>
            </div>

          </div>

          <div className="pt-4 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between text-[11px] text-stone-400 gap-2">
            <div>
              © 2026 مدرسة نوار محمد الابتدائية · جميع الحقوق محفوظة
            </div>
            <div className="flex items-center gap-4">
              <span>القسم التحضيري</span>
              <span>·</span>
              <span>السنة 1 إلى 5 ابتدائي</span>
              <span>·</span>
              <span>نظام الرصد والوقاية البيداغوجية</span>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
