export type GradeLevel = 
  | 'preparatory' 
  | '1st' 
  | '2nd' 
  | '3rd' 
  | '4th' 
  | '5th';

export interface GradeLevelInfo {
  id: GradeLevel;
  label: string;
  shortLabel: string;
  stage: string;
  ageRange: string;
}

export const GRADE_LEVELS: GradeLevelInfo[] = [
  { id: 'preparatory', label: 'القسم التحضيري (ما قبل التمدرس)', shortLabel: 'تحضيري', stage: 'الطور التمهيدي', ageRange: '5 - 6 سنوات' },
  { id: '1st', label: 'السنة الأولى ابتدائي', shortLabel: 'سنة 1', stage: 'الطور الأول', ageRange: '6 - 7 سنوات' },
  { id: '2nd', label: 'السنة الثانية ابتدائي', shortLabel: 'سنة 2', stage: 'الطور الأول', ageRange: '7 - 8 سنوات' },
  { id: '3rd', label: 'السنة الثالثة ابتدائي', shortLabel: 'سنة 3', stage: 'الطور الثاني', ageRange: '8 - 9 سنوات' },
  { id: '4th', label: 'السنة الرابعة ابتدائي', shortLabel: 'سنة 4', stage: 'الطور الثاني', ageRange: '9 - 10 سنوات' },
  { id: '5th', label: 'السنة الخامسة ابتدائي (الشهادة / تقييم المكتسبات)', shortLabel: 'سنة 5', stage: 'الطور الثالث', ageRange: '10 - 11 سنة' },
];

export type ConcernCategory = 
  | 'academic'
  | 'behavioral'
  | 'health_safety'
  | 'canteen'
  | 'facilities_hygiene'
  | 'administrative'
  | 'activities'
  | 'other';

export interface CategoryInfo {
  id: ConcernCategory;
  name: string;
  description: string;
  iconName: string;
  colorClass: string;
}

export const CONCERN_CATEGORIES: CategoryInfo[] = [
  { 
    id: 'academic', 
    name: 'بيداغوجي وتحصيل دراسي', 
    description: 'صعوبات التعلم، الواجبات المنزلية، التقييم، التعامل مع المناهج',
    iconName: 'BookOpen',
    colorClass: 'text-blue-700 bg-blue-50 border-blue-200'
  },
  { 
    id: 'behavioral', 
    name: 'سلوكي وانضباط وتفاعل أقران', 
    description: 'الاندماج الاجتماعي، التنمر، الخلافات بين التلاميذ، الانضباط في الساحة',
    iconName: 'Users',
    colorClass: 'text-amber-700 bg-amber-50 border-amber-200'
  },
  { 
    id: 'health_safety', 
    name: 'صحي وسلامة ورعاية خاصة', 
    description: 'الحساسيات الغذائية، الأمراض المزمنة، الإسعاف الأولي، النظارات والرؤية',
    iconName: 'HeartPulse',
    colorClass: 'text-rose-700 bg-rose-50 border-rose-200'
  },
  { 
    id: 'canteen', 
    name: 'المطعم المدرسي والإطعام', 
    description: 'جودة الوجبات، التغذية المتوازنة، التوقيت، النظافة الغذائية',
    iconName: 'Utensils',
    colorClass: 'text-orange-700 bg-orange-50 border-orange-200'
  },
  { 
    id: 'facilities_hygiene', 
    name: 'المرافق والنظافة العامة', 
    description: 'المراحيض، ساحة الاستراحة، التدفئة والتبريد، الطاولات والإنارة',
    iconName: 'Sparkles',
    colorClass: 'text-emerald-700 bg-emerald-50 border-emerald-200'
  },
  { 
    id: 'administrative', 
    name: 'إداري وتنظيمي ومواعيد', 
    description: 'الشهادات المدرسية، التوقيت والدخول والخروج، النقل، رخص الغياب',
    iconName: 'FileText',
    colorClass: 'text-slate-700 bg-slate-100 border-slate-200'
  },
  { 
    id: 'activities', 
    name: 'أنشطة لاصفية وتربية بدنية', 
    description: 'النوادي الثقافية، النشاط الرياضي، المسابقات، المكتبة المدرسية',
    iconName: 'Award',
    colorClass: 'text-purple-700 bg-purple-50 border-purple-200'
  },
  { 
    id: 'other', 
    name: 'انشغال أو اقتراح عام آخر', 
    description: 'مبادرات تطوعية، مقترحات لتحسين البيئة المدرسية',
    iconName: 'HelpCircle',
    colorClass: 'text-stone-700 bg-stone-100 border-stone-200'
  }
];

export type UrgencyLevel = 'normal' | 'important' | 'urgent';

export type ConcernStatus = 
  | 'submitted'
  | 'in_review'
  | 'responded'
  | 'preventive_action'
  | 'resolved';

export interface MessageItem {
  id: string;
  sender: 'parent' | 'admin';
  senderName: string;
  message: string;
  timestamp: string;
}

export interface ScheduledMeeting {
  date: string;
  time: string;
  location: string;
  withWhom: string;
  notes?: string;
  confirmed: boolean;
}

export interface ConcernTicket {
  id: string;
  trackingCode: string;
  createdAt: string;
  updatedAt: string;
  
  // Mandatory parent & student fields requested by user
  studentName: string;
  parentName: string;
  parentNIN: string; // 18-digit Algerian National ID
  parentMotherName: string; // اسم ولقب والدة ولي الأمر
  siblingsCount: number;
  gradeLevel: GradeLevel;
  sectionClass: string;
  parentPhone: string;
  parentUsername?: string; // اسم المستخدم لحساب ولي الأمر المرتبط
  
  // Concern details
  category: ConcernCategory;
  urgency: UrgencyLevel;
  title: string;
  description: string;
  parentSuggestions?: string;
  
  // Workflow & Management
  status: ConcernStatus;
  assignedTo?: string;
  adminResponse?: string;
  adminNotes?: string;
  meetingScheduled?: ScheduledMeeting;
  conversation: MessageItem[];
  preventiveActionId?: string;
}

export interface PreventiveAction {
  id: string;
  title: string;
  category: ConcernCategory;
  targetLevels: GradeLevel[];
  rootCause: string;
  actionTaken: string;
  responsibleParty: string;
  implementationDate: string;
  status: 'planned' | 'in_progress' | 'implemented';
  impactMetric: string;
  relatedTicketsCount: number;
}

export interface ParentUser {
  id: string;
  email: string; // البريد الإلكتروني لولي الأمر
  username: string; // اسم المستخدم الخاص بالولي
  fullName: string; // اسم ولقب ولي الأمر
  parentNIN: string; // رقم التعريف الوطني (18 رقماً)
  parentMotherName: string; // اسم ولقب والدة ولي الأمر
  phone: string; // رقم هاتف التواصل
  siblingsCount: number; // عدد الإخوة
  studentName: string; // اسم ولقب التلميذ(ة)
  gradeLevel: GradeLevel; // المستوى الدراسي
  sectionClass: string; // الفوج التربوي
  createdAt: string;
}
