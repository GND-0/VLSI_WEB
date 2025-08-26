import { createClient } from 'next-sanity';

// Validate environment variables
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const token = process.env.SANITY_WRITE_TOKEN;

if (!projectId || !dataset || !token) {
  throw new Error(
    'Missing Sanity environment variables. Ensure NEXT_PUBLIC_SANITY_PROJECT_ID, NEXT_PUBLIC_SANITY_DATASET, and SANITY_TOKEN are set in .env.local'
  );
}

console.log('Sanity config (server-side):', {
  projectId,
  dataset,
  token: token ? 'present' : 'not set',
});

export const client = createClient({
  projectId,
  dataset,
  useCdn: false, // Use direct API to avoid caching issues
  apiVersion: '2025-08-23', // Use current date for latest API version
  token, // Use token server-side
});

// Client-side logging for debugging
if (typeof window !== 'undefined') {
  console.log('Sanity config (client-side):', {
    projectId,
    dataset,
  });
}