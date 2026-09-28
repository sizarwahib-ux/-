import React, { useState } from 'react';
import { 
  BarChart3, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  ShieldCheck, 
  Filter, 
  Search, 
  Calendar, 
  MessageSquare, 
  Plus, 
  FileText, 
  Printer, 
  UserCheck, 
  Layers, 
  Sparkles, 
  Send,
  Eye,
  GraduationCap,
  Users,
  HeartPulse,
  Utensils,
  Lightbulb,
  KeyRound,
  LogOut,
  Lock,
  Check
} from 'lucide-react';
import { 
  ConcernTicket, 
  PreventiveAction, 
  GradeLevel, 
  ConcernCategory, 
  ConcernStatus, 
  UrgencyLevel, 
  GRADE_LEVELS, 
  CONCERN_CATEGORIES,
  MessageItem
} from '../types';
import { 
  getGradeLabel, 
  getGradeShortLabel, 
  getCategoryLabel, 
  getStatusDetails, 
  getUrgencyDetails, 
  formatDateArabic, 
  calculateStatistics 
} from '../utils/formatters';
import { AdminUser, changeAdminPassword } from '../utils/auth';

interface AdminDashboardProps {
  tickets: ConcernTicket[];
  preventiveActions: PreventiveAction[];
  onUpdateTicket: (ticket: ConcernTicket) => void;
  onAddPreventiveAction: (action: PreventiveAction) => void;
  onSendMessage: (ticketId: string, message: MessageItem) => void;
  adminUser?: AdminUser | null;
  onLogout?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  tickets,
  preventiveActions,
  onUpdateTicket,
  onAddPreventiveAction,
  onSendMessage,
  adminUser,
  onLogout
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'stats' | 'queue' | 'prevention' | 'reports'>('stats');

  // Change password modal
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);

  // Filters for Concern Queue
  const [filterLevel, setFilterLevel] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterUrgency, setFilterUrgency] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Selected Ticket for Modal/Drawer
  const [inspectTicket, setInspectTicket] = useState<ConcernTicket | null>(null);

  // Resolution Form State inside modal
  const [adminResponseInput, setAdminResponseInput] = useState('');
  const [assignedToInput, setAssignedToInput] = useState('');
  const [statusInput, setStatusInput] = useState<ConcernStatus>('in_review');
  const [scheduleMeetingEnabled, setScheduleMeetingEnabled] = useState(false);
  const [meetingDate, setMeetingDate] = useState('');
  const [meetingTime, setMeetingTime] = useState('10:00');
  const [meetingLocation, setMeetingLocation] = useState('مكتب الإدارة البيداغوجية');
  const [meetingWith, setMeetingWith] = useState('أستاذ الفوج والمدير');
  const [linkPreventiveId, setLinkPreventiveId] = useState('');
  const [directReplyText, setDirectReplyText] = useState('');

  // New Preventive Action Form State
  const [showNewPrevModal, setShowNewPrevModal] = useState(false);
  const [prevTitle, setPrevTitle] = useState('');
  const [prevCategory, setPrevCategory] = useState<ConcernCategory>('academic');
  const [prevLevels, setPrevLevels] = useState<GradeLevel[]>(['1st', '2nd']);
  const [prevRootCause, setPrevRootCause] = useState('');
  const [prevActionTaken, setPrevActionTaken] = useState('');
  const [prevResponsible, setPrevResponsible] = useState('لجنة الوقاية والمتابعة البيداغوجية');
  const [prevImpact, setPrevImpact] = useState('تفادي تكرار المشكل ورفع رضا الأولياء بنسبة 90%');

  // Statistics calculation
  const stats = calculateStatistics(tickets);

  // Filtered tickets
  const filteredQueue = tickets.filter(t => {
    if (filterLevel !== 'all' && t.gradeLevel !== filterLevel) return false;
    if (filterCategory !== 'all' && t.category !== filterCategory) return false;
    if (filterStatus !== 'all' && t.status !== filterStatus) return false;
    if (filterUrgency !== 'all' && t.urgency !== filterUrgency) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        t.id.toLowerCase().includes(q) ||
        t.studentName.toLowerCase().includes(q) ||
        t.parentName.toLowerCase().includes(q) ||
        t.parentNIN.includes(q) ||
        t.parentPhone.includes(q) ||
        t.title.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleOpenInspect = (ticket: ConcernTicket) => {
    setInspectTicket(ticket);
    setAdminResponseInput(ticket.adminResponse || '');
    setAssignedToInput(ticket.assignedTo || 'مدير المؤسسة');
    setStatusInput(ticket.status);
    setScheduleMeetingEnabled(!!ticket.meetingScheduled);
    if (ticket.meetingScheduled) {
      setMeetingDate(ticket.meetingScheduled.date);
      setMeetingTime(ticket.meetingScheduled.time);
      setMeetingLocation(ticket.meetingScheduled.location);
      setMeetingWith(ticket.meetingScheduled.withWhom);
    } else {
      setMeetingDate('2026-10-01');
      setMeetingTime('10:00');
      setMeetingLocation('مكتب الإدارة البيداغوجية');
      setMeetingWith('أستاذ الفوج والمدير');
    }
    setLinkPreventiveId(ticket.preventiveActionId || '');
  };

  const handleSaveResolution = () => {
    if (!inspectTicket) return;

    const updated: ConcernTicket = {
      ...inspectTicket,
      updatedAt: new Date().toISOString(),
      adminResponse: adminResponseInput.trim() || undefined,
      assignedTo: assignedToInput.trim() || undefined,
      status: statusInput,
      preventiveActionId: linkPreventiveId || undefined,
      meetingScheduled: scheduleMeetingEnabled
        ? {
            date: meetingDate,
            time: meetingTime,
            location: meetingLocation,
            withWhom: meetingWith,
            confirmed: true
          }
        : undefined
    };

    onUpdateTicket(updated);
    setInspectTicket(updated);
  };

  const handleSendDirectReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!directReplyText.trim() || !inspectTicket) return;

    const newMessage: MessageItem = {
      id: `msg-${Date.now()}`,
      sender: 'admin',
      senderName: 'إدارة مدرسة نوار محمد',
      message: directReplyText.trim(),
      timestamp: new Date().toISOString()
    };

    onSendMessage(inspectTicket.id, newMessage);
    setDirectReplyText('');
    setInspectTicket(prev => prev ? {
      ...prev,
      conversation: [...prev.conversation, newMessage]
    } : null);
  };

  const handleCreatePreventiveAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prevTitle.trim() || !prevRootCause.trim() || !prevActionTaken.trim()) return;

    const newAction: PreventiveAction = {
      id: `PREV-${String(preventiveActions.length + 1).padStart(2, '0')}`,
      title: prevTitle.trim(),
      category: prevCategory,
      targetLevels: prevLevels,
      rootCause: prevRootCause.trim(),
      actionTaken: prevActionTaken.trim(),
      responsibleParty: prevResponsible.trim(),
      implementationDate: new Date().toISOString().split('T')[0],
      status: 'in_progress',
      impactMetric: prevImpact.trim(),
      relatedTicketsCount: 1
    };

    onAddPreventiveAction(newAction);
    setShowNewPrevModal(false);
    // Reset form
    setPrevTitle('');
    setPrevRootCause('');
    setPrevActionTaken('');
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(null);

    if (newPassword !== confirmPassword) {
      setPasswordError('كلمة المرور الجديدة وتأكيدها غير متطابقين');
      return;
    }

    if (!adminUser) return;
    const res = changeAdminPassword(adminUser.username, oldPassword, newPassword);
    if (!res.success) {
      setPasswordError(res.error || 'حدث خطأ أثناء تغيير كلمة المرور');
    } else {
      setPasswordSuccess('تم تحديث كلمة المرور بنجاح!');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => {
        setShowPasswordModal(false);
        setPasswordSuccess(null);
      }, 1500);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-6">
      
      {/* Top Banner / Dashboard Navigation */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs p-6 space-y-4">
        
        {/* Admin User Header Bar */}
        {adminUser && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center justify-center font-bold text-sm">
                {adminUser.avatarTitle}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-stone-900 text-sm">{adminUser.name}</span>
                  <span className="text-[11px] font-mono bg-stone-100 text-stone-600 px-2 py-0.5 rounded border border-stone-200">
                    @{adminUser.username}
                  </span>
                </div>
                <span className="text-xs text-stone-500 block">{adminUser.role}</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowPasswordModal(true);
                  setPasswordError(null);
                  setPasswordSuccess(null);
                }}
                className="px-3 py-1.5 rounded-lg border border-stone-200 hover:bg-stone-50 text-xs font-semibold text-stone-700 flex items-center gap-1.5 transition-colors"
              >
                <KeyRound className="w-3.5 h-3.5 text-stone-500" />
                <span>تغيير كلمة المرور</span>
              </button>

              {onLogout && (
                <button
                  type="button"
                  onClick={onLogout}
                  className="px-3 py-1.5 rounded-lg border border-rose-200 hover:bg-rose-50 text-xs font-semibold text-rose-700 flex items-center gap-1.5 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5 text-rose-500" />
                  <span>تسجيل الخروج</span>
                </button>
              )}
            </div>
          </div>
        )}

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
                منصة الإدارة والرصد المدرسي
              </span>
              <span className="text-xs text-stone-500 font-mono">
                السنة الدراسية 2026/2027
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-stone-900 mt-1">
              لوحة قيادة مدرسة نوار محمد الابتدائية: الرصد، المعالجة والوقاية
            </h1>
          </div>

          {/* Sub Navigation Tabs */}
          <div className="flex items-center gap-1.5 bg-stone-100 p-1.5 rounded-xl border border-stone-200 overflow-x-auto">
            <button
              onClick={() => setActiveSubTab('stats')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 shrink-0 ${
                activeSubTab === 'stats'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <BarChart3 className="w-4 h-4 text-emerald-600" />
              <span>الإحصائيات والرصد</span>
            </button>

            <button
              onClick={() => setActiveSubTab('queue')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 shrink-0 ${
                activeSubTab === 'queue'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Layers className="w-4 h-4 text-emerald-600" />
              <span>معالجة الانشغالات ({tickets.length})</span>
            </button>

            <button
              onClick={() => setActiveSubTab('prevention')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 shrink-0 ${
                activeSubTab === 'prevention'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>خطة الوقاية والاستباقية ({preventiveActions.length})</span>
            </button>

            <button
              onClick={() => setActiveSubTab('reports')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 shrink-0 ${
                activeSubTab === 'reports'
                  ? 'bg-white text-emerald-800 shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <FileText className="w-4 h-4 text-emerald-600" />
              <span>التقارير والمحاضر</span>
            </button>
          </div>
        </div>
      </div>

      {/* ===================== TAB 1: STATISTICS & MONITORING ===================== */}
      {activeSubTab === 'stats' && (
        <div className="space-y-6">
          
          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
              <span className="text-xs text-stone-500 font-semibold block mb-1">إجمالي الانشغالات المرصودة</span>
              <div className="text-3xl font-extrabold text-stone-900 tabular-nums">
                {stats.total}
              </div>
              <div className="text-[11px] text-stone-500 mt-2 flex items-center gap-1">
                <span className="text-emerald-700 font-bold">100%</span>
                <span>مسجلة ومصنفة رقمياً</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
              <span className="text-xs text-stone-500 font-semibold block mb-1">نسبة التسوية والمعالجة</span>
              <div className="text-3xl font-extrabold text-emerald-700 tabular-nums">
                {stats.resolutionRate}%
              </div>
              <div className="text-[11px] text-stone-500 mt-2 flex items-center gap-1">
                <span>{stats.resolved + stats.responded + stats.preventive} انشغال تمت تسويته أو اتخاذ إجراء</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
              <span className="text-xs text-stone-500 font-semibold block mb-1">انشغالات عاجلة / تستوجب تدخلاً</span>
              <div className="text-3xl font-extrabold text-rose-700 tabular-nums">
                {stats.urgent}
              </div>
              <div className="text-[11px] text-rose-600 mt-2 font-medium">
                تتطلب معالجة فورية ومتابعة صحية/سلوكية
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
              <span className="text-xs text-stone-500 font-semibold block mb-1">إجراءات وقائية استباقية متخذة</span>
              <div className="text-3xl font-extrabold text-purple-700 tabular-nums">
                {preventiveActions.length}
              </div>
              <div className="text-[11px] text-purple-700 mt-2 font-medium">
                قرارات تنظيمية وبيداغوجية لتفادي تكرارها
              </div>
            </div>
          </div>

          {/* Core Monitoring Breakdown 1: By Educational Level (تحضيري إلى السنة الخامسة) */}
          <div className="bg-white rounded-2xl border border-stone-200 shadow-xs p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200 pb-3">
              <div>
                <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-emerald-700" />
                  <span>رصد الانشغالات حسب المستوى الدراسي (الطور التحضيري وسنوات الابتدائي)</span>
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  توزيع المشاكل على أطوار مدرسة نوار محمد لمعرفة خصوصيات كل سن دراسي
                </p>
              </div>
              <span className="text-xs font-mono text-stone-400">إحصاء شامل ومحدث</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
              {stats.gradeDistribution.map(g => {
                return (
                  <div key={g.level} className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 hover:bg-stone-50 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-extrabold text-stone-900">
                        {g.label}
                      </span>
                      <span className="text-xs font-bold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded-md tabular-nums">
                        {g.count} انشغال
                      </span>
                    </div>

                    <div className="w-full bg-stone-200 h-2.5 rounded-full overflow-hidden mb-3">
                      <div 
                        className="bg-emerald-600 h-full rounded-full transition-all duration-500"
                        style={{ width: `${Math.max(g.percentage, 5)}%` }}
                      ></div>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-stone-500">
                      <span>النسبة: <strong className="tabular-nums text-stone-700">{g.percentage}%</strong></span>
                      <span className="text-stone-600">
                        السبب الأبرز: <span className="font-semibold text-emerald-800">{g.topCategory}</span>
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Qualitative Educational Analysis Box */}
            <div className="bg-emerald-50/60 border border-emerald-200 rounded-xl p-4 text-xs text-emerald-950 leading-relaxed flex items-start gap-3 mt-2">
              <Lightbulb className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block mb-1">الرصد البيداغوجي الاستباقي للطور الابتدائي:</span>
                يُلاحظ تركز انشغالات <strong>القسم التحضيري والسنة الأولى</strong> حول التكيف النفسي وثقل المحفظة ومسك القلم؛ بينما تتركز انشغالات <strong>السنة الخامسة</strong> حول التحضير لامتحان تقييم المكتسبات والمعالجة البيداغوجية، مما يفرض توجيه التدخلات الوقائية لكل طور على حدة.
              </div>
            </div>
          </div>

          {/* Breakdown 2: By Problem Category & Breakdown 3: By Siblings Count */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Category Breakdown (7 cols) */}
            <div className="lg:col-span-7 bg-white rounded-2xl border border-stone-200 shadow-xs p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                <h3 className="text-base font-bold text-stone-900">
                  تصنيف المشاكل والانشغالات النوعية
                </h3>
                <span className="text-xs text-stone-400">الترتيب حسب التكرار</span>
              </div>

              <div className="space-y-3 pt-2">
                {stats.categoryDistribution.map(cat => (
                  <div key={cat.category} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-stone-800">{cat.name}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-stone-500 font-mono tabular-nums">{cat.count} حالة</span>
                        <span className="font-bold text-stone-900 tabular-nums">({cat.percentage}%)</span>
                      </div>
                    </div>
                    <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-emerald-700 h-full rounded-full transition-all"
                        style={{ width: `${Math.max(cat.percentage, 4)}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sibling Factor Breakdown (5 cols) */}
            <div className="lg:col-span-5 bg-white rounded-2xl border border-stone-200 shadow-xs p-6 space-y-4">
              <div className="border-b border-stone-200 pb-3">
                <h3 className="text-base font-bold text-stone-900">
                  رصد المعطيات الأسرية (عدد الإخوة)
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  تأثير حجم الأسرة على المتابعة المنزلية للانشغالات
                </p>
              </div>

              <div className="space-y-3 pt-2">
                {stats.siblingBuckets.map((bucket, idx) => (
                  <div key={idx} className="p-3 rounded-xl border border-stone-200 bg-stone-50/60 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-stone-500" />
                      <span className="font-bold text-stone-800">{bucket.label}</span>
                    </div>
                    <div className="font-bold text-emerald-800 tabular-nums bg-white px-2 py-1 rounded-md border border-stone-200">
                      {bucket.count} انشغال
                    </div>
                  </div>
                ))}
              </div>

              <p className="text-[11px] text-stone-500 leading-normal pt-2">
                * تفيد معرفة عدد الإخوة في تكييف حجم الواجبات المنزلية ومراعاة الوقت المتاح للولي للمرافقة.
              </p>
            </div>

          </div>

        </div>
      )}

      {/* ===================== TAB 2: CONCERN QUEUE & MANAGEMENT ===================== */}
      {activeSubTab === 'queue' && (
        <div className="space-y-6">
          
          {/* Filters Bar */}
          <div className="bg-white rounded-2xl border border-stone-200 shadow-xs p-5 space-y-4">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder="ابحث باسم التلميذ، اسم الولي، رقم التعريف الوطني (NIN)، الهاتف، أو رقم التذكرة..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pr-10 pl-4 py-2 rounded-xl border border-stone-300 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20"
                />
                <Search className="w-4 h-4 text-stone-400 absolute right-3 top-2.5 pointer-events-none" />
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {/* Level filter */}
                <select
                  value={filterLevel}
                  onChange={(e) => setFilterLevel(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-stone-300 text-xs bg-white font-medium"
                >
                  <option value="all">كافة المستويات الدراسية</option>
                  {GRADE_LEVELS.map(g => (
                    <option key={g.id} value={g.id}>{g.shortLabel} ({g.label})</option>
                  ))}
                </select>

                {/* Category filter */}
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-stone-300 text-xs bg-white font-medium"
                >
                  <option value="all">كافة التصنيفات</option>
                  {CONCERN_CATEGORIES.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>

                {/* Status filter */}
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-stone-300 text-xs bg-white font-medium"
                >
                  <option value="all">كافة الحالات</option>
                  <option value="submitted">جديد - مسجل</option>
                  <option value="in_review">قيد الدراسة والتحري</option>
                  <option value="responded">تم الرد / موعد محدد</option>
                  <option value="preventive_action">إجراء وقائي</option>
                  <option value="resolved">تمت التسوية بنجاح</option>
                </select>

                {/* Reset button */}
                {(filterLevel !== 'all' || filterCategory !== 'all' || filterStatus !== 'all' || searchQuery) && (
                  <button
                    onClick={() => {
                      setFilterLevel('all');
                      setFilterCategory('all');
                      setFilterStatus('all');
                      setSearchQuery('');
                    }}
                    className="px-3 py-2 text-xs text-stone-500 hover:text-stone-800 underline"
                  >
                    إعادة تعيين
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Tickets Table / List */}
          <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-stone-50 text-stone-600 font-bold border-b border-stone-200">
                  <tr>
                    <th className="py-3 px-4">رقم التذكرة والتاريخ</th>
                    <th className="py-3 px-4">التلميذ والمستوى</th>
                    <th className="py-3 px-4">هوية الولي والرقم الوطني (NIN)</th>
                    <th className="py-3 px-4">موضوع الانشغال والتصنيف</th>
                    <th className="py-3 px-4">الاستعجال</th>
                    <th className="py-3 px-4">الحالة</th>
                    <th className="py-3 px-4 text-center">الإجراء والمعالجة</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200 font-normal">
                  {filteredQueue.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-stone-500">
                        لا توجد انشغالات مطابقة للفلاتر المحددة.
                      </td>
                    </tr>
                  ) : (
                    filteredQueue.map(t => {
                      const statusInfo = getStatusDetails(t.status);
                      const urgencyInfo = getUrgencyDetails(t.urgency);

                      return (
                        <tr key={t.id} className="hover:bg-stone-50/80 transition-colors">
                          
                          {/* Ticket ID & Date */}
                          <td className="py-3.5 px-4 font-mono">
                            <span className="font-bold text-stone-900 block">{t.id}</span>
                            <span className="text-[11px] text-stone-400 block">{formatDateArabic(t.createdAt).split('،')[0]}</span>
                          </td>

                          {/* Student & Grade */}
                          <td className="py-3.5 px-4">
                            <div className="font-bold text-stone-900">{t.studentName}</div>
                            <div className="text-[11px] text-emerald-800 font-medium">
                              {getGradeShortLabel(t.gradeLevel)} · {t.sectionClass}
                            </div>
                            <div className="text-[10px] text-stone-400 tabular-nums">
                              {t.siblingsCount} إخوة بالأسرة
                            </div>
                          </td>

                          {/* Parent Details */}
                          <td className="py-3.5 px-4">
                            <div className="font-medium text-stone-800">{t.parentName}</div>
                            <div className="text-[11px] font-mono text-stone-500 tracking-wider">
                              NIN: {t.parentNIN}
                            </div>
                            <div className="text-[10px] text-stone-400">
                              والدة الولي: {t.parentMotherName}
                            </div>
                          </td>

                          {/* Subject & Category */}
                          <td className="py-3.5 px-4 max-w-xs">
                            <div className="font-bold text-stone-900 line-clamp-1">{t.title}</div>
                            <div className="text-[11px] text-stone-500">
                              {getCategoryLabel(t.category)}
                            </div>
                          </td>

                          {/* Urgency */}
                          <td className="py-3.5 px-4">
                            <span className={`inline-flex items-center gap-1.5 ${urgencyInfo.textClass}`}>
                              <span className={`w-2 h-2 rounded-full ${urgencyInfo.dotClass}`}></span>
                              <span>{urgencyInfo.label}</span>
                            </span>
                          </td>

                          {/* Status */}
                          <td className="py-3.5 px-4">
                            <span className={`inline-block px-2 py-0.5 rounded-md border text-[11px] font-bold ${statusInfo.bgClass} ${statusInfo.textClass}`}>
                              {statusInfo.label}
                            </span>
                            {t.meetingScheduled && (
                              <span className="block text-[10px] text-emerald-700 font-semibold mt-0.5">
                                موعد: {t.meetingScheduled.date}
                              </span>
                            )}
                          </td>

                          {/* Actions */}
                          <td className="py-3.5 px-4 text-center">
                            <button
                              onClick={() => handleOpenInspect(t)}
                              className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-lg text-xs shadow-xs transition-colors inline-flex items-center gap-1"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>معالجة واتخاذ قرار</span>
                            </button>
                          </td>

                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

      {/* ===================== TAB 3: PREVENTIVE ACTION PLAN ===================== */}
      {activeSubTab === 'prevention' && (
        <div className="space-y-6">
          
          {/* Header & Add Button */}
          <div className="bg-white rounded-2xl border border-stone-200 shadow-xs p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-700" />
                <h2 className="text-lg font-bold text-stone-900">
                  مصفوفة التدابير الوقائية والاستباقية لمدرسة نوار محمد
                </h2>
              </div>
              <p className="text-xs text-stone-500 mt-1">
                تحويل الشكاوى والانشغالات المتكررة إلى قرارات وقائية تنظيمية وبيداغوجية لتفادي حدوثها مستقبلاً
              </p>
            </div>

            <button
              onClick={() => setShowNewPrevModal(true)}
              className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs shadow-xs transition-colors flex items-center gap-1.5 shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>تسجيل تدبير وقائي جديد</span>
            </button>
          </div>

          {/* Preventive Actions List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {preventiveActions.map(action => {
              return (
                <div key={action.id} className="bg-white rounded-2xl border border-stone-200 shadow-xs p-6 space-y-4">
                  <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-xs bg-purple-50 text-purple-700 border border-purple-200 px-2.5 py-0.5 rounded-md">
                        {action.id}
                      </span>
                      <span className="text-xs font-semibold text-stone-600">
                        {getCategoryLabel(action.category)}
                      </span>
                    </div>

                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md ${
                      action.status === 'implemented'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      {action.status === 'implemented' ? 'مطبّق ومفعّل' : 'قيد الإنجاز'}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-stone-900">
                    {action.title}
                  </h3>

                  {/* Target Levels */}
                  <div className="flex items-center gap-1.5 flex-wrap text-[11px]">
                    <span className="text-stone-400">الأطوار المستهدفة:</span>
                    {action.targetLevels.map(lvl => (
                      <span key={lvl} className="bg-stone-100 text-stone-700 px-2 py-0.5 rounded-md font-semibold">
                        {getGradeShortLabel(lvl)}
                      </span>
                    ))}
                  </div>

                  {/* Root cause */}
                  <div className="bg-rose-50/60 border border-rose-100 rounded-xl p-3 text-xs">
                    <span className="font-bold text-rose-900 block mb-0.5">السبب الجذري المرصود من الشكاوى:</span>
                    <p className="text-stone-700">{action.rootCause}</p>
                  </div>

                  {/* Action taken to avoid */}
                  <div className="bg-emerald-50/60 border border-emerald-100 rounded-xl p-3 text-xs">
                    <span className="font-bold text-emerald-900 block mb-0.5">التدبير الوقائي لتفادي المشكل مستقبلاً:</span>
                    <p className="text-stone-700">{action.actionTaken}</p>
                  </div>

                  {/* Footer with Impact & Responsible */}
                  <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
                    <span>المسؤول: <strong className="text-stone-800">{action.responsibleParty}</strong></span>
                    <span>الأثر: <strong className="text-emerald-700">{action.impactMetric}</strong></span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* ===================== TAB 4: OFFICIAL REPORTS & PRINT ===================== */}
      {activeSubTab === 'reports' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-stone-200 shadow-xs p-6 sm:p-8 space-y-6">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-5">
              <div>
                <div className="text-xs font-semibold text-stone-500">
                  الجمهورية الجزائرية الديمقراطية الشعبية · وزارة التربية الوطنية
                </div>
                <h2 className="text-xl font-extrabold text-stone-900 mt-1">
                  التقرير الدوري لرصد ومعالجة انشغالات الأولياء والتدابير الوقائية
                </h2>
                <div className="text-xs text-stone-600 mt-1">
                  مدرسة نوار محمد الابتدائية · مفتشية التعليم الابتدائي · السنة الدراسية 2026/2027
                </div>
              </div>

              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs shadow-xs transition-colors flex items-center gap-2 self-start"
              >
                <Printer className="w-4 h-4" />
                <span>طباعة التقرير الرسمي</span>
              </button>
            </div>

            {/* Official Report Content Box */}
            <div className="space-y-6 text-xs text-stone-800 leading-relaxed border border-stone-200 rounded-xl p-6 bg-stone-50/40">
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center border-b border-stone-200 pb-4">
                <div>
                  <span className="text-stone-400 block mb-1">إجمالي الحالات</span>
                  <span className="text-xl font-bold text-stone-900 tabular-nums">{stats.total}</span>
                </div>
                <div>
                  <span className="text-stone-400 block mb-1">الحالات المعالجة</span>
                  <span className="text-xl font-bold text-emerald-700 tabular-nums">{stats.resolved + stats.responded + stats.preventive}</span>
                </div>
                <div>
                  <span className="text-stone-400 block mb-1">معدل التسوية</span>
                  <span className="text-xl font-bold text-emerald-700 tabular-nums">{stats.resolutionRate}%</span>
                </div>
                <div>
                  <span className="text-stone-400 block mb-1">تدابير وقائية معتمدة</span>
                  <span className="text-xl font-bold text-purple-700 tabular-nums">{preventiveActions.length}</span>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-stone-900 text-sm mb-2">أولاً: الحصيلة الإحصائية حسب المستويات الدراسية</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {stats.gradeDistribution.map(g => (
                    <div key={g.level} className="bg-white p-2.5 rounded-lg border border-stone-200">
                      <span className="font-bold text-stone-900 block">{g.label}:</span>
                      <span className="text-stone-600">{g.count} انشغال ({g.percentage}%) - {g.topCategory}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-bold text-stone-900 text-sm mb-2">ثانياً: خطة الوقاية والاستباقية المصادق عليها من طرف إدارة المؤسسة</h4>
                <div className="space-y-2">
                  {preventiveActions.map((act, i) => (
                    <div key={act.id} className="bg-white p-3 rounded-lg border border-stone-200">
                      <div className="font-bold text-stone-900">{i + 1}. {act.title}</div>
                      <div className="text-stone-600 mt-1">
                        <strong>التدبير الوقائي:</strong> {act.actionTaken}
                      </div>
                      <div className="text-stone-500 mt-0.5 text-[11px]">
                        المسؤول: {act.responsibleParty} · الأثر المحقق: {act.impactMetric}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-6 border-t border-stone-200 flex justify-between items-center text-xs">
                <div>
                  حرر بمقر المؤسسة في: {new Date().toLocaleDateString('ar-DZ')}
                </div>
                <div className="text-center font-bold">
                  مدير مدرسة نوار محمد الابتدائية
                  <div className="h-12 flex items-center justify-center text-stone-300 font-serif italic text-sm">
                    (الختم والإمضاء)
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* ===================== MODAL: INSPECT & RESOLVE CONCERN ===================== */}
      {inspectTicket && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-stone-200 shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-6">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-stone-200 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-xs bg-emerald-50 text-emerald-800 px-2.5 py-0.5 rounded-md border border-emerald-200">
                    {inspectTicket.id}
                  </span>
                  <span className="text-xs text-stone-400">
                    {formatDateArabic(inspectTicket.createdAt)}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-stone-900 mt-1">
                  {inspectTicket.title}
                </h3>
              </div>

              <button
                onClick={() => setInspectTicket(null)}
                className="text-stone-400 hover:text-stone-700 text-lg font-bold px-2"
              >
                ✕
              </button>
            </div>

            {/* Complete Civil Details Grid */}
            <div className="bg-stone-50 rounded-xl p-4 border border-stone-200 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <span className="text-stone-400 block mb-0.5">التلميذ</span>
                <span className="font-bold text-stone-900">{inspectTicket.studentName}</span>
              </div>
              <div>
                <span className="text-stone-400 block mb-0.5">المستوى والفوج</span>
                <span className="font-bold text-emerald-800">{getGradeLabel(inspectTicket.gradeLevel)} ({inspectTicket.sectionClass})</span>
              </div>
              <div>
                <span className="text-stone-400 block mb-0.5">عدد الإخوة</span>
                <span className="font-bold text-stone-900 tabular-nums">{inspectTicket.siblingsCount} إخوة</span>
              </div>
              <div>
                <span className="text-stone-400 block mb-0.5">اسم الولي</span>
                <span className="font-semibold text-stone-900">{inspectTicket.parentName}</span>
              </div>
              <div>
                <span className="text-stone-400 block mb-0.5">رقم التعريف الوطني (NIN)</span>
                <span className="font-mono font-bold text-stone-900 tracking-wider">{inspectTicket.parentNIN}</span>
              </div>
              <div>
                <span className="text-stone-400 block mb-0.5">اسم والدة الولي</span>
                <span className="font-semibold text-stone-800">{inspectTicket.parentMotherName}</span>
              </div>
              <div>
                <span className="text-stone-400 block mb-0.5">الهاتف</span>
                <span className="font-mono text-stone-800">{inspectTicket.parentPhone}</span>
              </div>
              <div>
                <span className="text-stone-400 block mb-0.5">التصنيف</span>
                <span className="font-semibold text-stone-800">{getCategoryLabel(inspectTicket.category)}</span>
              </div>
              <div>
                <span className="text-stone-400 block mb-0.5">الاستعجال</span>
                <span className="font-bold text-stone-800">{getUrgencyDetails(inspectTicket.urgency).label}</span>
              </div>
            </div>

            {/* Description */}
            <div className="text-xs space-y-1">
              <span className="font-bold text-stone-500">نص الانشغال كما ورد من الولي:</span>
              <p className="bg-stone-100 p-3 rounded-xl text-stone-800 leading-relaxed">
                {inspectTicket.description}
              </p>
              {inspectTicket.parentSuggestions && (
                <p className="text-amber-800 bg-amber-50 p-2.5 rounded-lg border border-amber-200 mt-1">
                  <strong>مقترح الولي:</strong> {inspectTicket.parentSuggestions}
                </p>
              )}
            </div>

            {/* Resolution Form */}
            <div className="border-t border-stone-200 pt-4 space-y-4">
              <h4 className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>القرار الإداري وتوجيه المعالجة:</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    تغيير حالة الانشغال
                  </label>
                  <select
                    value={statusInput}
                    onChange={(e) => setStatusInput(e.target.value as ConcernStatus)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs bg-white font-medium"
                  >
                    <option value="submitted">جديد - مسجل</option>
                    <option value="in_review">قيد الدراسة والتحري البيداغوجي</option>
                    <option value="responded">تم الرد / مبرمج موعد للمقابلة</option>
                    <option value="preventive_action">تم اتخاذ إجراء وقائي معتمد</option>
                    <option value="resolved">تمت التسوية بنجاح وإغلاق التذكرة</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    المسؤول المكلف بالمعالجة
                  </label>
                  <input
                    type="text"
                    value={assignedToInput}
                    onChange={(e) => setAssignedToInput(e.target.value)}
                    placeholder="مثال: أستاذة الفوج + مدير المؤسسة"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  الرد الرسمي الموجه للولي (يظهر مباشرة في حسابه)
                </label>
                <textarea
                  rows={3}
                  value={adminResponseInput}
                  onChange={(e) => setAdminResponseInput(e.target.value)}
                  placeholder="اكتب الرد الرسمي والتوجيهات المتخذة لمعالجة هذا الانشغال..."
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs leading-relaxed"
                ></textarea>
              </div>

              {/* Schedule meeting checkbox */}
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-3">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-stone-800">
                  <input
                    type="checkbox"
                    checked={scheduleMeetingEnabled}
                    onChange={(e) => setScheduleMeetingEnabled(e.target.checked)}
                    className="rounded text-emerald-700"
                  />
                  <span>برمجة مقابلة حضورية مع الولي بمقر المدرسة</span>
                </label>

                {scheduleMeetingEnabled && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-xs">
                    <div>
                      <span className="text-stone-400 block mb-1">التاريخ</span>
                      <input
                        type="date"
                        value={meetingDate}
                        onChange={(e) => setMeetingDate(e.target.value)}
                        className="w-full px-2 py-1.5 border border-stone-300 rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <span className="text-stone-400 block mb-1">التوقيت</span>
                      <input
                        type="text"
                        value={meetingTime}
                        onChange={(e) => setMeetingTime(e.target.value)}
                        placeholder="10:00 صباحاً"
                        className="w-full px-2 py-1.5 border border-stone-300 rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <span className="text-stone-400 block mb-1">المكان</span>
                      <input
                        type="text"
                        value={meetingLocation}
                        onChange={(e) => setMeetingLocation(e.target.value)}
                        className="w-full px-2 py-1.5 border border-stone-300 rounded-lg text-xs"
                      />
                    </div>
                    <div>
                      <span className="text-stone-400 block mb-1">مع من</span>
                      <input
                        type="text"
                        value={meetingWith}
                        onChange={(e) => setMeetingWith(e.target.value)}
                        className="w-full px-2 py-1.5 border border-stone-300 rounded-lg text-xs"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Link to preventive action */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  ربط هذا الانشغال بتدبير وقائي معتمد
                </label>
                <select
                  value={linkPreventiveId}
                  onChange={(e) => setLinkPreventiveId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs bg-white"
                >
                  <option value="">بدون ربط بتدبير وقائي خاص</option>
                  {preventiveActions.map(a => (
                    <option key={a.id} value={a.id}>
                      [{a.id}] {a.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setInspectTicket(null)}
                  className="px-4 py-2 border border-stone-300 rounded-xl text-xs font-semibold text-stone-700 hover:bg-stone-50"
                >
                  إلغاء
                </button>
                <button
                  type="button"
                  onClick={handleSaveResolution}
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs shadow-xs"
                >
                  حفظ القرار والرد الرسمي
                </button>
              </div>
            </div>

            {/* Quick Live Chat with Parent */}
            <div className="border-t border-stone-200 pt-4 space-y-3">
              <h4 className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-emerald-700" />
                <span>إرسال رسالة مباشرة للولي في سجل التذكرة:</span>
              </h4>

              <form onSubmit={handleSendDirectReply} className="flex gap-2">
                <input
                  type="text"
                  placeholder="اكتب رسالة أو توضيحاً يظهر فوراً في شاشة الولي..."
                  value={directReplyText}
                  onChange={(e) => setDirectReplyText(e.target.value)}
                  className="flex-1 px-3 py-2 border border-stone-300 rounded-xl text-xs"
                />
                <button
                  type="submit"
                  disabled={!directReplyText.trim()}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold rounded-xl text-xs flex items-center gap-1"
                >
                  <span>إرسال</span>
                  <Send className="w-3 h-3 rtl:rotate-180" />
                </button>
              </form>
            </div>

          </div>
        </div>
      )}

      {/* ===================== MODAL: NEW PREVENTIVE ACTION ===================== */}
      {showNewPrevModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-stone-200 shadow-xl max-w-xl w-full p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-700" />
                <span>تسجيل تدبير وقائي استباقي جديد للمؤسسة</span>
              </h3>
              <button
                onClick={() => setShowNewPrevModal(false)}
                className="text-stone-400 hover:text-stone-700 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreatePreventiveAction} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  عنوان التدبير الوقائي <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="مثال: خطة تخفيف الحقيبة المدرسية / برنامج الدعم في الرياضيات"
                  value={prevTitle}
                  onChange={(e) => setPrevTitle(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl border border-stone-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">التصنيف</label>
                  <select
                    value={prevCategory}
                    onChange={(e) => setPrevCategory(e.target.value as ConcernCategory)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white"
                  >
                    {CONCERN_CATEGORIES.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">الجهة المسؤولة</label>
                  <input
                    type="text"
                    value={prevResponsible}
                    onChange={(e) => setPrevResponsible(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  السبب الجذري المرصود من الشكاوى <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={2}
                  placeholder="ما هو السبب الكامن وراء تكرار هذا المشكل؟"
                  value={prevRootCause}
                  onChange={(e) => setPrevRootCause(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl border border-stone-300"
                ></textarea>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  التدبير الوقائي الميداني لتفاديه مستقبلاً <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={2}
                  placeholder="ما هي القرارات والتغييرات الملموسة لتفادي حدوثه مجدداً؟"
                  value={prevActionTaken}
                  onChange={(e) => setPrevActionTaken(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-xl border border-stone-300"
                ></textarea>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">الأثر ومؤشر النجاح المتوقع</label>
                <input
                  type="text"
                  value={prevImpact}
                  onChange={(e) => setPrevImpact(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setShowNewPrevModal(false)}
                  className="px-4 py-2 border border-stone-300 rounded-xl text-stone-700 font-semibold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl shadow-xs"
                >
                  اعتماد التدبير الوقائي
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===================== MODAL: CHANGE ADMIN PASSWORD ===================== */}
      {showPasswordModal && adminUser && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-stone-200 shadow-xl max-w-md w-full p-6 space-y-5">
            
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <KeyRound className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-stone-900 text-sm">تغيير كلمة مرور الإدارة</h3>
                  <span className="text-[11px] text-stone-500 font-mono">@{adminUser.username}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowPasswordModal(false)}
                className="text-stone-400 hover:text-stone-700 font-bold px-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleChangePassword} className="space-y-4 text-xs">
              
              {passwordError && (
                <div className="bg-rose-50 border border-rose-200 text-rose-800 p-2.5 rounded-lg flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{passwordError}</span>
                </div>
              )}

              {passwordSuccess && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-2.5 rounded-lg flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{passwordSuccess}</span>
                </div>
              )}

              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  كلمة المرور الحالية <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  required
                  placeholder="أدخل كلمة المرور الحالية"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  كلمة المرور الجديدة <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  required
                  placeholder="4 أحرف أو أرقام على الأقل"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  تأكيد كلمة المرور الجديدة <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  required
                  placeholder="أعد إدخال كلمة المرور الجديدة"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="px-4 py-2 border border-stone-300 rounded-xl text-stone-700 font-semibold"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl shadow-xs"
                >
                  حفظ كلمة المرور الجديدة
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
