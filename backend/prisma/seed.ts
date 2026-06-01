import { PrismaClient, UserRole, CaseStatus, BankCheckResult } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Reset demo data for a clean English-only dataset
  await prisma.notification.deleteMany();
  await prisma.caseEvent.deleteMany();
  await prisma.document.deleteMany();
  await prisma.appraisalRequest.deleteMany();
  await prisma.bankCreditCheck.deleteMany();
  await prisma.case.deleteMany();
  await prisma.user.deleteMany();

  const passwordHash = await bcrypt.hash('123456', 10);

  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: 'admin@platform.com',
        passwordHash,
        fullName: 'System Admin',
        phone: '+1 512 555 0001',
        role: UserRole.ADMIN,
      },
    }),
    prisma.user.create({
      data: {
        email: 'buyer@demo.com',
        passwordHash,
        fullName: 'James Mitchell',
        phone: '+1 512 555 1234',
        nationalId: '0012345678',
        role: UserRole.BUYER,
      },
    }),
    prisma.user.create({
      data: {
        email: 'seller@demo.com',
        passwordHash,
        fullName: 'Sarah Thompson',
        phone: '+1 512 555 5678',
        role: UserRole.SELLER,
      },
    }),
    prisma.user.create({
      data: {
        email: 'bank@demo.com',
        passwordHash,
        fullName: 'David Reynolds',
        phone: '+1 512 555 9012',
        role: UserRole.BANK_OPS,
      },
    }),
    prisma.user.create({
      data: {
        email: 'appraiser@demo.com',
        passwordHash,
        fullName: 'Premier Valuation LLC',
        phone: '+1 512 555 3456',
        role: UserRole.APPRAISER,
      },
    }),
  ]);

  const [admin, buyer, seller, bankOps] = users;

  const demoCase = await prisma.case.create({
    data: {
      caseNumber: 'RE-2026-DEMO01',
      status: CaseStatus.BANK_REVIEW,
      buyerId: buyer.id,
      sellerId: seller.id,
      propertyAddress: '742 Oak Street, Austin, TX 78701',
      propertyType: 'Apartment',
      propertyArea: 120,
      propertySource: 'PLATFORM',
      askingPrice: 8_000_000_000,
      buyerIncome: 80_000_000,
      buyerNotes: 'First-time buyer — requesting 70% mortgage financing',
    },
  });

  await prisma.bankCreditCheck.create({
    data: { caseId: demoCase.id, result: BankCheckResult.PENDING },
  });

  const events = [
    {
      caseId: demoCase.id,
      userId: buyer.id,
      eventType: 'CASE_CREATED',
      toStatus: CaseStatus.DRAFT,
      message: 'Case created',
    },
    {
      caseId: demoCase.id,
      userId: buyer.id,
      eventType: 'STATUS_CHANGE',
      fromStatus: CaseStatus.DRAFT,
      toStatus: CaseStatus.SUBMITTED,
      message: 'Request submitted by buyer',
    },
    {
      caseId: demoCase.id,
      userId: admin.id,
      eventType: 'STATUS_CHANGE',
      fromStatus: CaseStatus.SUBMITTED,
      toStatus: CaseStatus.BANK_REVIEW,
      message: 'Case sent to bank for credit review',
    },
  ];

  await prisma.caseEvent.createMany({ data: events });

  await prisma.notification.createMany({
    data: [
      {
        userId: bankOps.id,
        title: 'New case',
        message: `Case ${demoCase.caseNumber} is ready for credit review`,
        caseId: demoCase.id,
      },
      {
        userId: buyer.id,
        title: 'Sent to bank',
        message: 'Your case has been sent to the bank for credit review',
        caseId: demoCase.id,
      },
    ],
  });

  console.log('\n✅ Seed completed!\n');
  console.log('Demo accounts (password: 123456):');
  console.log('  Admin:     admin@platform.com');
  console.log('  Buyer:     buyer@demo.com');
  console.log('  Seller:    seller@demo.com');
  console.log('  Bank:      bank@demo.com');
  console.log('  Appraiser: appraiser@demo.com');
  console.log(`\nDemo case: ${demoCase.caseNumber} (status: BANK_REVIEW)\n`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
