import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { Download, Smartphone, X } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const PWAInstallButton: React.FC<{ className?: string; variant?: 'button' | 'badge' }> = ({
  className = '',
  variant = 'button'
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const { t } = useShop();

  if (isInstalled) {
    return null;
  }

  if (isInstallable) {
    if (variant === 'badge') {
      return (
        <button
          onClick={install}
          className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-full bg-[#D9A441] text-[#550A24] hover:bg-[#ecc76e] transition shadow-sm ${className}`}
        >
          <Download className="w-3.5 h-3.5" />
          <span>{t('Install App', 'অ্যাপ ইন্সটল')}</span>
        </button>
      );
    }
    return (
      <button
        onClick={install}
        className={`flex items-center gap-2 rounded-lg bg-[#BE0750] px-3.5 py-1.5 text-xs font-medium text-white shadow hover:bg-[#7A1238] transition cursor-pointer ${className}`}
        title="Install Preyoshi Shop on your device"
      >
        <Smartphone className="w-4 h-4 text-[#D9A441]" />
        <span>{t('Install App', 'অ্যাপ ইন্সটল করুন')}</span>
      </button>
    );
  }

  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className={`flex items-center gap-1.5 rounded-lg border border-[#D9A441]/40 px-3 py-1.5 text-xs font-medium text-[#7A1238] hover:bg-[#F8E8E9] transition ${className}`}
        >
          <Smartphone className="w-3.5 h-3.5 text-[#BE0750]" />
          <span>{t('Install on iOS', 'আইফোনে ইন্সটল')}</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
            <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl border border-[#D9A441]/30">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#7A1238] flex items-center justify-center text-white font-bold text-xs">
                    P
                  </div>
                  <h3 className="text-base font-bold text-[#7A1238]">
                    {t('Install on iPhone / iPad', 'আইফোন / আইপ্যাডে ইন্সটল করুন')}
                  </h3>
                </div>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="p-1 text-stone-400 hover:text-stone-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-4 space-y-3 text-sm text-stone-700">
                <div className="flex items-start gap-3 p-2.5 rounded-xl bg-[#FFF9F2] border border-[#F8E8E9]">
                  <span className="w-6 h-6 rounded-full bg-[#7A1238] text-white flex items-center justify-center text-xs shrink-0 font-bold">
                    1
                  </span>
                  <p>
                    {t(
                      'Tap the Share button in the Safari bottom toolbar.',
                      'সাফারি ব্রাউজারের নিচের শেয়ার (Share) বাটনে ট্যাপ করুন।'
                    )}
                  </p>
                </div>
                <div className="flex items-start gap-3 p-2.5 rounded-xl bg-[#FFF9F2] border border-[#F8E8E9]">
                  <span className="w-6 h-6 rounded-full bg-[#7A1238] text-white flex items-center justify-center text-xs shrink-0 font-bold">
                    2
                  </span>
                  <p>
                    {t(
                      'Scroll down and select "Add to Home Screen".',
                      'নিচে স্ক্রল করে "Add to Home Screen" অপশনটি বেছে নিন।'
                    )}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-5 w-full rounded-xl bg-[#7A1238] py-2.5 text-sm font-semibold text-white hover:bg-[#550A24] transition shadow"
              >
                {t('Got It', 'বুঝেছি')}
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
