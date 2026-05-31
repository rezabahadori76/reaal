import { PrismaClient, UserRole, CaseStatus, BankCheckResult, AppraisalStatus } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  const passwordHash = await bcrypt.hash('123456', 10);

  const users = await Promise.all([
    prisma.user.upsert({
      where: { email: 'admin@platform.ir' },
      update: {},
      create: {
        email: 'admin@platform.ir',
        passwordHash,
        fullName: 'مدیر سیستم',
        phone: '09120000001',
        role: UserRole.ADMIN,
      },
    }),
    prisma.user.upsert({
      where: { email: 'buyer@demo.ir' },
      update: {},
      create: {
        email: 'buyer@demo.ir',
        passwordHash,
        fullName: 'علی رضایی',
        phone: '09121234567',
        nationalId: '0012345678',
        role: UserRole.BUYER,
      },
    }),
    prisma.user.upsert({
      where: { email: 'seller@demo.ir' },
      update: {},
      create: {
        email: 'seller@demo.ir',
        passwordHash,
        fullName: 'محمد کریمی',
        phone: '09129876543',
        role: UserRole.SELLER,
      },
    }),
    prisma.user.upsert({
      where: { email: 'bank@demo.ir' },
      update: {},
      create: {
        email: 'bank@demo.ir',
        passwordHash,
        fullName: 'کارشناس بانک ملت',
        phone: '02188776655',
        role: UserRole.BANK_OPS,
      },
    }),
    prisma.user.upsert({
      where: { email: 'appraiser@demo.ir' },
      update: {},
      create: {
        email: 'appraiser@demo.ir',
        passwordHash,
        fullName: 'شرکت تثمین — ارزیاب',
        phone: '02144556677',
        role: UserRole.APPRAISER,
      },
    }),
  ]);

  const [admin, buyer, seller, bankOps, appraiser] = users;

  const demoCase = await prisma.case.upsert({
    where: { caseNumber: 'RE-2026-DEMO01' },
    update: {},
    create: {
      caseNumber: 'RE-2026-DEMO01',
      status: CaseStatus.BANK_REVIEW,
      buyerId: buyer.id,
      sellerId: seller.id,
      propertyAddress: 'تهران، سعادت‌آباد، میدان کاج، پلاک ۱۲',
      propertyType: 'آپارتمان',
      propertyArea: 120,
      propertySource: 'PLATFORM',
      askingPrice: 8_000_000_000,
      buyerIncome: 80_000_000,
      buyerNotes: 'خرید اول — نیاز به وام ۷۰٪',
    },
  });

  await prisma.bankCreditCheck.upsert({
    where: { caseId: demoCase.id },
    update: {},
    create: { caseId: demoCase.id, result: BankCheckResult.PENDING },
  });

  const events = [
    {
      caseId: demoCase.id,
      userId: buyer.id,
      eventType: 'CASE_CREATED',
      toStatus: CaseStatus.DRAFT,
      message: 'پرونده ایجاد شد',
    },
    {
      caseId: demoCase.id,
      userId: buyer.id,
      eventType: 'STATUS_CHANGE',
      fromStatus: CaseStatus.DRAFT,
      toStatus: CaseStatus.SUBMITTED,
      message: 'درخواست ارسال شد',
    },
    {
      caseId: demoCase.id,
      userId: admin.id,
      eventType: 'STATUS_CHANGE',
      fromStatus: CaseStatus.SUBMITTED,
      toStatus: CaseStatus.BANK_REVIEW,
      message: 'ارجاع به بانک',
    },
  ];

  for (const event of events) {
    await prisma.caseEvent.create({ data: event });
  }

  const notifications = [
    {
      userId: bankOps.id,
      title: 'پرونده جدید',
      message: `پرونده ${demoCase.caseNumber} برای بررسی آماده است`,
      caseId: demoCase.id,
    },
    {
      userId: buyer.id,
      title: 'ارجاع به بانک',
      message: 'پرونده شما برای اعتبارسنجی به بانک ارسال شد',
      caseId: demoCase.id,
    },
  ];

  for (const notification of notifications) {
    await prisma.notification.create({ data: notification });
  }

  console.log('\n✅ Seed completed!\n');
  console.log('Demo accounts (password: 123456):');
  console.log('  Admin:     admin@platform.ir');
  console.log('  Buyer:     buyer@demo.ir');
  console.log('  Seller:    seller@demo.ir');
  console.log('  Bank:      bank@demo.ir');
  console.log('  Appraiser: appraiser@demo.ir');
  console.log(`\nDemo case: ${demoCase.caseNumber} (status: BANK_REVIEW)\n`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
