import React from 'react';
import { format, isPast } from 'date-fns';
import prisma from '@/lib/prisma';

interface Balance {
	id: string;
	username: string;
	amount: number;
	dueDate: string;
	status: 'pendiente' | 'pagado' | 'atrasado';
}

interface PendingBalancesProps {
	id: string;
}

export default async function PendingBalances({ id }: PendingBalancesProps) {
	// Fecha actual
	const now = new Date();
	const currentMonth = now.getMonth();
	const currentYear = now.getFullYear();

	// Consulta a Prisma
	const credits = await prisma.credit.findMany({
		where: {
			lenderAddress: id,
			status: 'pendiente',
		},
		select: {
			totalToPay: true,
			User: {
				select: {
					username: true,
				},
			},
			installments: {
				where: {
					paid: false,
				},
				orderBy: {
					dueDate: 'asc',
				},
				take: 1, // Solo la primera cuota no pagada
				select: {
					dueDate: true,
					amount: true,
					paid: true,
					id: true,
				},
			},
		},
	});

	// Extraer una cuota pendiente de este mes por crédito
	const balances: Balance[] = [];

	for (const credit of credits) {
		const installment = credit.installments.find((i) => {
			const dueDate = new Date(i.dueDate);
			return (
				dueDate.getMonth() === currentMonth &&
				dueDate.getFullYear() === currentYear
			);
		});

		if (installment && credit.User.username) {
			const status = installment.paid
				? 'pagado'
				: isPast(new Date(installment.dueDate))
					? 'atrasado'
					: 'pendiente';

			balances.push({
				id: installment.id,
				username: credit.User.username,
				amount: installment.amount.toNumber(),
				dueDate: installment.dueDate.toISOString(),
				status,
			});
		}
	}

	return (
		<section className="w-full min-h-screen bg-gray-100 rounded-t-2xl">
			<h2 className="text-xl sm:text-2xl font-bold mb-4 text-gray-800 px-2 sm:px-4 pt-4">
				Personas a Cobrar (Este mes)
			</h2>

			{/* Lista de tarjetas para móviles */}
			<article className="space-y-4 sm:hidden px-2">
				{balances.map((balance) => (
					<div
						key={balance.id}
						className="w-full bg-white p-3 rounded-lg shadow-md flex flex-col gap-2"
					>
						<div className="flex justify-between items-center">
							<span className="font-semibold text-gray-800 text-sm">{balance.username}</span>
							<button
								className="bg-blue-500 text-white py-1 px-2 rounded text-xs hover:bg-blue-600 transition"
								disabled
							>
								Pagado
							</button>
						</div>
						<div className="text-xs">
							<span className="font-medium">Monto:</span> ${balance.amount.toFixed(2)}
						</div>
						<div className="text-xs">
							<span className="font-medium">Estado:</span>{' '}
							<span
								className={`py-1 px-2 rounded-full text-xs ${balance.status === 'pagado'
									? 'bg-green-200 text-green-800'
									: balance.status === 'atrasado'
										? 'bg-red-200 text-red-800'
										: 'bg-yellow-200 text-yellow-800'
									}`}
							>
								{balance.status === 'pagado'
									? 'Pagado'
									: balance.status === 'atrasado'
										? 'Atrasado'
										: 'Pendiente'}
							</span>
						</div>
						<div className="text-xs">
							<span className="font-medium">Próximo Pago:</span>{' '}
							{format(new Date(balance.dueDate), 'dd/MM/yyyy')}
						</div>
					</div>
				))}
			</article>

			<p className="text-xs text-gray-600 px-2 sm:px-4 mt-4">
				Nota: Se muestran cuotas no pagadas del mes actual.
			</p>
		</section>
	);
}
