import { NextResponse } from 'next/server';

import { PrismaClient } from '@/generated/prisma/client';
import { addMonths, parseISO, isValid } from 'date-fns';

const prisma = new PrismaClient();

export async function POST(req: Request) {
	try {
		const body = await req.json();
		console.log('Body recibido:', body);
		const { lenderAddress, amount, interestRate, installments, startDueDate } = body;

		// Validar campos obligatorios
		if (!lenderAddress) {
			return NextResponse.json({ error: 'La dirección de la billetera es obligatoria' }, { status: 400 });
		}
		if (typeof amount !== 'number' || isNaN(amount) || amount <= 0) {
			return NextResponse.json({ error: 'El monto debe ser un número positivo' }, { status: 400 });
		}
		if (typeof interestRate !== 'number' || isNaN(interestRate) || interestRate < 0) {
			return NextResponse.json({ error: 'El interés debe ser un número no negativo' }, { status: 400 });
		}
		if (typeof installments !== 'number' || isNaN(installments) || installments <= 0 || !Number.isInteger(installments)) {
			return NextResponse.json({ error: 'El número de cuotas debe ser un entero positivo' }, { status: 400 });
		}
		if (!startDueDate || !isValid(parseISO(startDueDate))) {
			return NextResponse.json({ error: 'La fecha de primer pago debe ser una fecha válida' }, { status: 400 });
		}

		const clientAddress = 'admin';

		const totalToPay = amount * (interestRate / 100 + 1);
		const monthlyAmount = totalToPay / installments;

		// Crear el crédito
		const credit = await prisma.credit.create({
			data: {
				lenderAddress,
				clientAddress,
				interest: interestRate,
				totalToPay,
			},
		});

		// Crear las cuotas
		const installmentsData = Array.from({ length: installments }, (_, i) => ({
			creditId: credit.id,
			amount: monthlyAmount,
			dueDate: addMonths(parseISO(startDueDate), i),
		}));

		await prisma.creditInstallment.createMany({
			data: installmentsData,
		});

		return NextResponse.json({ message: 'Crédito creado con éxito', credit });
	} catch (error: any) {
		console.error('[ERROR /api/credit]', error);
		return NextResponse.json(
			{ error: 'Error al crear el crédito', details: error.message },
			{ status: 500 }
		);
	}
}