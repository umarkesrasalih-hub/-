import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, Bookmark as BookmarkIcon, CheckCircle, Loader2, List } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Bookmark, Ayah } from '../types';
import { SURAHS } from '../data/surahs';

interface QuranReaderProps {
  initialPage: number;
  onPageRead: (page: number) => void;
  onAddBookmark: (bookmark: Bookmark) => void;
  bookmarks: Bookmark[];
}

export default function QuranReader({ initialPage, onPageRead, onAddBookmark, bookmarks }: QuranReaderProps) {
  const [currentPage, setCurrentPage] = useState(initialPage || 1);
  const [ayahs, setAyahs] = useState<Ayah[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showIndex, setShowIndex] = useState(false);

  useEffect(() => {
    fetchPage(currentPage);
  }, [currentPage]);

  const fetchPage = async (page: number) => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`https://api.alquran.cloud/v1/page/${page}/quran-uthmani`);
      const data = await res.json();
      if (data.code === 200) {
        setAyahs(data.data.ayahs);
      } else {
        setError('حدث خطأ أثناء جلب الصفحة');
      }
    } catch (err) {
      setError('تأكد من اتصالك بالإنترنت');
    } finally {
      setLoading(false);
    }
  };

  const handleNextPage = () => {
    if (currentPage < 604) setCurrentPage(p => p + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(p => p - 1);
  };

  const handleBookmark = (ayah: Ayah) => {
    const newBookmark: Bookmark = {
      id: `${ayah.surah.number}-${ayah.numberInSurah}`,
      page: currentPage,
      ayahNumber: ayah.numberInSurah,
      surahName: ayah.surah.name,
      text: ayah.text,
      date: new Date().toISOString(),
    };
    onAddBookmark(newBookmark);
  };

  const isBookmarked = (ayah: Ayah) => {
    return bookmarks.some(b => b.id === `${ayah.surah.number}-${ayah.numberInSurah}`);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex items-center justify-between p-4 bg-[var(--card-bg)] border-b border-[var(--border-color)] sticky top-[72px] z-40">
        <button 
          onClick={handleNextPage} 
          disabled={currentPage === 604 || showIndex}
          className="p-2 rounded-full hover:bg-[var(--border-color)] disabled:opacity-50"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
        
        <button 
          onClick={() => setShowIndex(!showIndex)}
          className="text-center px-4 py-1 rounded-xl hover:bg-[var(--border-color)] transition-colors"
        >
          <div className="font-bold text-lg flex items-center justify-center gap-2">
            الصفحة {currentPage}
            <List className="w-4 h-4" />
          </div>
          {ayahs.length > 0 && !showIndex && (
            <div className="text-sm text-[var(--text-muted)]">
              الجزء {ayahs[0].juz} • {ayahs[0].surah.name}
            </div>
          )}
        </button>

        <button 
          onClick={handlePrevPage} 
          disabled={currentPage === 1 || showIndex}
          className="p-2 rounded-full hover:bg-[var(--border-color)] disabled:opacity-50"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      </div>

      {showIndex ? (
        <div className="flex-1 overflow-y-auto p-4 bg-[var(--bg-color)] pb-24">
          <h2 className="text-2xl font-bold mb-6 text-center text-[var(--primary)]">فهرس السور</h2>
          <div className="grid grid-cols-1 gap-3">
            {SURAHS.map(surah => (
              <button
                key={surah.id}
                onClick={() => {
                  setCurrentPage(surah.page);
                  setShowIndex(false);
                }}
                className="flex items-center justify-between p-4 bg-[var(--card-bg)] rounded-xl border border-[var(--border-color)] hover:border-[var(--primary)] transition-colors shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-[var(--primary-light)] text-[var(--primary)] flex items-center justify-center font-bold">
                    {surah.id}
                  </div>
                  <span className="font-bold text-lg">{surah.name}</span>
                </div>
                <span className="text-[var(--text-muted)] text-sm font-medium">صفحة {surah.page}</span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex-1 p-4 md:p-8 flex justify-center bg-[var(--bg-color)] pb-24">
          <div className="w-full max-w-2xl bg-[#fffdf7] dark:bg-[#1a202c] rounded-lg shadow-md border-2 border-[#e2d5b5] dark:border-[#2d3748] p-6 relative min-h-[60vh]">
            <div className="absolute inset-2 border border-[#e2d5b5] dark:border-[#2d3748] pointer-events-none rounded"></div>
            
            {loading ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-[var(--primary)]" />
              </div>
            ) : error ? (
              <div className="absolute inset-0 flex items-center justify-center text-red-500">
                {error}
              </div>
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentPage}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="relative z-10 text-justify quran-text text-2xl md:text-3xl"
                  style={{ direction: 'rtl', textAlignLast: 'center' }}
                >
                  {ayahs.map((ayah, index) => {
                    const showSurahHeader = index === 0 || ayah.surah.number !== ayahs[index - 1].surah.number;
                    const showBismillah = showSurahHeader && ayah.surah.number !== 1 && ayah.surah.number !== 9;
                    
                    let text = ayah.text;
                    if (showBismillah && text.includes('بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ')) {
                      text = text.replace('بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ', '').trim();
                    }

                    return (
                      <React.Fragment key={ayah.number}>
                        {showSurahHeader && (
                          <div className="my-8 py-4 bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] bg-[var(--primary-light)] rounded-xl text-center font-bold text-2xl text-[var(--primary-text)] border-2 border-[var(--primary)]">
                            سورة {ayah.surah.name}
                          </div>
                        )}
                        {showBismillah && (
                          <div className="my-6 text-center text-2xl font-bold text-[var(--text-main)]">
                            بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
                          </div>
                        )}
                        <span 
                          className={`relative inline mx-1 group cursor-pointer rounded px-1 transition-colors leading-[2.5] ${isBookmarked(ayah) ? 'bg-[var(--primary-light)]' : 'hover:bg-[var(--border-color)]'}`}
                          onClick={() => handleBookmark(ayah)}
                        >
                          {text}
                          <span className="inline-flex items-center justify-center w-8 h-8 mx-1 text-sm bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] border border-[var(--primary)] rounded-full text-[var(--primary)] font-sans">
                            {ayah.numberInSurah}
                          </span>
                          {isBookmarked(ayah) && (
                            <BookmarkIcon className="absolute -top-4 left-1/2 -translate-x-1/2 w-6 h-6 text-[var(--primary)] fill-current drop-shadow-md" />
                          )}
                        </span>
                      </React.Fragment>
                    );
                  })}
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        </div>
      )}

      {!showIndex && (
        <div className="p-4 bg-[var(--card-bg)] border-t border-[var(--border-color)] sticky bottom-[72px] z-40 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
          <button
            onClick={() => onPageRead(currentPage)}
            className="w-full py-4 rounded-2xl font-bold text-white bg-[var(--primary)] hover:bg-[var(--primary-hover)] transition-colors flex items-center justify-center gap-2 shadow-lg"
          >
            <CheckCircle className="w-6 h-6" />
            أنهيت قراءة هذه الصفحة
          </button>
        </div>
      )}
    </div>
  );
}
