import React from 'react';
import { BookOpen, Calendar, CheckCircle, Target, Trophy, Plus, History, Award, Share2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { KhatmahPlan } from '../types';

const TOTAL_PAGES = 604;

interface HomeProps {
  plan: KhatmahPlan | null;
  onStartPlan: (days: number) => void;
  onResetPlan: () => void;
  onAddPages: (pages: number) => void;
  bookmarks: import('../types').Bookmark[];
  onRemoveBookmark: (id: string) => void;
}

export default function Home({ plan, onStartPlan, onResetPlan, onAddPages, bookmarks, onRemoveBookmark }: HomeProps) {
  const [pagesInput, setPagesInput] = React.useState('');

  const handleStartPlan = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const days = parseInt(formData.get('days') as string, 10);
    onStartPlan(days);
  };

  const handleAddPages = () => {
    const pages = parseInt(pagesInput, 10);
    if (isNaN(pages) || pages <= 0) return;
    onAddPages(pages);
    setPagesInput('');
  };

  const calculateDailyTarget = () => {
    if (!plan) return 0;
    return Math.ceil(TOTAL_PAGES / plan.targetDays);
  };

  const calculateDaysPassed = () => {
    if (!plan) return 0;
    const start = new Date(plan.startDate).getTime();
    const now = new Date().getTime();
    return Math.floor((now - start) / (1000 * 60 * 60 * 24));
  };

  const isCompleted = plan && plan.pagesRead >= TOTAL_PAGES;
  const juzRead = plan ? Math.floor(plan.pagesRead / 20) : 0;
  const percentage = plan ? Math.round((plan.pagesRead / TOTAL_PAGES) * 100) : 0;

  const handleShare = async () => {
    if (!plan) return;
    const text = `لقد أتممت ${percentage}% من ختمة القرآن الكريم (قرأت ${juzRead} جزءاً). شاركني الأجر وابدأ ختمتك عبر تطبيق إقرأ!`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'ختمة القرآن',
          text: text,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing', err);
      }
    } else {
      navigator.clipboard.writeText(text + ' ' + window.location.href);
      alert('تم نسخ النص للمشاركة!');
    }
  };

  if (!plan) {
    return (
      <motion.div
        key="setup"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3 }}
        className="mt-8"
      >
        <div className="bg-[var(--card-bg)] rounded-3xl p-8 shadow-sm border border-[var(--border-color)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-[var(--primary-light)] rounded-full -mr-20 -mt-20 opacity-50" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-[var(--primary-light)] rounded-full -ml-16 -mb-16 opacity-50" />
          
          <div className="relative z-10">
            <div className="w-20 h-20 bg-[var(--primary-light)] text-[var(--primary)] rounded-2xl flex items-center justify-center mx-auto mb-6 transform rotate-3">
              <Target className="w-10 h-10 transform -rotate-3" />
            </div>
            <h2 className="text-3xl font-bold text-center mb-3 text-[var(--text-main)]">ابدأ ختمة جديدة</h2>
            <p className="text-[var(--text-muted)] text-center mb-8 text-base leading-relaxed">
              حدد المدة التي ترغب في إتمام الختمة خلالها، وسنقوم بحساب الورد اليومي لك لمساعدتك على الإنجاز.
            </p>

            <form onSubmit={handleStartPlan} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-[var(--text-main)] mb-2">
                  مدة الختمة (بالأيام)
                </label>
                <div className="relative">
                  <select
                    name="days"
                    defaultValue="30"
                    className="w-full appearance-none bg-[var(--bg-color)] border border-[var(--border-color)] rounded-2xl px-5 py-4 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all"
                  >
                    <option value="15">15 يوم (جزئين يومياً)</option>
                    <option value="30">30 يوم (جزء يومياً)</option>
                    <option value="60">60 يوم (نصف جزء يومياً)</option>
                    <option value="90">90 يوم (ربع جزء يومياً)</option>
                  </select>
                  <div className="absolute inset-y-0 left-0 flex items-center px-4 pointer-events-none">
                    <svg className="w-5 h-5 text-[var(--text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-[var(--primary)] text-white rounded-2xl py-4 text-lg font-bold hover:bg-[var(--primary-hover)] active:scale-[0.98] transition-all shadow-md"
              >
                توكلت على الله
              </button>
            </form>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      key="dashboard"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6 mt-2 pb-24"
    >
      {isCompleted ? (
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-gradient-to-br from-[var(--primary)] to-[var(--primary-hover)] rounded-3xl p-8 text-white text-center shadow-lg relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] opacity-10 mix-blend-overlay"></div>
          <div className="relative z-10">
            <div className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-6">
              <Award className="w-12 h-12 text-yellow-300" />
            </div>
            <h2 className="text-3xl font-bold mb-2">مبارك لك!</h2>
            <p className="text-white/90 text-lg mb-6">
              لقد أتممت ختمة القرآن الكريم بنجاح. تقبل الله طاعتك.
            </p>
            <button
              onClick={onResetPlan}
              className="bg-white text-[var(--primary)] px-8 py-3 rounded-xl font-bold hover:bg-white/90 transition-colors"
            >
              ابدأ ختمة جديدة
            </button>
          </div>
        </motion.div>
      ) : (
        <>
          {/* Progress Card */}
          <div className="bg-[var(--card-bg)] rounded-3xl p-6 shadow-sm border border-[var(--border-color)] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--primary-light)] rounded-full -mr-16 -mt-16 opacity-50" />
            
            <div className="relative z-10 flex items-center justify-between mb-8">
              <div>
                <h3 className="text-xl font-bold text-[var(--text-main)] mb-1">نسبة الإنجاز</h3>
                <p className="text-sm font-medium text-[var(--text-muted)]">
                  {plan.pagesRead} من {TOTAL_PAGES} صفحة • {juzRead} أجزاء
                </p>
              </div>
              <div className="w-20 h-20 relative flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-[var(--border-color)]"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <motion.path
                    initial={{ strokeDasharray: "0, 100" }}
                    animate={{ strokeDasharray: `${percentage}, 100` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="text-[var(--primary)]"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <span className="absolute text-base font-bold text-[var(--primary-text)]">
                  {percentage}%
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[var(--bg-color)] rounded-2xl p-4 border border-[var(--border-color)]">
                <div className="text-sm font-medium text-[var(--text-muted)] mb-2 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-[var(--primary)]" />
                  الورد اليومي
                </div>
                <div className="text-2xl font-bold text-[var(--text-main)]">
                  {calculateDailyTarget()} <span className="text-sm font-medium text-[var(--text-muted)]">صفحة</span>
                </div>
              </div>
              <div className="bg-[var(--bg-color)] rounded-2xl p-4 border border-[var(--border-color)]">
                <div className="text-sm font-medium text-[var(--text-muted)] mb-2 flex items-center gap-1.5">
                  <Trophy className="w-4 h-4 text-amber-500" />
                  المتبقي
                </div>
                <div className="text-2xl font-bold text-[var(--text-main)]">
                  {TOTAL_PAGES - plan.pagesRead} <span className="text-sm font-medium text-[var(--text-muted)]">صفحة</span>
                </div>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-[var(--border-color)] flex justify-between items-center text-sm">
              <span className="text-[var(--text-muted)]">اليوم الحالي: <strong className="text-[var(--text-main)]">{calculateDaysPassed() + 1}</strong> من {plan.targetDays}</span>
              <button onClick={handleShare} className="flex items-center gap-1 text-[var(--primary)] hover:underline font-bold">
                <Share2 className="w-4 h-4" />
                مشاركة
              </button>
            </div>
          </div>

          {/* Add Progress */}
          <div className="bg-[var(--card-bg)] rounded-3xl p-6 shadow-sm border border-[var(--border-color)]">
            <h3 className="text-lg font-bold text-[var(--text-main)] mb-5 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-[var(--primary)]" />
              تسجيل قراءة جديدة
            </h3>
            <div className="flex gap-3">
              <input
                type="number"
                value={pagesInput}
                onChange={(e) => setPagesInput(e.target.value)}
                placeholder="عدد الصفحات..."
                className="flex-1 bg-[var(--bg-color)] border border-[var(--border-color)] rounded-2xl px-5 py-4 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all"
                min="1"
                max={TOTAL_PAGES - plan.pagesRead}
              />
              <button
                onClick={handleAddPages}
                disabled={!pagesInput || parseInt(pagesInput) <= 0}
                className="bg-[var(--primary)] text-white px-6 rounded-2xl font-bold hover:bg-[var(--primary-hover)] active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 flex items-center justify-center shadow-sm"
              >
                <Plus className="w-6 h-6" />
              </button>
            </div>
            
            {/* Quick Add Buttons */}
            <div className="flex gap-3 mt-4">
              {[5, 10, 20].map(num => (
                <button
                  key={num}
                  onClick={() => {
                    setPagesInput(num.toString());
                  }}
                  className="flex-1 bg-[var(--primary-light)] text-[var(--primary-text)] py-3 rounded-xl text-sm font-bold hover:opacity-80 active:scale-95 transition-all"
                >
                  +{num}
                </button>
              ))}
            </div>
          </div>

          {/* History */}
          {plan.history.length > 0 && (
            <div className="bg-[var(--card-bg)] rounded-3xl p-6 shadow-sm border border-[var(--border-color)]">
              <h3 className="text-lg font-bold text-[var(--text-main)] mb-5 flex items-center gap-2">
                <History className="w-5 h-5 text-[var(--text-muted)]" />
                سجل القراءة
              </h3>
              <div className="space-y-3">
                {plan.history.slice(0, 5).map((record, idx) => (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    key={idx} 
                    className="flex items-center justify-between p-3 rounded-2xl hover:bg-[var(--bg-color)] transition-colors"
                  >
                    <div className="text-sm font-medium text-[var(--text-muted)]">
                      {new Date(record.date).toLocaleDateString('ar-SA', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </div>
                    <div className="font-bold text-[var(--primary-text)] bg-[var(--primary-light)] px-4 py-1.5 rounded-full text-sm">
                      +{record.pages} صفحة
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Bookmarks */}
          {bookmarks.length > 0 && (
            <div className="bg-[var(--card-bg)] rounded-3xl p-6 shadow-sm border border-[var(--border-color)]">
              <h3 className="text-lg font-bold text-[var(--text-main)] mb-5 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[var(--primary)]" />
                العلامات المرجعية
              </h3>
              <div className="space-y-3">
                {bookmarks.map((bookmark) => (
                  <div key={bookmark.id} className="p-4 rounded-2xl bg-[var(--bg-color)] border border-[var(--border-color)]">
                    <div className="flex justify-between items-start mb-2">
                      <div className="font-bold text-[var(--primary)] text-sm">
                        {bookmark.surahName} • آية {bookmark.ayahNumber}
                      </div>
                      <button 
                        onClick={() => onRemoveBookmark(bookmark.id)}
                        className="text-red-500 hover:text-red-600 text-sm"
                      >
                        حذف
                      </button>
                    </div>
                    <p className="text-[var(--text-main)] text-sm leading-relaxed font-quran">
                      {bookmark.text}
                    </p>
                    <div className="mt-2 text-xs text-[var(--text-muted)]">
                      صفحة {bookmark.page}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="text-center mt-12 mb-4 text-sm text-[var(--text-muted)] font-bold">
            صنعها عمر كسرى العلي
          </div>
        </>
      )}
    </motion.div>
  );
}
