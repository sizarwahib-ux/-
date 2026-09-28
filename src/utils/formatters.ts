import { GradeLevel, ConcernCategory, ConcernStatus, UrgencyLevel, ConcernTicket, GRADE_LEVELS, CONCERN_CATEGORIES } from '../types';

export function getGradeLabel(grade: GradeLevel): string {
  const found = GRADE_LEVELS.find(g => g.id === grade);
  return found ? found.label : grade;
}

export function getGradeShortLabel(grade: GradeLevel): string {
  const found = GRADE_LEVELS.find(g => g.id === grade);
  return found ? found.shortLabel : grade;
}

export function getCategoryLabel(category: ConcernCategory): string {
  const found = CONCERN_CATEGORIES.find(c => c.id === category);
  return found ? found.name : category;
}

export function getStatusDetails(status: ConcernStatus): { label: string; textClass: string; bgClass: string; step: number } {
  switch (status) {
    case 'submitted':
      return { label: 'جديد - مسجل بالإدارة', textClass: 'text-amber-800', bgClass: 'bg-amber-50 border-amber-200', step: 1 };
    case 'in_review':
      return { label: 'قيد الدراسة والتحري', textClass: 'text-blue-800', bgClass: 'bg-blue-50 border-blue-200', step: 2 };
    case 'responded':
      return { label: 'تم الرد / مبرمج موعد', textClass: 'text-emerald-800', bgClass: 'bg-emerald-50 border-emerald-200', step: 3 };
    case 'preventive_action':
      return { label: 'إجراء وقائي معتمد', textClass: 'text-purple-800', bgClass: 'bg-purple-50 border-purple-200', step: 4 };
    case 'resolved':
      return { label: 'تمت المعالجة والإغلاق', textClass: 'text-stone-700', bgClass: 'bg-stone-100 border-stone-200', step: 5 };
  }
}

export function getUrgencyDetails(urgency: UrgencyLevel): { label: string; textClass: string; dotClass: string } {
  switch (urgency) {
    case 'urgent':
      return { label: 'عاجل جداً', textClass: 'text-red-700 font-bold', dotClass: 'bg-red-500' };
    case 'important':
      return { label: 'هام', textClass: 'text-amber-700 font-semibold', dotClass: 'bg-amber-500' };
    case 'normal':
      return { label: 'عادي', textClass: 'text-stone-600', dotClass: 'bg-stone-400' };
  }
}

export function formatDateArabic(isoString: string): string {
  try {
    const d = new Date(isoString);
    return new Intl.DateTimeFormat('ar-DZ', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(d);
  } catch {
    return isoString;
  }
}

export function calculateStatistics(tickets: ConcernTicket[]) {
  const total = tickets.length;
  const resolved = tickets.filter(t => t.status === 'resolved').length;
  const inReview = tickets.filter(t => t.status === 'in_review').length;
  const submitted = tickets.filter(t => t.status === 'submitted').length;
  const responded = tickets.filter(t => t.status === 'responded').length;
  const preventive = tickets.filter(t => t.status === 'preventive_action').length;
  const urgent = tickets.filter(t => t.urgency === 'urgent').length;

  const resolutionRate = total > 0 ? Math.round(((resolved + responded + preventive) / total) * 100) : 0;

  // Grade breakdown
  const gradeDistribution = GRADE_LEVELS.map(level => {
    const matching = tickets.filter(t => t.gradeLevel === level.id);
    const count = matching.length;
    const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
    
    // Find most frequent category in this grade
    const catCounts: Record<string, number> = {};
    matching.forEach(t => {
      catCounts[t.category] = (catCounts[t.category] || 0) + 1;
    });
    let topCategory = 'متنوع';
    let maxCat = 0;
    Object.entries(catCounts).forEach(([cat, val]) => {
      if (val > maxCat) {
        maxCat = val;
        topCategory = getCategoryLabel(cat as ConcernCategory);
      }
    });

    return {
      level: level.id,
      label: level.label,
      shortLabel: level.shortLabel,
      stage: level.stage,
      count,
      percentage,
      topCategory
    };
  });

  // Category breakdown
  const categoryDistribution = CONCERN_CATEGORIES.map(cat => {
    const count = tickets.filter(t => t.category === cat.id).length;
    const percentage = total > 0 ? Math.round((count / total) * 100) : 0;
    return {
      category: cat.id,
      name: cat.name,
      count,
      percentage,
      colorClass: cat.colorClass
    };
  }).sort((a, b) => b.count - a.count);

  // Sibling count breakdown
  const siblingBuckets = [
    { label: 'وحيد (0 إخوة)', count: tickets.filter(t => t.siblingsCount === 0).length },
    { label: '1 - 2 إخوة', count: tickets.filter(t => t.siblingsCount >= 1 && t.siblingsCount <= 2).length },
    { label: '3 - 4 إخوة', count: tickets.filter(t => t.siblingsCount >= 3 && t.siblingsCount <= 4).length },
    { label: '5 إخوة فما فوق', count: tickets.filter(t => t.siblingsCount >= 5).length },
  ];

  return {
    total,
    resolved,
    inReview,
    submitted,
    responded,
    preventive,
    urgent,
    resolutionRate,
    gradeDistribution,
    categoryDistribution,
    siblingBuckets
  };
}
