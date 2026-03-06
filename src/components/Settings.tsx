import React, { useState } from 'react';
import { Settings as SettingsIcon, Moon, Sun, Coffee, Bell, Clock, Trash2 } from 'lucide-react';
import { AppSettings } from '../types';

interface SettingsProps {
  settings: AppSettings;
  onUpdateSettings: (settings: AppSettings) => void;
}

export default function Settings({ settings, onUpdateSettings }: SettingsProps) {
  const [newTime, setNewTime] = useState('');

  const handleThemeChange = (theme: AppSettings['theme']) => {
    onUpdateSettings({ ...settings, theme });
  };

  const toggleNotifications = () => {
    onUpdateSettings({ ...settings, notificationsEnabled: !settings.notificationsEnabled });
  };

  const addTime = () => {
    if (newTime && !settings.notificationTimes.includes(newTime)) {
      onUpdateSettings({
        ...settings,
        notificationTimes: [...settings.notificationTimes, newTime].sort()
      });
      setNewTime('');
    }
  };

  const removeTime = (timeToRemove: string) => {
    onUpdateSettings({
      ...settings,
      notificationTimes: settings.notificationTimes.filter(t => t !== timeToRemove)
    });
  };

  return (
    <div className="space-y-6 p-5 pb-24">
      <div className="bg-[var(--card-bg)] rounded-3xl p-6 shadow-sm border border-[var(--border-color)]">
        <h3 className="text-xl font-bold text-[var(--text-main)] mb-6 flex items-center gap-2">
          <SettingsIcon className="w-6 h-6 text-[var(--primary)]" />
          المظهر
        </h3>
        
        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={() => handleThemeChange('light')}
            className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${
              settings.theme === 'light' ? 'border-[var(--primary)] bg-[var(--primary-light)]' : 'border-[var(--border-color)] hover:border-[var(--primary)]'
            }`}
          >
            <Sun className={`w-8 h-8 ${settings.theme === 'light' ? 'text-[var(--primary)]' : 'text-[var(--text-muted)]'}`} />
            <span className="font-bold text-sm">فاتح</span>
          </button>
          
          <button
            onClick={() => handleThemeChange('dark')}
            className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${
              settings.theme === 'dark' ? 'border-[var(--primary)] bg-[var(--primary-light)]' : 'border-[var(--border-color)] hover:border-[var(--primary)]'
            }`}
          >
            <Moon className={`w-8 h-8 ${settings.theme === 'dark' ? 'text-[var(--primary)]' : 'text-[var(--text-muted)]'}`} />
            <span className="font-bold text-sm">داكن</span>
          </button>
          
          <button
            onClick={() => handleThemeChange('sepia')}
            className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${
              settings.theme === 'sepia' ? 'border-[var(--primary)] bg-[var(--primary-light)]' : 'border-[var(--border-color)] hover:border-[var(--primary)]'
            }`}
          >
            <Coffee className={`w-8 h-8 ${settings.theme === 'sepia' ? 'text-[var(--primary)]' : 'text-[var(--text-muted)]'}`} />
            <span className="font-bold text-sm">دافئ</span>
          </button>
        </div>
      </div>

      <div className="bg-[var(--card-bg)] rounded-3xl p-6 shadow-sm border border-[var(--border-color)]">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-[var(--text-main)] flex items-center gap-2">
            <Bell className="w-6 h-6 text-[var(--primary)]" />
            الإشعارات والتذكير
          </h3>
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              className="sr-only peer" 
              checked={settings.notificationsEnabled}
              onChange={toggleNotifications}
            />
            <div className="w-11 h-6 bg-[var(--border-color)] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[var(--primary)]"></div>
          </label>
        </div>

        {settings.notificationsEnabled && (
          <div className="space-y-4 animate-in fade-in slide-in-from-top-4">
            <p className="text-sm text-[var(--text-muted)]">
              أضف أوقاتاً لتذكيرك بقراءة الورد اليومي (مثلاً: بعد الفجر، قبل النوم).
            </p>
            
            <div className="flex gap-2">
              <input
                type="time"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                className="flex-1 bg-[var(--bg-color)] border border-[var(--border-color)] rounded-xl px-4 py-3 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-[var(--primary)]"
              />
              <button
                onClick={addTime}
                disabled={!newTime}
                className="bg-[var(--primary)] text-white px-6 rounded-xl font-bold hover:bg-[var(--primary-hover)] disabled:opacity-50 transition-colors"
              >
                إضافة
              </button>
            </div>

            <div className="space-y-2 mt-4">
              {settings.notificationTimes.length === 0 ? (
                <div className="text-center text-[var(--text-muted)] py-4 text-sm">
                  لم تقم بإضافة أي أوقات للتذكير بعد.
                </div>
              ) : (
                settings.notificationTimes.map((time) => (
                  <div key={time} className="flex items-center justify-between bg-[var(--bg-color)] p-3 rounded-xl border border-[var(--border-color)]">
                    <div className="flex items-center gap-2 font-bold text-lg">
                      <Clock className="w-5 h-5 text-[var(--primary)]" />
                      {time}
                    </div>
                    <button
                      onClick={() => removeTime(time)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
