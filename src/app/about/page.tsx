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
    <div className="flex flex-col items-center text-center animate-pulse p-6 bg-gray-900/40 rounded-xl border border-gray-800/30">
      <div className="h-32 w-32 sm:h-40 sm:w-40 rounded-full bg-gray-800/60 mb-4"></div>
      <div className="h-5 w-28 bg-gray-800/60 rounded mb-2"></div>
      <div className="h-4 w-20 bg-gray-800/60 rounded"></div>
    </div>
  );
}

// Mobile Leadership Section Component
function MobileLeadershipSection({ members }: { members: Member[] }) {
  const leadershipOrder = ["President", "Secretary", "Treasurer"];
  const sortedLeadership = leadershipOrder
    .map((position) => members.find((member) => member.position === position))
    .filter((member): member is Member => !!member);

  return (
    <div className="mb-8 sm:mb-12">
      <h3 className="text-xl sm:text-2xl font-semibold text-white text-center mb-4 sm:mb-6">Club Leadership</h3>
      <div className="grid grid-cols-1 gap-4 sm:gap-6">
        {sortedLeadership.map((member) => (
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
        const timeoutId = setTimeout(() => controller.abort(), 15000);
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

  // Group members by hierarchy with President, Secretary, and Treasurer for desktop
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
      <div className="relative flex flex-col grow p-4 sm:p-8 mt-16">
        {/* Grid Background Pattern */}
        <div
          className="absolute inset-0 [background-size:20px_20px] [background-image:linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)]"
        />
        <div className="pointer-events-none absolute inset-0 bg-black [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
        
        <main className="z-10 max-w-7xl mx-auto w-full">
          {/* Members Section */}
          <section className="py-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4 text-teal-400 tracking-tight">
              Our Team
            </h2>
            <p className="text-gray-400 text-center mb-10 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
              Meet the dedicated individuals driving our club&#39;s mission to advance VLSI design and innovation.
            </p>

            {error ? (
              <p className="text-red-400 text-center text-sm sm:text-base">{error}</p>
            ) : (
              <>
                {/* Club Leadership (President, Secretary, and Treasurer) */}
                {loading ? (
                  <div className="mb-10">
                    <h3 className="text-xl sm:text-2xl font-semibold text-white text-center mb-6">Club Leadership</h3>
                    <div className={`${getGridClasses(3)} gap-6`}>
                      {[...Array(3)].map((_, i) => <SkeletonCard key={i} />)}
                    </div>
                  </div>
                ) : leadership.length > 0 ? (
                  <>
                    {/* Mobile Leadership Section (below sm breakpoint) */}
                    <div className="block sm:hidden">
                      <MobileLeadershipSection members={leadership} />
                    </div>
                    {/* Desktop Leadership Section (sm breakpoint and above) */}
                    <div className="hidden sm:block mb-10">
                      <h3 className="text-xl sm:text-2xl font-semibold text-white text-center mb-6">Club Leadership</h3>
                      <div className={`${getGridClasses(leadership.length)} gap-6`}>
                        {leadership.map((member) => (
                          <MemberCard
                            key={member._id}
                            name={member.name}
                            position={member.position}
                            imageSrc={member.image?.asset?.url ? `${member.image.asset.url}?w=384&h=384` : "/placeholder.png"}
                            linkedin={member.linkedin}
                            className={member.position !== "President" ? "mt-8" : ""}
                          />
                        ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <p className="text-gray-400 text-center">No leadership members available.</p>
                )}

                {/* Club Members */}
                {loading ? (
                  <div>
                    <h3 className="text-xl sm:text-2xl font-semibold text-white text-center mb-6">Club Members</h3>
                    <div className={`${getGridClasses(3)} gap-6`}>
                      {[...Array(3)].map((_, i) => <SkeletonCard key={i} />)}
                    </div>
                  </div>
                ) : clubMembers.length > 0 ? (
                  <div>
                    <h3 className="text-xl sm:text-2xl font-semibold text-white text-center mb-6">Club Members</h3>
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
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4 bg-linear-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
              Alumni
            </h2>
            <p className="text-gray-400 text-center mb-10 text-sm sm:text-base max-w-2xl mx-auto">
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
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-8 bg-linear-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
              Faculty Mentor
            </h2>
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
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-8 bg-linear-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent">
              Faculty Guides
            </h2>
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
              href="/club-projects"
              className="inline-flex items-center gap-2 px-8 py-3 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-500 transition-all duration-300"
            >
              View Club Projects
            </Link>
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
}