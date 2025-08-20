import { Inter } from 'next/font/google';
import Header from '../../components/header';
import Footer from '../../components/footer';
import FacultyCard from '../../components/FacultyCard';
import MemberCard from '../../components/MemberCard';

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '600'],
  display: 'swap',
});

export default function About() {
  const facultyMentor = {
    name: 'Dr. Jagadish D N',
    position: 'Associate Dean - Student Welfare [S.W.]',
    imageSrc: '/Dr.JagadishDN.png',
    linkedinUrl: 'https://www.linkedin.com/in/jagadish-d-n-23465111b/',
  };

  const supportingFaculty = [
    {
      name: 'Dr. Rajesh Kumar',
      position: 'Head of the Department [HoD] - Dept. of ECE',
      imageSrc: '/Dr.RajeshKumar.png',
      linkedinUrl: 'https://www.linkedin.com/in/dr-rajesh-kumar-2417ab11b/',
    },
    {
      name: 'Dr. Pankaj Kumar',
      position: 'Assistant Professor',
      imageSrc: '/Dr.PankajKumar.png',
      linkedinUrl: 'https://www.linkedin.com/in/pankaj-kumar-960505261/',
    },
  ];

  const alumni = [
    {
      name: 'Shiva Shankar',
      position: 'Ex - President',
      imageSrc: '/ShivaShankar.png',
      linkedin: 'https://www.linkedin.com/in/shiva-shankar-b-aa36682a1/',
    },
    {
      name: 'Yash Kumar',
      position: 'Ex - Club Member',
      imageSrc: '/YashKumar.png',
      linkedin: 'https://www.linkedin.com/in/yashkumar3066/',
      placed_at: 'SDE @ Google',
    },
    {
      name: 'Karkalle Shrinath',
      position: 'Ex - Treasurer',
      imageSrc: '/Shrinath.png',
      linkedin: 'https://www.linkedin.com/in/karkalle-shrinath-94775325a/',
      placed_at: 'Apprentship @ Boeing',
    },
    {
      name: 'Aditya Vikram Singh',
      position: 'Ex - Club Member',
      imageSrc: '/AdityaVikramSIngh.png',
      linkedin: 'https://www.linkedin.com/in/aditya-vikram-singhgh-0a260a266/',
      placed_at: 'Apprentship @ Boeing',
    },
    {
      name: 'Manish Nellimarla',
      position: 'Ex - Club Member',
      imageSrc: '/ManishNellimarla.png',
      linkedin: 'https://www.linkedin.com/in/karkalle-shrinath-94775325a/', // Verify URL
      placed_at: 'Apprentship @ Boeing',
    },
  ];

  const members = [
    {
      name: 'Divyansh Mishra',
      position: 'President',
      imageSrc: '/DivyanshMishra.png',
      gmail: '23bec016@iiitdwd.ac.in',
      linkedin: 'https://www.linkedin.com/in/divyansh-mishra-203664241/',
      github: 'https://github.com/divyanshmishra1',
      instagram: 'https://www.instagram.com/divyanshmishra9364/',
    },
    {
      name: 'Vibhav Deora',
      position: 'Secretary',
      imageSrc: '/VibhavDeora.png',
      gmail: '23bec016@iiitdwd.ac.in',
      linkedin: 'https://www.linkedin.com/in/vaibhav-deora-582503290/',
      github: 'https://github.com/divyanshmishra1',
      instagram: 'https://www.instagram.com/divyanshmishra9364/',
    },
    {
      name: 'Tejas Vijay Dahake',
      position: 'Treasurer',
      imageSrc: '/TejasDahake.png',
      gmail: '23bec016@iiitdwd.ac.in',
      linkedin: 'https://www.linkedin.com/in/tejas-vijay-dahake-7b5783359/',
      github: 'https://github.com/divyanshmishra1',
      instagram: 'https://www.instagram.com/divyanshmishra9364/',
    },
    {
      name: 'Ishaan Shetty',
      position: 'Club Member',
      imageSrc: '/IshaanShetty.png',
      gmail: '23bec016@iiitdwd.ac.in',
      linkedin: 'https://www.linkedin.com/in/ishaan-shetty-b5241b334/',
      github: 'https://github.com/divyanshmishra1',
      instagram: 'https://www.instagram.com/divyanshmishra9364/',
    },
    {
      name: 'A S Mithil',
      position: 'Club Member',
      imageSrc: '/ASMithil.png',
      gmail: '23bec016@iiitdwd.ac.in',
      linkedin: 'https://www.linkedin.com/in/mithil-a-36b79433b/',
      github: 'https://github.com/divyanshmishra1',
      instagram: 'https://www.instagram.com/divyanshmishra9364/',
    },
  ];

  // Group members by hierarchy
  const leadership = members.filter((member) =>
    ['President', 'Secretary'].includes(member.position)
  );
  const treasurer = members.filter((member) => member.position === 'Treasurer');
  const clubMembers = members.filter((member) => member.position === 'Club Member');

  // Dynamic grid class helper
  const getGridClasses = (itemCount: number) => {
    if (itemCount === 1) return 'grid grid-cols-1 justify-items-center';
    if (itemCount === 2) return 'grid grid-cols-1 sm:grid-cols-2 justify-items-center';
    return 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 justify-items-center';
  };

  return (
    <div className={`flex flex-col min-h-screen bg-black ${inter.className}`}>
      <Header />
      <div
        className="relative flex flex-col flex-grow p-8"
        style={{
          backgroundImage: "url('/image.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <main className="z-10 max-w-7xl mx-auto w-full">
          {/* Members Section */}
          <section className="py-12">
            <h2 className="text-3xl font-bold text-white text-center mb-8">Our Team</h2>

            {/* Club Leadership (President & Secretary) */}
            {leadership.length > 0 && (
              <div className="mb-12">
                <h3 className="text-2xl font-semibold text-white text-center mb-6">Club Leadership</h3>
                <div className={`${getGridClasses(leadership.length)} gap-4`}>
                  {leadership.map((member) => (
                    <MemberCard key={member.name} {...member} />
                  ))}
                </div>
              </div>
            )}

            {/* Treasurer */}
            {treasurer.length > 0 && (
              <div className="mb-12">
                <h3 className="text-2xl font-semibold text-white text-center mb-6">Treasurer</h3>
                <div className={`${getGridClasses(treasurer.length)} gap-4`}>
                  {treasurer.map((member) => (
                    <MemberCard key={member.name} {...member} />
                  ))}
                </div>
              </div>
            )}

            {/* Club Members */}
            {clubMembers.length > 0 && (
              <div>
                <h3 className="text-2xl font-semibold text-white text-center mb-6">Club Members</h3>
                <div className={`${getGridClasses(clubMembers.length)} gap-4`}>
                  {clubMembers.map((member) => (
                    <MemberCard key={member.name} {...member} />
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* Alumni */}
          <section className="py-12">
            <h2 className="text-3xl font-bold text-white text-center mb-8">Alumni</h2>
            <div className={`${getGridClasses(alumni.length)} gap-4`}>
              {alumni.map((alumnus) => (
                <MemberCard key={alumnus.name} {...alumnus} />
              ))}
            </div>
          </section>

          {/* Faculty Mentor */}
          <section className="py-12">
            <h2 className="text-3xl font-bold text-white text-center mb-8">Faculty Mentor</h2>
            <div className="flex justify-center">
              <FacultyCard {...facultyMentor} />
            </div>
          </section>

          {/* Faculty Guides */}
          <section className="py-12">
            <h2 className="text-3xl font-bold text-white text-center mb-8">Faculty Guides</h2>
            <div className={`${getGridClasses(supportingFaculty.length)} gap-4`}>
              {supportingFaculty.map((faculty) => (
                <FacultyCard key={faculty.name} {...faculty} />
              ))}
            </div>
          </section>
        </main>
      </div>
      <Footer />
    </div>
  );
}