import { useState, useEffect } from 'react';

/**
 * Hook kustom untuk menunda unmounting komponen sehingga animasi keluar bisa selesai.
 * * @param isMounted Status mount komponen (true jika harus tampil, false jika harus hilang)
 * @param delayTime Waktu tunda dalam milidetik (sesuaikan dengan durasi animasi CSS Anda)
 * @returns boolean yang menentukan apakah komponen harus benar-benar di-render di DOM
 */
export function useDelayUnmount(isMounted: boolean, delayTime: number) {
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    
    // Jika isMounted berubah menjadi true dan belum dirender, render segera
    if (isMounted && !shouldRender) {
      setShouldRender(true);
    } 
    // Jika isMounted berubah menjadi false dan masih dirender, tunda unmount
    else if (!isMounted && shouldRender) {
      timeoutId = setTimeout(() => setShouldRender(false), delayTime);
    }
    
    // Bersihkan timeout jika komponen tiba-tiba isMounted lagi sebelum timeout selesai
    return () => clearTimeout(timeoutId);
  }, [isMounted, delayTime, shouldRender]);

  return shouldRender;
}