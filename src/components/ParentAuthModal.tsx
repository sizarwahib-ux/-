import React, { useState } from 'react';
import { 
  User, 
  Lock, 
  Eye, 
  EyeOff, 
  UserPlus, 
  LogIn, 
  GraduationCap, 
  Phone, 
  AlertCircle, 
  CheckCircle2, 
  Sparkles,
  School,
  X,
  ShieldCheck,
  Users,
  Mail
} from 'lucide-react';
import { ParentUser, GradeLevel, GRADE_LEVELS } from '../types';
import { 
  loginParent, 
  registerParent, 
  DEFAULT_PARENT_ACCOUNTS, 
  getStoredParentAccounts 
} from '../utils/auth';

interface ParentAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (user: ParentUser) => void;
  initialMode?: 'login' | 'register';
}

export const ParentAuthModal: React.FC<ParentAuthModalProps> = ({
  isOpen,
  onClose,
  onAuthSuccess,
  initialMode = 'login'
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  
  // Login form state
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginRemember, setLoginRemember] = useState(true);

  // Register form state
  const [regEmail, setRegEmail] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [regFullName, setRegFullName] = useState('');
  const [regNIN, setRegNIN] = useState('');
  const [regMotherName, setRegMotherName] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regSiblings, setRegSiblings] = useState<number>(2);
  const [regStudentName, setRegStudentName] = useState('');
  const [regGradeLevel, setRegGradeLevel] = useState<GradeLevel>('1st');
  const [regSectionClass, setRegSectionClass] = useState('فوج 1');

  // Feedback state
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    setTimeout(() => {
      const res = loginParent(loginUsername, loginPassword, loginRemember);
      setIsLoading(false);
      if (res.success && res.user) {
        onAuthSuccess(res.user);
        onClose();
      } else {
        setError(res.error || 'فشل تسجيل الدخول. تحقق من البريد الإلكتروني أو اسم المستخدم وكلمة المرور.');
      }
    }, 200);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!regEmail.trim() || !regEmail.includes('@')) {
      setError('يرجى إدخال عنوان بريد إلكتروني صحيح لولي الأمر');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setError('كلمة المرور وتأكيدها غير متطابقين');
      return;
    }

    if (!regFullName.trim()) {
      setError('يرجى إدخال اسم ولقب ولي الأمر');
      return;
    }

    const cleanNIN = regNIN.replace(/\s+/g, '');
    if (cleanNIN.length !== 18) {
      setError('رقم التعريف الوطني لولي الأمر (NIN) يتكون من 18 رقماً');
      return;
    }

    if (!regMotherName.trim()) {
      setError('اسم ولقب والدة ولي الأمر مطلوب للتحقق المدني');
      return;
    }

    if (!regStudentName.trim()) {
      setError('يرجى إدخال اسم ولقب التلميذ(ة)');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const res = registerParent(
        {
          email: regEmail.trim().toLowerCase(),
          username: regUsername.trim().toLowerCase(),
          fullName: regFullName.trim(),
          parentNIN: cleanNIN,
          parentMotherName: regMotherName.trim(),
          phone: regPhone.trim(),
          siblingsCount: regSiblings,
          studentName: regStudentName.trim(),
          gradeLevel: regGradeLevel,
          sectionClass: regSectionClass.trim() || 'فوج 1'
        },
        regPassword,
        true
      );

      setIsLoading(false);
      if (res.success && res.user) {
        onAuthSuccess(res.user);
        onClose();
      } else {
        setError(res.error || 'حدث خطأ أثناء إنشاء الحساب');
      }
    }, 250);
  };

  const handleQuickFill = (user: string, pass: string) => {
    setLoginUsername(user);
    setLoginPassword(pass);
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl border border-stone-200 shadow-2xl max-w-xl w-full max-h-[92vh] overflow-y-auto relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute left-4 top-4 z-10 w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-500 hover:text-stone-800 flex items-center justify-center transition-colors"
          title="إغلاق"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white p-6 sm:p-7 text-center">
          <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center mx-auto mb-2.5">
            <School className="w-7 h-7 text-emerald-300" />
          </div>

          <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight">
            بوابة أولياء أمور مدرسة نوار محمد
          </h3>
          <p className="text-xs text-emerald-100 mt-1 max-w-sm mx-auto">
            منظومة رقمية مخصصة لكل ولي أمر لمتابعة انشغالات أبنائه والتواصل مع الإدارة
          </p>

          {/* Mode Switch Tabs */}
          <div className="mt-4 inline-flex p-1 rounded-xl bg-black/20 border border-white/10 text-xs font-bold">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setError(null);
              }}
              className={`px-5 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
                mode === 'login'
                  ? 'bg-white text-emerald-900 shadow-sm'
                  : 'text-emerald-100 hover:text-white'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>تسجيل دخول ولي الأمر</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setMode('register');
                setError(null);
              }}
              className={`px-5 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
                mode === 'register'
                  ? 'bg-white text-emerald-900 shadow-sm'
                  : 'text-emerald-100 hover:text-white'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>إنشاء حساب ولي جديد</span>
            </button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="m-6 mb-0 bg-rose-50 border border-rose-200 text-rose-800 p-3 rounded-xl flex items-start gap-2 text-xs">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* ================= MODE 1: LOGIN ================= */}
        {mode === 'login' && (
          <div className="p-6 sm:p-7 space-y-5">
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              
              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">
                  البريد الإلكتروني أو اسم المستخدم <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    autoFocus
                    placeholder="مثال: name@gmail.com أو rachid_b"
                    value={loginUsername}
                    onChange={(e) => {
                      setLoginUsername(e.target.value);
                      setError(null);
                    }}
                    className="w-full pr-10 pl-3 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 font-medium"
                  />
                  <User className="w-4 h-4 text-stone-400 absolute right-3.5 top-3 pointer-events-none" />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-stone-800">
                    كلمة المرور الخاصة بك <span className="text-red-500">*</span>
                  </label>
                  <span className="text-[11px] text-stone-400">سرية ومحمية</span>
                </div>
                <div className="relative">
                  <input
                    type={showLoginPassword ? 'text' : 'password'}
                    required
                    placeholder="أدخل كلمة المرور..."
                    value={loginPassword}
                    onChange={(e) => {
                      setLoginPassword(e.target.value);
                      setError(null);
                    }}
                    className="w-full pr-10 pl-11 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 font-sans"
                  />
                  <Lock className="w-4 h-4 text-stone-400 absolute right-3.5 top-3 pointer-events-none" />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    className="absolute left-3 top-2.5 text-stone-400 hover:text-stone-700 p-0.5"
                    title={showLoginPassword ? 'إخفاء' : 'إظهار'}
                  >
                    {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-stone-700 select-none">
                  <input
                    type="checkbox"
                    checked={loginRemember}
                    onChange={(e) => setLoginRemember(e.target.checked)}
                    className="rounded border-stone-300 text-emerald-700 focus:ring-emerald-500 w-4 h-4"
                  />
                  <span>تذكر تسجيل دخولي على هذا الجهاز</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isLoading || !loginUsername.trim() || !loginPassword.trim()}
                className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 text-sm"
              >
                {isLoading ? (
                  <span>جاري التحقق...</span>
                ) : (
                  <>
                    <LogIn className="w-4 h-4" />
                    <span>دخول الحساب وعرض انشغالاتي</span>
                  </>
                )}
              </button>

            </form>

            {/* Quick Demo Parent Accounts */}
            <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 space-y-2.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-stone-700 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>حسابات نموذجية لأولياء الأمور للتجربة السريعة:</span>
                </span>
                <span className="text-[11px] text-stone-400">انقر للتعبئة الفورية</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {DEFAULT_PARENT_ACCOUNTS.slice(0, 4).map(p => (
                  <button
                    key={p.username}
                    type="button"
                    onClick={() => handleQuickFill(p.username, 'parent2026')}
                    className="text-right p-2.5 rounded-lg border border-stone-200 bg-white hover:border-emerald-500 hover:bg-emerald-50/40 transition-colors"
                  >
                    <div className="font-bold text-stone-900 flex items-center justify-between">
                      <span>{p.fullName}</span>
                      <span className="text-[10px] text-emerald-700 font-normal">ولي {p.studentName}</span>
                    </div>
                    <div className="text-[11px] text-stone-500 font-mono mt-0.5">
                      المستخدم: <strong>{p.username}</strong>
                    </div>
                    <div className="text-[10px] text-stone-400 font-mono">
                      {p.email}
                    </div>
                    <div className="text-[11px] text-emerald-700 font-mono mt-0.5">
                      كلمة المرور: <strong>parent2026</strong>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="text-center pt-1">
              <span className="text-xs text-stone-500">ليس لديك حساب بعد؟ </span>
              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setError(null);
                }}
                className="text-xs font-bold text-emerald-700 hover:underline"
              >
                إنشاء حساب ولي أمر جديد الآن
              </button>
            </div>
          </div>
        )}

        {/* ================= MODE 2: REGISTER ================= */}
        {mode === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="p-6 sm:p-7 space-y-5 text-xs">
            
            {/* Account Credentials: Email First, then Username, then Password */}
            <div className="space-y-3 pb-3 border-b border-stone-200">
              <div className="font-bold text-stone-900 text-sm flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-emerald-700" />
                <span>1. بيانات الحساب (التسجيل بالإيميل ثم اسم المستخدم وكلمة المرور)</span>
              </div>

              {/* Email field */}
              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  البريد الإلكتروني لولي الأمر <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="example@gmail.com (البريد الإلكتروني لتلقي إشعارات الإدارة)"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    className="w-full pr-9 pl-3 py-2 rounded-xl border border-stone-300 text-xs font-medium"
                  />
                  <Mail className="w-3.5 h-3.5 text-stone-400 absolute right-3 top-2.5 pointer-events-none" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    اسم المستخدم الجديد <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: ahmed_2026"
                    value={regUsername}
                    onChange={(e) => setRegUsername(e.target.value.toLowerCase().replace(/\s+/g, ''))}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-mono font-bold"
                  />
                  <span className="text-[10px] text-stone-400 block mt-0.5">أحرف لاتينية بدون مسافات</span>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    كلمة المرور <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <input
                      type={showRegPassword ? 'text' : 'password'}
                      required
                      placeholder="4 خانات على الأقل"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      className="w-full pl-8 pr-3 py-2 rounded-xl border border-stone-300 text-xs"
                    />
                    <button
                      type="button"
                      onClick={() => setShowRegPassword(!showRegPassword)}
                      className="absolute left-2 top-2 text-stone-400"
                    >
                      {showRegPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    تأكيد كلمة المرور <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="أعد إدخال كلمة المرور"
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Mandatory Civil & Parent Details */}
            <div className="space-y-3 pb-3 border-b border-stone-200">
              <div className="font-bold text-stone-900 text-sm flex items-center gap-1.5">
                <User className="w-4 h-4 text-emerald-700" />
                <span>2. البيانات الإلزامية لولي الأمر (التحقق المدني)</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    اسم ولقب ولي الأمر <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="مثال: يوسف بلحاج"
                    value={regFullName}
                    onChange={(e) => setRegFullName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-bold text-stone-700">
                      رقم التعريف الوطني (NIN) <span className="text-red-500">*</span>
                    </label>
                    <span className="text-[10px] font-mono text-stone-400">
                      {regNIN.replace(/\s+/g, '').length}/18 رقماً
                    </span>
                  </div>
                  <input
                    type="text"
                    maxLength={18}
                    required
                    placeholder="10xxxxxxxxxxxxxxxx (18 رقماً)"
                    value={regNIN}
                    onChange={(e) => setRegNIN(e.target.value.replace(/\D/g, ''))}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 font-mono text-xs tracking-wider"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    اسم ولقب والدة ولي الأمر <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="اسم ولقب الجدة"
                    value={regMotherName}
                    onChange={(e) => setRegMotherName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1">
                    رقم هاتف التواصل <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="05 / 06 / 07 xx xx xx xx"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-mono"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-bold text-stone-700 mb-1">
                    عدد الإخوة في الأسرة <span className="text-red-500">*</span>
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      min="0"
                      max="15"
                      value={regSiblings}
                      onChange={(e) => setRegSiblings(Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-20 px-3 py-2 rounded-xl border border-stone-300 text-xs font-bold text-center"
                    />
                    <span className="text-[11px] text-stone-500">
                      إخوة (يفيد المؤسسة في دراسة الجانب الاجتماعي والتربوي)
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Student Details */}
            <div className="space-y-3">
              <div className="font-bold text-stone-900 text-sm flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-emerald-700" />
                <span>3. بيانات التلميذ المتمدرس بمدرسة نوار محمد</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-1">
                  <label className="block font-bold text-stone-700 mb-1">
                    اسم ولقب التلميذ(ة) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="اسم التلميذ بالكامل"
                    value={regStudentName}
                    onChange={(e) => setRegStudentName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs"
                  />
                </div>

                <div className="sm:col-span-1">
                  <label className="block font-bold text-stone-700 mb-1">
                    المستوى الدراسي <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={regGradeLevel}
                    onChange={(e) => setRegGradeLevel(e.target.value as GradeLevel)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs bg-white font-medium"
                  >
                    {GRADE_LEVELS.map(g => (
                      <option key={g.id} value={g.id}>
                        {g.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-1">
                  <label className="block font-bold text-stone-700 mb-1">
                    الفوج / القسم
                  </label>
                  <input
                    type="text"
                    placeholder="فوج 1 أو فوج 2..."
                    value={regSectionClass}
                    onChange={(e) => setRegSectionClass(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs"
                  />
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="pt-2 border-t border-stone-200 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-stone-500 hover:text-stone-800 text-xs underline"
              >
                لدي حساب بالفعل، تسجيل الدخول
              </button>

              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>إنشاء الحساب والدخول التلقائي</span>
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
