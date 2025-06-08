'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Input, Button, Card, CardBody } from '@nextui-org/react';
import { toast } from 'react-toastify';

export default function NuevaClavePage() {
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

    console.log('🧪 Token enviado a la API:', token);

    const verify = async () => {
    try {
        const res = await fetch('/api/verify-token', {
        method: 'POST',
        body: JSON.stringify({ token }),
        });

        const data = await res.json();
        setValid(data.valid);
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
    const res = await fetch('/api/update-password', {
        method: 'POST',
        body: JSON.stringify({ token, password }),
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.error || 'Error al actualizar');

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
    <div className="animated-bg h-screen flex items-center justify-center">
        <p className="text-white text-lg">🔍 Verificando token...</p>
        <style jsx>{gradientStyle}</style>
    </div>
    );
}

if (!valid) {
    return (
    <div className="animated-bg h-screen flex items-center justify-center">
        <p className="text-red-200 text-lg font-medium">⛔ Token inválido o expirado</p>
        <style jsx>{gradientStyle}</style>
    </div>
    );
}

return (
    <div className="animated-bg flex justify-center items-center h-screen px-4">
    <Card className="w-full max-w-md rounded-2xl shadow-2xl p-4">
        <CardBody>
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
            Restablecer contraseña
        </h2>
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
    <style jsx>{gradientStyle}</style>
    </div>
);
}

// 🎨 Gradiente animado (encapsulado)
const gradientStyle = `
.animated-bg {
    background-image: linear-gradient(
    270deg,
    #047b34,
    #272727,
    #af0710,
    #272727,
    #047b34
    );
    background-size: 500% 500%;
    animation: gradientFlow 20s ease infinite;
}

@keyframes gradientFlow {
    0% {
    background-position: 0% 50%;
    }
    50% {
    background-position: 100% 50%;
    }
    100% {
    background-position: 0% 50%;
    }
}
`;

