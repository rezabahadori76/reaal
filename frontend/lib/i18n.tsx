'use client';

import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';

export type Locale = 'en' | 'ar';

type Dictionary = Record<string, string>;

const dictionaries: Record<Locale, Dictionary> = {
  en: {
    appName: 'MulkPlus',
    appTagline: 'Smart mortgage finance',
    heroBadge: 'The new way to buy property with bank financing',
    heroTitleA: 'Buy property,',
    heroTitleB: 'fast and intelligent',
    heroDescription:
      'A premium platform connecting buyers, sellers, banks, and valuation companies in one transparent mortgage workflow.',
    login: 'Login',
    logout: 'Logout',
    startDemo: 'Start demo',
    getStarted: 'Get started',
    howItWorks: 'How it works',
    actorsCount: 'Actors',
    stepsCount: 'Steps',
    faster: 'Faster',
    ecosystem: 'Ecosystem',
    actorsTitle: 'Four parties. One platform.',
    process: 'Process',
    processTitle: 'From application to keys',
    demoReadyTitle: 'Ready for the demo?',
    demoReadyDescription:
      'Use the demo accounts to experience the full workflow from buyer to bank, appraiser, seller, and admin.',
    demoPassword: 'Password',
    enterDemo: 'Enter demo',
    footerText: 'Integrated real estate finance and purchase platform - MVP',
    actorBuyer: 'Buyer',
    actorBuyerDesc: 'Applies to buy property and receive bank finance',
    actorSeller: 'Seller',
    actorSellerDesc: 'Receives cash after the bank-backed transaction',
    actorBank: 'Bank',
    actorBankDesc: 'Runs eligibility and mortgage approval',
    actorAppraiser: 'Valuation',
    actorAppraiserDesc: 'Issues the official bank-approved property report',
    stepApply: 'Application',
    stepApplyDesc: 'The buyer submits property and financial information',
    stepBank: 'Bank eligibility',
    stepBankDesc: 'The bank reviews the applicant and loan capacity',
    stepValuation: 'Property valuation',
    stepValuationDesc: 'The valuation company issues the official report',
    stepDeal: 'Deal completion',
    stepDealDesc: 'Buyer and seller finalize the bank-financed transaction',
    heroCase: 'Case RE-2026-DEMO01',
    heroBankReview: 'Bank review',
    heroLoanLimit: 'Approved loan limit',
    heroLoanAmount: 'OMR 64,000',
    heroValuation: 'Property valuation',
    heroPending: 'Pending',
    heroProgress: 'Case progress - 60%',
    heroApproved: 'Eligibility approved',
    heroApprovedBy: 'Bank Muscat - 2 minutes ago',
    authBadge: 'Smart property finance platform',
    authTitle: 'Buy property',
    authTitleHighlight: 'without the friction',
    authDescription:
      'A single workspace for buyers, sellers, banks, and valuation teams - from request to keys.',
    mainParties: 'Main parties',
    speed: 'More speed',
    transparency: 'Transparency',
    welcome: 'Welcome back',
    welcomeSubtitle: 'Sign in to continue',
    email: 'Email',
    password: 'Password',
    signingIn: 'Signing in...',
    loginCta: 'Sign in',
    noAccount: "Don't have an account?",
    haveAccount: 'Already have an account?',
    register: 'Create account',
    quickLogin: 'Quick login - demo accounts',
    createAccount: 'Create account',
    createAccountSubtitle: 'Join MulkPlus',
    fullName: 'Full name',
    phone: 'Phone number',
    role: 'Role',
    minPassword: 'Minimum 6 characters',
    creating: 'Creating...',
    buyerDashboard: 'Buyer dashboard',
    buyerDashboardSubtitle: 'Track your property purchase applications',
    newRequest: 'New request',
    newNotifications: 'New notifications',
    noBuyerCases: 'No applications yet',
    noBuyerCasesDesc: 'Create a new request to start the property purchase workflow.',
    adminDashboard: 'Admin dashboard',
    adminSubtitle: 'Platform operations overview',
    adminBadge: 'Admin panel',
    totalCases: 'Total cases',
    activeCases: 'Active cases',
    completedCases: 'Completed',
    users: 'Users',
    inProgress: 'In progress',
    casesByStatus: 'Cases by status',
    latestCases: 'Latest cases',
    viewAll: 'View all',
    casesManagement: 'Case management',
    caseCount: 'cases',
    noCases: 'No cases yet',
    usersManagement: 'User management',
    registeredUsers: 'registered users',
    name: 'Name',
    contact: 'Contact',
    creditReview: 'Credit review',
    creditReviewSubtitle: 'Cases waiting for bank eligibility review',
    noBankCases: 'No cases waiting for review',
    sellerCases: 'Sales cases',
    sellerCasesSubtitle: 'Properties connected to your account',
    noSellerCases: 'No cases connected yet',
    noSellerCasesDesc: 'Once the admin connects a buyer case to you, it will appear here.',
    receivedAmount: 'Received amount',
    appraisalRequests: 'Valuation requests',
    appraisalSubtitle: 'Review and value the property',
    noAppraisals: 'No valuation requests pending',
    newStatus: 'New',
    ongoingStatus: 'In progress',
    buyer: 'Buyer',
    back: 'Back',
    submitPropertyRequest: 'Submit property request',
    submitPropertySubtitle: 'Enter the property and financing details',
    propertyAddress: 'Property address',
    propertyType: 'Property type',
    apartment: 'Apartment',
    villa: 'Villa',
    land: 'Land',
    commercial: 'Commercial',
    area: 'Area (sqm)',
    askingPrice: 'Asking price (OMR)',
    monthlyIncome: 'Monthly income (OMR)',
    propertySource: 'Property source',
    externalProperty: 'Selected by buyer',
    platformProperty: 'Introduced by platform',
    notes: 'Notes',
    submitAndSend: 'Submit request',
    submitting: 'Submitting...',
    caseNumber: 'Case number',
    property: 'Property',
    price: 'Price',
    income: 'Income',
    seller: 'Seller',
    bankResult: 'Bank result',
    result: 'Result',
    maxLoan: 'Max loan',
    interestRate: 'Interest rate',
    valuationReport: 'Valuation report',
    appraisedValue: 'Appraised value',
    appraiser: 'Appraiser',
    actions: 'Actions',
    submitRequest: 'Submit request',
    sendToBank: 'Send to bank',
    assignSeller: 'Assign seller',
    selectSeller: 'Select seller',
    approve: 'Approve',
    conditionalApprove: 'Conditional approve',
    reject: 'Reject',
    rejectionReason: 'Rejection reason',
    submitBankResult: 'Submit bank result',
    requestValuation: 'Request valuation',
    acceptValuation: 'Accept and start valuation',
    valueOman: 'Property value (OMR)',
    reportNotes: 'Report notes',
    submitValuation: 'Submit valuation report',
    completeDeal: 'Complete deal',
    cancelCase: 'Cancel case',
    confirmCancel: 'Are you sure you want to cancel this case?',
    timeline: 'Case timeline',
    noEvents: 'No events yet',
    workflow: 'Workflow',
    approved: 'Approved',
    rejected: 'Rejected',
    conditional: 'Conditional',
  },
  ar: {
    appName: 'مُلك بلس',
    appTagline: 'تمويل عقاري ذكي',
    heroBadge: 'طريقة عمانية حديثة لشراء العقار بالتمويل البنكي',
    heroTitleA: 'اشتري عقارك،',
    heroTitleB: 'بسهولة وذكاء',
    heroDescription:
      'منصة راقية تربط المشتري والبائع والبنك وشركة التثمين في مسار تمويل عقاري واضح وسريع.',
    login: 'تسجيل الدخول',
    logout: 'تسجيل الخروج',
    startDemo: 'ابدأ العرض',
    getStarted: 'ابدأ الآن',
    howItWorks: 'كيف تعمل المنصة',
    actorsCount: 'أطراف',
    stepsCount: 'خطوات',
    faster: 'أسرع',
    ecosystem: 'المنظومة',
    actorsTitle: 'أربعة أطراف في منصة واحدة',
    process: 'المسار',
    processTitle: 'من الطلب إلى استلام المفاتيح',
    demoReadyTitle: 'جاهز للعرض التجريبي؟',
    demoReadyDescription:
      'استخدم حسابات العرض لتجربة المسار الكامل من المشتري إلى البنك والمثمن والبائع والإدارة.',
    demoPassword: 'كلمة المرور',
    enterDemo: 'دخول العرض',
    footerText: 'منصة متكاملة لتمويل وشراء العقار - MVP',
    actorBuyer: 'المشتري',
    actorBuyerDesc: 'يقدم طلب شراء العقار والحصول على التمويل',
    actorSeller: 'البائع',
    actorSellerDesc: 'يستلم المبلغ نقداً بعد إتمام الصفقة الممولة',
    actorBank: 'البنك',
    actorBankDesc: 'ينفذ فحص الأهلية واعتماد التمويل العقاري',
    actorAppraiser: 'التثمين',
    actorAppraiserDesc: 'يصدر تقرير القيمة المعتمد لدى البنك',
    stepApply: 'تسجيل الطلب',
    stepApplyDesc: 'يسجل المشتري بيانات العقار والوضع المالي',
    stepBank: 'فحص البنك',
    stepBankDesc: 'يراجع البنك أهلية المتقدم وقدرته التمويلية',
    stepValuation: 'تثمين العقار',
    stepValuationDesc: 'تصدر شركة التثمين التقرير الرسمي للعقار',
    stepDeal: 'إتمام الصفقة',
    stepDealDesc: 'يتم ربط الأطراف وإنهاء الصفقة الممولة',
    heroCase: 'ملف RE-2026-DEMO01',
    heroBankReview: 'قيد مراجعة البنك',
    heroLoanLimit: 'حد التمويل المعتمد',
    heroLoanAmount: '٦٤٬٠٠٠ ر.ع',
    heroValuation: 'تثمين العقار',
    heroPending: 'قيد الانتظار',
    heroProgress: 'تقدم الملف - ٦٠٪',
    heroApproved: 'تم اعتماد الأهلية',
    heroApprovedBy: 'بنك مسقط - قبل دقيقتين',
    authBadge: 'منصة تمويل عقاري ذكية',
    authTitle: 'امتلك عقارك',
    authTitleHighlight: 'بدون تعقيد',
    authDescription:
      'مساحة واحدة للمشتري والبائع والبنك وفريق التثمين - من الطلب إلى المفاتيح.',
    mainParties: 'الأطراف الرئيسية',
    speed: 'سرعة أعلى',
    transparency: 'شفافية كاملة',
    welcome: 'مرحباً بعودتك',
    welcomeSubtitle: 'سجل الدخول للمتابعة',
    email: 'البريد الإلكتروني',
    password: 'كلمة المرور',
    signingIn: 'جاري الدخول...',
    loginCta: 'تسجيل الدخول',
    noAccount: 'ما عندك حساب؟',
    haveAccount: 'عندك حساب؟',
    register: 'إنشاء حساب',
    quickLogin: 'دخول سريع - حسابات العرض',
    createAccount: 'إنشاء حساب',
    createAccountSubtitle: 'انضم إلى مُلك بلس',
    fullName: 'الاسم الكامل',
    phone: 'رقم الهاتف',
    role: 'الدور',
    minPassword: '٦ أحرف على الأقل',
    creating: 'جاري الإنشاء...',
    buyerDashboard: 'لوحة المشتري',
    buyerDashboardSubtitle: 'تابع طلبات شراء العقار',
    newRequest: 'طلب جديد',
    newNotifications: 'إشعارات جديدة',
    noBuyerCases: 'لا توجد طلبات بعد',
    noBuyerCasesDesc: 'أنشئ طلباً جديداً لبدء مسار شراء العقار.',
    adminDashboard: 'لوحة الإدارة',
    adminSubtitle: 'نظرة عامة على عمليات المنصة',
    adminBadge: 'لوحة المدير',
    totalCases: 'إجمالي الملفات',
    activeCases: 'الملفات النشطة',
    completedCases: 'المكتملة',
    users: 'المستخدمون',
    inProgress: 'قيد التنفيذ',
    casesByStatus: 'الملفات حسب الحالة',
    latestCases: 'آخر الملفات',
    viewAll: 'عرض الكل',
    casesManagement: 'إدارة الملفات',
    caseCount: 'ملفات',
    noCases: 'لا توجد ملفات بعد',
    usersManagement: 'إدارة المستخدمين',
    registeredUsers: 'مستخدم مسجل',
    name: 'الاسم',
    contact: 'التواصل',
    creditReview: 'مراجعة الائتمان',
    creditReviewSubtitle: 'ملفات بانتظار مراجعة البنك',
    noBankCases: 'لا توجد ملفات بانتظار المراجعة',
    sellerCases: 'ملفات البيع',
    sellerCasesSubtitle: 'العقارات المرتبطة بحسابك',
    noSellerCases: 'لا توجد ملفات مرتبطة بعد',
    noSellerCasesDesc: 'بعد ربط الإدارة لملف مشتري بك، سيظهر هنا.',
    receivedAmount: 'المبلغ المستلم',
    appraisalRequests: 'طلبات التثمين',
    appraisalSubtitle: 'مراجعة وتثمين العقار',
    noAppraisals: 'لا توجد طلبات تثمين بانتظارك',
    newStatus: 'جديد',
    ongoingStatus: 'قيد التنفيذ',
    buyer: 'المشتري',
    back: 'رجوع',
    submitPropertyRequest: 'تسجيل طلب شراء عقار',
    submitPropertySubtitle: 'أدخل بيانات العقار والتمويل',
    propertyAddress: 'عنوان العقار',
    propertyType: 'نوع العقار',
    apartment: 'شقة',
    villa: 'فيلا',
    land: 'أرض',
    commercial: 'تجاري',
    area: 'المساحة (متر مربع)',
    askingPrice: 'السعر المطلوب (ر.ع)',
    monthlyIncome: 'الدخل الشهري (ر.ع)',
    propertySource: 'مصدر العقار',
    externalProperty: 'مختار من المشتري',
    platformProperty: 'مقترح من المنصة',
    notes: 'ملاحظات',
    submitAndSend: 'إرسال الطلب',
    submitting: 'جاري الإرسال...',
    caseNumber: 'رقم الملف',
    property: 'العقار',
    price: 'السعر',
    income: 'الدخل',
    seller: 'البائع',
    bankResult: 'نتيجة البنك',
    result: 'النتيجة',
    maxLoan: 'حد التمويل',
    interestRate: 'نسبة الفائدة',
    valuationReport: 'تقرير التثمين',
    appraisedValue: 'القيمة المثمنة',
    appraiser: 'المثمن',
    actions: 'الإجراءات',
    submitRequest: 'إرسال الطلب',
    sendToBank: 'إرسال للبنك',
    assignSeller: 'ربط البائع',
    selectSeller: 'اختر البائع',
    approve: 'اعتماد',
    conditionalApprove: 'اعتماد مشروط',
    reject: 'رفض',
    rejectionReason: 'سبب الرفض',
    submitBankResult: 'تسجيل نتيجة البنك',
    requestValuation: 'طلب التثمين',
    acceptValuation: 'قبول وبدء التثمين',
    valueOman: 'قيمة العقار (ر.ع)',
    reportNotes: 'ملاحظات التقرير',
    submitValuation: 'إرسال تقرير التثمين',
    completeDeal: 'إتمام الصفقة',
    cancelCase: 'إلغاء الملف',
    confirmCancel: 'هل أنت متأكد من إلغاء هذا الملف؟',
    timeline: 'سجل الملف',
    noEvents: 'لا توجد أحداث بعد',
    workflow: 'مسار العمل',
    approved: 'معتمد',
    rejected: 'مرفوض',
    conditional: 'مشروط',
  },
};

const LocaleContext = createContext<{
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
  isRtl: boolean;
} | null>(null);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en');

  useEffect(() => {
    const saved = window.localStorage.getItem('locale') as Locale | null;
    if (saved === 'en' || saved === 'ar') setLocaleState(saved);
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale === 'ar' ? 'ar-OM' : 'en';
    document.documentElement.dir = locale === 'ar' ? 'rtl' : 'ltr';
  }, [locale]);

  const value = useMemo(
    () => ({
      locale,
      isRtl: locale === 'ar',
      setLocale: (next: Locale) => {
        setLocaleState(next);
        window.localStorage.setItem('locale', next);
      },
      t: (key: string) => dictionaries[locale][key] ?? dictionaries.en[key] ?? key,
    }),
    [locale],
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) throw new Error('useLocale must be used within LocaleProvider');
  return context;
}

export function LanguageSwitcher() {
  const { locale, setLocale } = useLocale();

  return (
    <div className="inline-flex rounded-xl border border-white/10 bg-white/5 p-1 backdrop-blur-xl">
      {(['en', 'ar'] as Locale[]).map((item) => (
        <button
          key={item}
          onClick={() => setLocale(item)}
          className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
            locale === item
              ? 'bg-accent text-white shadow-glow'
              : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
          }`}
        >
          {item === 'en' ? 'EN' : 'عُمان'}
        </button>
      ))}
    </div>
  );
}

export function formatMoney(amount?: number, locale: Locale = 'en') {
  if (!amount) return '—';
  const value = amount / 1000;
  return new Intl.NumberFormat(locale === 'ar' ? 'ar-OM' : 'en-US', {
    style: 'currency',
    currency: 'OMR',
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatLocalizedDate(date: string, locale: Locale = 'en') {
  return new Intl.DateTimeFormat(locale === 'ar' ? 'ar-OM' : 'en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
}
