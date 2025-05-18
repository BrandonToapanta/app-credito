'use client';

import React, { useEffect, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { updateInstallment } from '@/actions/updateInstallment';

interface Balance {
	username: string;
	amount: number;
	dueDate: string;
	status: 'pendiente' | 'pagado' | 'atrasado';
	installmentId: string;
	creditId: string;
}

interface Props {
	id: string;
}

export default function PendingBalances({ id }: Props) {
	const router = useRouter();
	const [balances, setBalances] = useState<Balance[] | null>(null);
	const [isPending, startTransition] = useTransition();

	useEffect(() => {
		const fetchBalances = async () => {
			const res = await fetch(`/api/balances?id=${id}`);
			const data = await res.json();
			setBalances(data);
		};
		fetchBalances();
	}, [id]);

	const handleEdit = async (installmentId: string, creditId: string) => {
		await updateInstallment(installmentId, creditId);
		startTransition(() => {
			router.refresh();
		});
	};

	return (
		<section className="w-full min-h-screen bg-gray-100 rounded-t-2xl">
			<h2 className="text-xl font-bold mb-4 px-4 pt-4">Personas a Cobrar (Este mes)</h2>

			<div className="space-y-4 px-4">
				{balances === null ? (
					<p className="text-gray-500 text-sm">Cargando...</p>
				) : balances.length === 0 ? (
					<p className="text-gray-500 text-sm">No hay cuotas pendientes este mes.</p>
				) : (
					balances.map((b, index) => (
						<div
							key={index}
							className="bg-white rounded-xl p-4 shadow-md flex flex-col gap-2"
						>
							<div className="flex justify-between items-center">
								<span className="font-semibold text-sm text-gray-800">{b.username}</span>
								<button
									onClick={() => handleEdit(b.installmentId, b.creditId)}
									disabled={isPending}
									className="text-blue-500 text-sm hover:underline"
								>
									Editar
								</button>
							</div>
							<div className="text-sm text-gray-700">
								<span className="font-medium">Monto:</span> ${b.amount.toFixed(2)}
							</div>
							<div className="text-sm">
								<span className="font-medium">Estado:</span>{' '}
								<span
									className={`px-2 py-1 rounded-full text-xs ${b.status === 'pagado'
										? 'bg-green-200 text-green-800'
										: b.status === 'atrasado'
											? 'bg-red-200 text-red-800'
											: 'bg-yellow-200 text-yellow-800'
										}`}
								>
									{b.status}
								</span>
							</div>
							<div className="text-sm text-gray-700">
								<span className="font-medium">Fecha de Pago:</span>{' '}
								{format(new Date(b.dueDate), 'dd/MM/yyyy')}
							</div>
						</div>
					))
				)}
			</div>

			<p className="text-xs text-gray-500 px-4 mt-6 pb-4">
				Nota: Solo se muestran cuotas no pagadas del mes actual.
			</p>
		</section>
	);
}
