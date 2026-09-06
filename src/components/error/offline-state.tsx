// =============================================================================
// Happy Store — Offline State Banner
// Shows an inline banner when the network goes offline.
// =============================================================================

import { useState, useEffect } from "react";
import { WifiOff } from "lucide-react";

export function OfflineState() {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const goOffline = () => setIsOffline(true);
    const goOnline = () => setIsOffline(false);
    window.addEventListener("offline", goOffline);
    window.addEventListener("online", goOnline);
    return () => {
      window.removeEventListener("offline", goOffline);
      window.removeEventListener("online", goOnline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-50 flex items-center justify-center gap-2 bg-warning px-4 py-2.5 text-foreground-on-accent">
      <WifiOff size={16} />
      <span className="text-label font-medium">
        You're offline. Some features may not be available.
      </span>
    </div>
  );
}
