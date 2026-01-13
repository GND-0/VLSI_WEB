'use client';

import { useEffect, useState } from 'react';
import YouTube from 'react-lite-youtube-embed';
import 'react-lite-youtube-embed/dist/LiteYouTubeEmbed.css';
import Header from '../../components/header';
import Footer from '../../components/footer';

// Define the types for your project data
interface Project {
  _id: string;
  id: string;
  title: string;
  status: 'ongoing' | 'completed';
  startDate: string;
  endDate?: string;
  progress?: number;
  description: string;
  objectives?: string[];
  challenges?: string[];
  futurePlans?: string;
  mentors?: { name: string; affiliation: string; role: string; contact: string }[];
  members?: { name: string; role: string; year: string; contributions?: string[] }[];
  domain: string;
  technologies?: string[];
  specifications?: { key: string; value: string }[];
  designFlow?: string[];
  simulationResults?: string;
  fabricationDetails?: { processNode: string; foundry: string; status: string };
  budget?: { total: number; utilized: number; sources?: string[] };
  resourcesUsed?: string[];
  achievements?: string[];
  publications?: { title: string; authors: string[]; venue: string; link?: string }[];
  patents?: { title: string; status: string; number?: string }[];
  collaborators?: { name: string; type: string; role: string }[];
  videos?: { url: string; caption?: string }[];
  images?: { url: string; caption?: string; alt?: string }[];
  repositoryLinks?: string[];
  documentationLinks?: string[];
  nationalImpact?: string;
  tags?: string[];
}

export default function ClubProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const response = await fetch('/api/sanity');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        setProjects(data.projects);
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchProjects();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-950 text-white">
        <Header />
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400">Loading projects...</p>
        </div>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-black text-white p-6 text-center relative overflow-hidden">
        <div
          className="absolute inset-0 [background-size:20px_20px] [background-image:linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)]"
        />
        <div className="pointer-events-none absolute inset-0 bg-black [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
        <h1 className="text-4xl font-bold mb-4 relative z-10">No Projects Found</h1>
        <p className="text-lg text-gray-400 relative z-10">
          It looks like there are no VLSI projects to display at the moment. Please check back later!
        </p>
      </div>
    );
  }

  const getYoutubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  return (
    <div className="bg-black text-white min-h-screen font-sans antialiased relative overflow-hidden">
      {/* Grid Background Pattern */}
      <div
        className="absolute inset-0 [background-size:20px_20px] [background-image:linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)]"
      />
      <div className="pointer-events-none absolute inset-0 bg-black [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
      
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-8 py-12 mt-16 relative z-10">
        <header className="text-center mb-16">
          <h1 className="text-4xl lg:text-5xl font-bold text-teal-400 mb-4">
            VLSI Club Projects
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Explore the groundbreaking work from our brilliant minds in the world of VLSI.
          </p>
        </header>

        <div className="space-y-12">
          {projects.map((project) => (
            <div
              key={project._id}
              className="bg-gray-900/60 backdrop-blur-sm rounded-xl border border-gray-800/50 p-6 lg:p-8 hover:border-gray-700 transition-all duration-300"
            >
              <div className="flex flex-col lg:flex-row gap-8">
                <div className="lg:w-1/2">
                  <h2 className="text-2xl lg:text-3xl font-bold text-teal-400 mb-4">
                    {project.title}
                  </h2>
                  <p className="text-gray-400 mb-4">{project.description}</p>
                  <div className="flex items-center gap-3 text-sm">
                    <span className={`px-3 py-1 rounded-full font-medium ${
                      project.status === 'ongoing' 
                        ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' 
                        : 'bg-green-500/20 text-green-400 border border-green-500/30'
                    }`}>
                      {project.status.toUpperCase()}
                    </span>
                    <span className="text-gray-500">
                      {new Date(project.startDate).toLocaleDateString()}
                      {project.endDate && ` - ${new Date(project.endDate).toLocaleDateString()}`}
                    </span>
                  </div>
                </div>
                
                {project.videos && project.videos.length > 0 && (
                  <div className="lg:w-1/2 bg-gray-800/50 rounded-lg p-4">
                    <h3 className="text-lg font-semibold mb-3 text-gray-200">Project Videos</h3>
                    {project.videos.map((video, idx) => (
                      <div key={idx} className="mb-4 last:mb-0">
                        <YouTube
                          id={getYoutubeId(video.url) || ''}
                          title={video.caption || project.title}
                          adNetwork
                          noCookie={true}
                          wrapperClass="rounded-lg overflow-hidden w-full aspect-video"
                        />
                        {video.caption && (
                          <p className="mt-2 text-sm text-gray-500 text-center">{video.caption}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Grid Layout for other sections */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Section: Technologies Used */}
                {project.technologies && project.technologies.length > 0 && (
                  <div className="bg-gray-800/50 rounded-lg p-5 border border-gray-700/30">
                    <h3 className="text-lg font-semibold text-teal-400 mb-3">Technologies</h3>
                    <ul className="list-disc list-inside space-y-1 text-gray-300 text-sm">
                      {project.technologies.map((tech, idx) => (
                        <li key={idx}>{tech}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Section: Team Members */}
                {project.members && project.members.length > 0 && (
                  <div className="bg-gray-800/50 rounded-lg p-5 border border-gray-700/30">
                    <h3 className="text-lg font-semibold text-teal-400 mb-3">Team Members</h3>
                    <ul className="space-y-2">
                      {project.members
                        .filter(member => member !== null)
                        .map((member, idx) => (
                          <li key={idx}>
                            <p className="font-medium text-gray-200 text-sm">{member.name}</p>
                            <p className="text-xs text-gray-400">{member.role}</p>
                          </li>
                        ))}
                    </ul>
                  </div>
                )}

                {/* Section: Technical Specifications */}
                {project.specifications && project.specifications.length > 0 && (
                  <div className="bg-gray-800/50 rounded-lg p-5 border border-gray-700/30">
                    <h3 className="text-lg font-semibold text-teal-400 mb-3">Specifications</h3>
                    <ul className="space-y-1 text-gray-300 text-sm">
                      {project.specifications.map((spec, idx) => (
                        <li key={idx}>
                          <span className="font-medium text-gray-200">{spec.key}:</span> {spec.value}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Section: Achievements */}
                {project.achievements && project.achievements.length > 0 && (
                  <div className="bg-gray-800/50 rounded-lg p-5 border border-gray-700/30">
                    <h3 className="text-lg font-semibold text-teal-400 mb-3">Achievements</h3>
                    <ul className="list-disc list-inside space-y-1 text-gray-300 text-sm">
                      {project.achievements.map((achievement, idx) => (
                        <li key={idx}>{achievement}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Section: Mentors */}
                {project.mentors && project.mentors.length > 0 && (
                  <div className="bg-gray-800/50 rounded-lg p-5 border border-gray-700/30">
                    <h3 className="text-lg font-semibold text-teal-400 mb-3">Mentors</h3>
                    <ul className="space-y-2">
                      {project.mentors
                        .filter(mentor => mentor !== null)
                        .map((mentor, idx) => (
                          <li key={idx}>
                            <p className="font-medium text-gray-200 text-sm">{mentor.name}</p>
                            <p className="text-xs text-gray-400">{mentor.affiliation}</p>
                          </li>
                        ))}
                    </ul>
                  </div>
                )}
                
                {/* Section: Images Gallery */}
                {project.images && project.images.length > 0 && (
                  <div className="col-span-1 md:col-span-2 lg:col-span-3 bg-gray-800/50 rounded-lg p-5 border border-gray-700/30">
                    <h3 className="text-lg font-semibold text-teal-400 mb-4">Gallery</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {project.images.map((image, idx) => (
                        <div key={idx} className="relative group overflow-hidden rounded-lg">
                          <img
                            src={image.url}
                            alt={image.alt || image.caption || project.title}
                            className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                          {image.caption && (
                            <div className="absolute inset-x-0 bottom-0 bg-black/70 text-white p-2 text-center text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              {image.caption}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Section: Links (Repository, Documentation) */}
                {(project.repositoryLinks || project.documentationLinks) && (
                  <div className="bg-gray-800/50 rounded-lg p-5 border border-gray-700/30">
                    <h3 className="text-lg font-semibold text-teal-400 mb-3">Links</h3>
                    <div className="space-y-3">
                      {project.repositoryLinks && project.repositoryLinks.length > 0 && (
                        <div>
                          <p className="font-medium text-gray-200 text-sm mb-1">Repository:</p>
                          <ul className="text-sm text-gray-300 space-y-1">
                            {project.repositoryLinks.map((link, idx) => (
                              <li key={idx}>
                                <a href={link} target="_blank" rel="noopener noreferrer" className="text-teal-400 hover:text-teal-300 transition-colors break-all">
                                  {link}
                                </a>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {project.documentationLinks && project.documentationLinks.length > 0 && (
                        <div>
                          <p className="font-medium text-gray-200 text-sm mb-1">Documentation:</p>
                          <ul className="text-sm text-gray-300 space-y-1">
                            {project.documentationLinks.map((link, idx) => (
                              <li key={idx}>
                                <a href={link} target="_blank" rel="noopener noreferrer" className="text-teal-400 hover:text-teal-300 transition-colors break-all">
                                  {link}
                                </a>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Section: Publications & Patents */}
                {(project.publications || project.patents) && (
                  <div className="bg-gray-800/50 rounded-lg p-5 border border-gray-700/30">
                    <h3 className="text-lg font-semibold text-teal-400 mb-3">Publications & Patents</h3>
                    {project.publications && project.publications.length > 0 && (
                      <div className="mb-3">
                        <p className="font-medium text-gray-200 text-sm mb-1">Publications:</p>
                        <ul className="text-sm text-gray-300 space-y-2">
                          {project.publications.map((pub, idx) => (
                            <li key={idx}>
                              <p>{pub.title}</p>
                              <p className="text-xs text-gray-500">
                                {pub.authors.join(', ')} - {pub.venue}
                              </p>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {project.patents && project.patents.length > 0 && (
                      <div>
                        <p className="font-medium text-gray-200 text-sm mb-1">Patents:</p>
                        <ul className="text-sm text-gray-300 space-y-2">
                          {project.patents.map((pat, idx) => (
                            <li key={idx}>
                              <p>{pat.title}</p>
                              <p className="text-xs text-gray-500">
                                Status: {pat.status}, Number: {pat.number}
                              </p>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {/* Section: Collaborators */}
                {project.collaborators && project.collaborators.length > 0 && (
                  <div className="bg-gray-800/50 rounded-lg p-5 border border-gray-700/30">
                    <h3 className="text-lg font-semibold text-teal-400 mb-3">Collaborators</h3>
                    <ul className="space-y-2">
                      {project.collaborators.map((collab, idx) => (
                        <li key={idx}>
                          <p className="font-medium text-gray-200 text-sm">{collab.name}</p>
                          <p className="text-xs text-gray-400">{collab.type} - {collab.role}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Section: Fabrication Details */}
                {project.fabricationDetails && (
                  <div className="bg-gray-800/50 rounded-lg p-5 border border-gray-700/30">
                    <h3 className="text-lg font-semibold text-teal-400 mb-3">Fabrication</h3>
                    <ul className="space-y-1 text-gray-300 text-sm">
                      <li><span className="font-medium text-gray-200">Process Node:</span> {project.fabricationDetails.processNode}</li>
                      <li><span className="font-medium text-gray-200">Foundry:</span> {project.fabricationDetails.foundry}</li>
                      <li><span className="font-medium text-gray-200">Status:</span> {project.fabricationDetails.status}</li>
                    </ul>
                  </div>
                )}
              </div>
              
              {/* Other sections that need full width */}
              {(project.simulationResults || project.nationalImpact) && (
                <div className="mt-6 space-y-4">
                  {project.simulationResults && (
                    <div className="bg-gray-800/50 rounded-lg p-5 border border-gray-700/30">
                      <h3 className="text-lg font-semibold text-teal-400 mb-2">Simulation Results</h3>
                      <p className="text-gray-300 text-sm">{project.simulationResults}</p>
                    </div>
                  )}
                  {project.nationalImpact && (
                    <div className="bg-gray-800/50 rounded-lg p-5 border border-gray-700/30">
                      <h3 className="text-lg font-semibold text-teal-400 mb-2">National Impact</h3>
                      <p className="text-gray-300 text-sm">{project.nationalImpact}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}