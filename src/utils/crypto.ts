/**
 * Cryptographic security utilities for UMVP (Unified Metrology Verification Portal)
 * Uses Web Crypto API (supported natively in modern browsers & Node.js 18+)
 */

// Helper to convert buffer to hex string
export function bufferToHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

// Compute SHA-256 hash of a string
export async function computeSHA256(data: string): Promise<string> {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
  return bufferToHex(hashBuffer);
}

// Compute HMAC-SHA256 signature for Certificates
export async function computeHMAC(data: string, secretKey: string = 'UMVP-LEGAL-METROLOGY-KEY-2026'): Promise<string> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(secretKey);
  const cryptoKey = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  );
  const signature = await crypto.subtle.sign('HMAC', cryptoKey, encoder.encode(data));
  return bufferToHex(signature);
}

// Verify HMAC-SHA256 signature
export async function verifyHMAC(data: string, signatureHex: string, secretKey: string = 'UMVP-LEGAL-METROLOGY-KEY-2026'): Promise<boolean> {
  const computed = await computeHMAC(data, secretKey);
  return computed === signatureHex;
}

// Symmetric AES-GCM 256-bit Encryption for E2EE Communication
export async function encryptE2EE(plainText: string, sharedSecretKey: string = 'UMVP-E2EE-ENCLAVE-2026'): Promise<{ cipherTextHex: string; ivHex: string }> {
  const encoder = new TextEncoder();
  // Derive 256-bit key from passphrase using SHA-256
  const keyHash = await crypto.subtle.digest('SHA-256', encoder.encode(sharedSecretKey));
  const cryptoKey = await crypto.subtle.importKey('raw', keyHash, { name: 'AES-GCM' }, false, ['encrypt', 'decrypt']);

  // Random 12-byte IV for AES-GCM
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encodedText = encoder.encode(plainText);

  const encryptedBuffer = await crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    cryptoKey,
    encodedText
  );

  return {
    cipherTextHex: bufferToHex(encryptedBuffer),
    ivHex: bufferToHex(iv.buffer),
  };
}

// Symmetric AES-GCM 256-bit Decryption for E2EE Communication
export async function decryptE2EE(cipherTextHex: string, ivHex: string, sharedSecretKey: string = 'UMVP-E2EE-ENCLAVE-2026'): Promise<string> {
  try {
    const encoder = new TextEncoder();
    const keyHash = await crypto.subtle.digest('SHA-256', encoder.encode(sharedSecretKey));
    const cryptoKey = await crypto.subtle.importKey('raw', keyHash, { name: 'AES-GCM' }, false, ['decrypt']);

    // Parse IV
    const ivBytes = new Uint8Array(ivHex.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16)));
    // Parse Ciphertext
    const cipherBytes = new Uint8Array(cipherTextHex.match(/.{1,2}/g)!.map((byte) => parseInt(byte, 16)));

    const decryptedBuffer = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: ivBytes },
      cryptoKey,
      cipherBytes
    );

    const decoder = new TextDecoder();
    return decoder.decode(decryptedBuffer);
  } catch {
    return '[Decryption Failed: Invalid Authentication Key or Corrupted Ciphertext]';
  }
}
