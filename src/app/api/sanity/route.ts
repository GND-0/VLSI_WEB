import { client } from '../../../../lib/sanityClient';
import { NextResponse } from 'next/server';
import { SanityClient } from 'next-sanity';

async function fetchWithTimeout(client: SanityClient, query: string, timeout = 15000) {
  const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error('Sanity fetch timeout')), timeout));
  return Promise.race([client.fetch(query), timeoutPromise]);
}

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

    const resources = await fetchWithTimeout(client, resourcesQuery);
    const hardware = await fetchWithTimeout(client, hardwareQuery);
    const members = await fetchWithTimeout(client, membersQuery);
    const faculty = await fetchWithTimeout(client, facultyQuery);
    const alumni = await fetchWithTimeout(client, alumniQuery);

    return NextResponse.json({ resources, hardware, members, faculty, alumni });
  } catch (error: unknown) {
    console.error('Error in /api/sanity:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to fetch data';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}