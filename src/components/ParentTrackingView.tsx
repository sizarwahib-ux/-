import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Clock, 
  MessageSquare, 
  Send, 
  Calendar, 
  MapPin, 
  UserCheck, 
  Printer, 
  CheckCircle, 
  ShieldCheck, 
  AlertCircle,
  ChevronLeft,
  GraduationCap,
  User,
  Filter
} from 'lucide-react';
import { ConcernTicket, MessageItem, ParentUser } from '../types';
import { 
  getGradeLabel, 
  getCategoryLabel, 
  getStatusDetails, 
  getUrgencyDetails, 
  formatDateArabic 
} from '../utils/formatters';

interface ParentTrackingViewProps {
  tickets: ConcernTicket[];
  initialTrackingCode?: string;
  onSendMessage: (ticketId: string, message: MessageItem) => void;
  onNewConcernClick: () => void;
  currentUser?: ParentUser | null;
  onOpenAuthModal?: (mode: 'login' | 'register') => void;
}

export const ParentTrackingView: React.FC<ParentTrackingViewProps> = ({
  tickets,
  initialTrackingCode,
  onSendMessage,
  onNewConcernClick,
  currentUser,
  onOpenAuthModal
}) => {
  const [searchTerm, setSearchTerm] = useState(initialTrackingCode || '');
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [senderName, setSenderName] = useState(currentUser?.fullName || '');
  const [onlyMyTickets, setOnlyMyTickets] = useState(false);

  // If currentUser is present and no search term, default to their tickets if they have any
  useEffect(() => {
    if (currentUser) {
      setSenderName(currentUser.fullName);
      const userTickets = tickets.filter(t => 
        (t.parentUsername && t.parentUsername === currentUser.username) ||
        t.parentNIN === currentUser.parentNIN
      );
      if (userTickets.length > 0 && !initialTrackingCode) {
        setOnlyMyTickets(true);
      }
    }
  }, [currentUser, tickets, initialTrackingCode]);

  // If initialTrackingCode provided, auto-select matching ticket
  useEffect(() => {
    if (initialTrackingCode) {
      setSearchTerm(initialTrackingCode);
      const match = tickets.find(t => 
        t.trackingCode.toLowerCase() === initialTrackingCode.toLowerCase() ||
        t.id.toLowerCase() === initialTrackingCode.toLowerCase()
      );
      if (match) {
        setSelectedTicketId(match.id);
      }
    }
  }, [initialTrackingCode, tickets]);

  // Filtered tickets by search and onlyMyTickets
  const filteredTickets = tickets.filter(t => {
    if (onlyMyTickets && currentUser) {
      const isMine = (t.parentUsername && t.parentUsername === currentUser.username) ||
                     t.parentNIN === currentUser.parentNIN;
      if (!isMine) return false;
    }

    if (!searchTerm.trim()) return true;
    const term = searchTerm.trim().toLowerCase();
    return (
      t.id.toLowerCase().includes(term) ||
      t.trackingCode.toLowerCase().includes(term) ||
      t.parentNIN.includes(term) ||
      t.studentName.toLowerCase().includes(term) ||
      t.parentPhone.includes(term)
    );
  });

  const selectedTicket = tickets.find(t => t.id === selectedTicketId) || filteredTickets[0] || null;

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyMessage.trim() || !selectedTicket) return;

    const newMessage: MessageItem = {
      id: `msg-${Date.now()}`,
      sender: 'parent',
      senderName: senderName.trim() || `${selectedTicket.parentName} (الولي)`,
      message: replyMessage.trim(),
      timestamp: new Date().toISOString()
    };

    onSendMessage(selectedTicket.id, newMessage);
    setReplyMessage('');
  };

  const myTicketsCount = currentUser 
    ? tickets.filter(t => (t.parentUsername && t.parentUsername === currentUser.username) || t.parentNIN === currentUser.parentNIN).length 
    : 0;

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-6">
      
      {/* Logged in Parent Welcome Banner */}
      {currentUser ? (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-bold text-sm shrink-0">
              {currentUser.fullName.slice(0, 2)}
            </div>
            <div>
              <div className="font-bold text-stone-900 text-sm flex items-center gap-2">
                <span>أهلاً بك، {currentUser.fullName}</span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold">
                  حساب ولي أمر موثق
                </span>
              </div>
              <div className="text-stone-500 text-[11px] flex items-center gap-2 mt-0.5">
                <span>التلميذ(ة): <strong>{currentUser.studentName}</strong></span>
                <span>·</span>
                <span>المستوى: <strong>{getGradeLabel(currentUser.gradeLevel)}</strong></span>
                <span>·</span>
                <span>عدد الانشغالات المسجلة: <strong>{myTicketsCount}</strong></span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end">
            <button
              onClick={() => setOnlyMyTickets(!onlyMyTickets)}
              className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                onlyMyTickets
                  ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                  : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
              }`}
            >
              <Filter className="w-3.5 h-3.5" />
              <span>{onlyMyTickets ? `عرض تذاكري فقط (${myTicketsCount})` : 'تصفية: تذاكري فقط'}</span>
            </button>
            <button
              onClick={onNewConcernClick}
              className="px-3 py-1.5 rounded-xl bg-white border border-emerald-300 text-emerald-800 hover:bg-emerald-50 font-semibold transition-colors"
            >
              طرح انشغال جديد
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-stone-600">
            <User className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>
              هل لديك حساب ولي أمر مسجل؟ تسجيل الدخول يتيح لك الاطلاع التلقائي على جميع تذاكر أبنائك وإدارتها بسهولة.
            </span>
          </div>
          {onOpenAuthModal && (
            <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end">
              <button
                onClick={() => onOpenAuthModal('login')}
                className="px-3 py-1.5 rounded-xl bg-white border border-stone-300 text-stone-700 hover:bg-stone-100 font-semibold transition-colors"
              >
                تسجيل الدخول
              </button>
              <button
                onClick={() => onOpenAuthModal('register')}
                className="px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold shadow-xs transition-colors"
              >
                تسجيل حساب ولي جديد
              </button>
            </div>
          )}
        </div>
      )}

      {/* Search Bar & Header */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs p-6">
        <div className="max-w-3xl">
          <h1 className="text-xl sm:text-2xl font-extrabold text-stone-900 tracking-tight">
            متابعة الانشغالات والتواصل مع إدارة المدرسة
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-stone-500">
            أدخل رقم التذكرة (مثل <code className="font-mono bg-stone-100 px-1.5 py-0.5 rounded text-stone-700">NOUAR-2026-001</code>) أو رمز المتابعة السري (مثل <code className="font-mono bg-stone-100 px-1.5 py-0.5 rounded text-stone-700">NW-9412</code>) أو رقم التعريف الوطني لولي الأمر (NIN).
          </p>
        </div>

        <div className="mt-4 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="ابحث برقم التذكرة أو رمز المتابعة أو رقم التعريف الوطني (NIN)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pr-10 pl-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 font-medium"
            />
            <Search className="w-5 h-5 text-stone-400 absolute right-3 top-3 pointer-events-none" />
          </div>

          <button
            onClick={() => setSearchTerm('')}
            className="px-4 py-2.5 border border-stone-200 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-50 transition-colors"
          >
            عرض جميع انشغالاتي
          </button>

          <button
            onClick={onNewConcernClick}
            className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl text-xs shadow-xs transition-colors"
          >
            + طرح انشغال جديد
          </button>
        </div>
      </div>

      {/* Main Content Layout */}
      {filteredTickets.length === 0 ? (
        <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center max-w-lg mx-auto">
          <div className="w-12 h-12 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto mb-3">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-stone-800">لا توجد انشغالات مطابقة للبحث</h3>
          <p className="text-xs text-stone-500 mt-1">
            تأكد من كتابة رقم التذكرة أو رقم التعريف الوطني بشكل صحيح، أو قم بطرح انشغال جديد.
          </p>
          <button
            onClick={onNewConcernClick}
            className="mt-4 px-4 py-2 bg-emerald-700 text-white rounded-lg text-xs font-bold shadow-xs hover:bg-emerald-800"
          >
            طرح انشغال جديد
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Tickets List */}
          <div className="lg:col-span-4 space-y-3">
            <div className="text-xs font-bold text-stone-500 px-1 flex items-center justify-between">
              <span>الانشغالات المسجلة ({filteredTickets.length})</span>
              <span className="text-[11px] font-mono text-stone-400">انقر للتفاصيل</span>
            </div>

            <div className="space-y-2.5 max-h-[720px] overflow-y-auto pr-1">
              {filteredTickets.map(t => {
                const isSelected = selectedTicket?.id === t.id;
                const statusInfo = getStatusDetails(t.status);
                const urgencyInfo = getUrgencyDetails(t.urgency);

                return (
                  <button
                    key={t.id}
                    onClick={() => setSelectedTicketId(t.id)}
                    className={`w-full text-right p-4 rounded-xl border transition-all ${
                      isSelected
                        ? 'border-emerald-600 bg-white ring-2 ring-emerald-500/20 shadow-xs'
                        : 'border-stone-200 bg-white hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="font-mono font-bold text-xs text-stone-800">
                        {t.id}
                      </span>
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-md border ${statusInfo.bgClass} ${statusInfo.textClass}`}>
                        {statusInfo.label}
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-stone-900 line-clamp-1 mb-1">
                      {t.title}
                    </h4>

                    <div className="text-xs text-stone-500 flex items-center gap-1.5 mb-2">
                      <span>{t.studentName}</span>
                      <span>·</span>
                      <span className="text-emerald-700 font-medium">{getGradeLabel(t.gradeLevel)}</span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-stone-400 pt-2 border-t border-stone-100">
                      <span>{formatDateArabic(t.createdAt).split('،')[0]}</span>
                      <span className={`font-semibold ${urgencyInfo.textClass}`}>
                        {urgencyInfo.label}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Selected Ticket Details & Live Communication */}
          {selectedTicket && (
            <div className="lg:col-span-8 space-y-6">
              
              {/* Ticket Details Card */}
              <div className="bg-white rounded-2xl border border-stone-200 shadow-xs p-6 sm:p-8 space-y-6">
                
                {/* Header & Meta */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 pb-5">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-xs font-mono font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
                        {selectedTicket.id}
                      </span>
                      <span className="text-xs font-mono bg-stone-100 text-stone-600 px-2 py-0.5 rounded-md">
                        رمز المتابعة: {selectedTicket.trackingCode}
                      </span>
                      <span className={`text-xs font-bold px-2.5 py-0.5 rounded-md border ${getStatusDetails(selectedTicket.status).bgClass} ${getStatusDetails(selectedTicket.status).textClass}`}>
                        {getStatusDetails(selectedTicket.status).label}
                      </span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900">
                      {selectedTicket.title}
                    </h2>
                  </div>

                  <button
                    onClick={() => window.print()}
                    className="no-print self-start px-3.5 py-1.5 border border-stone-300 rounded-lg text-xs font-semibold text-stone-700 hover:bg-stone-50 transition-colors flex items-center gap-1.5"
                  >
                    <Printer className="w-4 h-4" />
                    <span>طباعة الوصل</span>
                  </button>
                </div>

                {/* Progress Tracker Steps */}
                <div className="py-2">
                  <div className="text-xs font-bold text-stone-500 mb-3">مراحل معالجة الانشغال:</div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                    
                    {/* Step 1: Registered */}
                    <div className={`p-2.5 rounded-xl border ${
                      ['submitted', 'in_review', 'responded', 'preventive_action', 'resolved'].includes(selectedTicket.status)
                        ? 'border-emerald-500 bg-emerald-50/50 text-emerald-900 font-bold'
                        : 'border-stone-200 text-stone-400'
                    }`}>
                      <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto mb-1 text-[10px] font-bold">1</div>
                      <span>تسجيل الانشغال</span>
                    </div>

                    {/* Step 2: Under Review */}
                    <div className={`p-2.5 rounded-xl border ${
                      ['in_review', 'responded', 'preventive_action', 'resolved'].includes(selectedTicket.status)
                        ? 'border-emerald-500 bg-emerald-50/50 text-emerald-900 font-bold'
                        : 'border-stone-200 text-stone-400'
                    }`}>
                      <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto mb-1 text-[10px] font-bold">2</div>
                      <span>الدراسة والتحري</span>
                    </div>

                    {/* Step 3: Response / Meeting */}
                    <div className={`p-2.5 rounded-xl border ${
                      ['responded', 'preventive_action', 'resolved'].includes(selectedTicket.status)
                        ? 'border-emerald-500 bg-emerald-50/50 text-emerald-900 font-bold'
                        : 'border-stone-200 text-stone-400'
                    }`}>
                      <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto mb-1 text-[10px] font-bold">3</div>
                      <span>الرد وتحديد موعد</span>
                    </div>

                    {/* Step 4: Prevention / Resolution */}
                    <div className={`p-2.5 rounded-xl border ${
                      ['preventive_action', 'resolved'].includes(selectedTicket.status)
                        ? 'border-emerald-500 bg-emerald-50/50 text-emerald-900 font-bold'
                        : 'border-stone-200 text-stone-400'
                    }`}>
                      <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto mb-1 text-[10px] font-bold">4</div>
                      <span>إجراء وقائي وتسوية</span>
                    </div>

                  </div>
                </div>

                {/* Civil & School Profile Information Grid */}
                <div className="bg-stone-50 rounded-xl p-4 border border-stone-200">
                  <div className="text-xs font-bold text-stone-600 mb-3 flex items-center gap-1.5">
                    <GraduationCap className="w-4 h-4 text-emerald-700" />
                    <span>بيانات التلميذ والملف المدني لولي الأمر</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                    <div>
                      <span className="text-stone-400 block mb-0.5">اسم ولقب التلميذ</span>
                      <span className="font-bold text-stone-900 text-sm">{selectedTicket.studentName}</span>
                    </div>

                    <div>
                      <span className="text-stone-400 block mb-0.5">المستوى الدراسي</span>
                      <span className="font-bold text-emerald-800 text-sm">{getGradeLabel(selectedTicket.gradeLevel)}</span>
                      <span className="text-stone-500 block text-[11px]">{selectedTicket.sectionClass}</span>
                    </div>

                    <div>
                      <span className="text-stone-400 block mb-0.5">عدد الإخوة بالأسرة</span>
                      <span className="font-bold text-stone-900 tabular-nums">{selectedTicket.siblingsCount} إخوة</span>
                    </div>

                    <div>
                      <span className="text-stone-400 block mb-0.5">اسم ولقب ولي الأمر</span>
                      <span className="font-semibold text-stone-800">{selectedTicket.parentName}</span>
                    </div>

                    <div>
                      <span className="text-stone-400 block mb-0.5">رقم التعريف الوطني للولي (NIN)</span>
                      <span className="font-mono font-bold text-stone-900 tracking-wider tabular-nums">
                        {selectedTicket.parentNIN}
                      </span>
                    </div>

                    <div>
                      <span className="text-stone-400 block mb-0.5">اسم ولقب والدة الولي</span>
                      <span className="font-semibold text-stone-800">{selectedTicket.parentMotherName}</span>
                    </div>

                    <div>
                      <span className="text-stone-400 block mb-0.5">تصنيف الانشغال</span>
                      <span className="font-semibold text-stone-800">{getCategoryLabel(selectedTicket.category)}</span>
                    </div>

                    <div>
                      <span className="text-stone-400 block mb-0.5">رقم الهاتف</span>
                      <span className="font-mono text-stone-800">{selectedTicket.parentPhone}</span>
                    </div>

                    <div>
                      <span className="text-stone-400 block mb-0.5">تاريخ الإيداع</span>
                      <span className="text-stone-700">{formatDateArabic(selectedTicket.createdAt)}</span>
                    </div>
                  </div>
                </div>

                {/* Description Body */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-stone-500">نص الانشغال كما طُرح:</h4>
                  <div className="bg-white p-4 rounded-xl border border-stone-200 text-sm text-stone-800 leading-relaxed whitespace-pre-wrap">
                    {selectedTicket.description}
                  </div>
                  {selectedTicket.parentSuggestions && (
                    <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-xs text-amber-900">
                      <span className="font-bold block mb-1">مقترح الولي المرفق:</span>
                      {selectedTicket.parentSuggestions}
                    </div>
                  )}
                </div>

                {/* Scheduled Meeting Banner (If set by admin) */}
                {selectedTicket.meetingScheduled && (
                  <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800">
                        <Calendar className="w-4 h-4 text-emerald-600" />
                        <span>دعوة رسمية لمقابلة حضورية بالمؤسسة</span>
                      </div>
                      <div className="text-stone-900 font-bold text-sm">
                        الموعد: يوم {selectedTicket.meetingScheduled.date} على الساعة {selectedTicket.meetingScheduled.time}
                      </div>
                      <div className="text-xs text-stone-600 flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-stone-400" />
                          المكان: {selectedTicket.meetingScheduled.location}
                        </span>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          <UserCheck className="w-3.5 h-3.5 text-stone-400" />
                          مع: {selectedTicket.meetingScheduled.withWhom}
                        </span>
                      </div>
                      {selectedTicket.meetingScheduled.notes && (
                        <p className="text-xs text-emerald-700 italic pt-1">
                          ملاحظة: {selectedTicket.meetingScheduled.notes}
                        </p>
                      )}
                    </div>

                    <div className="bg-white px-3 py-1.5 rounded-lg border border-emerald-200 text-xs font-bold text-emerald-800 shrink-0">
                      حضور مؤكد
                    </div>
                  </div>
                )}

                {/* Official Admin Response */}
                {selectedTicket.adminResponse && (
                  <div className="bg-stone-50 border border-stone-200 rounded-xl p-5 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs font-bold text-stone-900">
                        <ShieldCheck className="w-4 h-4 text-emerald-700" />
                        <span>رد وتوجيه إدارة مدرسة نوار محمد</span>
                        {selectedTicket.assignedTo && (
                          <span className="text-stone-400 text-[11px] font-normal">
                            (المكلف بالمعالجة: {selectedTicket.assignedTo})
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-stone-800 leading-relaxed bg-white p-3.5 rounded-lg border border-stone-200">
                      {selectedTicket.adminResponse}
                    </p>
                  </div>
                )}

                {/* Back-and-forth Conversation Thread */}
                <div className="pt-4 border-t border-stone-200 space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-stone-800 flex items-center gap-2">
                      <MessageSquare className="w-4 h-4 text-emerald-700" />
                      <span>سجل المراسلات والتوضيحات المتبادلة ({selectedTicket.conversation.length})</span>
                    </h4>
                    <span className="text-[11px] text-stone-400">تواصل مباشر مع الإدارة والأستاذ</span>
                  </div>

                  {selectedTicket.conversation.length === 0 ? (
                    <div className="p-4 bg-stone-50 rounded-xl text-center text-xs text-stone-500">
                      لم يتم إرسال رسائل إضافية بعد. يمكنك إرسال استفسار أو تعقيب مباشر للإدارة أدناه.
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                      {selectedTicket.conversation.map(msg => {
                        const isParent = msg.sender === 'parent';
                        return (
                          <div
                            key={msg.id}
                            className={`p-3.5 rounded-xl border text-xs leading-relaxed ${
                              isParent
                                ? 'bg-emerald-50/50 border-emerald-200 mr-4'
                                : 'bg-stone-100 border-stone-200 ml-4'
                            }`}
                          >
                            <div className="flex items-center justify-between font-bold text-stone-900 mb-1">
                              <span>{msg.senderName}</span>
                              <span className="text-[10px] font-normal text-stone-400">
                                {formatDateArabic(msg.timestamp)}
                              </span>
                            </div>
                            <p className="text-stone-800 text-xs sm:text-sm">{msg.message}</p>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Send Reply Form */}
                  <form onSubmit={handleSendReply} className="pt-2 space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="أدخل رسالة توضيحية أو استفسار إضافي للإدارة..."
                        value={replyMessage}
                        onChange={(e) => setReplyMessage(e.target.value)}
                        className="flex-1 px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                      />
                      <button
                        type="submit"
                        disabled={!replyMessage.trim()}
                        className="px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold rounded-xl text-xs transition-colors flex items-center gap-1.5 shadow-xs"
                      >
                        <span>إرسال</span>
                        <Send className="w-3.5 h-3.5 rtl:rotate-180" />
                      </button>
                    </div>
                    <span className="text-[11px] text-stone-400 block">
                      الرسائل تظهر فوراً في سجل متابعة الإدارة البيداغوجية.
                    </span>
                  </form>
                </div>

              </div>

            </div>
          )}

        </div>
      )}

    </div>
  );
};
