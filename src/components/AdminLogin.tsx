import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  User, 
  Mail, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  KeyRound, 
  AlertCircle, 
  School,
  CheckCircle2,
  Sparkles,
  UserPlus,
  LogIn,
  BadgeCheck
} from 'lucide-react';
import { loginAdmin, registerAdmin, AdminUser, DEFAULT_ADMIN_ACCOUNTS } from '../utils/auth';

interface AdminLoginProps {
  onLoginSuccess: (user: AdminUser) => void;
  onBackToParentPortal: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({
  onLoginSuccess,
  onBackToParentPortal
}) => {
  // Determine if this is the first time entering
  const [mode, setMode] = useState<'register' | 'login'>('register');
  
  useEffect(() => {
    const hasRegistered = localStorage.getItem('nouar_has_custom_admin_registered');
    if (hasRegistered === 'true') {
      setMode('login');
    } else {
      setMode('register');
    }
  }, []);

  // Registration state
  const [regEmail, setRegEmail] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regFullName, setRegFullName] = useState('');
  const [regRole, setRegRole] = useState('مدير مدرسة نوار محمد (صلاحيات كاملة)');
  const [showRegPassword, setShowRegPassword] = useState(false);

  // Login state
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Common UI state
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Handle first-time registration submit
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (regPassword !== regConfirmPassword) {
      setError('كلمة المرور وتأكيد كلمة المرور غير متطابقين');
      return;
    }

    if (!regEmail.trim() || !regEmail.includes('@')) {
      setError('يرجى إدخال عنوان بريد إلكتروني صحيح');
      return;
    }

    if (!regUsername.trim() || regUsername.trim().length < 3) {
      setError('اسم المستخدم يجب أن يتكون من 3 أحرف على الأقل');
      return;
    }

    if (!regPassword.trim() || regPassword.trim().length < 4) {
      setError('كلمة المرور يجب أن تتكون من 4 خانات على الأقل');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const res = registerAdmin(
        regEmail,
        regUsername,
        regPassword,
        regFullName.trim() || 'مدير المؤسسة',
        regRole,
        rememberMe
      );

      setIsLoading(false);

      if (res.success && res.user) {
        onLoginSuccess(res.user);
      } else {
        setError(res.error || 'حدث خطأ أثناء تسجيل الحساب');
      }
    }, 250);
  };

  // Handle standard login submit
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    setTimeout(() => {
      const result = loginAdmin(loginIdentifier, loginPassword, rememberMe);
      setIsLoading(false);

      if (result.success && result.user) {
        onLoginSuccess(result.user);
      } else {
        setError(result.error || 'فشل تسجيل الدخول. تحقق من البريد الإلكتروني أو اسم المستخدم وكلمة المرور.');
      }
    }, 250);
  };

  const handleQuickFill = (userOrEmailVal: string, passVal: string) => {
    setLoginIdentifier(userOrEmailVal);
    setLoginPassword(passVal);
    setError(null);
  };

  const handleQuickFillFirstTime = () => {
    setRegEmail('directeur@ecole-nouar.dz');
    setRegUsername('directeur');
    setRegPassword('nouar2026');
    setRegConfirmPassword('nouar2026');
    setRegFullName('السيد مدير المؤسسة');
    setRegRole('مدير مدرسة نوار محمد (صلاحيات كاملة)');
    setError(null);
  };

  return (
    <div className="max-w-xl mx-auto py-10 px-4 sm:px-6">
      
      {/* Return button */}
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={onBackToParentPortal}
          className="inline-flex items-center gap-2 text-xs font-semibold text-stone-600 hover:text-emerald-800 transition-colors bg-white px-3.5 py-2 rounded-xl border border-stone-200 shadow-xs"
        >
          <ArrowRight className="w-4 h-4 rtl:rotate-180" />
          <span>العودة إلى بوابة الأولياء وطرح الانشغالات</span>
        </button>

        <span className="text-[11px] text-stone-500 font-medium">
          مدرسة نوار محمد الابتدائية
        </span>
      </div>

      <div className="bg-white rounded-2xl border border-stone-200 shadow-md overflow-hidden">
        
        {/* Top Header Card */}
        <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white p-6 sm:p-8 text-center relative">
          <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/20 flex items-center justify-center mx-auto mb-3 shadow-inner">
            <ShieldCheck className="w-8 h-8 text-emerald-300" />
          </div>

          <div className="inline-block px-3 py-0.5 rounded-full bg-emerald-700/60 border border-emerald-500/30 text-emerald-100 text-xs font-semibold mb-2">
            فضاء محمي · إدارة المؤسسة والرصد التربوي
          </div>

          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">
            {mode === 'register' ? 'التسجيل بالبريد الإلكتروني لأول مرة' : 'تسجيل الدخول إلى فضاء الإدارة'}
          </h2>
          <p className="text-emerald-100 text-xs sm:text-sm mt-1 max-w-sm mx-auto">
            {mode === 'register' 
              ? 'يرجى إدخال البريد الإلكتروني ثم تحديد اسم المستخدم وكلمة المرور لتأمين الإدارة' 
              : 'أدخل البريد الإلكتروني أو اسم المستخدم وكلمة المرور لمتابعة الانشغالات'}
          </p>

          {/* Mode Switch Tabs */}
          <div className="mt-4 inline-flex p-1 rounded-xl bg-black/25 border border-white/15 text-xs font-bold">
            <button
              type="button"
              onClick={() => {
                setMode('register');
                setError(null);
              }}
              className={`px-4 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                mode === 'register'
                  ? 'bg-white text-emerald-950 shadow-sm'
                  : 'text-emerald-100 hover:text-white'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>التسجيل لأول مرة (بالإيميل)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setMode('login');
                setError(null);
              }}
              className={`px-4 py-1.5 rounded-lg transition-all flex items-center gap-1.5 ${
                mode === 'login'
                  ? 'bg-white text-emerald-950 shadow-sm'
                  : 'text-emerald-100 hover:text-white'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>تسجيل الدخول (لدي حساب)</span>
            </button>
          </div>
        </div>

        {/* First time guidance banner */}
        {mode === 'register' && (
          <div className="bg-emerald-50/80 border-b border-emerald-100 px-6 py-3 flex items-start gap-2.5 text-xs text-emerald-900 leading-relaxed">
            <Sparkles className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <strong>التسجيل الأولي المعتمد:</strong> يطلب من المسؤول عند الدخول لأول مرة التسجيل بالبريد الإلكتروني أولاً، ثم كتابة اسم المستخدم وتعيين كلمة المرور لحفظ بياناته الإدارية.
            </div>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="m-6 mb-0 bg-rose-50 border border-rose-200 rounded-xl p-3.5 flex items-start gap-2.5 text-xs text-rose-800 animate-shake">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* ================= FORM 1: REGISTER FOR FIRST TIME ================= */}
        {mode === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="p-6 sm:p-8 space-y-4 text-xs">
            
            {/* Step 1: Email */}
            <div>
              <label className="block font-bold text-stone-800 mb-1">
                الخطوة 1: البريد الإلكتروني <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  autoFocus
                  placeholder="name@domain.com (مثال: sizar.wahib@gmail.com أو directeur@ecole-nouar.dz)"
                  value={regEmail}
                  onChange={(e) => {
                    setRegEmail(e.target.value);
                    setError(null);
                  }}
                  className="w-full pr-10 pl-3 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 font-medium"
                />
                <Mail className="w-4 h-4 text-stone-400 absolute right-3.5 top-3 pointer-events-none" />
              </div>
              <span className="text-[11px] text-stone-500 mt-0.5 block">
                يستخدم لاستلام التنبيهات الرسمية وإشعاركم بالانشغالات العاجلة
              </span>
            </div>

            {/* Step 2: Username */}
            <div>
              <label className="block font-bold text-stone-800 mb-1">
                الخطوة 2: اسم المستخدم <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="أدخل اسم المستخدم للولوج (مثال: directeur أو admin_nouar)"
                  value={regUsername}
                  onChange={(e) => {
                    setRegUsername(e.target.value.toLowerCase().replace(/\s+/g, ''));
                    setError(null);
                  }}
                  className="w-full pr-10 pl-3 py-2.5 rounded-xl border border-stone-300 text-sm font-mono focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 font-bold"
                />
                <User className="w-4 h-4 text-stone-400 absolute right-3.5 top-3 pointer-events-none" />
              </div>
              <span className="text-[11px] text-stone-400 mt-0.5 block">
                أحرف إنجليزية أو أرقام بدون مسافات للدخول السريع
              </span>
            </div>

            {/* Step 3: Password & Confirm Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="font-bold text-stone-800">
                    الخطوة 3: كلمة المرور <span className="text-red-500">*</span>
                  </label>
                </div>
                <div className="relative">
                  <input
                    type={showRegPassword ? 'text' : 'password'}
                    required
                    placeholder="4 خانات على الأقل"
                    value={regPassword}
                    onChange={(e) => {
                      setRegPassword(e.target.value);
                      setError(null);
                    }}
                    className="w-full pr-9 pl-9 py-2 rounded-xl border border-stone-300 text-xs focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 font-sans"
                  />
                  <Lock className="w-3.5 h-3.5 text-stone-400 absolute right-3 top-2.5 pointer-events-none" />
                  <button
                    type="button"
                    onClick={() => setShowRegPassword(!showRegPassword)}
                    className="absolute left-2.5 top-2 text-stone-400 hover:text-stone-700"
                    title={showRegPassword ? 'إخفاء' : 'إظهار'}
                  >
                    {showRegPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-800 mb-1">
                  تأكيد كلمة المرور <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    placeholder="أعد كتابة كلمة المرور"
                    value={regConfirmPassword}
                    onChange={(e) => {
                      setRegConfirmPassword(e.target.value);
                      setError(null);
                    }}
                    className="w-full pr-9 pl-3 py-2 rounded-xl border border-stone-300 text-xs focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 font-sans"
                  />
                  <Lock className="w-3.5 h-3.5 text-stone-400 absolute right-3 top-2.5 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Profile info: Name & Role */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block font-bold text-stone-800 mb-1">
                  الاسم واللقب الإداري <span className="text-stone-400 font-normal">(اختياري)</span>
                </label>
                <input
                  type="text"
                  placeholder="مثال: السيد مدير المؤسسة"
                  value={regFullName}
                  onChange={(e) => setRegFullName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-800 mb-1">
                  الصفة أو المسؤولية
                </label>
                <select
                  value={regRole}
                  onChange={(e) => setRegRole(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs bg-white"
                >
                  <option value="مدير مدرسة نوار محمد (صلاحيات كاملة)">مدير المؤسسة</option>
                  <option value="أمانة المؤسسة وخلايا المتابعة">أمانة المؤسسة والمتابعة</option>
                  <option value="مستشار التوجيه والإرشاد البيداغوجي">مستشار التوجيه والتربية</option>
                  <option value="مسؤول المطعم والخدمات العامة">مسؤول الإطعام والخدمات</option>
                </select>
              </div>
            </div>

            {/* Submit Register Button */}
            <div className="pt-3 space-y-2">
              <button
                type="submit"
                disabled={isLoading || !regEmail.trim() || !regUsername.trim() || !regPassword.trim()}
                className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 text-sm"
              >
                {isLoading ? (
                  <span>جاري تسجيل الحساب وتأمين الولوج...</span>
                ) : (
                  <>
                    <BadgeCheck className="w-4 h-4" />
                    <span>تأكيد التسجيل والدخول المباشر للوحة الإدارة</span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-between text-[11px] text-stone-500 pt-1">
                <button
                  type="button"
                  onClick={handleQuickFillFirstTime}
                  className="text-emerald-700 font-semibold hover:underline flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  <span>تعبئة نموذج تجريبي جاهز لأول مرة</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setError(null);
                  }}
                  className="hover:text-stone-800 underline"
                >
                  لدي حساب مسبق؟ تسجيل الدخول
                </button>
              </div>
            </div>

          </form>
        )}

        {/* ================= FORM 2: LOGIN FOR RETURNING ADMIN ================= */}
        {mode === 'login' && (
          <form onSubmit={handleLoginSubmit} className="p-6 sm:p-8 space-y-5">
            
            {/* Identifier: Username OR Email */}
            <div>
              <label className="block text-xs font-bold text-stone-800 mb-1.5">
                البريد الإلكتروني أو اسم المستخدم <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  autoFocus
                  placeholder="أدخل بريدك الإلكتروني (name@domain.com) أو اسم المستخدم (directeur)"
                  value={loginIdentifier}
                  onChange={(e) => {
                    setLoginIdentifier(e.target.value);
                    setError(null);
                  }}
                  className="w-full pr-10 pl-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 font-medium"
                />
                <User className="w-4 h-4 text-stone-400 absolute right-3.5 top-3 pointer-events-none" />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-stone-800">
                  كلمة المرور <span className="text-red-500">*</span>
                </label>
                <span className="text-[11px] text-stone-400">
                  مطلوبة للتحقق من الصلاحيات
                </span>
              </div>

              <div className="relative">
                <input
                  type={showLoginPassword ? 'text' : 'password'}
                  placeholder="أدخل كلمة المرور الخاصة بالإدارة..."
                  value={loginPassword}
                  onChange={(e) => {
                    setLoginPassword(e.target.value);
                    setError(null);
                  }}
                  className="w-full pr-10 pl-11 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 font-medium font-sans"
                />
                <Lock className="w-4 h-4 text-stone-400 absolute right-3.5 top-3 pointer-events-none" />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  className="absolute left-3 top-2.5 text-stone-400 hover:text-stone-700 p-0.5 rounded-md"
                  title={showLoginPassword ? 'إخفاء كلمة المرور' : 'إظهار كلمة المرور'}
                >
                  {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember me */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-stone-700 select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-stone-300 text-emerald-700 focus:ring-emerald-500 w-4 h-4"
                />
                <span>تذكر تسجيل دخولي على هذا الجهاز</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !loginIdentifier.trim() || !loginPassword.trim()}
              className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 text-sm"
            >
              {isLoading ? (
                <span>جاري التحقق من الهوية...</span>
              ) : (
                <>
                  <KeyRound className="w-4 h-4" />
                  <span>دخول لوحة القيادة والرصد</span>
                </>
              )}
            </button>

            {/* Quick Test Accounts Card */}
            <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-stone-700 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>الحسابات الإدارية المعتمدة (للتجربة السريعة):</span>
                </span>
                <span className="text-[11px] text-stone-400">انقر للتعبئة</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {DEFAULT_ADMIN_ACCOUNTS.slice(0, 2).map(acc => (
                  <button
                    key={acc.username}
                    type="button"
                    onClick={() => handleQuickFill(acc.username, 'nouar2026')}
                    className="text-right p-2.5 rounded-lg border border-stone-200 hover:border-emerald-500 bg-white hover:bg-emerald-50/50 transition-colors"
                  >
                    <div className="font-bold text-stone-900">{acc.name}</div>
                    <div className="text-[11px] text-stone-500 font-mono mt-0.5">
                      المستخدم: <strong>{acc.username}</strong>
                    </div>
                    <div className="text-[10px] text-stone-400 font-mono">
                      الإيميل: {acc.email}
                    </div>
                    <div className="text-[11px] text-emerald-700 font-mono mt-0.5">
                      كلمة المرور: <strong>nouar2026</strong>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="text-center pt-1">
              <span className="text-xs text-stone-500">هل هذه زيارتك الأولى للمنصة؟ </span>
              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setError(null);
                }}
                className="text-xs font-bold text-emerald-700 hover:underline"
              >
                التسجيل بالبريد الإلكتروني لأول مرة
              </button>
            </div>

          </form>
        )}

      </div>

    </div>
  );
};
