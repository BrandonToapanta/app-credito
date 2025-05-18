import { NextResponse } from 'next/server';
import { isSameMonth } from 'date-fns';
import prisma from '@/lib/prisma';

export async function GET(req: Request) {
	const { searchParams } = new URL(req.url);
	const id = searchParams.get('id');
	if (!id) return NextResponse.json([], { status: 200 });

	const credits = await prisma.credit.findMany({
		where: { lenderAddress: id },
		include: {
			User: { select: { username: true } },
			installments: {
				where: { paid: false },
				orderBy: { dueDate: 'asc' },
			},
		},
	});

	const now = new Date();
	const balances = credits.map((credit) => {
		const current = credit.installments.find(i => isSameMonth(new Date(i.dueDate), now));
		if (!current) return null;

		return {
			username: credit.User.username,
			amount: current.amount,
			dueDate: current.dueDate,
			status: 'pendiente',
			installmentId: current.id,
			creditId: credit.id,
		};
	}).filter(Boolean);

	return NextResponse.json(balances);
}
