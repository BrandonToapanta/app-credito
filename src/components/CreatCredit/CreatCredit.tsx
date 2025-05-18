'use client';

import { useState } from 'react';
import { toast } from 'sonner'; // Opcional: para notificaciones
import { CreditCard } from 'lucide-react'; // ícono de referencia

interface CrearCreditoProps {
	lenderAddress: string;
}

export default function CrearCredito({ lenderAddress }: CrearCreditoProps) {
	const [walletAddress, setWalletAddress] = useState('');
	const [amount, setAmount] = useState('');
	const [dueDate, setDueDate] = useState('');
	const [interest, setInterest] = useState('');
	const [installments, setInstallments] = useState('');

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		// Validar campos numéricos
		const parsedAmount = parseFloat(amount);
		const parsedInterest = parseFloat(interest);
		const parsedInstallments = parseInt(installments);

		if (!walletAddress) {
			toast.error('La dirección de la billetera es obligatoria');
			return;
		}
		if (isNaN(parsedAmount) || parsedAmount <= 0) {
			toast.error('El monto debe ser un número positivo');
			return;
		}
		if (isNaN(parsedInterest) || parsedInterest < 0) {
			toast.error('El interés debe ser un número no negativo');
			return;
		}
		if (isNaN(parsedInstallments) || parsedInstallments <= 0) {
			toast.error('El número de cuotas debe ser un número positivo');
			return;
		}
		if (!dueDate) {
			toast.error('La fecha de primer pago es obligatoria');
			return;
		}

		try {
			const res = await fetch('/api/credit', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					lenderAddress: lenderAddress,
					clientAddress: walletAddress,
					amount: parsedAmount,
					interestRate: parsedInterest,
					installments: parsedInstallments,
					startDueDate: dueDate,
				}),
			});

			const data = await res.json();
			if (res.ok) {
				toast.success('Crédito creado exitosamente');
				// Opcional: Limpiar el formulario
				setWalletAddress('');
				setAmount('');
				setInterest('');
				setInstallments('');
				setDueDate('');
			} else {
				toast.error(data.error || 'Error al crear crédito');
			}
		} catch (err) {
			toast.error('Error al conectar con el servidor');
		}
	};

	return (
		<div className="p-4 max-w-md mx-auto">
			<h1 className="text-2xl font-bold mb-4 flex items-center gap-2">
				<CreditCard className="w-6 h-6" /> Crear nuevo crédito
			</h1>
			<form onSubmit={handleSubmit} className="flex flex-col gap-4 bg-white rounded-xl p-4 shadow-md">
				<label className="text-sm font-medium">Dirección de la billetera</label>
				<input
					type="text"
					value={walletAddress}
					onChange={e => setWalletAddress(e.target.value)}
					className="input-style bg-slate-100 p-2 rounded-md"
					placeholder="0x..."
					required
				/>

				<label className="text-sm font-medium">Monto total $</label>
				<input
					type="number"
					value={amount}
					onChange={e => setAmount(e.target.value)}
					className="input-style bg-slate-100 p-2 rounded-md"
					required
				/>

				<label className="text-sm font-medium">Interés %</label>
				<input
					type="number"
					value={interest}
					onChange={e => setInterest(e.target.value)}
					className="input-style bg-slate-100 p-2 rounded-md"
					required
				/>

				<label className="text-sm font-medium">Número de cuotas</label>
				<input
					type="number"
					value={installments}
					onChange={e => setInstallments(e.target.value)}
					className="input-style bg-slate-100 p-2 rounded-md"
					required
				/>

				<label className="text-sm font-medium">Fecha de primer pago</label>
				<input
					type="date"
					value={dueDate}
					onChange={e => setDueDate(e.target.value)}
					className="input-style bg-slate-100 p-2 rounded-md"
					required
				/>

				<button type="submit" style={{
					backgroundColor: '#2563eb', // bg-blue-600
					color: '#ffffff', // text-white
					paddingTop: '0.5rem', // py-2
					paddingBottom: '0.5rem',
					borderRadius: '0.75rem', // rounded-xl
				}}
					className="hover:bg-blue-700">
					Crear Crédito
				</button>
			</form>
		</div>
	);
};

