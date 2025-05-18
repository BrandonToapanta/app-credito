'use client';

import React, { useState } from 'react';
import { format, isPast } from 'date-fns';

interface Balance {
	id: string;
	clientName: string;
	amount: number;
	nextPaymentDate: string; // ISO date (e.g., '2025-05-20')
	status: 'pending' | 'paid' | 'overdue';
}

const initialBalances: Balance[] = [
	{
		id: '1',
		clientName: 'Ana López',
		amount: 150.0,
		nextPaymentDate: '2025-05-15', // Atrasado
		status: 'pending',
	},
	{
		id: '2',
		clientName: 'Carlos Gómez',
		amount: 200.0,
		nextPaymentDate: '2025-05-22', // Al día
		status: 'pending',
	},
];

const PendingBalances: React.FC = () => {
	const [balances, setBalances] = useState<Balance[]>(initialBalances);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [selectedBalance, setSelectedBalance] = useState<Balance | null>(null);
	const [paymentAmount, setPaymentAmount] = useState('');
	const [newStatus, setNewStatus] = useState<'pending' | 'paid' | 'overdue'>('pending');

	// Abrir modal para editar
	const handleEdit = (balance: Balance) => {
		setSelectedBalance(balance);
		setPaymentAmount('');
		setNewStatus(balance.status);
		setIsModalOpen(true);
	};

	// Guardar cambios
	const handleSave = () => {
		if (!selectedBalance) return;

		const updatedBalances = balances.map((b) => {
			if (b.id === selectedBalance.id) {
				const updatedAmount = paymentAmount ? b.amount - parseFloat(paymentAmount) : b.amount;
				return {
					...b,
					amount: updatedAmount > 0 ? updatedAmount : 0,
					status: updatedAmount <= 0 ? 'paid' : newStatus,
				};
			}
			return b;
		});

		setBalances(updatedBalances);
		setIsModalOpen(false);
		setSelectedBalance(null);
		setPaymentAmount('');
	};

	// Verificar si está atrasado
	const isOverdue = (date: string) => {
		return isPast(new Date(date)) && new Date(date).toDateString() !== new Date().toDateString();
	};

	return (
		<section className="w-full min-h-screen bg-gray-100 rounded-t-2xl">
			<h2 className="text-xl sm:text-2xl font-bold mb-4 text-gray-800 px-2 sm:px-4 pt-4">
				Personas a Cobrar
			</h2>

			{/* Lista de tarjetas para móviles */}
			<article className="space-y-4 sm:hidden px-2">
				{balances.map((balance) => (
					<div
						key={balance.id}
						className="w-full bg-white p-3 rounded-lg shadow-md flex flex-col gap-2"
					>
						<div className="flex justify-between items-center">
							<span className="font-semibold text-gray-800 text-sm">{balance.clientName}</span>
							<button
								onClick={() => handleEdit(balance)}
								className="bg-blue-500 text-white py-1 px-2 rounded text-xs hover:bg-blue-600 transition"
							>
								Editar
							</button>
						</div>
						<div className="text-xs">
							<span className="font-medium">Monto:</span> ${balance.amount.toFixed(2)}
						</div>
						<div className="text-xs">
							<span className="font-medium">Estado:</span>{' '}
							<span
								className={`py-1 px-2 rounded-full text-xs ${balance.status === 'paid'
									? 'bg-green-200 text-green-800'
									: balance.status === 'overdue' || isOverdue(balance.nextPaymentDate)
										? 'bg-red-200 text-red-800'
										: 'bg-yellow-200 text-yellow-800'
									}`}
							>
								{balance.status === 'paid'
									? 'Pagado'
									: balance.status === 'overdue' || isOverdue(balance.nextPaymentDate)
										? 'Atrasado'
										: 'Pendiente'}
							</span>
						</div>
						<div className="text-xs">
							<span className="font-medium">Próximo Pago:</span>{' '}
							{format(new Date(balance.nextPaymentDate), 'dd/MM/yyyy')}
						</div>
					</div>
				))}
			</article>

			{/* Modal para editar */}
			{isModalOpen && selectedBalance && (
				<article className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
					<div className="bg-white p-3 sm:p-4 rounded-lg shadow-lg w-full sm:max-w-lg">
						<div className="flex justify-between items-center mb-3">
							<h3 className="text-base sm:text-lg font-bold">
								Editar Pago: {selectedBalance.clientName}
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
								Monto Adeudado
							</label>
							<p className="text-sm sm:text-base font-semibold">
								${selectedBalance.amount.toFixed(2)}
							</p>
						</div>
						<div className="mb-3">
							<label className="block text-xs sm:text-sm font-medium text-gray-700">
								Registrar Pago
							</label>
							<input
								type="number"
								value={paymentAmount}
								onChange={(e) => setPaymentAmount(e.target.value)}
								className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-xs sm:text-sm"
								placeholder="Ingresa monto pagado"
								min="0"
								step="0.01"
							/>
						</div>
						<div className="mb-3">
							<label className="block text-xs sm:text-sm font-medium text-gray-700">
								Estado
							</label>
							<select
								value={newStatus}
								onChange={(e) => setNewStatus(e.target.value as 'pending' | 'paid' | 'overdue')}
								className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-xs sm:text-sm"
							>
								<option value="pending">Pendiente</option>
								<option value="paid">Pagado</option>
								<option value="overdue">Atrasado</option>
							</select>
						</div>
						<div className="flex justify-end space-x-2">
							<button
								onClick={() => setIsModalOpen(false)}
								className="bg-gray-300 text-gray-700 py-1 px-3 sm:py-2 sm:px-4 rounded hover:bg-gray-400 transition text-xs sm:text-sm"
							>
								Cancelar
							</button>
							<button
								onClick={handleSave}
								className="bg-blue-500 text-white py-1 px-3 sm:py-2 sm:px-4 rounded hover:bg-blue-600 transition text-xs sm:text-sm"
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

export default PendingBalances;