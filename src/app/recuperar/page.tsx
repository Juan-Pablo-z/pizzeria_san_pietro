'use client';

import { useState } from 'react';
import { toast } from 'react-toastify';
import Image from 'next/image';
import { recuperarContrasena } from '@/actions/contraseña-actions';

export default function PasswordRecoveryPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [enviado, setEnviado] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await recuperarContrasena(email);

      if (res?.error) {
        toast.error('⚠️ ' + res.error);
      } else {
        setEnviado(true);
        toast.success('📩 Revisa tu correo para continuar');
      }
    } catch (error) {
      toast.error('❌ Error al enviar el correo');
    }

    setLoading(false);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4">
      {/* Fondo animado local al componente */}
      <div className="animated-bg" />

      <form
        onSubmit={handleSubmit}
        className="relative z-10 bg-white shadow-2xl rounded-2xl p-8 max-w-lg w-full space-y-6"
      >
        <div className="flex flex-col items-center">
          <Image
            src="/images/san_pietro_logo.png"
            alt="Logo San Pietro"
            width={120}
            height={120}
            className="rounded-full mb-4"
          />
          <h2 className="text-2xl font-extrabold text-gray-800">
            Recuperar Contraseña
          </h2>
          <p className="text-sm text-gray-500">
            Ingresa tu correo electrónico registrado
          </p>
        </div>

        {!enviado ? (
          <>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Correo electrónico
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="ejemplo@correo.com"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
            >
              {loading ? 'Enviando...' : 'Enviar correo de recuperación'}
            </button>
          </>
        ) : (
          <div className="text-center">
            <p className="text-green-700 font-medium">
              ✅ Correo enviado correctamente. Revisa tu bandeja de entrada.
            </p>
          </div>
        )}
      </form>
    </div>
  );
}
