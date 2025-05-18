import { PrismaClient } from '@/generated/prisma/client';
import { auth } from '@/auth';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
	try {
		const session = await auth(); // Solo se puede usar aquí en el servidor
		const { finalPayload } = await req.json();

		const walletAddress = finalPayload?.address;
		const username = session?.user?.username || 'anonymous';

		if (!walletAddress) {
			return NextResponse.json({ error: 'Wallet address is missing' }, { status: 400 });
		}

		const existingUser = await prisma.user.findUnique({
			where: { walletAddress },
		});

		if (!existingUser) {
			await prisma.user.create({
				data: { walletAddress, username },
			});
		} else if (existingUser.username !== username) {
			await prisma.user.update({
				where: { walletAddress },
				data: { username },
			});
		}

		return NextResponse.json({ ok: true });
	} catch (error) {
		console.error('Error en wallet-auth route:', error);
		return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
	}
}
