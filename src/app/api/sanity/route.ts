// src/app/api/sanity/route.ts
// This is the missing API route handler. Add this file to your project.
// It fetches data from Sanity using GROQ queries that resolve asset URLs for images and files.

import { client } from '../../../../lib/sanityClient';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const resourcesQuery = `*[_type == "resource"] {
      ...,
      file { asset -> { url } }
    }`;
    const hardwareQuery = `*[_type == "hardwareComponent"] {
      ...,
      image { asset -> { url } }
    }`;

    const resources = await client.fetch(resourcesQuery);
    const hardware = await client.fetch(hardwareQuery);

    return NextResponse.json({ resources, hardware });
  } catch (error) {
    console.error('Error in /api/sanity:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}