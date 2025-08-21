// lib/sanityClient.ts
import { createClient } from '@sanity/client';

const token = process.env.SANITY_TOKEN; // Ensure this is in .env.local

console.log('Sanity config (server-side):', {
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  token: token ? 'present' : 'not set',
});

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  useCdn: false, // Use direct API
  apiVersion: '2021-06-07',
  token: token, // Use token server-side
});

if (typeof window !== 'undefined') {
  console.log('Sanity config (client-side):', {
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  });
}