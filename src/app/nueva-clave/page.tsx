import { Suspense } from 'react';
import NuevaClaveForm from './NuevaClaveForm';

export default function NuevaClavePage() {
  return (
    <Suspense fallback={<div className="h-screen flex justify-center items-center text-white">Cargando...</div>}>
      <NuevaClaveForm />
    </Suspense>
  );
}
