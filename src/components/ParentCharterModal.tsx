import React from 'react';
import { 
  BookOpen, 
  Clock, 
  Calendar, 
  CheckCircle2, 
  PhoneCall, 
  Mail, 
  Award, 
  ShieldCheck, 
  HeartHandshake,
  GraduationCap
} from 'lucide-react';
import { GRADE_LEVELS } from '../types';

interface ParentCharterModalProps {
  onClose: () => void;
  onGoToSubmit: () => void;
}

export const ParentCharterModal: React.FC<ParentCharterModalProps> = ({
  onClose,
  onGoToSubmit
}) => {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 space-y-6">
      
      {/* Title Card */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-md border border-emerald-200">
              ميثاق الشراكة التربوية
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold text-stone-900 mt-1">
              دليل الولي وميثاق مدرسة نوار محمد الابتدائية
            </h1>
          </div>
        </div>

        <p className="text-stone-600 text-sm leading-relaxed">
          نؤمن في مدرسة نوار محمد الابتدائية بأن المدرسة والأسرة شريكان متكاملان في تنشئة التلميذ وبناء شخصيته المتوازنة. وضعنا هذا الدليل لترسيخ قنوات اتصال واضحة، شفافة ومثمرة تحفظ مصلحة الطفل الفضلى وتضمن التكفل السريع بأي انشغال أو صعوبة يواجهها.
        </p>
      </div>

      {/* Grade Levels in Nouar Mohamed School */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-xs p-6 space-y-4">
        <div className="flex items-center gap-2 text-stone-900 font-bold border-b border-stone-100 pb-3">
          <GraduationCap className="w-5 h-5 text-emerald-700" />
          <h3>الأطوار والمستويات التعليمية المعتمدة بالمؤسسة</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
          {GRADE_LEVELS.map(g => (
            <div key={g.id} className="p-3.5 rounded-xl border border-stone-200 bg-stone-50/60">
              <span className="font-extrabold text-stone-900 block text-sm mb-1">{g.label}</span>
              <span className="text-emerald-800 font-semibold block">{g.stage}</span>
              <span className="text-stone-500 text-[11px] block mt-0.5">الفئة العمرية: {g.ageRange}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Core Principles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Reception Hours & Schedule */}
        <div className="bg-white rounded-2xl border border-stone-200 shadow-xs p-6 space-y-4">
          <div className="flex items-center gap-2 text-stone-900 font-bold border-b border-stone-100 pb-3">
            <Clock className="w-5 h-5 text-emerald-700" />
            <h3>مواعيد الاستقبال والمقابلة الحضورية</h3>
          </div>

          <div className="space-y-3 text-xs text-stone-700">
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
              <strong className="block text-stone-900 mb-1">استقبال السيد المدير:</strong>
              أيام الإثنين والخميس من 09:00 إلى 11:30 صباحاً (أو عبر حجز موعد رقمي مسبق بالمنصة).
            </div>

            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
              <strong className="block text-stone-900 mb-1">استقبال الأساتذة والمعلمين:</strong>
              خلال فترات الاستراحة المحددة ويوم الثلاثاء مساء، حفاظاً على الزمن البيداغوجي لتمدرس التلاميذ داخل الأقسام.
            </div>

            <div className="p-3 bg-stone-50 rounded-xl border border-stone-200">
              <strong className="block text-stone-900 mb-1">وحدة الكشف والمتابعة الصحية (UDS):</strong>
              الفحص الدوري ومتابعة الحالات الخاصة طيلة أيام الأسبوع بالتنسيق مع طبيب المؤسسة.
            </div>
          </div>
        </div>

        {/* Commitments & Values */}
        <div className="bg-white rounded-2xl border border-stone-200 shadow-xs p-6 space-y-4">
          <div className="flex items-center gap-2 text-stone-900 font-bold border-b border-stone-100 pb-3">
            <HeartHandshake className="w-5 h-5 text-emerald-700" />
            <h3>التزامات المؤسسة تجاه انشغالات الأولياء</h3>
          </div>

          <div className="space-y-2.5 text-xs text-stone-700">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>الرد السريع:</strong> التكفل بالانشغال العادي خلال 48 ساعة، والانشغال العاجل فورياً.</span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>السرية التامة:</strong> حماية هوية التلميذ والولي وعدم إفشاء المعطيات خارج الإطار التربوي.</span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>البعد الوقائي:</strong> دراسة أسباب الشكاوى المتكررة لتعديل الإجراءات التنظيمية وتفاديها مستقبلاً.</span>
            </div>
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span><strong>الإنصاف وتكافؤ الفرص:</strong> التعامل مع كافة التلاميذ على قدم المساواة في الأنشطة والإطعام والرعاية.</span>
            </div>
          </div>
        </div>

      </div>

      {/* Action Footer */}
      <div className="bg-emerald-900 text-white rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold">هل لديكم أي انشغال أو اقتراح يخص ابنكم أو ابنتكم؟</h3>
          <p className="text-xs text-emerald-100 mt-1">
            لا تترددوا في طرحه عبر المنصة لتتم معالجته مباشرة من طرف الفريق التربوي المختص.
          </p>
        </div>

        <button
          onClick={onGoToSubmit}
          className="px-6 py-2.5 bg-white text-emerald-900 hover:bg-emerald-50 font-bold rounded-xl text-xs shadow-xs transition-colors shrink-0"
        >
          طرح انشغال الآن
        </button>
      </div>

    </div>
  );
};
