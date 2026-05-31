# پلتفرم یکپارچه تأمین مالی و خرید ملک (MVP)

پلتفرمی برای ساده‌سازی فرآیند خرید ملک با تسهیلات بانکی — اتصال **خریدار**، **فروشنده**، **بانک** و **شرکت ارزیابی (تثمین)** در یک جریان کاری یکپارچه.

## ویژگی‌های MVP

- ثبت درخواست خریدار و پیگیری پرونده
- Mock اعتبارسنجی بانکی با محاسبه خودکار سقف وام
- ماژول ارزیابی و ارزش‌گذاری ملک
- اتصال خریدار و فروشنده
- داشبورد مدیریت با آمار و timeline
- پورتال جداگانه برای هر نقش (خریدار، فروشنده، بانک، ارزیاب، مدیر)
- اعلان‌های درون‌سیستمی
- رابط کاربری فارسی RTL

## Tech Stack

| لایه | فناوری |
|------|--------|
| Backend | NestJS + Prisma + PostgreSQL |
| Frontend | Next.js 14 + Tailwind CSS |
| Auth | JWT + RBAC |
| Database | SQLite (dev) / PostgreSQL (prod) |

## راه‌اندازی سریع

### پیش‌نیازها

- Node.js 18+
- npm

> PostgreSQL اختیاری است — در حالت dev از SQLite استفاده می‌شود. برای production می‌توانید `docker compose up -d` را اجرا کنید.

### نصب

```bash
# 1. کلون و نصب
npm run setup

# 2. کپی env
cp .env.example .env

# 3. Migration و Seed
cd backend
npx prisma migrate dev
npm run prisma:seed
cd ..

# 4. اجرا
npm run dev
```

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:3001/api

## حساب‌های دمو

رمز عبور همه: `123456`

| نقش | ایمیل |
|-----|-------|
| مدیر | admin@platform.ir |
| خریدار | buyer@demo.ir |
| فروشنده | seller@demo.ir |
| بانک | bank@demo.ir |
| ارزیاب | appraiser@demo.ir |

## سناریوی دمو

یک پرونده نمونه (`RE-2026-DEMO01`) از قبل seed شده و در وضعیت **بررسی بانک** است:

1. **بانک** (`bank@demo.ir`) → تأیید یا رد اعتبارسنجی
2. **مدیر** (`admin@platform.ir`) → درخواست ارزیابی
3. **ارزیاب** (`appraiser@demo.ir`) → پذیرش و ثبت گزارش ارزش
4. **مدیر** → تکمیل معامله
5. **خریدار/فروشنده** → مشاهده وضعیت نهایی

## جریان کاری

```
ثبت درخواست → اعتبارسنجی بانک → ارزیابی ملک → آماده معامله → تکمیل
```

## ساختار پروژه

```
├── backend/          # NestJS API
│   ├── prisma/       # Schema + Seed
│   └── src/
│       ├── auth/     # JWT Authentication
│       ├── cases/    # Case workflow
│       ├── bank/     # Mock bank adapter
│       ├── appraisal/
│       ├── notifications/
│       └── dashboard/
├── frontend/         # Next.js App
│   ├── app/
│   │   ├── admin/    # پنل مدیریت
│   │   ├── buyer/    # پورتال خریدار
│   │   ├── seller/   # پورتال فروشنده
│   │   ├── bank/     # پورتال بانک
│   │   └── appraiser/
│   └── components/
└── docker-compose.yml
```

## API Endpoints (خلاصه)

| Method | Path | توضیح |
|--------|------|-------|
| POST | /api/auth/login | ورود |
| POST | /api/auth/register | ثبت‌نام |
| GET | /api/cases | لیست پرونده‌ها |
| POST | /api/cases | ایجاد پرونده |
| POST | /api/cases/:id/submit | ارسال درخواست |
| POST | /api/cases/:id/send-to-bank | ارجاع به بانک |
| POST | /api/bank/cases/:id/review | بررسی اعتباری |
| POST | /api/appraisal/cases/:id/submit | ثبت گزارش ارزیابی |
| GET | /api/dashboard/stats | آمار مدیریت |

## مدل درآمد (آینده)

- کارمزد ارزیابی ملک
- سهم همکاری با بانک
- کارمزد فروشنده
- هزینه خدمات خریدار

---

نسخه MVP — آماده نمایش به سرمایه‌گذاران
