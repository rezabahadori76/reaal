import Link from 'next/link';

const STEPS = [
  { num: '۱', title: 'ثبت درخواست', desc: 'خریدار اطلاعات اولیه و ملک مورد نظر را ثبت می‌کند', icon: '📝' },
  { num: '۲', title: 'اعتبارسنجی بانک', desc: 'بانک شرایط متقاضی را بررسی و نتیجه اولیه را اعلام می‌کند', icon: '🏦' },
  { num: '۳', title: 'ارزیابی ملک', desc: 'شرکت تثمین گزارش رسمی ارزش ملک را تهیه می‌کند', icon: '📋' },
  { num: '۴', title: 'نهایی‌سازی معامله', desc: 'اتصال خریدار و فروشنده و تکمیل فرآیند پرداخت', icon: '🤝' },
];

const ACTORS = [
  { role: 'خریدار', desc: 'متقاضی خرید ملک و دریافت وام', color: 'bg-blue-50 border-blue-200' },
  { role: 'فروشنده', desc: 'مالک ملک و دریافت‌کننده وجه', color: 'bg-emerald-50 border-emerald-200' },
  { role: 'بانک', desc: 'ارائه‌دهنده تسهیلات مسکن', color: 'bg-amber-50 border-amber-200' },
  { role: 'ارزیاب (تثمین)', desc: 'ارزش‌گذاری رسمی ملک', color: 'bg-purple-50 border-purple-200' },
];

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <header className="bg-brand-900 text-white">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">پلتفرم ملک</h1>
            <p className="text-brand-300 text-sm">تأمین مالی یکپارچه خرید مسکن</p>
          </div>
          <div className="flex gap-3">
            <Link href="/login" className="btn-secondary text-sm">ورود</Link>
            <Link href="/register" className="btn-primary text-sm">ثبت‌نام</Link>
          </div>
        </div>
      </header>

      <section className="bg-gradient-to-b from-brand-900 to-brand-700 text-white py-20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold leading-tight">
            خرید ملک با وام بانکی،
            <br />
            <span className="text-brand-200">ساده و شفاف</span>
          </h2>
          <p className="text-brand-200 mt-4 max-w-2xl mx-auto text-lg">
            پلتفرمی که خریدار، فروشنده، بانک و شرکت ارزیابی را در یک فرآیند یکپارچه
            به هم متصل می‌کند — از ثبت درخواست تا تکمیل معامله.
          </p>
          <div className="mt-8 flex gap-4 justify-center">
            <Link href="/login" className="btn-primary px-8 py-3 text-base">
              شروع کنید
            </Link>
            <Link href="#process" className="btn bg-white/10 text-white hover:bg-white/20 px-8 py-3 text-base">
              نحوه کار
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-16">
        <h3 className="text-2xl font-bold text-center mb-10">بازیگران اصلی</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {ACTORS.map((a) => (
            <div key={a.role} className={`card p-5 border ${a.color}`}>
              <h4 className="font-bold text-lg">{a.role}</h4>
              <p className="text-sm text-slate-600 mt-2">{a.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="process" className="bg-slate-100 py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h3 className="text-2xl font-bold text-center mb-10">فرآیند خرید ملک</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {STEPS.map((step) => (
              <div key={step.num} className="card p-6 text-center">
                <span className="text-3xl">{step.icon}</span>
                <div className="w-8 h-8 rounded-full bg-brand-600 text-white flex items-center justify-center text-sm font-bold mx-auto mt-3">
                  {step.num}
                </div>
                <h4 className="font-bold mt-3">{step.title}</h4>
                <p className="text-sm text-slate-500 mt-2">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="card p-8 bg-brand-50 border-brand-200 text-center">
          <h3 className="text-xl font-bold">آماده دمو هستید؟</h3>
          <p className="text-slate-600 mt-2">
            با حساب‌های آزمایشی وارد شوید و کل فرآیند را از دید هر نقش تجربه کنید.
          </p>
          <p className="text-sm text-slate-500 mt-3 font-mono">رمز عبور همه حساب‌ها: 123456</p>
          <Link href="/login" className="btn-primary mt-4 inline-flex">ورود به دمو</Link>
        </div>
      </section>

      <footer className="border-t py-8 text-center text-sm text-slate-400">
        پلتفرم یکپارچه تأمین مالی و خرید ملک — نسخه MVP
      </footer>
    </div>
  );
}
