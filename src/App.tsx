import React, { useState, useEffect } from 'react';
import { BookOpen, Home as HomeIcon, Settings as SettingsIcon, BellRing } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { KhatmahPlan, Bookmark, AppSettings } from './types';
import Home from './components/Home';
import QuranReader from './components/QuranReader';
import Settings from './components/Settings';

const TOTAL_PAGES = 604;

const DEFAULT_SETTINGS: AppSettings = {
  theme: 'light',
  notificationsEnabled: false,
  notificationTimes: [],
};

export default function App() {
  const [plan, setPlan] = useState<KhatmahPlan | null>(null);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentTab, setCurrentTab] = useState<'home' | 'read' | 'settings'>('home');
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    const savedPlan = localStorage.getItem('khatmah_plan');
    const savedBookmarks = localStorage.getItem('khatmah_bookmarks');
    const savedSettings = localStorage.getItem('khatmah_settings');

    if (savedPlan) setPlan(JSON.parse(savedPlan));
    if (savedBookmarks) setBookmarks(JSON.parse(savedBookmarks));
    if (savedSettings) {
      const parsedSettings = JSON.parse(savedSettings);
      setSettings(parsedSettings);
      document.documentElement.className = `theme-${parsedSettings.theme}`;
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      if (plan) localStorage.setItem('khatmah_plan', JSON.stringify(plan));
      else localStorage.removeItem('khatmah_plan');
      
      localStorage.setItem('khatmah_bookmarks', JSON.stringify(bookmarks));
      localStorage.setItem('khatmah_settings', JSON.stringify(settings));
      document.documentElement.className = `theme-${settings.theme}`;
    }
  }, [plan, bookmarks, settings, isLoaded]);

  // Notification Checker
  useEffect(() => {
    if (!settings.notificationsEnabled || settings.notificationTimes.length === 0) return;

    const checkTime = () => {
      const now = new Date();
      const currentTimeString = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      
      if (settings.notificationTimes.includes(currentTimeString) && now.getSeconds() === 0) {
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 10000); // Hide after 10s
        
        // Try browser notification if permitted
        if ('Notification' in window && Notification.permission === 'granted') {
          new Notification('إقرأ - تذكير', {
            body: 'حان وقت قراءة وردك اليومي من القرآن الكريم.',
            icon: '/favicon.ico'
          });
        }
      }
    };

    const interval = setInterval(checkTime, 1000);
    return () => clearInterval(interval);
  }, [settings]);

  // Request notification permission
  useEffect(() => {
    if (settings.notificationsEnabled && 'Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, [settings.notificationsEnabled]);

  if (!isLoaded) return null;

  const handleStartPlan = (days: number) => {
    setPlan({
      startDate: new Date().toISOString(),
      targetDays: days,
      pagesRead: 0,
      history: [],
    });
  };

  const handleAddPages = (pages: number) => {
    setPlan(prev => {
      if (!prev) return prev;
      const newTotal = Math.min(prev.pagesRead + pages, TOTAL_PAGES);
      return {
        ...prev,
        pagesRead: newTotal,
        history: [
          { date: new Date().toISOString(), pages },
          ...prev.history,
        ],
      };
    });
  };

  const handlePageRead = (page: number) => {
    handleAddPages(1);
    setCurrentTab('home');
  };

  const handleAddBookmark = (bookmark: Bookmark) => {
    setBookmarks(prev => {
      const exists = prev.find(b => b.id === bookmark.id);
      if (exists) return prev.filter(b => b.id !== bookmark.id);
      return [bookmark, ...prev];
    });
  };

  const resetPlan = () => {
    if (window.confirm('هل أنت متأكد من رغبتك في مسح الختمة الحالية والبدء من جديد؟')) {
      setPlan(null);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-color)] text-[var(--text-main)] font-sans selection:bg-[var(--primary-light)]">
      <header className="bg-[var(--primary)] text-white shadow-lg sticky top-0 z-50 h-[72px]">
        <div className="max-w-md mx-auto px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
              <BookOpen className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">إقرأ</h1>
          </div>
          {plan && currentTab === 'home' && (
            <button 
              onClick={resetPlan} 
              className="text-sm font-medium text-[var(--primary-light)] hover:text-white hover:bg-white/10 px-3 py-1.5 rounded-lg transition-all"
            >
              ختمة جديدة
            </button>
          )}
        </div>
      </header>

      <main className="max-w-md mx-auto pb-24">
        {currentTab === 'home' && (
          <Home 
            plan={plan} 
            onStartPlan={handleStartPlan} 
            onResetPlan={resetPlan} 
            onAddPages={handleAddPages} 
            bookmarks={bookmarks}
            onRemoveBookmark={(id) => setBookmarks(prev => prev.filter(b => b.id !== id))}
          />
        )}
        {currentTab === 'read' && (
          <QuranReader 
            initialPage={plan ? plan.pagesRead + 1 : 1} 
            onPageRead={handlePageRead}
            onAddBookmark={handleAddBookmark}
            bookmarks={bookmarks}
          />
        )}
        {currentTab === 'settings' && (
          <Settings 
            settings={settings} 
            onUpdateSettings={setSettings} 
          />
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-[var(--card-bg)] border-t border-[var(--border-color)] pb-safe z-50 h-[72px]">
        <div className="max-w-md mx-auto flex justify-around p-3">
          <button
            onClick={() => setCurrentTab('home')}
            className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-colors ${
              currentTab === 'home' ? 'text-[var(--primary)]' : 'text-[var(--text-muted)] hover:bg-[var(--bg-color)]'
            }`}
          >
            <HomeIcon className={`w-6 h-6 ${currentTab === 'home' ? 'fill-current' : ''}`} />
            <span className="text-xs font-bold">الرئيسية</span>
          </button>
          <button
            onClick={() => setCurrentTab('read')}
            className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-colors ${
              currentTab === 'read' ? 'text-[var(--primary)]' : 'text-[var(--text-muted)] hover:bg-[var(--bg-color)]'
            }`}
          >
            <BookOpen className={`w-6 h-6 ${currentTab === 'read' ? 'fill-current' : ''}`} />
            <span className="text-xs font-bold">المصحف</span>
          </button>
          <button
            onClick={() => setCurrentTab('settings')}
            className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-colors ${
              currentTab === 'settings' ? 'text-[var(--primary)]' : 'text-[var(--text-muted)] hover:bg-[var(--bg-color)]'
            }`}
          >
            <SettingsIcon className={`w-6 h-6 ${currentTab === 'settings' ? 'fill-current' : ''}`} />
            <span className="text-xs font-bold">الإعدادات</span>
          </button>
        </div>
      </nav>

      {/* In-App Notification Toast */}
      <AnimatePresence>
        {showNotification && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-20 left-4 right-4 max-w-sm mx-auto z-50 bg-[var(--card-bg)] border-2 border-[var(--primary)] text-[var(--text-main)] p-4 rounded-2xl shadow-2xl flex items-start gap-4"
          >
            <div className="bg-[var(--primary-light)] p-3 rounded-full text-[var(--primary)]">
              <BellRing className="w-6 h-6 animate-bounce" />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-lg mb-1">حان وقت الورد!</h4>
              <p className="text-sm text-[var(--text-muted)]">
                لا تنسَ قراءة وردك اليومي من القرآن الكريم.
              </p>
            </div>
            <button 
              onClick={() => setShowNotification(false)}
              className="text-[var(--text-muted)] hover:text-[var(--text-main)]"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
