// /actions/updateInstallment.ts
'use server';

import prisma from "@/lib/prisma";


export async function updateInstallment(installmentId: string, creditId: string) {
	await prisma.installment.update({
		where: { id: installmentId },
		data: { paid: true },
	});

	const remaining = await prisma.installment.count({
		where: { creditId, paid: false },
	});

	if (remaining === 0) {
		await prisma.credit.update({
			where: { id: creditId },
			data: { status: 'pagado' },
		});
	}
}
