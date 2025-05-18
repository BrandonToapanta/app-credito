'use client';

import { useTransition } from 'react';

interface EditButtonProps {
	installmentId: string;
	creditId: string;
	onSuccess: () => void;
}

export default function EditButton({ installmentId, creditId, onSuccess }: EditButtonProps) {
	const [isPending, startTransition] = useTransition();

	const handleClick = async () => {
		startTransition(async () => {
			await fetch('/app/api/pay-installment', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ installmentId, creditId }),
			});
			onSuccess(); // puedes usar router.refresh() si estás en un layout server
		});
	};

	return (
		<button
			onClick={handleClick}
			disabled={isPending}
			className="bg-green-500 text-white py-1 px-2 rounded text-xs hover:bg-green-600 transition"
		>
			{isPending ? 'Guardando...' : 'Marcar Pagado'}
		</button>
	);
}
