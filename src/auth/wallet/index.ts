import { MiniKit } from '@worldcoin/minikit-js';
import { signIn } from 'next-auth/react';
import { getNewNonces } from './server-helpers';

/**
 * Authenticates a user via their wallet using a nonce-based challenge-response mechanism.
 *
 * This function generates a unique `nonce` and requests the user to sign it with their wallet,
 * producing a `signedNonce`. The `signedNonce` ensures the response we receive from wallet auth
 * is authentic and matches our session creation.
 *
 * @returns {Promise<SignInResponse>} The result of the sign-in attempt.
 * @throws {Error} If wallet authentication fails at any step.
 */
export const walletAuth = async () => {
  const { nonce, signedNonce } = await getNewNonces();

  const result = await MiniKit.commandsAsync.walletAuth({
    nonce,
    expirationTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    notBefore: new Date(Date.now() - 24 * 60 * 60 * 1000),
    statement: `Authenticate (${crypto.randomUUID().replace(/-/g, '')}).`,
  });
  console.log('Result', result);

  if (!result || result.finalPayload.status !== 'success') {
    console.log('Wallet authentication failed', JSON.stringify(result?.finalPayload));
    return;
  }

  const finalPayload = result.finalPayload;

  // Envía al backend para crear el usuario
  const response = await fetch('/api/wallet-auth', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ finalPayload }),
  });

  if (!response.ok) {
    throw new Error('Error registrando usuario');
  }

  await signIn('credentials', {
    redirectTo: '/home',
    nonce,
    signedNonce,
    finalPayloadJson: JSON.stringify(finalPayload),
  });

  return finalPayload;
};
