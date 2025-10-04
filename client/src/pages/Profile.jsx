import React, { useState, useRef, useEffect } from "react";
import {
  User,
  Mail,
  Github,
  Linkedin,
  MapPin,
  Calendar,
  Briefcase,
  Award,
  Edit3,
  Save,
  X,
  Plus,
  Camera,
  Upload,
  FileText,
  Download,
  Home,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";

// Helper function to handle image and file uploads
const handleFileChange = (e, callback, accept) => {
  const file = e.target.files[0];
  if (file) {
    if (accept && !file.type.match(accept)) {
      alert(`Please upload a valid file type: ${accept}`);
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      callback({
        fileData: event.target.result,
        fileName: file.name,
        fileType: file.type,
      });
    };
    reader.readAsDataURL(file);
  }
};

const ProfilePage = () => {
  const { username } = useParams();

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [skillInput, setSkillInput] = useState("");
  const [userRole, setUserRole] = useState(null);
  const [profile, setProfile] = useState({});
  const [editedProfile, setEditedProfile] = useState({});

  // Refs for file inputs
  const fileRefs = {
    profilePicture: useRef(null),
    coverPhoto: useRef(null),
    cvFile: useRef(null),
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      const accessToken = localStorage.getItem("access_token");
      let fetchUrl = username
        ? `http://localhost:5555/api/users/${username}`
        : "http://localhost:5555/api/users/profile";

      const headers = { "Content-Type": "application/json" };
      if (accessToken) {
        headers.Authorization = `Bearer ${accessToken}`;
      }

      try {
        const response = await fetch(fetchUrl, { method: "GET", headers });
        if (response.ok) {
          const userData = await response.json();
          setProfile(userData);
          setEditedProfile(userData);
          setUserRole(userData.role);
          console.log("User data fetched:", userData);
        } else {
          console.error(
            "Failed to fetch user profile:",
            response.status,
            response.statusText
          );
          setProfile({});
          setEditedProfile({});
          setUserRole(null);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        setProfile({});
        setEditedProfile({});
        setUserRole(null);
      }
    };

    fetchUserProfile();
  }, [username]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    setEditedProfile((prev) => ({ ...prev, [name]: parseInt(value) || 0 }));
  };

  const handleSave = async () => {
    setLoading(true);
    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) {
      console.error("No access token found. Cannot save profile.");
      setLoading(false);
      return;
    }

    const dataToSend = {
      ...editedProfile,
      profile_pic: editedProfile.profilePicture,
      cover_photo: editedProfile.coverPhoto,
      join_date: editedProfile.joinDate,
      cv_file: editedProfile.cvFile,
      cv_file_name: editedProfile.cvFileName,
    };

    // Clean up temporary keys before sending
    delete dataToSend.profilePicture;
    delete dataToSend.coverPhoto;
    delete dataToSend.joinDate;
    delete dataToSend.cvFileName;

    try {
      const response = await fetch("http://localhost:5555/api/users/profile", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(dataToSend),
      });

      if (response.ok) {
        const updatedUserData = await response.json();
        setProfile(updatedUserData);
        setEditedProfile(updatedUserData);
        setIsEditing(false);
        console.log("Profile updated successfully:", updatedUserData);
      } else {
        const errorData = await response.json();
        console.error(
          "Failed to save profile:",
          response.status,
          response.statusText,
          errorData
        );
        alert(
          `Failed to save profile: ${errorData.msg || response.statusText}`
        );
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("An error occurred while saving the profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddSkill = () => {
    if (skillInput.trim()) {
      setEditedProfile((prev) => ({
        ...prev,
        skills: [...(prev.skills || []), skillInput.trim()],
      }));
      setSkillInput("");
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setEditedProfile((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill !== skillToRemove),
    }));
  };

  const handleCVUpload = (e) => {
    handleFileChange(
      e,
      ({ fileData, fileName }) => {
        setEditedProfile((prev) => ({
          ...prev,
          cvFile: fileData,
          cvFileName: fileName,
        }));
      },
      ".pdf,.doc,.docx"
    );
  };

  const downloadCV = () => {
    if (profile.cvFile && profile.cvFileName) {
      const link = document.createElement("a");
      link.href = profile.cvFile;
      link.download = profile.cvFileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const removeFile = (type) => {
    setEditedProfile((prev) => ({
      ...prev,
      [type]: null,
      ...(type === "cvFile" && { cvFileName: "" }),
    }));
  };

  const handleImageUpload = (e, type) => {
    handleFileChange(
      e,
      ({ fileData }) => {
        setEditedProfile((prev) => ({ ...prev, [type]: fileData }));
      },
      "image/*"
    );
  };

  const removeImage = (type) => {
    setEditedProfile((prev) => ({
      ...prev,
      [type]: null,
    }));
  };

  const removeCV = () => {
    setEditedProfile((prev) => ({
      ...prev,
      cvFile: null,
      cvFileName: "",
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Navigation Bar */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link
                to="/projects"
                className="text-gray-600 hover:text-indigo-600 transition-colors"
              >
                <Home className="h-6 w-6" />
              </Link>
              <span className="text-xl font-bold text-gray-900">Profile</span>
            </div>

            {/* Edit/Save/Cancel Buttons */}
            {!username && userRole === "student" && (
              <div className="flex items-center space-x-3">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleSave}
                      disabled={loading}
                      className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-medium rounded-lg shadow-md hover:from-emerald-600 hover:to-teal-700 transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      {loading ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                      ) : (
                        <Save className="w-4 h-4 mr-2" />
                      )}
                      Save Changes
                    </button>
                    <button
                      onClick={() => {
                        setEditedProfile({ ...profile });
                        setIsEditing(false);
                      }}
                      className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-red-500 to-pink-600 text-white font-medium rounded-lg shadow-md hover:from-red-600 hover:to-pink-700 transform hover:scale-105 transition-all duration-200"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium rounded-lg shadow-md hover:from-indigo-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-200"
                  >
                    <Edit3 className="w-4 h-4 mr-2" />
                    Edit Profile
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Cover Photo Section */}
      <div className="relative w-full h-80 overflow-hidden">
        {(isEditing ? editedProfile.coverPhoto : profile.coverPhoto) ? (
          <img
            src={isEditing ? editedProfile.coverPhoto : profile.coverPhoto}
            alt="Cover"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
        )}

        {/* Cover photo overlay */}
        <div className="absolute inset-0 bg-black/20"></div>

        {/* Cover Photo Edit Buttons */}
        {isEditing && (
          <div className="absolute top-6 right-6 flex items-center space-x-3">
            <button
              onClick={() => fileRefs.coverPhoto.current?.click()}
              className="flex items-center px-3 py-2 bg-white/90 backdrop-blur-sm text-gray-700 font-medium rounded-lg shadow-lg hover:bg-white transition-all duration-200"
            >
              <Camera className="w-4 h-4 mr-2" />
              Change Cover
            </button>
            {(isEditing ? editedProfile.coverPhoto : profile.coverPhoto) && (
              <button
                onClick={() => removeImage("coverPhoto")}
                className="flex items-center px-3 py-2 bg-red-500/90 backdrop-blur-sm text-white font-medium rounded-lg shadow-lg hover:bg-red-600 transition-all duration-200"
              >
                <X className="w-4 h-4 mr-2" />
                Remove
              </button>
            )}
          </div>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-10">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row items-start md:items-end space-y-6 md:space-y-0 md:space-x-8 mb-8">
          {/* Profile Picture */}
          <div className="relative">
            <div className="w-40 h-40 rounded-full border-6 border-white shadow-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
              {(
                isEditing
                  ? editedProfile.profilePicture
                  : profile.profilePicture
              ) ? (
                <img
                  src={
                    isEditing
                      ? editedProfile.profilePicture
                      : profile.profilePicture
                  }
                  alt={`${profile.first_name || "User"}'s profile`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <User className="w-20 h-20 text-gray-400" />
                </div>
              )}
            </div>

            {/* Profile Picture Edit Button */}
            {isEditing && (
              <button
                onClick={() => fileRefs.profilePicture.current?.click()}
                className="absolute bottom-2 right-2 p-3 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 transform hover:scale-110 transition-all duration-200"
              >
                <Camera className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Profile Info */}
          <div className="flex-1 bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/50">
            {isEditing ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    name="first_name"
                    value={editedProfile.first_name}
                    onChange={handleChange}
                    placeholder="Enter first name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="last_name"
                    value={editedProfile.last_name}
                    onChange={handleChange}
                    placeholder="Enter last name"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Professional Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={editedProfile.title}
                    onChange={handleChange}
                    placeholder="e.g., Senior Software Engineer"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>
            ) : (
              <>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                  {profile.first_name || profile.last_name
                    ? `${profile.first_name} ${profile.last_name}`.trim()
                    : "Add Your Name"}
                </h1>
                <p className="text-xl text-indigo-600 font-medium mb-4">
                  {profile.title || "Add Your Professional Title"}
                </p>
                <div className="flex flex-wrap items-center gap-4 text-gray-600">
                  {profile.location && (
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span className="text-sm">{profile.location}</span>
                    </div>
                  )}
                  {profile.joinDate && (
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span className="text-sm">
                        Joined {new Date(profile.joinDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">
          {/* Left Column: Bio & Skills */}
          <div className="lg:col-span-2 space-y-8">
            {/* Bio Section */}
            <div className="bg-white/80 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-white/50">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <User className="w-6 h-6 mr-3 text-indigo-600" />
                About Me
              </h3>
              {isEditing ? (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Biography
                  </label>
                  <textarea
                    name="bio"
                    value={editedProfile.bio}
                    onChange={handleChange}
                    rows="6"
                    placeholder="Tell others about yourself, your experience, and what drives you..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200 resize-none"
                  />
                </div>
              ) : (
                <p className="text-gray-700 leading-relaxed text-lg">
                  {profile.bio ||
                    "Share your story, experience, and what makes you unique. Click edit to add your biography."}
                </p>
              )}
            </div>

            {/* Skills Section */}
            <div className="bg-white/80 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-white/50">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Award className="w-6 h-6 mr-3 text-indigo-600" />
                Skills & Expertise
              </h3>

              {isEditing && (
                <div className="mb-6">
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddSkill();
                        }
                      }}
                      placeholder="Add a new skill..."
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                    />
                    <button
                      onClick={handleAddSkill}
                      className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium rounded-lg shadow-md hover:from-indigo-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-200"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}

              <div className="flex flex-wrap gap-3">
                {(isEditing ? editedProfile.skills : profile.skills)?.length >
                0 ? (
                  (isEditing ? editedProfile.skills : profile.skills).map(
                    (skill, index) => (
                      <span
                        key={index}
                        className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium shadow-md transition-all duration-200 ${
                          isEditing
                            ? "bg-gradient-to-r from-red-100 to-pink-100 text-red-800 hover:from-red-200 hover:to-pink-200"
                            : "bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-800"
                        }`}
                      >
                        {skill}
                        {isEditing && (
                          <button
                            onClick={() => handleRemoveSkill(skill)}
                            className="ml-2 text-red-600 hover:text-red-800 transition-colors duration-200"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        )}
                      </span>
                    )
                  )
                ) : (
                  <p className="text-gray-500 italic">
                    {isEditing
                      ? "Add skills to showcase your expertise"
                      : "No skills listed yet"}
                  </p>
                )}
              </div>
            </div>

            {/* Stats Section */}
            <div className="bg-white/80 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-white/50">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Briefcase className="w-6 h-6 mr-3 text-indigo-600" />
                Statistics
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-6 border border-blue-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-blue-600 uppercase tracking-wide">
                        Projects
                      </p>
                      {isEditing ? (
                        <input
                          type="number"
                          name="projects"
                          value={editedProfile.projects}
                          onChange={handleNumberChange}
                          min="0"
                          className="text-3xl font-bold text-gray-900 mt-1 w-20 border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                      ) : (
                        <p className="text-3xl font-bold text-gray-900 mt-1">
                          {profile.projects || 0}
                        </p>
                      )}
                    </div>
                    <Award className="w-12 h-12 text-blue-600" />
                  </div>
                </div>
                <div className="bg-gradient-to-br from-emerald-50 to-teal-100 rounded-xl p-6 border border-emerald-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-emerald-600 uppercase tracking-wide">
                        Contributions
                      </p>
                      {isEditing ? (
                        <input
                          type="number"
                          name="contributions"
                          value={editedProfile.contributions}
                          onChange={handleNumberChange}
                          min="0"
                          className="text-3xl font-bold text-gray-900 mt-1 w-20 border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                      ) : (
                        <p className="text-3xl font-bold text-gray-900 mt-1">
                          {profile.contributions || 0}
                        </p>
                      )}
                    </div>
                    <Briefcase className="w-12 h-12 text-emerald-600" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contact & CV */}
          <div className="space-y-8">
            {/* Contact Info */}
            <div className="bg-white/80 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-white/50">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Mail className="w-6 h-6 mr-3 text-indigo-600" />
                Contact Information
              </h3>
              <div className="space-y-4">
                <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                  <Mail className="w-5 h-5 text-gray-500 mr-4 flex-shrink-0" />
                  <div className="flex-1">
                    {isEditing ? (
                      <input
                        type="email"
                        name="email"
                        value={editedProfile.email}
                        onChange={handleChange}
                        placeholder="your.email@example.com"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                      />
                    ) : (
                      <div>
                        <p className="font-medium text-gray-900">
                          {profile.email || "Add email address"}
                        </p>
                        <p className="text-sm text-gray-500">Email Address</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                  <MapPin className="w-5 h-5 text-gray-500 mr-4 flex-shrink-0" />
                  <div className="flex-1">
                    {isEditing ? (
                      <input
                        type="text"
                        name="location"
                        value={editedProfile.location}
                        onChange={handleChange}
                        placeholder="City, Country"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                      />
                    ) : (
                      <div>
                        <p className="font-medium text-gray-900">
                          {profile.location || "Add location"}
                        </p>
                        <p className="text-sm text-gray-500">Location</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                  <Github className="w-5 h-5 text-gray-500 mr-4 flex-shrink-0" />
                  <div className="flex-1">
                    {isEditing ? (
                      <input
                        type="text"
                        name="github"
                        value={editedProfile.github}
                        onChange={handleChange}
                        placeholder="https://github.com/username"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                      />
                    ) : profile.github ? (
                      <div>
                        <a
                          href={profile.github}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-indigo-600 hover:text-indigo-800 transition-colors duration-200"
                        >
                          View GitHub Profile
                        </a>
                        <p className="text-sm text-gray-500">GitHub</p>
                      </div>
                    ) : (
                      <div>
                        <p className="font-medium text-gray-900">
                          Add GitHub profile
                        </p>
                        <p className="text-sm text-gray-500">GitHub</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center p-4 bg-gray-50 rounded-lg">
                  <Linkedin className="w-5 h-5 text-gray-500 mr-4 flex-shrink-0" />
                  <div className="flex-1">
                    {isEditing ? (
                      <input
                        type="text"
                        name="linkedin"
                        value={editedProfile.linkedin}
                        onChange={handleChange}
                        placeholder="https://linkedin.com/in/username"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-200"
                      />
                    ) : profile.linkedin ? (
                      <div>
                        <a
                          href={profile.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-indigo-600 hover:text-indigo-800 transition-colors duration-200"
                        >
                          View LinkedIn Profile
                        </a>
                        <p className="text-sm text-gray-500">LinkedIn</p>
                      </div>
                    ) : (
                      <div>
                        <p className="font-medium text-gray-900">
                          Add LinkedIn profile
                        </p>
                        <p className="text-sm text-gray-500">LinkedIn</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* CV Upload/Download Section */}
            <div className="bg-white/80 backdrop-blur-md rounded-2xl p-8 shadow-xl border border-white/50">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <FileText className="w-6 h-6 mr-3 text-indigo-600" />
                Resume / CV
              </h3>

              {isEditing ? (
                <div className="space-y-4">
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-indigo-400 transition-colors duration-200">
                    {editedProfile.cvFile ? (
                      <div className="space-y-4">
                        <FileText className="w-16 h-16 text-indigo-600 mx-auto" />
                        <div>
                          <p className="text-lg font-semibold text-gray-900">
                            {editedProfile.cvFileName}
                          </p>
                          <p className="text-sm text-gray-500">
                            CV uploaded successfully
                          </p>
                        </div>
                        <div className="flex gap-3 justify-center">
                          <button
                            onClick={() => fileRefs.cvFile.current?.click()}
                            className="flex items-center px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium rounded-lg shadow-md hover:from-indigo-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-200"
                          >
                            <Upload className="w-4 h-4 mr-2" />
                            Replace CV
                          </button>
                          <button
                            onClick={removeCV}
                            className="flex items-center px-4 py-2 bg-gradient-to-r from-red-500 to-pink-600 text-white font-medium rounded-lg shadow-md hover:from-red-600 hover:to-pink-700 transform hover:scale-105 transition-all duration-200"
                          >
                            <X className="w-4 h-4 mr-2" />
                            Remove
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <Upload className="w-16 h-16 text-gray-400 mx-auto" />
                        <div>
                          <p className="text-lg font-semibold text-gray-900">
                            Upload your Resume/CV
                          </p>
                          <p className="text-sm text-gray-500">
                            PDF, DOC, or DOCX files accepted
                          </p>
                        </div>
                        <button
                          onClick={() => fileRefs.cvFile.current?.click()}
                          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium rounded-lg shadow-md hover:from-indigo-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-200"
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Upload CV
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ) : profile.cvFile && profile.cvFileName ? (
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <FileText className="w-8 h-8 text-indigo-600" />
                  <span className="flex-1 text-gray-900 font-medium">
                    {profile.cvFileName}
                  </span>
                  <button
                    onClick={downloadCV}
                    className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-teal-500 to-emerald-600 text-white font-medium rounded-lg shadow-md hover:from-teal-600 hover:to-emerald-700 transform hover:scale-105 transition-all duration-200"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </button>
                </div>
              ) : (
                <div className="text-center p-8 bg-gray-50 rounded-xl border border-gray-200">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 italic">
                    No CV uploaded yet. Click edit to add one.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Hidden file inputs */}
        <input
          type="file"
          ref={fileRefs.profilePicture}
          onChange={(e) => handleImageUpload(e, "profilePicture")}
          className="hidden"
          accept="image/*"
        />
        <input
          type="file"
          ref={fileRefs.coverPhoto}
          onChange={(e) => handleImageUpload(e, "coverPhoto")}
          className="hidden"
          accept="image/*"
        />
        <input
          type="file"
          ref={fileRefs.cvFile}
          onChange={handleCVUpload}
          className="hidden"
          accept=".pdf,.doc,.docx"
        />
      </div>
    </div>
  );
};

export default ProfilePage;