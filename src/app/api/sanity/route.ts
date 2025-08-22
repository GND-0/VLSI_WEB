// src/app/api/sanity/route.ts
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
    const membersQuery = `*[_type == "members"] {
      ...,
      image { asset -> { url } }
    }`;
    const facultyQuery = `*[_type == "faculty"] {
      ...,
      image { asset -> { url } }
    }`;
    const alumniQuery = `*[_type == "alumni"] {
      ...,
      image { asset -> { url } }
    }`;

    const [resources, hardware, members, faculty, alumni] = await Promise.all([
      client.fetch(resourcesQuery),
      client.fetch(hardwareQuery),
      client.fetch(membersQuery),
      client.fetch(facultyQuery),
      client.fetch(alumniQuery),
    ]);

    return NextResponse.json({ resources, hardware, members, faculty, alumni });
  } catch (error) {
    console.error('Error in /api/sanity:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}