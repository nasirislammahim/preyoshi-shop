import React from 'react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';
import { WifiOff } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();
  const { t } = useShop();

  if (isOnline) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:right-auto sm:max-w-md z-50 flex items-center gap-3 rounded-xl bg-[#7A1238] border border-[#D9A441] px-4 py-3 text-xs sm:text-sm font-medium text-white shadow-2xl animate-bounce-subtle">
      <div className="p-2 rounded-full bg-[#BE0750] text-[#D9A441] shrink-0">
        <WifiOff className="w-4 h-4" />
      </div>
      <div>
        <p className="font-semibold text-[#D9A441]">
          {t('Offline Mode', 'ইন্টারনেট সংযোগ নেই')}
        </p>
        <p className="text-stone-200 text-xs">
          {t(
            'Browsing cached catalog. Reconnect to place orders.',
            'ক্যাশ করা ক্যাটালগ ব্রাউজ করছেন। অর্ডার নিশ্চিত করতে সংযোগ দিন।'
          )}
        </p>
      </div>
    </div>
  );
};
