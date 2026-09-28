import { ParentUser, GradeLevel } from '../types';

export type { ParentUser };

export interface AdminUser {
  username: string;
  email: string;
  name: string;
  role: string;
  avatarTitle: string;
  createdAt?: string;
}

export interface StoredAccount extends AdminUser {
  passwordHash: string; // Plain/hashed comparison in local storage
}

export interface StoredParentAccount extends ParentUser {
  passwordHash: string;
}

const ADMIN_ACCOUNTS_KEY = 'nouar_school_admin_accounts_v2';
const ADMIN_SESSION_KEY = 'nouar_school_admin_session_v2';

const PARENT_ACCOUNTS_KEY = 'nouar_school_parent_accounts_v2';
const PARENT_SESSION_KEY = 'nouar_school_parent_session_v2';

export const DEFAULT_ADMIN_ACCOUNTS: StoredAccount[] = [
  {
    username: 'directeur',
    email: 'directeur@ecole-nouar.dz',
    name: 'السيد مدير المؤسسة',
    role: 'مدير مدرسة نوار محمد (صلاحيات كاملة)',
    avatarTitle: 'المدير',
    passwordHash: 'nouar2026',
    createdAt: '2026-09-01T08:00:00Z'
  },
  {
    username: 'admin',
    email: 'admin@ecole-nouar.dz',
    name: 'المشرف الإداري للرصد',
    role: 'أمانة المؤسسة وخلايا المتابعة',
    avatarTitle: 'الإدارة',
    passwordHash: 'nouar2026',
    createdAt: '2026-09-01T08:00:00Z'
  },
  {
    username: 'conseiller',
    email: 'conseiller@ecole-nouar.dz',
    name: 'مستشار التوجيه والإرشاد',
    role: 'المتابعة النفسية والبيداغوجية',
    avatarTitle: 'المستشار',
    passwordHash: 'nouar2026',
    createdAt: '2026-09-01T08:00:00Z'
  }
];

export const DEFAULT_PARENT_ACCOUNTS: StoredParentAccount[] = [
  {
    id: 'parent-1',
    email: 'rachid.belkacem@gmail.com',
    username: 'rachid_b',
    passwordHash: 'parent2026',
    fullName: 'رشيد بلقاسم',
    parentNIN: '109823450012948123',
    parentMotherName: 'فاطمة الزهراء بن عيسى',
    phone: '0550123456',
    siblingsCount: 3,
    studentName: 'أنس بلقاسم',
    gradeLevel: '1st',
    sectionClass: 'فوج 1',
    createdAt: '2026-09-20T08:00:00Z'
  },
  {
    id: 'parent-2',
    email: 'abdelkader.saadaoui@gmail.com',
    username: 'saadaoui_a',
    passwordHash: 'parent2026',
    fullName: 'عبد القادر سعداوي',
    parentNIN: '110934820034871920',
    parentMotherName: 'خديجة مزيان',
    phone: '0661234589',
    siblingsCount: 2,
    studentName: 'مريم سعداوي',
    gradeLevel: 'preparatory',
    sectionClass: 'فوج التحضيري أ',
    createdAt: '2026-09-22T09:00:00Z'
  },
  {
    id: 'parent-3',
    email: 'kamal.benamara@gmail.com',
    username: 'kamal_ben',
    passwordHash: 'parent2026',
    fullName: 'كمال بن عمارة',
    parentNIN: '108745230091823741',
    parentMotherName: 'يمينة قروي',
    phone: '0770987654',
    siblingsCount: 4,
    studentName: 'ياسين بن عمارة',
    gradeLevel: '5th',
    sectionClass: 'فوج 2',
    createdAt: '2026-09-23T10:00:00Z'
  },
  {
    id: 'parent-4',
    email: 'mohamed.harkat@gmail.com',
    username: 'harkat_m',
    passwordHash: 'parent2026',
    fullName: 'محمد حركات',
    parentNIN: '107623910045612398',
    parentMotherName: 'عائشة طواهرية',
    phone: '0555981243',
    siblingsCount: 1,
    studentName: 'إسراء حركات',
    gradeLevel: '3rd',
    sectionClass: 'فوج 1',
    createdAt: '2026-09-24T11:00:00Z'
  }
];

export function getStoredAccounts(): StoredAccount[] {
  try {
    const raw = localStorage.getItem(ADMIN_ACCOUNTS_KEY);
    if (!raw) {
      localStorage.setItem(ADMIN_ACCOUNTS_KEY, JSON.stringify(DEFAULT_ADMIN_ACCOUNTS));
      return DEFAULT_ADMIN_ACCOUNTS;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_ADMIN_ACCOUNTS;
  }
}

export function getAdminSession(): AdminUser | null {
  try {
    const local = localStorage.getItem(ADMIN_SESSION_KEY);
    if (local) return JSON.parse(local);
    const session = sessionStorage.getItem(ADMIN_SESSION_KEY);
    if (session) return JSON.parse(session);
    return null;
  } catch {
    return null;
  }
}

/**
 * Register a new Admin User on first entry:
 * As requested: Enter email, then username, then password.
 */
export function registerAdmin(
  email: string,
  username: string,
  passwordInput: string,
  fullName: string,
  role: string = 'إدارة المؤسسة والمتابعة',
  rememberMe: boolean = true
): { success: boolean; user?: AdminUser; error?: string } {
  const accounts = getStoredAccounts();
  const cleanEmail = email.trim().toLowerCase();
  const cleanUser = username.trim().toLowerCase();
  const cleanPass = passwordInput.trim();

  if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
    return { success: false, error: 'يرجى إدخال عنوان بريد إلكتروني صحيح (مثال: name@domain.com)' };
  }

  if (!cleanUser || cleanUser.length < 3) {
    return { success: false, error: 'اسم المستخدم يجب أن يتكون من 3 أحرف على الأقل' };
  }

  if (!cleanPass || cleanPass.length < 4) {
    return { success: false, error: 'كلمة المرور يجب أن تتكون من 4 خانات على الأقل' };
  }

  // Check uniqueness of username or email
  const exists = accounts.some(
    a => a.username.toLowerCase() === cleanUser || a.email.toLowerCase() === cleanEmail
  );
  if (exists) {
    return { success: false, error: 'البريد الإلكتروني أو اسم المستخدم مسجل بالفعل. يرجى تسجيل الدخول مباشرة.' };
  }

  const nameVal = fullName.trim() || 'مسؤول الإدارة';
  const newAdmin: StoredAccount = {
    username: cleanUser,
    email: cleanEmail,
    name: nameVal,
    role: role.trim() || 'إدارة المؤسسة والمتابعة',
    avatarTitle: nameVal.slice(0, 2) || 'إدارة',
    passwordHash: cleanPass,
    createdAt: new Date().toISOString()
  };

  const updated = [newAdmin, ...accounts];
  localStorage.setItem(ADMIN_ACCOUNTS_KEY, JSON.stringify(updated));
  localStorage.setItem('nouar_has_custom_admin_registered', 'true');

  const { passwordHash, ...sessionUser } = newAdmin;
  if (rememberMe) {
    localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(sessionUser));
  } else {
    sessionStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(sessionUser));
  }

  return { success: true, user: sessionUser };
}

/**
 * Login admin with Email OR Username + Password
 */
export function loginAdmin(
  identifierInput: string,
  passwordInput: string,
  rememberMe: boolean = true
): { success: boolean; user?: AdminUser; error?: string } {
  const accounts = getStoredAccounts();
  const cleanId = identifierInput.trim().toLowerCase();
  const cleanPass = passwordInput.trim();

  if (!cleanId || !cleanPass) {
    return { success: false, error: 'يرجى إدخال البريد الإلكتروني أو اسم المستخدم، وكلمة المرور' };
  }

  const account = accounts.find(
    acc => (acc.username.toLowerCase() === cleanId || acc.email?.toLowerCase() === cleanId) && acc.passwordHash === cleanPass
  );

  if (!account) {
    return { 
      success: false, 
      error: 'البريد الإلكتروني/اسم المستخدم أو كلمة المرور غير صحيحة. إذا كانت زيارتك الأولى، يرجى التسجيل أولاً.' 
    };
  }

  const sessionUser: AdminUser = {
    username: account.username,
    email: account.email || cleanId,
    name: account.name,
    role: account.role,
    avatarTitle: account.avatarTitle,
    createdAt: account.createdAt
  };

  if (rememberMe) {
    localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(sessionUser));
  } else {
    sessionStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(sessionUser));
  }

  return { success: true, user: sessionUser };
}

export function logoutAdmin(): void {
  try {
    localStorage.removeItem(ADMIN_SESSION_KEY);
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
  } catch {
    // ignore
  }
}

export function changeAdminPassword(
  username: string,
  oldPass: string,
  newPass: string
): { success: boolean; error?: string } {
  const accounts = getStoredAccounts();
  const target = accounts.find(a => a.username.toLowerCase() === username.toLowerCase());

  if (!target) {
    return { success: false, error: 'المستخدم غير موجود' };
  }

  if (target.passwordHash !== oldPass.trim()) {
    return { success: false, error: 'كلمة المرور الحالية غير صحيحة' };
  }

  if (!newPass.trim() || newPass.trim().length < 4) {
    return { success: false, error: 'كلمة المرور الجديدة يجب ألا تقل عن 4 أحرف أو أرقام' };
  }

  const updated = accounts.map(a => {
    if (a.username.toLowerCase() === username.toLowerCase()) {
      return { ...a, passwordHash: newPass.trim() };
    }
    return a;
  });

  localStorage.setItem(ADMIN_ACCOUNTS_KEY, JSON.stringify(updated));
  return { success: true };
}

// ======================== PARENT AUTHENTICATION ========================

export function getStoredParentAccounts(): StoredParentAccount[] {
  try {
    const raw = localStorage.getItem(PARENT_ACCOUNTS_KEY);
    if (!raw) {
      localStorage.setItem(PARENT_ACCOUNTS_KEY, JSON.stringify(DEFAULT_PARENT_ACCOUNTS));
      return DEFAULT_PARENT_ACCOUNTS;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_PARENT_ACCOUNTS;
  }
}

export function getParentSession(): ParentUser | null {
  try {
    const local = localStorage.getItem(PARENT_SESSION_KEY);
    if (local) return JSON.parse(local);
    const session = sessionStorage.getItem(PARENT_SESSION_KEY);
    if (session) return JSON.parse(session);
    return null;
  } catch {
    return null;
  }
}

export function loginParent(
  identifierInput: string, // username or email
  passwordInput: string,
  rememberMe: boolean = true
): { success: boolean; user?: ParentUser; error?: string } {
  const accounts = getStoredParentAccounts();
  const cleanId = identifierInput.trim().toLowerCase();
  const cleanPass = passwordInput.trim();

  if (!cleanId || !cleanPass) {
    return { success: false, error: 'يرجى إدخال البريد الإلكتروني أو اسم المستخدم وكلمة المرور' };
  }

  const account = accounts.find(
    acc => (acc.username.toLowerCase() === cleanId || acc.email?.toLowerCase() === cleanId) && acc.passwordHash === cleanPass
  );

  if (!account) {
    return { 
      success: false, 
      error: 'البريد الإلكتروني/اسم المستخدم أو كلمة المرور غير صحيحة. يرجى التحقق أو إنشاء حساب جديد.' 
    };
  }

  const { passwordHash, ...sessionUser } = account;

  if (rememberMe) {
    localStorage.setItem(PARENT_SESSION_KEY, JSON.stringify(sessionUser));
  } else {
    sessionStorage.setItem(PARENT_SESSION_KEY, JSON.stringify(sessionUser));
  }

  return { success: true, user: sessionUser };
}

export function registerParent(
  data: Omit<ParentUser, 'id' | 'createdAt'>,
  passwordInput: string,
  rememberMe: boolean = true
): { success: boolean; user?: ParentUser; error?: string } {
  const accounts = getStoredParentAccounts();
  const cleanEmail = data.email.trim().toLowerCase();
  const cleanUser = data.username.trim().toLowerCase();
  const cleanPass = passwordInput.trim();

  if (!cleanEmail || !cleanEmail.includes('@') || !cleanEmail.includes('.')) {
    return { success: false, error: 'يرجى إدخال عنوان بريد إلكتروني صحيح' };
  }

  if (!cleanUser || cleanUser.length < 3) {
    return { success: false, error: 'اسم المستخدم يجب أن يتكون من 3 أحرف على الأقل' };
  }

  if (!cleanPass || cleanPass.length < 4) {
    return { success: false, error: 'كلمة المرور يجب أن تتكون من 4 خانات على الأقل' };
  }

  // Check username and email uniqueness
  const existsUser = accounts.some(
    a => a.username.toLowerCase() === cleanUser || a.email?.toLowerCase() === cleanEmail
  );
  if (existsUser) {
    return { success: false, error: 'البريد الإلكتروني أو اسم المستخدم مستعمل بالفعل، يرجى تسجيل الدخول أو اختيار اسم آخر' };
  }

  // Check NIN uniqueness
  const cleanNIN = data.parentNIN.replace(/\s+/g, '');
  if (cleanNIN.length !== 18) {
    return { success: false, error: 'رقم التعريف الوطني لولي الأمر (NIN) يتكون من 18 رقماً' };
  }

  const newId = `parent-${Date.now()}`;
  const newAccount: StoredParentAccount = {
    ...data,
    id: newId,
    email: cleanEmail,
    username: cleanUser,
    parentNIN: cleanNIN,
    createdAt: new Date().toISOString(),
    passwordHash: cleanPass
  };

  const updated = [newAccount, ...accounts];
  localStorage.setItem(PARENT_ACCOUNTS_KEY, JSON.stringify(updated));

  const { passwordHash, ...sessionUser } = newAccount;

  if (rememberMe) {
    localStorage.setItem(PARENT_SESSION_KEY, JSON.stringify(sessionUser));
  } else {
    sessionStorage.setItem(PARENT_SESSION_KEY, JSON.stringify(sessionUser));
  }

  return { success: true, user: sessionUser };
}

export function logoutParent(): void {
  try {
    localStorage.removeItem(PARENT_SESSION_KEY);
    sessionStorage.removeItem(PARENT_SESSION_KEY);
  } catch {
    // ignore
  }
}

export function changeParentPassword(
  username: string,
  oldPass: string,
  newPass: string
): { success: boolean; error?: string } {
  const accounts = getStoredParentAccounts();
  const target = accounts.find(a => a.username.toLowerCase() === username.toLowerCase());

  if (!target) {
    return { success: false, error: 'الحساب غير موجود' };
  }

  if (target.passwordHash !== oldPass.trim()) {
    return { success: false, error: 'كلمة المرور الحالية غير صحيحة' };
  }

  if (!newPass.trim() || newPass.trim().length < 4) {
    return { success: false, error: 'كلمة المرور الجديدة يجب أن لا تقل عن 4 خانات' };
  }

  const updated = accounts.map(a => {
    if (a.username.toLowerCase() === username.toLowerCase()) {
      return { ...a, passwordHash: newPass.trim() };
    }
    return a;
  });

  localStorage.setItem(PARENT_ACCOUNTS_KEY, JSON.stringify(updated));
  return { success: true };
}

export function updateParentProfile(
  updatedUser: ParentUser
): { success: boolean; user?: ParentUser; error?: string } {
  const accounts = getStoredParentAccounts();
  const target = accounts.find(a => a.id === updatedUser.id || a.username === updatedUser.username);

  if (!target) {
    return { success: false, error: 'الحساب غير موجود' };
  }

  const updated = accounts.map(a => {
    if (a.id === updatedUser.id || a.username === updatedUser.username) {
      return {
        ...a,
        ...updatedUser,
        passwordHash: a.passwordHash // preserve password
      };
    }
    return a;
  });

  localStorage.setItem(PARENT_ACCOUNTS_KEY, JSON.stringify(updated));
  localStorage.setItem(PARENT_SESSION_KEY, JSON.stringify(updatedUser));
  return { success: true, user: updatedUser };
}
