import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@/generated/prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	if (req.method !== 'POST') {
		return res.status(405).json({ error: 'Método no permitido' });
	}

	const { username, walletAddress } = req.body;

	if (!walletAddress) {
		return res.status(400).json({ error: 'walletAddress es requerido' });
	}

	try {
		const user = await prisma.user.create({
			data: {
				walletAddress,
				username,
			},
		});
		return res.status(201).json(user);
	} catch (error) {
		return res.status(500).json({ error: 'Error al crear usuario' });
	}
}
