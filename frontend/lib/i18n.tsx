'use client';

import { createContext, ReactNode, useContext, useEffect, useMemo } from 'react';

type Dictionary = Record<string, string>;

const dictionary: Dictionary = {
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
  stepDealDesc: 'Parties are connected and the financed deal is finalized',
  heroCase: 'Case RE-2026-DEMO01',
  heroBankReview: 'Bank review in progress',
  heroLoanLimit: 'Approved loan limit',
  heroLoanAmount: '$640,000',
  heroValuation: 'Property valuation',
  heroPending: 'Pending',
  heroProgress: 'Case progress — 60%',
  heroApproved: 'Eligibility approved',
  heroApprovedBy: 'First National Bank — 2 min ago',
  authBadge: 'Smart real estate finance platform',
  authTitle: 'Own your property',
  authTitleHighlight: 'without the hassle',
  authDescription:
    'One workspace for buyer, seller, bank, and valuation team — from application to keys.',
  mainParties: 'Main parties',
  speed: 'Higher speed',
  transparency: 'Full transparency',
  welcome: 'Welcome back',
  welcomeSubtitle: 'Sign in to continue',
  email: 'Email',
  password: 'Password',
  signingIn: 'Signing in...',
  loginCta: 'Sign in',
  noAccount: "Don't have an account?",
  haveAccount: 'Already have an account?',
  register: 'Register',
  quickLogin: 'Quick login — demo accounts',
  createAccount: 'Create account',
  createAccountSubtitle: 'Join MulkPlus',
  fullName: 'Full name',
  phone: 'Phone number',
  role: 'Role',
  minPassword: 'At least 6 characters',
  creating: 'Creating...',
  buyerDashboard: 'Buyer dashboard',
  buyerDashboardSubtitle: 'Track your property purchase requests',
  newRequest: 'New request',
  newNotifications: 'New notifications',
  noBuyerCases: 'No requests yet',
  noBuyerCasesDesc: 'Create a new request to start your property purchase journey.',
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
  creditReviewSubtitle: 'Cases awaiting bank review',
  noBankCases: 'No cases awaiting review',
  sellerCases: 'Seller cases',
  sellerCasesSubtitle: 'Properties linked to your account',
  noSellerCases: 'No linked cases yet',
  noSellerCasesDesc: 'Once admin links a buyer case to you, it will appear here.',
  receivedAmount: 'Amount received',
  appraisalRequests: 'Valuation requests',
  appraisalSubtitle: 'Review and value properties',
  noAppraisals: 'No valuation requests awaiting you',
  newStatus: 'New',
  ongoingStatus: 'In progress',
  buyer: 'Buyer',
  back: 'Back',
  submitPropertyRequest: 'Submit property purchase request',
  submitPropertySubtitle: 'Enter property and financing details',
  propertyAddress: 'Property address',
  propertyType: 'Property type',
  apartment: 'Apartment',
  villa: 'Villa',
  land: 'Land',
  commercial: 'Commercial',
  area: 'Area (sqm)',
  askingPrice: 'Asking price (USD)',
  monthlyIncome: 'Monthly income (USD)',
  propertySource: 'Property source',
  externalProperty: 'Selected by buyer',
  platformProperty: 'Suggested by platform',
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
  propertyValue: 'Property value (USD)',
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
};

const LocaleContext = createContext<{ t: (key: string) => string } | null>(null);

export function LocaleProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    document.documentElement.lang = 'en';
    document.documentElement.dir = 'ltr';
  }, []);

  const value = useMemo(
    () => ({
      t: (key: string) => dictionary[key] ?? key,
    }),
    [],
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) throw new Error('useLocale must be used within LocaleProvider');
  return context;
}

export function formatMoney(amount?: number) {
  if (!amount) return '—';
  const value = amount / 1000;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatLocalizedDate(date: string) {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date));
}
