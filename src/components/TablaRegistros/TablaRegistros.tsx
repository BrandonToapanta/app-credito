'use client';

import React, { useState } from 'react';
import { format } from 'date-fns';

interface Alerta {
	id: string;
	tipo: string;
	ubicacion: string;
	fecha: string; // ISO string
	estado: 'enviado' | 'fallido' | 'cancelado';
}

const initialAlerts: Alerta[] = [
	{
		id: '1',
		tipo: 'Brandon Toapanta',
		ubicacion: 'Quito, EC',
		fecha: '2025-05-17T14:30:00',
		estado: 'enviado',
	},
	{
		id: '2',
		tipo: 'Edwin Chicaiza',
		ubicacion: 'Guayaquil, EC',
		fecha: '2025-05-16T09:12:00',
		estado: 'fallido',
	},
];

const TablaRegistros: React.FC = () => {
	const [alertas, setAlertas] = useState<Alerta[]>(initialAlerts);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedAlerta, setSelectedAlerta] = useState<Alerta | null>(null);
	const [estadoNuevo, setEstadoNuevo] = useState<Alerta['estado']>('enviado');

	const handleEdit = (alerta: Alerta) => {
		setSelectedAlerta(alerta);
		setEstadoNuevo(alerta.estado);
		setIsModalOpen(true);
	};

	const handleSave = () => {
		if (!selectedAlerta) return;

		const actualizadas = alertas.map((a) =>
			a.id === selectedAlerta.id ? { ...a, estado: estadoNuevo } : a
		);

		setAlertas(actualizadas);
		setIsModalOpen(false);
		setSelectedAlerta(null);
	};

	return (
		<section className="w-full bg-gray-100 rounded-t-2xl">
			<h2 className="text-xl sm:text-2xl font-bold mb-4 text-gray-800 px-4 pt-4">
				Registros de Credìtos
			</h2>

			<article className="space-y-4 sm:hidden px-4 pb-4">
				{alertas.map((alerta) => (
					<div
						key={alerta.id}
						className="bg-white p-3 rounded-lg shadow-md flex flex-col gap-2"
					>
						<div className="flex justify-between items-center">
							<span className="font-semibold text-gray-800 text-sm">{alerta.tipo}</span>
							<button
								onClick={() => handleEdit(alerta)}
								className="bg-blue-500 text-white py-1 px-2 rounded text-xs hover:bg-blue-600 transition"
							>
								Editar
							</button>
						</div>
						<div className="text-xs">
							<span className="font-medium">Ubicación:</span> {alerta.ubicacion}
						</div>
						<div className="text-xs">
							<span className="font-medium">Fecha:</span>{' '}
							{format(new Date(alerta.fecha), 'dd/MM/yyyy HH:mm')}
						</div>
						<div className="text-xs">
							<span className="font-medium">Estado:</span>{' '}
							<span
								className={`py-1 px-2 rounded-full text-xs ${alerta.estado === 'enviado'
									? 'bg-green-200 text-green-800'
									: alerta.estado === 'fallido'
										? 'bg-red-200 text-red-800'
										: 'bg-yellow-200 text-yellow-800'
									}`}
							>
								{alerta.estado === 'enviado'
									? 'Enviado'
									: alerta.estado === 'fallido'
										? 'Fallido'
										: 'Cancelado'}
							</span>
						</div>
					</div>
				))}
			</article>

			{/* Modal */}
			{isModalOpen && selectedAlerta && (
				<article className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
					<div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg w-full sm:max-w-lg">
						<div className="flex justify-between items-center mb-3">
							<h3 className="text-base sm:text-lg font-bold">
								Editar Alerta: {selectedAlerta.tipo}
							</h3>
							<button
								onClick={() => setIsModalOpen(false)}
								className="text-gray-500 hover:text-gray-700 text-xl sm:text-2xl"
							>
								×
							</button>
						</div>
						<div className="mb-3">
							<label className="block text-xs sm:text-sm font-medium text-gray-700">
								Estado
							</label>
							<select
								value={estadoNuevo}
								onChange={(e) => setEstadoNuevo(e.target.value as Alerta['estado'])}
								className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-xs sm:text-sm"
							>
								<option value="enviado">Enviado</option>
								<option value="cancelado">Cancelado</option>
								<option value="fallido">Fallido</option>
							</select>
						</div>
						<div className="flex justify-end space-x-2">
							<button
								onClick={() => setIsModalOpen(false)}
								className="bg-gray-300 text-gray-700 py-1 px-4 rounded hover:bg-gray-400 transition text-xs sm:text-sm"
							>
								Cancelar
							</button>
							<button
								onClick={handleSave}
								className="bg-blue-500 text-white py-1 px-4 rounded hover:bg-blue-600 transition text-xs sm:text-sm"
							>
								Guardar
							</button>
						</div>
					</div>
				</article>
			)}
		</section>
	);
};

export default TablaRegistros;