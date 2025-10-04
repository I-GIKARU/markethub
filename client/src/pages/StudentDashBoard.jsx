import React, { useState, useEffect, useRef, useCallback } from "react"; // Import useCallback
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import UploadProject from "./UploadProject";
import { Home } from "lucide-react";
import {
  IconBrandTabler,
  IconSettings,
  IconBook,
  IconBell,
  IconSearch,
  IconCalendar,
  IconFileText,
  IconStar,
  IconChartBar,
  IconUpload,
} from "@tabler/icons-react";
import { toast } from "sonner";

export function StudentDashBoard() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [projects, setProjects] = useState([]);
  const [activeLink, setActiveLink] = useState("Dashboard");
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(true);
  const [profileImage, setProfileImage] = useState(
    "https://randomuser.me/api/portraits/men/32.jpg"
  );

  // Function to fetch user's projects
  const fetchUserProjects = useCallback(async () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      // This case is handled in the main useEffect for initial load/redirect
      return;
    }
    try {
      const res = await fetch("http://localhost:5555/api/users/projects", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) {
        // If the token is invalid or expired, log out
        if (res.status === 401 || res.status === 403) {
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          toast.error("Session expired or unauthorized. Please log in again.");
          navigate("/login");
          return;
        }
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      setProjects(data);
    } catch (err) {
      console.error("Error fetching user projects:", err);
      toast.error("Failed to load your projects.");
    }
  }, [navigate]);

  useEffect(() => {
    const fetchInitialData = async () => {
      const token = localStorage.getItem("access_token");

      if (!token) {
        console.warn("No authentication token found. Redirecting to login.");
        navigate("/login");
        return;
      }

      try {
        setLoading(true);
        // Fetch user profile
        const userRes = await fetch("http://localhost:5555/api/users/profile", {
          // <--- UPDATED THIS LINE
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!userRes.ok) {
          if (userRes.status === 401 || userRes.status === 403) {
            localStorage.removeItem("access_token");
            localStorage.removeItem("refresh_token");
            toast.error(
              "Session expired or unauthorized. Please log in again."
            );
            navigate("/login");
            return;
          }
          throw new Error(`HTTP error! status: ${userRes.status}`);
        }

        const userData = await userRes.json();
        setUserName(userData.username || userData.name || "Student");
        if (userData.profile_picture) {
          setProfileImage(userData.profile_picture);
        }

        // Fetch projects immediately after user data
        await fetchUserProjects();
      } catch (err) {
        console.error("Error fetching initial data:", err);
        setError("Failed to load data. Redirecting to login...");
        setTimeout(() => navigate("/login"), 3000);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [navigate, fetchUserProjects]);

  // This function now expects the backend response which should contain the new project data
  const handleProjectUpload = (newProjectResult) => {
    // Assuming newProjectResult is an object like { msg: "...", project: { ... } }
    if (newProjectResult && newProjectResult.project) {
      setProjects((prev) => [newProjectResult.project, ...prev]);
      setActiveLink("My Projects"); // Switch to My Projects view to show the newly uploaded project
      toast.success("Project submitted! Awaiting admin review.");
    } else {
      toast.error("Project upload successful, but received unexpected data.");
    }
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
      console.log("Selected file for upload:", file);
      // Implement actual profile picture upload to backend here
    }
  };

  const links = [
    {
      label: "Home",
      href: "/",
      icon: <Home className="h-5 w-5 shrink-0" />,
    },
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: <IconBrandTabler className="h-5 w-5 shrink-0" />,
    },
    {
      label: "Upload Projects",
      href: "/dashboard/upload-project",
      icon: <IconUpload className="h-5 w-5 shrink-0" />,
    },
    {
      label: "My Projects",
      href: "/my-projects",
      icon: <IconFileText className="h-5 w-5 shrink-0" />,
    },
    {
      label: "Courses",
      href: "/courses",
      icon: <IconBook className="h-5 w-5 shrink-0" />,
    },
    {
      label: "Grades",
      href: "/grades",
      icon: <IconStar className="h-5 w-5 shrink-0" />,
    },
    {
      label: "Analytics",
      href: "/student-profile",
      icon: <IconChartBar className="h-5 w-5 shrink-0" />,
    },
  ];

  const renderComponent = () => {
    switch (activeLink) {
      case "Upload Projects":
        return <UploadProject onProjectUpload={handleProjectUpload} />;
      case "My Projects":
        return <MyProjects projects={projects} />;
      case "Dashboard":
      default:
        // Pass projects to Dashboard
        return <Dashboard projects={projects} userName={userName} />;
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-gray-50 dark:bg-neutral-900 items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen bg-gray-50 dark:bg-neutral-900 items-center justify-center">
        <div className="text-red-500 dark:text-red-400 text-lg">{error}</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-neutral-900">
      {/* Sidebar */}
      <motion.div
        initial={{ width: open ? 240 : 72 }}
        animate={{ width: open ? 240 : 72 }}
        transition={{ duration: 0.3 }}
        className={cn(
          "fixed h-screen bg-white dark:bg-neutral-800 shadow-lg z-10",
          "flex flex-col border-r border-gray-200 dark:border-neutral-700"
        )}
      >
        <div className="p-4 flex items-center justify-between border-b border-gray-200 dark:border-neutral-700">
          <div />
          <button
            onClick={() => setOpen(!open)}
            className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-neutral-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-500 dark:text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={open ? "M15 19l-7-7 7-7" : "M4 6h16M4 12h16M4 18h16"}
              />
            </svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto py-4">
          <nav className="space-y-1 px-3">
            {links.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                onClick={() => setActiveLink(link.label)}
                className={cn(
                  "flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  link.label === "Home" && activeLink === "Home"
                    ? "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                    : activeLink === link.label
                    ? "text-blue-600 dark:text-blue-400 bg-gray-100 dark:bg-neutral-700" // Added bg-gray-100 for active state
                    : "text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-neutral-700",
                  !open && "justify-center"
                )}
              >
                <span className={cn(open ? "mr-3" : "mx-auto")}>
                  {React.cloneElement(link.icon, {
                    className: cn(
                      "h-5 w-5",
                      activeLink === link.label
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-gray-500 dark:text-gray-400"
                    ),
                  })}
                </span>
                {open && (
                  <motion.span
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {link.label}
                  </motion.span>
                )}
              </Link>
            ))}
          </nav>
        </div>
        <div className="p-4 border-t border-gray-200 dark:border-neutral-700">
          <div className="flex items-center space-x-3">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/*"
            />
            <div className="relative">
              <img
                src={profileImage}
                className="h-9 w-9 rounded-full border-2 border-white dark:border-neutral-700 object-cover cursor-pointer"
                alt="User Profile"
                onClick={handleImageClick}
              />
              <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white dark:border-neutral-700"></span>
            </div>
            {open && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex-1 min-w-0"
              >
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {userName}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  Student
                </p>
              </motion.div>
            )}
            {open && (
              <button className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                <IconSettings className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <div
        className={cn(
          "flex-1 pb-10 transition-all duration-300",
          open ? "ml-[240px]" : "ml-[72px]"
        )}
      >
        {renderComponent()}
      </div>
    </div>
  );
}

// Separate component for "My Projects" to clean up Dashboard
const MyProjects = ({ projects }) => {
  return (
    <div className="px-6 py-6">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        My Submitted Projects
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400 col-span-full">
            No projects submitted yet.
          </p>
        ) : (
          projects.map((project) => (
            <motion.div
              key={project.id}
              whileHover={{ y: -5 }}
              className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-neutral-700 relative"
            >
              <span
                className={`absolute top-3 right-3 px-3 py-1 text-xs font-semibold rounded-full
                                ${
                                  project.status === "Approved"
                                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                    : project.status === "Rejected"
                                    ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                                    : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                                }`}
              >
                {project.status}
              </span>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {project.title}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                {project.description}
              </p>
              {/* Assuming fileUrl is the URL from the backend */}
              {project.fileUrl && (
                <img
                  src={project.fileUrl}
                  alt="Project Screenshot"
                  className="w-full h-32 object-cover rounded mb-3"
                />
              )}
              <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 mb-2">
                {/* Ensure category and techStack are available in your project object from backend */}
                {project.category && (
                  <span className="flex items-center gap-1">
                    <IconBook size={16} /> {project.category}
                  </span>
                )}
                {project.techStack && (
                  <span className="flex items-center gap-1">
                    <IconStar size={16} /> {project.techStack}
                  </span>
                )}
              </div>
              <div className="flex justify-between items-center mt-4">
                {project.githubLink && (
                  <a
                    href={project.githubLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 text-sm"
                  >
                    GitHub
                  </a>
                )}
                {project.livePreviewUrl && (
                  <a
                    href={project.livePreviewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 text-sm"
                  >
                    Live Demo
                  </a>
                )}
              </div>
              {/* Display admin notes if project is rejected */}
              {project.status === "Rejected" && project.adminNotes && (
                <div className="mt-3 p-3 bg-red-50 dark:bg-red-900/20 rounded border border-red-200 dark:border-red-800">
                  <p className="text-xs font-medium text-red-700 dark:text-red-300">
                    Admin Feedback:
                  </p>
                  <p className="text-xs text-red-600 dark:text-red-400">
                    {project.adminNotes}
                  </p>
                </div>
              )}
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
};

// Update the Dashboard component to accept and display dynamic projects
const Dashboard = ({ projects, userName }) => {
  const upcomingEvents = [
    {
      id: 1,
      title: "Marines Stand-Up",
      time: "09:00 AM",
      course: "Web Development",
    },
    {
      id: 2,
      title: "Group Discussion",
      time: "11:00 AM",
      course: "Web Development",
    },
    {
      id: 3,
      title: "Marines Check-Out",
      time: "2:00 PM",
      course: "Web Development",
    },
  ];

  const stats = [
    { name: "Courses Enrolled", value: "12", change: "+2", trend: "up" },
    { name: "Assignments Due", value: "5", change: "-3", trend: "down" },
    {
      name: "Projects Submitted",
      value: projects.length.toString(),
      change: "+1",
      trend: "up",
    }, // Dynamic projects submitted
    { name: "Avg. Grade", value: "87%", change: "+2%", trend: "up" },
  ];

  return (
    <div className="px-6 py-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Welcome back, {userName}!
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Here's what's happening with your courses today
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex items-center space-x-4">
          <div className="relative">
            <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-grey-400" />
            <input
              type="text"
              placeholder="Search..."
              className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 text-whitedark:border-neutral-700 bg-white dark:bg-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button className="p-2 rounded-full bg-white dark:bg-neutral-800 shadow-sm hover:bg-gray-100 dark:hover:bg-neutral-700 relative">
            <IconBell className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            whileHover={{ y: -5 }}
            className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-neutral-700"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {stat.name}
                </p>
                <p className="mt-1 text-2xl font-semibold text-gray-900 dark:text-white">
                  {stat.value}
                </p>
              </div>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  stat.trend === "up"
                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                    : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                }`}
              >
                {stat.change}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Courses Section */}
        <div className="lg:col-span-2 space-y-6">
          {/* Welcome Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-sm overflow-hidden"
          >
            <div className="p-6 flex flex-col md:flex-row items-center justify-between">
              <div className="mb-4 md:mb-0">
                <h2 className="text-xl font-bold text-white">
                  Dive into innovation and gear up! 🔥
                </h2>
                <p className="mt-2 text-blue-100 max-w-lg">
                  Discover creative student projects that are making waves and
                  grab some exclusive merch while you're at it.
                </p>
                <div className="mt-4 flex space-x-3">
                  <Link to="/projects">
                    <button className="px-4 py-2 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition">
                      Explore Projects
                    </button>
                  </Link>
                  <Link to="/shop">
                    <button className="px-4 py-2 border border-white text-white rounded-lg font-medium hover:bg-white/10 transition">
                      Visit Merch Shop
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Featured Projects (now My Projects summary) */}
          <div className="h-125 bg-white dark:bg-neutral-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-neutral-700">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                My Recent Projects
              </h2>
              <Link
                to="/my-projects"
                onClick={() => setActiveLink("My Projects")} // Link to My Projects view
                className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
              >
                View All
              </Link>
            </div>
            <ul className="divide-y divide-gray-200 dark:divide-neutral-700">
              {projects.length === 0 ? (
                <p className="text-gray-600 dark:text-gray-400">
                  No projects submitted yet.
                </p>
              ) : (
                // Show only a few recent projects for the Dashboard summary
                projects.slice(0, 3).map((project) => (
                  <li
                    key={project.id}
                    className="py-3 flex items-center justify-between"
                  >
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {project.title}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {project.description?.substring(0, 50)}...
                      </p>{" "}
                      {/* Use optional chaining */}
                    </div>
                    <span
                      className={`px-2 py-0.5 text-xs font-semibold rounded-full
                                        ${
                                          project.status === "Approved"
                                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                            : project.status === "Rejected"
                                            ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                                            : "bg-yellow-100 text-yellow-800 dark:bg-green-900 dark:text-yellow-200"
                                        }`}
                    >
                      {project.status || "Aproved"}{" "}
                      {/* Display status or 'Unknown' */}
                    </span>
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Upcoming Events (remains the same) */}
          <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-neutral-700">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Upcoming Events
              </h2>
              <a
                href="https://calendar.google.com/calendar/u/0/r"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
              >
                View calendar
              </a>
            </div>
            <div className="space-y-4">
              {upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  className="flex items-start space-x-4 group"
                >
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
                      <IconCalendar className="h-5 w-5" />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                      {event.title}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {event.time} &bull; {event.course}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};