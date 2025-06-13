'use client';
import '../app/whatsapp/css/estilos.css';

import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function LoadingScreen() {
const [showLoader, setShowLoader] = useState(true);

useEffect(() => {
    const timeout = setTimeout(() => {
    setShowLoader(false);
    }, 8000);

    return () => clearTimeout(timeout);
}, []);

if (!showLoader) return null;

return (
    <main className="flex items-center justify-center w-full h-screen bg-gradient-italian animate-gradient">
    <div className="flex flex-col justify-center items-center text-center">
        {/* Logo centrado */}
        <Image
        src="/images/san_pietro_logo.png"
        alt="Logo San Pietro"
        width={250}
        height={250}
        className="mb-6 h-64 w-64 rounded-full shadow-xl animate__animated animate__fadeInLeft animate__pulse"
        />

        {/* Spinner debajo del logo */}
        <div className="mt-6">
        <div className="animate-spin border-t-4 border-white border-solid w-16 h-16 rounded-full mx-auto shadow-xl"></div>
        <p className="mt-4 text-white text-lg">Cargando tu panel, por favor espera...</p>
        </div>
    </div>
    </main>
);
}

