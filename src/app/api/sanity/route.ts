// app/api/sanity/route.ts
import { NextResponse } from 'next/server';
import { client } from '../../../../lib/sanityClient';

export async function GET() {
  try {
    const resourcesQuery = `*[_type == "resource"] | order(category asc)`;
    const hardwareQuery = `*[_type == "hardwareComponent"] | order(name asc)`;
    const [resourcesData, hardwareData] = await Promise.all([
      client.fetch(resourcesQuery),
      client.fetch(hardwareQuery),
    ]);
    return NextResponse.json({ resources: resourcesData, hardware: hardwareData });
  } catch (error) {
    console.error('Server-side fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch data from Sanity' }, { status: 500 });
  }
}