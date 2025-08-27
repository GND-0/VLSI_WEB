"use client";

import { Inter } from "next/font/google";
import Header from "../../components/header";
import Footer from "../../components/footer";
import FacultyCard from "../../components/FacultyCard";
import MemberCard from "../../components/MemberCard";
import AlumniCard from "../../components/AlumniCard";
import { useState, useEffect } from "react";
import Link from "next/link";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "600"],
  display: "swap",
});

interface Member {
  _id: string;
  name: string;
  position: string;
  linkedin: string;
  order?: number;
  image?: { asset?: { url: string } };
}

interface Faculty {
  _id: string;
  name: string;
  position: string;
  institute_position: string;
  linkedin: string;
  image?: { asset?: { url: string } };
}

interface Alumni {
  _id: string;
  name: string;
  position: string;
  placed_at: string;
  linkedin: string;
  order?: number;
  image?: { asset?: { url: string } };
}

// Skeleton Loader Component
function SkeletonCard() {
  return (
    <div className="flex flex-col items-center text-center animate-pulse">
      <div className="h-48 w-48 rounded-full bg-gray-800 mb-4"></div>
      <div className="h-6 w-3/4 bg-gray-800 rounded mb-2"></div>
      <div className="h-4 w-1/2 bg-gray-800 rounded"></div>
    </div>
  );
}

export default function About() {
  const [faculty, setFaculty] = useState<Faculty[]>([]);
  const [alumni, setAlumni] = useState<Alumni[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000); // Increased to 15s
        const response = await fetch("/api/sanity", { signal: controller.signal });
        clearTimeout(timeoutId);
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        if (data.error) throw new Error(data.error);
        setFaculty(data.faculty || []);
        setAlumni(data.alumni || []);
        setMembers(data.members || []);
        console.log("Fetched data:", data);
      } catch (error: unknown) {
        console.error("Error fetching data from API:", error);
        const errorMessage = error instanceof Error ? error.message : "Failed to load data. Please try again later.";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Group members by hierarchy with President, Secretary, and Treasurer
  const leadership = members
    .filter((member) => ["President", "Secretary", "Treasurer"].includes(member.position))
    .sort((a, b) => {
      const order: Record<string, number> = { President: 1, Secretary: 0, Treasurer: 2 };
      return order[a.position] - order[b.position];
    });
  const clubMembers = members
    .filter((member) => member.position === "Member")
    .sort((a, b) => (a.order ?? Infinity) - (b.order ?? Infinity));

  // Sort alumni by order
  const sortedAlumni = alumni.sort((a, b) => (a.order ?? Infinity) - (b.order ?? Infinity));

  // Group faculty by position
  const facultyMentor = faculty.filter((f) => f.position === "Faculty Mentor");
  const facultyGuides = faculty.filter((f) => f.position === "Faculty Guide");

  // Dynamic grid class helper
  const getGridClasses = (itemCount: number) => {
    if (itemCount === 1) return "grid grid-cols-1 justify-items-center";
    if (itemCount === 2) return "grid grid-cols-1 sm:grid-cols-2 justify-items-center";
    return "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 justify-items-center";
  };

  return (
    <div className={`flex flex-col min-h-screen bg-black ${inter.className}`}>
      <Header />
      <div
        className="relative flex flex-col flex-grow p-4 sm:p-8"
        style={{
          backgroundImage: "url('/image.png')",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      >
        <main className="z-10 max-w-7xl mx-auto w-full">
          {/* Members Section */}
          <section className="py-12">
            <h2 className="text-4xl font-bold text-white text-center mb-8">Our Team</h2>
            <p className="text-gray-400 text-center mb-12 max-w-3xl mx-auto">
              Meet the dedicated individuals driving our club&#39;s mission to advance VLSI design and innovation.
            </p>

            {error ? (
              <p className="text-red-400 text-center">{error}</p>
            ) : (
              <>
                {/* Club Leadership (President, Secretary, and Treasurer) */}
                {loading ? (
                  <div className="mb-12">
                    <h3 className="text-2xl font-semibold text-white text-center mb-6">Club Leadership</h3>
                    <div className={`${getGridClasses(3)} gap-6`}>
                      {[...Array(3)].map((_, i) => <SkeletonCard key={i} />)}
                    </div>
                  </div>
                ) : leadership.length > 0 ? (
                  <div className="mb-12">
                    <h3 className="text-2xl font-semibold text-white text-center mb-6">Club Leadership</h3>
                    <div className={`${getGridClasses(leadership.length)} gap-6`}>
                      {leadership.map((member) => (
                        <MemberCard
                          key={member._id}
                          name={member.name}
                          position={member.position}
                          imageSrc={member.image?.asset?.url ? `${member.image.asset.url}?w=384&h=384` : "/placeholder.png"}
                          linkedin={member.linkedin}
                          className={member.position !== "President" ? "mt-25" : ""}
                        />
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-400 text-center">No leadership members available.</p>
                )}

                {/* Club Members */}
                {loading ? (
                  <div>
                    <h3 className="text-2xl font-semibold text-white text-center mb-6">Club Members</h3>
                    <div className={`${getGridClasses(3)} gap-6`}>
                      {[...Array(3)].map((_, i) => <SkeletonCard key={i} />)}
                    </div>
                  </div>
                ) : clubMembers.length > 0 ? (
                  <div>
                    <h3 className="text-2xl font-semibold text-white text-center mb-6">Club Members</h3>
                    <div className={`${getGridClasses(clubMembers.length)} gap-6`}>
                      {clubMembers.map((member) => (
                        <MemberCard
                          key={member._id}
                          name={member.name}
                          position={member.position}
                          imageSrc={member.image?.asset?.url ? `${member.image.asset.url}?w=384&h=384` : "/placeholder.png"}
                          linkedin={member.linkedin}
                        />
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-400 text-center">No club members available.</p>
                )}
              </>
            )}
          </section>

          {/* Alumni */}
          <section className="py-12">
            <h2 className="text-4xl font-bold text-white text-center mb-8">Alumni</h2>
            <p className="text-gray-400 text-center mb-12 max-w-3xl mx-auto">
              Our alumni have gone on to make significant contributions in the field of VLSI and beyond.
            </p>
            {error ? (
              <p className="text-red-400 text-center">{error}</p>
            ) : loading ? (
              <div className={`${getGridClasses(3)} gap-6`}>
                {[...Array(3)].map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : sortedAlumni.length > 0 ? (
              <div className={`${getGridClasses(sortedAlumni.length)} gap-6`}>
                {sortedAlumni.map((alumnus) => (
                  <AlumniCard
                    key={alumnus._id}
                    name={alumnus.name}
                    position={alumnus.position}
                    placed_at={alumnus.placed_at}
                    imageSrc={alumnus.image?.asset?.url ? `${alumnus.image.asset.url}?w=384&h=384` : "/placeholder.png"}
                    linkedin={alumnus.linkedin}
                  />
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-center">No alumni available.</p>
            )}
          </section>

          {/* Faculty Mentor */}
          <section className="py-12">
            <h2 className="text-4xl font-bold text-white text-center mb-8">Faculty Mentor</h2>
            {error ? (
              <p className="text-red-400 text-center">{error}</p>
            ) : loading ? (
              <div className="flex justify-center">
                <SkeletonCard />
              </div>
            ) : facultyMentor.length > 0 ? (
              <div className="flex justify-center">
                {facultyMentor.map((mentor) => (
                  <FacultyCard
                    key={mentor._id}
                    name={mentor.name}
                    position={mentor.institute_position}
                    imageSrc={mentor.image?.asset?.url ? `${mentor.image.asset.url}?w=384&h=384` : "/placeholder.png"}
                    linkedin={mentor.linkedin}
                  />
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-center">No faculty mentor available.</p>
            )}
          </section>

          {/* Faculty Guides */}
          <section className="py-12">
            <h2 className="text-4xl font-bold text-white text-center mb-8">Faculty Guides</h2>
            {error ? (
              <p className="text-red-400 text-center">{error}</p>
            ) : loading ? (
              <div className={`${getGridClasses(2)} gap-6`}>
                {[...Array(2)].map((_, i) => <SkeletonCard key={i} />)}
              </div>
            ) : facultyGuides.length > 0 ? (
              <div className={`${getGridClasses(facultyGuides.length)} gap-6`}>
                {facultyGuides.map((faculty) => (
                  <FacultyCard
                    key={faculty._id}
                    name={faculty.name}
                    position={faculty.institute_position}
                    imageSrc={faculty.image?.asset?.url ? `${faculty.image.asset.url}?w=384&h=384` : "/placeholder.png"}
                    linkedin={faculty.linkedin}
                  />
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-center">No faculty guides available.</p>
            )}
          </section>

          {/* View Club Projects Button */}
          <div className="py-12 flex justify-center">
            <Link
              href="/projects"
              className="relative text-white text-lg font-bold tracking-tight matrix-text-header transition-all duration-300 px-6 py-3 bg-blue-500 hover:bg-blue-600 rounded-full matrix-container-header"
              data-text="View Club Projects"
            >
              <span>View Club Projects</span>
              <div className="matrix-rain-header"></div>
            </Link>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}