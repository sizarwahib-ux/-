import React, { useState, useEffect } from 'react';
import { 
  Send, 
  Sparkles, 
  CheckCircle2, 
  HelpCircle, 
  User, 
  GraduationCap, 
  FileText, 
  Phone, 
  ShieldAlert, 
  Printer, 
  ExternalLink,
  Info,
  LogIn,
  UserCheck,
  UserPlus
} from 'lucide-react';
import { 
  ConcernTicket, 
  GradeLevel, 
  ConcernCategory, 
  UrgencyLevel, 
  ParentUser,
  GRADE_LEVELS, 
  CONCERN_CATEGORIES 
} from '../types';
import { getGradeLabel, getCategoryLabel } from '../utils/formatters';

interface ParentSubmissionFormProps {
  onSubmitSuccess: (ticket: ConcernTicket) => void;
  onGoToTracking: (trackingCode: string) => void;
  currentUser?: ParentUser | null;
  onOpenAuthModal?: (mode: 'login' | 'register') => void;
}

export const ParentSubmissionForm: React.FC<ParentSubmissionFormProps> = ({ 
  onSubmitSuccess, 
  onGoToTracking,
  currentUser,
  onOpenAuthModal
}) => {
  // Form fields as requested
  const [studentName, setStudentName] = useState('');
  const [parentName, setParentName] = useState('');
  const [parentNIN, setParentNIN] = useState('');
  const [parentMotherName, setParentMotherName] = useState('');
  const [siblingsCount, setSiblingsCount] = useState<number>(2);
  const [gradeLevel, setGradeLevel] = useState<GradeLevel>('1st');
  const [sectionClass, setSectionClass] = useState('فوج 1');
  const [parentPhone, setParentPhone] = useState('');

  // Auto-fill from currentUser if logged in
  useEffect(() => {
    if (currentUser) {
      setStudentName(currentUser.studentName || '');
      setParentName(currentUser.fullName || '');
      setParentNIN(currentUser.parentNIN || '');
      setParentMotherName(currentUser.parentMotherName || '');
      setSiblingsCount(currentUser.siblingsCount ?? 2);
      setGradeLevel(currentUser.gradeLevel || '1st');
      setSectionClass(currentUser.sectionClass || 'فوج 1');
      setParentPhone(currentUser.phone || '');
    }
  }, [currentUser]);

  // Concern fields
  const [category, setCategory] = useState<ConcernCategory>('academic');
  const [urgency, setUrgency] = useState<UrgencyLevel>('normal');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [parentSuggestions, setParentSuggestions] = useState('');

  // UI state
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submittedTicket, setSubmittedTicket] = useState<ConcernTicket | null>(null);

  const fillSampleData = () => {
    setStudentName('إلياس بن شريف');
    setParentName('مراد بن شريف');
    setParentNIN('108534120045981273');
    setParentMotherName('فاطمة الزهراء حمادي');
    setSiblingsCount(3);
    setGradeLevel('2nd');
    setSectionClass('فوج 2');
    setParentPhone('0554129845');
    setCategory('academic');
    setUrgency('important');
    setTitle('صعوبة في استيعاب التمارين الحسابية والانتقال للغة الفرنسية');
    setDescription('نلاحظ أن التلميذ يواجه صعوبة وتوتراً أثناء حل التمارين المنزلية في مادة الحساب وتطبيق مفاهيم الجمع بالاحتفاظ، كما يرتبك مع بداية إدراج حصص اللغة الفرنسية. نود التنسيق مع الأستاذ لمعرفة الخطة البيداغوجية المناسبة لدعمه منزلياً.');
    setParentSuggestions('تنظيم حصة إرشادية للأولياء حول كيفية المراجعة المنزلية أو تمكين التلميذ من حصص معالجة تربوية قصيرة.');
    setErrors({});
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!studentName.trim()) newErrors.studentName = 'يرجى كتابة اسم ولقب التلميذ بالكامل';
    if (!parentName.trim()) newErrors.parentName = 'يرجى إدخال اسم ولقب ولي الأمر';
    
    // Parent NIN validation (18 digits)
    const cleanNIN = parentNIN.replace(/\s+/g, '');
    if (!cleanNIN) {
      newErrors.parentNIN = 'رقم التعريف الوطني لولي الأمر مطلوب إجبارياً';
    } else if (!/^\d{18}$/.test(cleanNIN)) {
      newErrors.parentNIN = 'رقم التعريف الوطني الجزائري يتكون من 18 رقماً بالضبط';
    }

    if (!parentMotherName.trim()) {
      newErrors.parentMotherName = 'اسم ولقب والدة ولي الأمر مطلوب إجبارياً للتحقق المدني';
    }

    if (siblingsCount < 0) {
      newErrors.siblingsCount = 'عدد الإخوة يجب أن يكون 0 أو أكثر';
    }

    if (!parentPhone.trim()) {
      newErrors.parentPhone = 'رقم هاتف التواصل مطلوب لاستلام الإشعارات وتحديد المواعيد';
    } else if (!/^(05|06|07)\d{8}$/.test(parentPhone.trim().replace(/\s+/g, ''))) {
      newErrors.parentPhone = 'يرجى إدخال رقم هاتف جزائري صحيح (10 أرقام تبدأ بـ 05 أو 06 أو 07)';
    }

    if (!title.trim()) newErrors.title = 'يرجى كتابة موضوع أو عنوان واضح للانشغال';
    if (!description.trim() || description.trim().length < 15) {
      newErrors.description = 'يرجى شرح الانشغال بالتفصيل (15 حرفاً على الأقل) لتتمكن الإدارة من معالجته بدقة';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    const timestamp = new Date().toISOString();
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const trackingCode = `NW-${randomSuffix}`;
    const ticketId = `NOUAR-2026-${Math.floor(100 + Math.random() * 900)}`;

    const newTicket: ConcernTicket = {
      id: ticketId,
      trackingCode,
      createdAt: timestamp,
      updatedAt: timestamp,
      studentName: studentName.trim(),
      parentName: parentName.trim(),
      parentNIN: parentNIN.replace(/\s+/g, ''),
      parentMotherName: parentMotherName.trim(),
      siblingsCount: Number(siblingsCount),
      gradeLevel,
      sectionClass: sectionClass.trim() || 'فوج 1',
      parentPhone: parentPhone.trim(),
      parentUsername: currentUser?.username,
      category,
      urgency,
      title: title.trim(),
      description: description.trim(),
      parentSuggestions: parentSuggestions.trim() || undefined,
      status: 'submitted',
      conversation: []
    };

    setSubmittedTicket(newTicket);
    onSubmitSuccess(newTicket);
  };

  if (submittedTicket) {
    return (
      <div className="max-w-3xl mx-auto py-8 px-4">
        <div className="bg-white rounded-2xl border border-emerald-200 shadow-sm p-6 sm:p-8 text-center space-y-6">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-xs">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              تم تسجيل الانشغال بنجاح في سجل المؤسسة
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 mt-3">
              شكراً لكم سيدي الولي، وصل انشغالكم لإدارة مدرسة نوار محمد
            </h2>
            <p className="text-stone-600 mt-2 max-w-xl mx-auto text-sm sm:text-base">
              تم تحويل انشغالكم مباشرة إلى الفريق المختص، وستتلقون رداً رسمياً أو دعوة لمقابلة بالتنسيق مع أستاذ الفوج.
            </p>
          </div>

          {/* Ticket Information Card */}
          <div className="bg-stone-50 border border-stone-200 rounded-xl p-6 max-w-xl mx-auto text-right space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <span className="text-xs font-semibold text-stone-500">رقم التذكرة والمتابعة</span>
              <div className="text-left font-mono font-bold text-emerald-700 text-lg tabular-nums">
                {submittedTicket.id}
              </div>
            </div>

            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <span className="text-xs font-semibold text-stone-500">رمز المتابعة السري</span>
              <span className="font-mono font-bold text-stone-900 bg-stone-200 px-3 py-1 rounded-md text-sm">
                {submittedTicket.trackingCode}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-stone-400 block mb-1">اسم التلميذ</span>
                <span className="font-bold text-stone-900 text-sm">{submittedTicket.studentName}</span>
              </div>
              <div>
                <span className="text-stone-400 block mb-1">المستوى الدراسي</span>
                <span className="font-bold text-emerald-800 text-sm">{getGradeLabel(submittedTicket.gradeLevel)}</span>
              </div>
              <div>
                <span className="text-stone-400 block mb-1">اسم الولي ورقم الهوية</span>
                <span className="font-medium text-stone-800">{submittedTicket.parentName}</span>
                <span className="block text-stone-500 font-mono text-[11px]">{submittedTicket.parentNIN}</span>
              </div>
              <div>
                <span className="text-stone-400 block mb-1">تصنيف الانشغال</span>
                <span className="font-semibold text-stone-800">{getCategoryLabel(submittedTicket.category)}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => onGoToTracking(submittedTicket.trackingCode)}
              className="w-full sm:w-auto px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 text-sm"
            >
              <span>متابعة حالة الانشغال والتواصل الآن</span>
              <ExternalLink className="w-4 h-4" />
            </button>
            
            <button
              onClick={() => window.print()}
              className="w-full sm:w-auto px-5 py-3 border border-stone-300 text-stone-700 hover:bg-stone-50 font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 text-sm"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة وصل الإيداع</span>
            </button>

            <button
              onClick={() => {
                setSubmittedTicket(null);
                setStudentName('');
                setParentName('');
                setParentNIN('');
                setParentMotherName('');
                setTitle('');
                setDescription('');
                setParentSuggestions('');
              }}
              className="w-full sm:w-auto px-5 py-3 text-stone-600 hover:text-stone-900 font-semibold text-sm transition-colors"
            >
              طرح انشغال جديد
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
      
      {/* Hero Welcome Banner */}
      <div className="relative rounded-2xl overflow-hidden mb-8 border border-emerald-900/10 shadow-sm bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white p-6 sm:p-8">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-700/60 border border-emerald-500/30 text-emerald-100 text-xs font-semibold mb-3">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>الجمهورية الجزائرية الديمقراطية الشعبية · وزارة التربية الوطنية</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            استمارة طرح انشغالات أولياء الأمور
          </h1>
          <p className="mt-2 text-emerald-100 text-sm sm:text-base leading-relaxed">
            مرحباً بكم في البوابة الرسمية لمدرسة نوار محمد الابتدائية. نسعد بالإصغاء لجميع انشغالاتكم ومقترحاتكم لمعالجتها فورياً ورصد الأسباب لوضع حلول وقائية تضمن بيئة تعليمية آمنة ومحفزة لأبنائنا.
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={fillSampleData}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-semibold text-white backdrop-blur-xs transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>تعبئة سريعة بنموذج واقعي للتجربة</span>
            </button>
            <span className="text-xs text-emerald-200/80">
              * جميع البيانات المدخلة محمية بسرية تامة ومخصصة للإدارة التربوية فقط.
            </span>
          </div>
        </div>

        {/* Decorative backdrop pattern */}
        <div className="absolute left-0 top-0 bottom-0 w-1/3 opacity-15 pointer-events-none hidden lg:block overflow-hidden">
          <img 
            src="/src/assets/images/school_campus_banner_1790538315686.jpg" 
            alt="School Banner" 
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Parent Account State Banner */}
      {currentUser ? (
        <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <UserCheck className="w-5 h-5 text-emerald-700" />
            </div>
            <div>
              <div className="font-bold text-stone-900 flex items-center gap-2">
                <span>مسجل الدخول بحساب الولي:</span>
                <span className="text-emerald-800">{currentUser.fullName}</span>
                <span className="text-[11px] font-mono bg-white px-2 py-0.5 rounded border border-emerald-200 text-stone-600">
                  @{currentUser.username}
                </span>
              </div>
              <p className="text-stone-600 text-[11px] mt-0.5">
                تم استرجاع بياناتك المدنية ورقم التعريف الوطني (NIN) وبيانات التلميذ تلقائياً من ملفك الشخصي.
              </p>
            </div>
          </div>

          <div className="text-[11px] text-emerald-800 font-semibold bg-white px-3 py-1.5 rounded-lg border border-emerald-200 shrink-0 text-center">
            ✓ حساب ولي معتمد
          </div>
        </div>
      ) : (
        <div className="mb-6 p-4 rounded-2xl bg-white border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-stone-100 text-stone-600 flex items-center justify-center font-bold">
              <User className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-stone-900">
                هل تملك حساباً خاصاً بك كولي أمر؟
              </div>
              <p className="text-stone-500 text-[11px] mt-0.5">
                سجّل الدخول بحسابك (اسم المستخدم وكلمة المرور) لتعبئة بياناتك تلقائياً وربط كافة انشغالاتك بملفك.
              </p>
            </div>
          </div>

          {onOpenAuthModal && (
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => onOpenAuthModal('login')}
                className="px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold transition-colors flex items-center gap-1.5"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>دخول الولي</span>
              </button>
              <button
                type="button"
                onClick={() => onOpenAuthModal('register')}
                className="px-3 py-2 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-700 font-semibold transition-colors flex items-center gap-1.5"
              >
                <UserPlus className="w-3.5 h-3.5" />
                <span>إنشاء حساب</span>
              </button>
            </div>
          )}
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-8 bg-white rounded-2xl border border-stone-200 shadow-xs p-6 sm:p-8">
        
        {/* SECTION 1: Required Student & Parent Civil Identity */}
        <div>
          <div className="border-b border-stone-200 pb-3 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2 text-stone-900">
              <User className="w-5 h-5 text-emerald-700" />
              <h2 className="text-lg font-bold">1. البيانات الإلزامية للتلميذ والولي</h2>
            </div>
            <span className="text-xs text-stone-500 font-medium">البيانات محددة رسمياً للتأكد من هوية الطالب وولي أمره</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Student Name */}
            <div>
              <label className="block text-xs font-bold text-stone-800 mb-1.5">
                اسم ولقب التلميذ(ة) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="مثال: يونس بوقرة"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm transition-colors focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 ${
                  errors.studentName ? 'border-red-400 bg-red-50/30' : 'border-stone-300 focus:border-emerald-600'
                }`}
              />
              {errors.studentName && (
                <p className="text-xs text-red-600 mt-1 font-medium">{errors.studentName}</p>
              )}
            </div>

            {/* Grade Level (التحضيري إلى السنة الخامسة) */}
            <div>
              <label className="block text-xs font-bold text-stone-800 mb-1.5">
                المستوى الذي يدرس فيه التلميذ <span className="text-red-500">*</span>
              </label>
              <select
                value={gradeLevel}
                onChange={(e) => setGradeLevel(e.target.value as GradeLevel)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 font-medium"
              >
                {GRADE_LEVELS.map(g => (
                  <option key={g.id} value={g.id}>
                    {g.label} ({g.stage})
                  </option>
                ))}
              </select>
              <span className="text-[11px] text-stone-500 mt-1 block">
                مدرسة نوار محمد الابتدائية تضم الطور التحضيري والسنوات من الأولى إلى الخامسة.
              </span>
            </div>

            {/* Section / Class */}
            <div>
              <label className="block text-xs font-bold text-stone-800 mb-1.5">
                الفوج / القسم التربوي <span className="text-stone-400 font-normal">(اختياري)</span>
              </label>
              <select
                value={sectionClass}
                onChange={(e) => setSectionClass(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
              >
                <option value="فوج 1">فوج 1 (القسم أ)</option>
                <option value="فوج 2">فوج 2 (القسم ب)</option>
                <option value="فوج 3">فوج 3 (القسم ج)</option>
                <option value="فوج التحضيري أ">فوج التحضيري (أ)</option>
                <option value="فوج التحضيري ب">فوج التحضيري (ب)</option>
                <option value="غير محدد">لا أعرف الفوج بعد</option>
              </select>
            </div>

            {/* Sibling count */}
            <div>
              <label className="block text-xs font-bold text-stone-800 mb-1.5">
                عدد الإخوة <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min="0"
                  max="15"
                  value={siblingsCount}
                  onChange={(e) => setSiblingsCount(Math.max(0, parseInt(e.target.value) || 0))}
                  className={`w-28 px-3.5 py-2.5 rounded-xl border text-sm tabular-nums text-center font-bold focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 ${
                    errors.siblingsCount ? 'border-red-400 bg-red-50/30' : 'border-stone-300 focus:border-emerald-600'
                  }`}
                />
                <span className="text-xs text-stone-500">
                  إخوة في الأسرة (يفيد في دراسة الرعاية الأسرية والظروف الاجتماعية)
                </span>
              </div>
              {errors.siblingsCount && (
                <p className="text-xs text-red-600 mt-1 font-medium">{errors.siblingsCount}</p>
              )}
            </div>

            {/* Parent Full Name */}
            <div>
              <label className="block text-xs font-bold text-stone-800 mb-1.5">
                اسم ولقب ولي الأمر (الأب / الأم / الكفيل الشرعي) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="مثال: عبد الرحيم بوقرة"
                value={parentName}
                onChange={(e) => setParentName(e.target.value)}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm transition-colors focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 ${
                  errors.parentName ? 'border-red-400 bg-red-50/30' : 'border-stone-300 focus:border-emerald-600'
                }`}
              />
              {errors.parentName && (
                <p className="text-xs text-red-600 mt-1 font-medium">{errors.parentName}</p>
              )}
            </div>

            {/* Parent National ID (NIN) */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-stone-800">
                  رقم التعريف الوطني لولي الأمر (NIN) <span className="text-red-500">*</span>
                </label>
                <span className="text-[11px] font-mono text-stone-500">
                  {parentNIN.replace(/\s+/g, '').length}/18 رقماً
                </span>
              </div>
              <input
                type="text"
                maxLength={18}
                placeholder="10xxxxxxxxxxxxxxxx (18 رقماً من بطاقة التعريف البيومترية)"
                value={parentNIN}
                onChange={(e) => setParentNIN(e.target.value.replace(/\D/g, ''))}
                className={`w-full px-3.5 py-2.5 rounded-xl border font-mono text-sm tracking-widest transition-colors focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 ${
                  errors.parentNIN ? 'border-red-400 bg-red-50/30' : 'border-stone-300 focus:border-emerald-600'
                }`}
              />
              {errors.parentNIN ? (
                <p className="text-xs text-red-600 mt-1 font-medium">{errors.parentNIN}</p>
              ) : (
                <p className="text-[11px] text-stone-500 mt-1">
                  الرقم الموجود في أعلى يمين بطاقة التعريف الوطنية البيومترية أو جواز السفر.
                </p>
              )}
            </div>

            {/* Parent's Mother Full Name */}
            <div>
              <label className="block text-xs font-bold text-stone-800 mb-1.5">
                اسم ولقب أم ولي الأمر (جدة التلميذ لأبيه أو لأمه) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="مثال: حليمة بوعلام"
                value={parentMotherName}
                onChange={(e) => setParentMotherName(e.target.value)}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm transition-colors focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 ${
                  errors.parentMotherName ? 'border-red-400 bg-red-50/30' : 'border-stone-300 focus:border-emerald-600'
                }`}
              />
              {errors.parentMotherName ? (
                <p className="text-xs text-red-600 mt-1 font-medium">{errors.parentMotherName}</p>
              ) : (
                <span className="text-[11px] text-stone-500 mt-1 block">
                  مطلوب للتحقق من السجل المدني وسلامة الإجراءات الإدارية.
                </span>
              )}
            </div>

            {/* Contact Phone */}
            <div>
              <label className="block text-xs font-bold text-stone-800 mb-1.5">
                رقم هاتف التواصل <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="tel"
                  dir="ltr"
                  placeholder="05 / 06 / 07 xx xx xx xx"
                  value={parentPhone}
                  onChange={(e) => setParentPhone(e.target.value)}
                  className={`w-full text-right px-3.5 py-2.5 rounded-xl border text-sm font-mono transition-colors focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 ${
                    errors.parentPhone ? 'border-red-400 bg-red-50/30' : 'border-stone-300 focus:border-emerald-600'
                  }`}
                />
                <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-3 pointer-events-none" />
              </div>
              {errors.parentPhone && (
                <p className="text-xs text-red-600 mt-1 font-medium">{errors.parentPhone}</p>
              )}
            </div>

          </div>
        </div>

        {/* SECTION 2: Concern Details, Categorization & Urgency */}
        <div>
          <div className="border-b border-stone-200 pb-3 mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2 text-stone-900">
              <FileText className="w-5 h-5 text-emerald-700" />
              <h2 className="text-lg font-bold">2. تفاصيل وتصنيف الانشغال أو المشكل</h2>
            </div>
            <span className="text-xs text-stone-500 font-medium">يتم توجيهه للمصلحة المختصة بالمؤسسة</span>
          </div>

          {/* Category selection */}
          <div className="mb-6">
            <label className="block text-xs font-bold text-stone-800 mb-2">
              تصنيف الانشغال <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
              {CONCERN_CATEGORIES.map(cat => {
                const isSelected = category === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setCategory(cat.id)}
                    className={`text-right p-3 rounded-xl border transition-all text-xs flex flex-col justify-between ${
                      isSelected
                        ? 'border-emerald-600 bg-emerald-50/70 ring-1 ring-emerald-600'
                        : 'border-stone-200 hover:border-stone-300 bg-white'
                    }`}
                  >
                    <div>
                      <div className="font-bold text-stone-900 mb-1 flex items-center justify-between">
                        <span>{cat.name}</span>
                        {isSelected && <span className="w-2 h-2 rounded-full bg-emerald-600"></span>}
                      </div>
                      <p className="text-[11px] text-stone-500 leading-normal line-clamp-2">
                        {cat.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Urgency selection */}
          <div className="mb-6">
            <label className="block text-xs font-bold text-stone-800 mb-2">
              درجة الاستعجال <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-3 max-w-md">
              <button
                type="button"
                onClick={() => setUrgency('normal')}
                className={`py-2 px-3 rounded-lg border text-xs font-semibold transition-all ${
                  urgency === 'normal'
                    ? 'border-stone-400 bg-stone-100 text-stone-900 shadow-xs'
                    : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                }`}
              >
                عادي (دراسة دورية)
              </button>
              <button
                type="button"
                onClick={() => setUrgency('important')}
                className={`py-2 px-3 rounded-lg border text-xs font-semibold transition-all ${
                  urgency === 'important'
                    ? 'border-amber-400 bg-amber-50 text-amber-900 shadow-xs'
                    : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                }`}
              >
                هام (يستوجب تدخلاً)
              </button>
              <button
                type="button"
                onClick={() => setUrgency('urgent')}
                className={`py-2 px-3 rounded-lg border text-xs font-semibold transition-all ${
                  urgency === 'urgent'
                    ? 'border-rose-400 bg-rose-50 text-rose-900 shadow-xs'
                    : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                }`}
              >
                عاجل جداً (فوري)
              </button>
            </div>
          </div>

          {/* Title */}
          <div className="mb-4">
            <label className="block text-xs font-bold text-stone-800 mb-1.5">
              موضوع الانشغال بوضوح <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="مثال: صعوبة في مسك القلم وثقل المحفظة / استفسار بخصوص حصة الاستدراك"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm transition-colors focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 ${
                errors.title ? 'border-red-400 bg-red-50/30' : 'border-stone-300 focus:border-emerald-600'
              }`}
            />
            {errors.title && (
              <p className="text-xs text-red-600 mt-1 font-medium">{errors.title}</p>
            )}
          </div>

          {/* Detailed Description */}
          <div className="mb-4">
            <label className="block text-xs font-bold text-stone-800 mb-1.5">
              الشرح المفصل للمشكلة والوقائع الملاحظة <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={4}
              placeholder="يرجى ذكر التواريخ، ما يشتكي منه التلميذ، وأي ملاحظات تساعد الطاقم التربوي والإداري في معالجة الأمر بشكل دقيق..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`w-full px-3.5 py-2.5 rounded-xl border text-sm transition-colors focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 ${
                errors.description ? 'border-red-400 bg-red-50/30' : 'border-stone-300 focus:border-emerald-600'
              }`}
            ></textarea>
            {errors.description && (
              <p className="text-xs text-red-600 mt-1 font-medium">{errors.description}</p>
            )}
          </div>

          {/* Parent Suggestions */}
          <div>
            <label className="block text-xs font-bold text-stone-800 mb-1.5">
              مقترحاتكم أو الحلول التي ترونها مناسبة <span className="text-stone-400 font-normal">(اختياري ومرحب به جداً)</span>
            </label>
            <textarea
              rows={2}
              placeholder="ما هي المقترحات التي تقترحها على الإدارة أو المعلم لتفادي المشكل وتسهيل الحل؟"
              value={parentSuggestions}
              onChange={(e) => setParentSuggestions(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
            ></textarea>
            <p className="text-[11px] text-stone-500 mt-1">
              تساعدنا مقترحاتكم في صياغة خطط وقائية وتحديث الممارسات المدرسية.
            </p>
          </div>

        </div>

        {/* Informative notice */}
        <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-4 flex items-start gap-3 text-amber-900 text-xs leading-relaxed">
          <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block mb-0.5">التزام المؤسسة بالمعالجة والسرية:</span>
            تلتزم إدارة مدرسة نوار محمد الابتدائية بدراسة كل انشغال وارد خلال أجل أقصاه 48 ساعة، والتواصل مع الولي عبر النظام أو برمجته لمقابلة رسمية مع الطاقم المعني. كما تخضع كل الانشغالات للرصد الإحصائي لاتخاذ إجراءات وقائية للمستقبل.
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-2 flex items-center justify-between border-t border-stone-200">
          <button
            type="button"
            onClick={fillSampleData}
            className="text-xs font-medium text-stone-500 hover:text-stone-800 underline underline-offset-4"
          >
            تعبئة نموذج تجريبي جاهز
          </button>

          <button
            type="submit"
            className="px-8 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl shadow-xs transition-colors flex items-center gap-2 text-sm"
          >
            <span>إرسال الانشغال وتوليد رقم التذكرة</span>
            <Send className="w-4 h-4 rtl:rotate-180" />
          </button>
        </div>

      </form>
    </div>
  );
};
