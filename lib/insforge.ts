import { createClient } from '@insforge/sdk';

const insforgeUrl = process.env.NEXT_PUBLIC_INSFORGE_URL;

if (!insforgeUrl) {
  throw new Error('Missing NEXT_PUBLIC_INSFORGE_URL environment variable');
}

export const insforge = createClient({ baseUrl: insforgeUrl });
