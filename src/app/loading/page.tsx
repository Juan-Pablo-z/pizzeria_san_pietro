'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { moduleRedirect } from '@/actions/auth-action';
import LoadingScreen from '@/components/LoadingScreen';

export default function CargandoPage() {
const router = useRouter();

useEffect(() => {
    const timer = setTimeout(async () => {
      await moduleRedirect(); // 
    }, 2000);

    return () => clearTimeout(timer);
}, [router]);

return <LoadingScreen />;
}
