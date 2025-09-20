import { client } from '../../../../lib/sanityClient';
import { NextResponse } from 'next/server';

async function fetchWithTimeout(client: any, query: string, timeout = 30000) {
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
    const eventSimpleQuery = `*[_type == "eventSimple"] | order(dateTime desc)`;
    const eventDetailedQuery = `*[_type == "eventDetailed"] | order(dateTime desc) {
      ...,
      images[] { asset -> { url } },
      videos[] { asset -> { url }, caption }
    }`;
    const upcomingEventQuery = `*[_type == "upcomingEvent"] | order(tentativeDates[0] asc) {
      ...,
      images[] { asset -> { url } }
    }`;
    const hotTopicsQuery = `*[_type == "hotTopics"] | order(publishDate desc) {
      ...,
      thumbnail { asset -> { url } },
      imagery[] {
        ...,
        image { asset -> { url } }
      }
    }`;
    const projectsQuery = `*[_type == "project"] | order(startDate desc) {
      ...,
      mentors[]->,
      members[]->,
      'images': media.images[] { 
        'url': url.asset->url,
        caption,
        alt
      },
      'videos': media.videos[] { 
        url,
        caption
      }
    }`;
    const videosQuery = `*[_type == "videoDump"] {
      ...,
      'videos': videos[] {
        ...,
        file { asset -> { url } }
      }
    } | order(publishDate desc)`;

    const [resources, hardware, members, faculty, alumni, eventSimple, eventDetailed, upcomingEvents, hotTopics, projects, videos] = await Promise.all([
      fetchWithTimeout(client, resourcesQuery),
      fetchWithTimeout(client, hardwareQuery),
      fetchWithTimeout(client, membersQuery),
      fetchWithTimeout(client, facultyQuery),
      fetchWithTimeout(client, alumniQuery),
      fetchWithTimeout(client, eventSimpleQuery),
      fetchWithTimeout(client, eventDetailedQuery),
      fetchWithTimeout(client, upcomingEventQuery),
      fetchWithTimeout(client, hotTopicsQuery),
      fetchWithTimeout(client, projectsQuery),
      fetchWithTimeout(client, videosQuery)
    ]);

    return NextResponse.json({ resources, hardware, members, faculty, alumni, eventSimple, eventDetailed, upcomingEvents, hotTopics, projects, videos });
  } catch (error) {
    console.error('Error in /api/sanity:', error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}