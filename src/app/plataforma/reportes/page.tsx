'use client';

import { useEffect, useRef, useState } from 'react';
import { Input, Button } from '@nextui-org/react';
import { getTareasFiltradas } from '@/actions/tareas-actions';
import { CustomTable } from '@/components/CustomTable';
import { ToastContainer, toast } from 'react-toastify';

export default function ReportesPage() {
  const [nombre, setNombre] = useState('');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [tareas, setTareas] = useState<any[]>([]);
  const [filtrarFechas, setFiltrarFechas] = useState(false);
  const nombreInputRef = useRef<HTMLInputElement>(null);

  const fetchTareas = async () => {
    const filtros: any = { nombre };

    if (filtrarFechas && fechaInicio && fechaFin) {
      filtros.fechaInicio = fechaInicio;
      filtros.fechaFin = fechaFin;
    }

    const data = await getTareasFiltradas(filtros);

    const opcionesFecha = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    } as const;

    const tareasFormateadas = data.map((t: any) => ({
      ...t,
      fecha_creacion: t.fecha_creacion
        ? new Date(t.fecha_creacion)
            .toLocaleDateString('es-CO', opcionesFecha)
            .replace(/ de /g, ' ')
        : '',
      fecha_limite: t.fecha_limite
        ? new Date(t.fecha_limite)
            .toLocaleDateString('es-CO', opcionesFecha)
            .replace(/ de /g, ' ')
        : '',
    }));

    setTareas(tareasFormateadas);
  };

  useEffect(() => {
    fetchTareas();
  }, [nombre, filtrarFechas]);

  const handleFiltrarPorFecha = () => {
    if (fechaInicio && fechaFin) {
      setFiltrarFechas(true);
    }
  };

  const handleLimpiarFiltros = () => {
    setNombre('');
    setFechaInicio('');
    setFechaFin('');
    setFiltrarFechas(false);

    // Enfocar input de nombre
    nombreInputRef.current?.focus();

    // Scroll al inicio
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Mostrar toast
    toast.success('Filtros limpiados correctamente');
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Reporte de Tareas</h1>

      <div className="flex flex-wrap gap-4 items-end">
        <Input
          ref={nombreInputRef}
          type="text"
          label="Buscar por nombre"
          placeholder="Nombre del usuario asignado"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="w-64"
        />

        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-600">Fecha desde</label>
          <input
            type="date"
            className="border px-3 py-1.5 rounded-md text-sm"
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm text-gray-600">Fecha hasta</label>
          <input
            type="date"
            className="border px-3 py-1.5 rounded-md text-sm"
            value={fechaFin}
            onChange={(e) => setFechaFin(e.target.value)}
          />
        </div>      

        <Button
          color="primary"
          className="mt-2"
          onClick={handleFiltrarPorFecha}
          isDisabled={!fechaInicio || !fechaFin}
        >
          Filtrar por fecha
        </Button>

        <Button
          color="primary"
          className="mt-2"
          onClick={handleLimpiarFiltros}
        >
          Limpiar filtros
        </Button>
      </div>

      <CustomTable
        columns={[
          { header: 'ID', accessor: 'id_tarea' },
          { header: 'Título', accessor: 'titulo' },
          { header: 'Asignado', accessor: 'nombre_asignado' },
          { header: 'Creador', accessor: 'nombre_creador' },
          { header: 'Estado', accessor: 'estado_tarea' },
          { header: 'Prioridad', accessor: 'prioridad_tarea' },
          { header: 'Creación', accessor: 'fecha_creacion' },
          { header: 'Límite', accessor: 'fecha_limite' },
        ]}
        data={tareas}
        emptyMessage="No hay tareas registradas con estos filtros"
        isStriped
      />

      <ToastContainer position="top-right" autoClose={2000} hideProgressBar />
    </div>
  );
}
