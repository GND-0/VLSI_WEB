'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import YouTube from 'react-lite-youtube-embed';
import 'react-lite-youtube-embed/dist/LiteYouTubeEmbed.css';

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

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

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
      <div className="flex justify-center items-center h-screen bg-gray-900 text-white">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-t-4 border-purple-500 rounded-full border-solid border-t-transparent"
        ></motion.div>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-900 text-white p-6 text-center">
        <h1 className="text-4xl font-bold mb-4">No Projects Found</h1>
        <p className="text-lg text-gray-400">
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
    <div className="bg-gray-950 text-white min-h-screen font-sans antialiased p-8 lg:p-16">
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-16"
      >
        <h1 className="text-5xl lg:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 leading-tight">
          VLSI Club Projects
        </h1>
        <p className="mt-4 text-xl text-gray-300 max-w-2xl mx-auto">
          Explore the groundbreaking work from our brilliant minds in the world of VLSI.
        </p>
      </motion.header>

      <AnimatePresence>
        <motion.div
          className="space-y-24"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {projects.map((project, index) => (
            <motion.div
              key={project._id}
              className="bg-gray-900 rounded-3xl p-8 lg:p-12 shadow-2xl overflow-hidden transform transition-transform duration-500 hover:scale-[1.01]"
              variants={itemVariants}
            >
              <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                <div className="lg:w-1/2">
                  <motion.h2
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-500 mb-4 leading-snug"
                  >
                    {project.title}
                  </motion.h2>
                  <motion.p
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                    className="text-gray-400 text-lg mb-6"
                  >
                    {project.description}
                  </motion.p>
                  <div className="flex items-center mb-6 text-gray-400">
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold mr-2 ${
                      project.status === 'ongoing' ? 'bg-yellow-800 text-yellow-300' : 'bg-green-800 text-green-300'
                    }`}>
                      {project.status.toUpperCase()}
                    </span>
                    <span className="text-sm">
                      {new Date(project.startDate).toLocaleDateString()}
                      {project.endDate && ` - ${new Date(project.endDate).toLocaleDateString()}`}
                    </span>
                  </div>
                </div>
                
                {project.videos && project.videos.length > 0 && (
                  <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                    className="lg:w-1/2 flex flex-col items-center justify-center p-4 bg-gray-800 rounded-xl"
                  >
                    <h3 className="text-2xl font-semibold mb-4 text-center">Project Videos</h3>
                    {project.videos.map((video, idx) => (
                      <div key={idx} className="w-full mb-6">
                        <YouTube
                          id={getYoutubeId(video.url) || ''}
                          title={video.caption || project.title}
                          adNetwork
                          noCookie={true}
                          wrapperClass="rounded-lg shadow-lg overflow-hidden w-full aspect-video"
                        />
                        {video.caption && (
                          <p className="mt-2 text-sm text-gray-500 text-center">{video.caption}</p>
                        )}
                      </div>
                    ))}
                  </motion.div>
                )}
              </div>

              {/* Grid Layout for other sections */}
              <motion.div 
                className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                {/* Section: Technologies Used */}
                {project.technologies && project.technologies.length > 0 && (
                  <motion.div className="bg-gray-800 rounded-xl p-6 shadow-md transition-shadow duration-300 hover:shadow-lg">
                    <h3 className="text-xl font-semibold text-purple-400 mb-3">Technologies</h3>
                    <ul className="list-disc list-inside space-y-1 text-gray-300">
                      {project.technologies.map((tech, idx) => (
                        <li key={idx}>{tech}</li>
                      ))}
                    </ul>
                  </motion.div>
                )}

                {/* Section: Team Members */}
                {project.members && project.members.length > 0 && (
                <motion.div className="bg-gray-800 rounded-xl p-6 shadow-md transition-shadow duration-300 hover:shadow-lg">
                    <h3 className="text-xl font-semibold text-purple-400 mb-3">Team Members</h3>
                    <ul className="space-y-3">
                    {/* Filter out any null values before mapping */}
                    {project.members
                        .filter(member => member !== null)
                        .map((member, idx) => (
                        <li key={idx} className="flex items-center">
                            <div className="flex-1">
                            <p className="font-medium text-gray-200">{member.name}</p>
                            <p className="text-sm text-gray-400">{member.role}</p>
                            </div>
                        </li>
                        ))}
                    </ul>
                </motion.div>
                )}

                {/* Section: Technical Specifications */}
                {project.specifications && project.specifications.length > 0 && (
                  <motion.div className="bg-gray-800 rounded-xl p-6 shadow-md transition-shadow duration-300 hover:shadow-lg">
                    <h3 className="text-xl font-semibold text-purple-400 mb-3">Specifications</h3>
                    <ul className="space-y-2 text-gray-300">
                      {project.specifications.map((spec, idx) => (
                        <li key={idx}>
                          <span className="font-medium text-gray-200">{spec.key}:</span> {spec.value}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}

                {/* Section: Achievements */}
                {project.achievements && project.achievements.length > 0 && (
                  <motion.div className="bg-gray-800 rounded-xl p-6 shadow-md transition-shadow duration-300 hover:shadow-lg">
                    <h3 className="text-xl font-semibold text-purple-400 mb-3">Achievements</h3>
                    <ul className="list-disc list-inside space-y-1 text-gray-300">
                      {project.achievements.map((achievement, idx) => (
                        <li key={idx}>{achievement}</li>
                      ))}
                    </ul>
                  </motion.div>
                )}

                {/* Section: Mentors */}
                {project.mentors && project.mentors.length > 0 && (
                <motion.div className="bg-gray-800 rounded-xl p-6 shadow-md transition-shadow duration-300 hover:shadow-lg">
                    <h3 className="text-xl font-semibold text-purple-400 mb-3">Mentors</h3>
                    <ul className="space-y-3">
                    {/* Filter out any null values before mapping */}
                    {project.mentors
                        .filter(mentor => mentor !== null)
                        .map((mentor, idx) => (
                        <li key={idx}>
                            <p className="font-medium text-gray-200">{mentor.name}</p>
                            <p className="text-sm text-gray-400">{mentor.affiliation}</p>
                        </li>
                        ))}
                    </ul>
                </motion.div>
                )}
                
                {/* Section: Images Gallery */}
                {project.images && project.images.length > 0 && (
                  <motion.div className="col-span-1 md:col-span-2 lg:col-span-3 bg-gray-800 rounded-xl p-6 shadow-md transition-shadow duration-300 hover:shadow-lg">
                    <h3 className="text-2xl font-semibold text-purple-400 mb-4">Gallery</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {project.images.map((image, idx) => (
                        <div key={idx} className="relative group overflow-hidden rounded-lg">
                          <img
                            src={image.url}
                            alt={image.alt || image.caption || project.title}
                            className="w-full h-48 object-cover transform transition-transform duration-300 group-hover:scale-105"
                          />
                          {image.caption && (
                            <div className="absolute inset-x-0 bottom-0 bg-black bg-opacity-60 text-white p-2 text-center text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              {image.caption}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}

                {/* Section: Links (Repository, Documentation) */}
                {(project.repositoryLinks || project.documentationLinks) && (
                  <motion.div className="bg-gray-800 rounded-xl p-6 shadow-md transition-shadow duration-300 hover:shadow-lg">
                    <h3 className="text-xl font-semibold text-purple-400 mb-3">Links</h3>
                    <div className="space-y-2">
                      {project.repositoryLinks && project.repositoryLinks.length > 0 && (
                        <div>
                          <p className="font-medium text-gray-200">Repository:</p>
                          <ul className="list-disc list-inside text-sm text-gray-300">
                            {project.repositoryLinks.map((link, idx) => (
                              <li key={idx}>
                                <a href={link} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                                  {link}
                                </a>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      {project.documentationLinks && project.documentationLinks.length > 0 && (
                        <div>
                          <p className="font-medium text-gray-200">Documentation:</p>
                          <ul className="list-disc list-inside text-sm text-gray-300">
                            {project.documentationLinks.map((link, idx) => (
                              <li key={idx}>
                                <a href={link} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                                  {link}
                                </a>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}

                {/* Section: Publications & Patents */}
                {(project.publications || project.patents) && (
                  <motion.div className="bg-gray-800 rounded-xl p-6 shadow-md transition-shadow duration-300 hover:shadow-lg">
                    <h3 className="text-xl font-semibold text-purple-400 mb-3">Publications & Patents</h3>
                    {project.publications && project.publications.length > 0 && (
                      <div className="mb-4">
                        <p className="font-medium text-gray-200">Publications:</p>
                        <ul className="list-disc list-inside text-sm text-gray-300 space-y-2">
                          {project.publications.map((pub, idx) => (
                            <li key={idx}>
                              <p>{pub.title}</p>
                              <p className="text-xs text-gray-500 italic">
                                {pub.authors.join(', ')} - {pub.venue}
                              </p>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {project.patents && project.patents.length > 0 && (
                      <div>
                        <p className="font-medium text-gray-200">Patents:</p>
                        <ul className="list-disc list-inside text-sm text-gray-300 space-y-2">
                          {project.patents.map((pat, idx) => (
                            <li key={idx}>
                              <p>{pat.title}</p>
                              <p className="text-xs text-gray-500 italic">
                                Status: {pat.status}, Number: {pat.number}
                              </p>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Section: Collaborators */}
                {project.collaborators && project.collaborators.length > 0 && (
                  <motion.div className="bg-gray-800 rounded-xl p-6 shadow-md transition-shadow duration-300 hover:shadow-lg">
                    <h3 className="text-xl font-semibold text-purple-400 mb-3">Collaborators</h3>
                    <ul className="space-y-3">
                      {project.collaborators.map((collab, idx) => (
                        <li key={idx}>
                          <p className="font-medium text-gray-200">{collab.name}</p>
                          <p className="text-sm text-gray-400">{collab.type} - {collab.role}</p>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}

                {/* Section: Fabrication Details */}
                {project.fabricationDetails && (
                  <motion.div className="bg-gray-800 rounded-xl p-6 shadow-md transition-shadow duration-300 hover:shadow-lg">
                    <h3 className="text-xl font-semibold text-purple-400 mb-3">Fabrication</h3>
                    <ul className="space-y-2 text-gray-300">
                      <li><span className="font-medium text-gray-200">Process Node:</span> {project.fabricationDetails.processNode}</li>
                      <li><span className="font-medium text-gray-200">Foundry:</span> {project.fabricationDetails.foundry}</li>
                      <li><span className="font-medium text-gray-200">Status:</span> {project.fabricationDetails.status}</li>
                    </ul>
                  </motion.div>
                )}
              </motion.div>
              
              {/* Other sections that need full width */}
              <div className="mt-12 space-y-8">
                {project.simulationResults && (
                  <motion.div 
                    className="bg-gray-800 rounded-xl p-6 shadow-md"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.6 }}
                  >
                    <h3 className="text-xl font-semibold text-purple-400 mb-3">Simulation Results</h3>
                    <p className="text-gray-300">{project.simulationResults}</p>
                  </motion.div>
                )}
                {project.nationalImpact && (
                  <motion.div 
                    className="bg-gray-800 rounded-xl p-6 shadow-md"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.7, duration: 0.6 }}
                  >
                    <h3 className="text-xl font-semibold text-purple-400 mb-3">National Impact</h3>
                    <p className="text-gray-300">{project.nationalImpact}</p>
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}