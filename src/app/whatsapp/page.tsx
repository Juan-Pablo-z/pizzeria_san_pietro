'use client';
import { useRouter } from "next/navigation";
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

import './css/estilos.css'; 
export default function WhatsAppRedirect() {
  const [isLoading, setIsLoading] = useState(true);
  const searchParams = useSearchParams();
  const number = searchParams.get('number');
  const text = searchParams.get('text');

  useEffect(() => {
    if (!number || !text) return;

    const redirectURL = `https://wa.me/${number}?text=${text}`;
    const timer = setTimeout(() => {
      setIsLoading(false); // Cambia el estado a falso para que se vea el contenido
      window.location.href = redirectURL;
    }, 5000); // tiempo de espera de 5 segundos

    return () => clearTimeout(timer);
  }, [number, text]);

  return (
    <main className="flex items-center justify-center w-full h-screen bg-gradient-italian animate-gradient">
      <div className="flex flex-col justify-center items-center text-center">
        {/* Logo centrado */}
        <Link href="/" className="animate__animated animate__fadeInLeft animate__pulse">
          <Image
            src="/images/san_pietro_logo.png"
            alt="Logo san pietro"
            width={250}
            height={250}
            className="mb-6 h-64 w-64 rounded-full shadow-xl"
          />
        </Link>

        {/* Spinner debajo del logo */}
        {isLoading && (
          <div className="mt-6">
            <div className="animate-spin border-t-4 border-white border-solid w-16 h-16 rounded-full mx-auto shadow-xl"></div>
            <p className="mt-4 text-white">Por favor espera un momento...</p>
          </div>
        )}

        {/* Redirección y mensaje */}
        {!isLoading && (
          <p className="text-white mt-4">
            Si no eres redirigido automáticamente,{" "}
            <a
              href={`https://wa.me/${number}?text=${text}`}
              className="text-black-600 underline"
            >
              haz clic aquí
            </a>{" "}
            o{" "}
            <a
              href={`https://wa.me/${number}?text=${text}`}
              className="bg-black-500 text-white px-4 py-2 rounded-full hover:bg-black-600 transition-all"
            >
              Iniciar conversación
            </a>.
          </p>
        )}
      </div>
    </main>
  );
}

