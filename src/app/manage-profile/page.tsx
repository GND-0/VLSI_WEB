// src/app/manage-profile/page.tsx
"use client";
import { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import localFont from 'next/font/local';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const customFont = localFont({
  src: '../../components/f1.ttf',
  display: 'swap',
});

export default function ManageProfile() {
  const { user, updateProfile } = useAuth();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bio: '',
    department: '',
    year: '',
    phone: '',
    interests: [] as string[]
  });

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    setFormData({
      name: user.name || '',
      email: user.email || '',
      bio: user.bio || '',
      department: user.department || '',
      year: user.year || '',
      phone: user.phone || '',
      interests: user.interests || []
    });
  }, [user, router]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleInterestToggle = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await updateProfile(formData);
      setShowSuccess(true);
      setIsEditing(false);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name: string | null | undefined) => {
    if (!name) return 'U';
    return name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
  };

  const profileColors = [
    'from-purple-500 to-pink-500',
    'from-blue-500 to-cyan-500',
    'from-green-500 to-teal-500',
    'from-orange-500 to-red-500',
    'from-indigo-500 to-purple-500'
  ];

  const userColorIndex = formData.name ? formData.name.length % profileColors.length : 0;

  const departments = ['Computer Science', 'Electronics & Communication', 'Electrical', 'Mechanical', 'Civil', 'Other'];
  const years = ['1st Year', '2nd Year', '3rd Year', '4th Year', 'Graduate', 'Faculty'];
  const availableInterests = ['VLSI Design', 'Digital Circuits', 'Analog Circuits', 'FPGA', 'PCB Design', 'Embedded Systems', 'Signal Processing', 'IoT', 'Machine Learning', 'Research'];

  if (!user) return null;

  return (
    <div className={`min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white ${customFont.className} relative overflow-hidden`}>
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating Particles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-blue-400 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          />
        ))}
        
        {/* Gradient Orbs */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        
        {/* Interactive Mouse Trail */}
        {isHovering && (
          <div
            className="absolute w-8 h-8 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full blur-sm opacity-70 pointer-events-none transition-all duration-200"
            style={{
              left: mousePosition.x - 16,
              top: mousePosition.y - 16,
              transform: 'translate(-50%, -50%)'
            }}
          />
        )}
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors group">
            <svg className="w-6 h-6 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Back to Home</span>
          </Link>
          
          {/* Success Notification */}
          {showSuccess && (
            <div className="fixed top-24 right-6 z-50 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-lg shadow-xl animate-bounce">
              <div className="flex items-center space-x-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Profile updated successfully!</span>
              </div>
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Profile Card */}
            <div className="lg:col-span-1">
              <div 
                className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-6 hover:border-blue-500/50 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/10"
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
              >
                {/* Profile Picture */}
                <div className="flex flex-col items-center mb-6">
                  <div className="relative">
                    <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${profileColors[userColorIndex]} flex items-center justify-center text-white font-bold text-2xl shadow-2xl ring-4 ring-white/20 hover:ring-white/40 transition-all duration-300 hover:scale-110`}>
                      {getInitials(formData.name)}
                    </div>
                    {/* Pulsing Rings */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 animate-ping opacity-20"></div>
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 animate-ping opacity-20" style={{ animationDelay: '0.5s' }}></div>
                  </div>
                  <h1 className="text-2xl font-bold mt-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    {formData.name || 'User'}
                  </h1>
                  <p className="text-gray-400 text-sm mt-1">{formData.department && formData.year ? `${formData.department} • ${formData.year}` : formData.email}</p>
                </div>

                {/* Quick Stats */}
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg p-4 border border-blue-500/20">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Member Since</span>
                      <span className="text-blue-400 font-semibold">2024</span>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-green-500/10 to-teal-500/10 rounded-lg p-4 border border-green-500/20">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Events Attended</span>
                      <span className="text-green-400 font-semibold">12</span>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-orange-500/10 to-red-500/10 rounded-lg p-4 border border-orange-500/20">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Projects</span>
                      <span className="text-orange-400 font-semibold">5</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Section */}
            <div className="lg:col-span-2">
              <div className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-8 hover:border-blue-500/30 transition-all duration-500">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    Profile Settings
                  </h2>
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className={`px-6 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 ${
                      isEditing 
                        ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-400 hover:to-red-500 text-white' 
                        : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-400 hover:to-purple-400 text-white'
                    }`}
                  >
                    {isEditing ? 'Cancel' : 'Edit Profile'}
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Personal Information */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-gray-300 text-sm font-medium mb-2">Full Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed text-white placeholder-gray-400"
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div>
                      <label className="block text-gray-300 text-sm font-medium mb-2">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed text-white placeholder-gray-400"
                        placeholder="Enter your email"
                      />
                    </div>
                  </div>

                  {/* Academic Information */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-gray-300 text-sm font-medium mb-2">Department</label>
                      <select
                        name="department"
                        value={formData.department}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed text-white"
                      >
                        <option value="">Select Department</option>
                        {departments.map(dept => (
                          <option key={dept} value={dept}>{dept}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-gray-300 text-sm font-medium mb-2">Year/Level</label>
                      <select
                        name="year"
                        value={formData.year}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed text-white"
                      >
                        <option value="">Select Year</option>
                        {years.map(year => (
                          <option key={year} value={year}>{year}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Contact */}
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">Phone Number</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed text-white placeholder-gray-400"
                      placeholder="Enter your phone number"
                    />
                  </div>

                  {/* Bio */}
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">Bio</label>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      rows={4}
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed text-white placeholder-gray-400 resize-none"
                      placeholder="Tell us about yourself..."
                    />
                  </div>

                  {/* Interests */}
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">Interests</label>
                    <div className="flex flex-wrap gap-2">
                      {availableInterests.map(interest => (
                        <button
                          key={interest}
                          type="button"
                          onClick={() => handleInterestToggle(interest)}
                          disabled={!isEditing}
                          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 transform hover:scale-105 disabled:cursor-not-allowed ${
                            formData.interests.includes(interest)
                              ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg hover:shadow-blue-500/25'
                              : 'bg-gray-800/50 text-gray-300 border border-gray-600 hover:border-blue-500/50 hover:bg-blue-500/10'
                          }`}
                        >
                          {interest}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Save Button */}
                  {isEditing && (
                    <div className="pt-6 border-t border-gray-700/50">
                      <button
                        onClick={handleSave}
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 disabled:from-gray-600 disabled:to-gray-700 text-white py-4 rounded-lg font-bold text-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-2xl hover:shadow-blue-500/25 disabled:cursor-not-allowed disabled:scale-100 disabled:shadow-none relative overflow-hidden"
                      >
                        {loading ? (
                          <div className="flex items-center justify-center space-x-2">
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            <span>Saving...</span>
                          </div>
                        ) : (
                          <>
                            <span className="relative z-10">Save Changes</span>
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Additional Actions */}
              <div className="mt-8 grid md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-xl p-6 hover:border-orange-500/40 transition-all duration-300">
                  <h3 className="text-lg font-bold text-orange-400 mb-2">Security Settings</h3>
                  <p className="text-gray-400 text-sm mb-4">Update your password and security preferences</p>
                  <button className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105">
                    Manage Security
                  </button>
                </div>

                <div className="bg-gradient-to-br from-green-500/10 to-teal-500/10 border border-green-500/20 rounded-xl p-6 hover:border-green-500/40 transition-all duration-300">
                  <h3 className="text-lg font-bold text-green-400 mb-2">Account Data</h3>
                  <p className="text-gray-400 text-sm mb-4">Download or delete your account data</p>
                  <button className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-400 hover:to-teal-400 text-white px-4 py-2 rounded-lg font-medium transition-all duration-300 transform hover:scale-105">
                    Export Data
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Action Button */}
        <div className="fixed bottom-8 right-8 z-50">
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white p-4 rounded-full shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 group"
          >
            <svg className="w-6 h-6 group-hover:-translate-y-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
            </svg>
          </button>
        </div>
      </div>

      {/* Matrix Rain Effect */}
      <style jsx>{`
        @keyframes matrix-rain {
          0% { transform: translateY(-100vh); opacity: 1; }
          100% { transform: translateY(100vh); opacity: 0; }
        }
        
        .matrix-rain::before {
          content: '';
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(0, 255, 255, 0.03), transparent);
          animation: matrix-rain 3s linear infinite;
          pointer-events: none;
        }
        
        /* Glowing text effect */
        .glow-text {
          text-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
        }
        
        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: rgba(55, 65, 81, 0.3);
          border-radius: 10px;
        }
        
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #3b82f6, #8b5cf6);
          border-radius: 10px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #2563eb, #7c3aed);
        }
      `}</style>
    </div>
  );
}