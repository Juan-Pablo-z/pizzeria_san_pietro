'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import { Input, Button, Card, CardBody } from '@nextui-org/react';
import { toast } from 'react-toastify';
import Image from 'next/image';
import Link from 'next/link';
import { verificarToken, actualizarContrasena } from '@/actions/contraseña-actions';

function NuevaClaveFormInner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  const [valid, setValid] = useState<boolean | null>(null);
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      setValid(false);
      return;
    }

    const verify = async () => {
      try {
        const res = await verificarToken(token);
        setValid(res.valid);
      } catch {
        setValid(false);
      }
    };

    verify();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password || password.length < 6) {
      return toast.error('La contraseña debe tener al menos 6 caracteres');
    }

    if (password !== confirm) {
      return toast.error('Las contraseñas no coinciden');
    }

    setLoading(true);
    try {
      const res = await actualizarContrasena(token!, password);

      if (!res.success) {
        throw new Error(res.error || 'Error al actualizar');
      }

      toast.success('✅ Contraseña actualizada con éxito');
      router.push('/iniciar-sesion');
    } catch (err: any) {
      toast.error(err.message || 'Error interno');
    } finally {
      setLoading(false);
    }
  };

  if (valid === null) {
    return (
      <div className="relative min-h-screen flex items-center justify-center">
        <div className="animated-bg" />
        <div className="relative z-10 flex flex-col items-center text-white">
          <Link href="/" className="animate__animated animate__fadeInLeft animate__pulse">
            <Image
              src="/images/san_pietro_logo.png"
              alt="Logo San Pietro"
              width={250}
              height={250}
              className="mb-6 h-64 w-64 rounded-full shadow-xl"
            />
          </Link>
          <p className="text-lg"> Verificando token...</p>
        </div>
      </div>
    );
  }

  if (!valid) {
    return (
      <div className="relative min-h-screen flex items-center justify-center">
        <div className="animated-bg" />
        <p className="relative z-10 text-red-200 text-lg font-medium">😱 Token inválido o expirado</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex justify-center items-center px-4">
      <div className="animated-bg" />

      <Card className="w-full max-w-md rounded-2xl shadow-2xl p-4 relative z-10">
        <CardBody>
          <div className="flex flex-col items-center mb-6">
            <Image
              src="/images/san_pietro_logo.png"
              alt="Logo San Pietro"
              width={100}
              height={100}
              className="rounded-full mb-3"
            />
            <h2 className="text-2xl font-bold text-center text-gray-800">
              Restablecer contraseña
            </h2>
            <p className="text-sm text-gray-500 text-center">
              Ingrese su nueva clave
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              type="password"
              label="Nueva contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              isRequired
            />
            <Input
              type="password"
              label="Confirmar contraseña"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              isRequired
            />
            <Button type="submit" color="primary" isDisabled={loading}>
              {loading ? 'Guardando...' : 'Actualizar contraseña'}
            </Button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}

export default function NuevaClaveForm() {
  return (
    <Suspense fallback={
      <div className="relative min-h-screen flex items-center justify-center text-white">
        <div className="animated-bg" />
        <p className="relative z-10">Cargando...</p>
      </div>
    }>
      <NuevaClaveFormInner />
    </Suspense>
  );
}
