import React, { useState, useEffect, useRef, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Star,
  X,
  Search,
  Home,
  LogOut,
  User,
  Briefcase,
  ExternalLink,
  Github,
  Calendar,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Masonry from "react-masonry-css";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 bg-red-100 text-red-800 rounded-lg">
          <h2 className="font-bold">Something went wrong.</h2>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 px-4 py-2 bg-teal-500 text-white rounded"
          >
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

const ProjectLayout = () => {
  const [selectedProject, setSelectedProject] = useState(null);
  const [newReview, setNewReview] = useState({
    rating: 5,
    comment: "",
    reviewerName: "Anonymous User",
  });
  const [hoverRating, setHoverRating] = useState(0);
  const [selectedFilterCategory, setSelectedFilterCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [userEmail, setUserEmail] = useState(null);
  const [username, setUsername] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  const navigate = useNavigate();
  const API_BASE_URL = "http://127.0.0.1:5555";
  const reviewSectionRef = useRef(null);
  const gridContainerRef = useRef(null);

  const fetchProjects = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/api/projects`, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setProjects(
        data.map((project) => ({
          ...project,
          title: project.title || "Untitled Project",
          category: project.category || "Uncategorized",
          isApproved: project.isApproved || false,
        }))
      );
    } catch (err) {
      setError("Failed to load projects.");
      console.error("Error fetching projects:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      const accessToken = localStorage.getItem("access_token");
      if (!accessToken) {
        setIsLoading(false);
        navigate("/login");
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/api/users/profile`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (response.ok) {
          const userData = await response.json();
          setUserEmail(userData.email);
          setUsername(userData.username);
          setUserRole(userData.role);
          setNewReview((prev) => ({
            ...prev,
            reviewerName: userData.username,
          }));
        } else {
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          setUserEmail(null);
          setUsername(null);
          setUserRole(null);
          navigate("/login");
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
        navigate("/login");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserProfile();
  }, [navigate]);

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setUserEmail(null);
    setUsername(null);
    setUserRole(null);
    navigate("/login");
  };

  const filteredAndApprovedProjects = useMemo(() => {
    return projects.filter((project) => {
      if (!project || !project.title) return false;

      const matchesCategory =
        selectedFilterCategory === "All" ||
        project.category === selectedFilterCategory;
      const matchesSearch = project.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      return project.isApproved && matchesCategory && matchesSearch;
    });
  }, [projects, selectedFilterCategory, searchTerm]);

  const handleReviewChange = (e) => {
    const { name, value } = e.target;
    setNewReview((prevReview) => ({
      ...prevReview,
      [name]: value,
    }));
  };

  const handleAddReview = async (e) => {
    e.preventDefault();
    setIsSubmittingReview(true);

    if (!userEmail) {
      setMessage({ text: "Please log in to submit a review.", type: "error" });
      setIsSubmittingReview(false);
      return;
    }

    if (!selectedProject) {
      setIsSubmittingReview(false);
      return;
    }

    try {
      const accessToken = localStorage.getItem("access_token");
      const response = await fetch(
        `${API_BASE_URL}/api/projects/${selectedProject.id}/reviews`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            rating: parseInt(newReview.rating),
            comment: newReview.comment,
            reviewerName: username,
          }),
        }
      );

      if (response.ok) {
        const updatedProject = await response.json();
        if (!updatedProject.title) {
          fetchProjects();
          return;
        }
        setProjects((prevProjects) =>
          prevProjects.map((proj) =>
            proj.id === updatedProject.id ? updatedProject : proj
          )
        );
        setNewReview({
          rating: 5,
          comment: "",
          reviewerName: username,
        });
        setMessage({ text: "Review added successfully!", type: "success" });
      } else {
        const errorData = await response.json();
        setMessage({
          text: `Failed to add review: ${errorData.msg || response.statusText}`,
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error adding review:", error);
      setMessage({
        text: "An error occurred while adding the review. Please try again.",
        type: "error",
      });
    } finally {
      setIsSubmittingReview(false);
      if (reviewSectionRef.current) {
        reviewSectionRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const renderStarRating = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Star
          key={i}
          className={`w-4 h-4 ${
            i <= rating ? "text-yellow-400 fill-current" : "text-gray-300"
          }`}
        />
      );
    }
    return <div className="flex">{stars}</div>;
  };

  const renderReviewStars = (rating, setRating, setHover) => {
    return [1, 2, 3, 4, 5].map((star) => (
      <Star
        key={star}
        className={`cursor-pointer w-6 h-6 transition-colors duration-200 ${
          star <= (hoverRating || newReview.rating)
            ? "text-yellow-400 fill-current"
            : "text-gray-300"
        }`}
        onClick={() => setRating(star)}
        onMouseEnter={() => setHover(star)}
        onMouseLeave={() => setHover(0)}
      />
    ));
  };

  const allCategories = useMemo(() => {
    const categories = new Set(projects.map((project) => project.category));
    return ["All", ...Array.from(categories)].filter(Boolean);
  }, [projects]);

  const renderMessage = () => {
    if (!message.text) return null;
    const style =
      message.type === "success"
        ? "bg-green-100 text-green-800"
        : "bg-red-100 text-red-800";
    return (
      <div className={`p-4 rounded-lg mt-4 text-center ${style}`}>
        {message.text}
      </div>
    );
  };

  const handleCloseProjectModal = () => {
    setSelectedProject(null);
    setMessage({ text: "", type: "" });
  };

  const breakpointColumnsObj = {
    default: 5,
    1600: 4,
    1280: 3,
    1024: 2,
    640: 1,
  };

  const homeLink =
    userRole === "admin"
      ? "/admin-dashboard"
      : userRole === "student"
      ? "/dashboard"
      : "/home";
  const homeTooltip =
    userRole === "admin"
      ? "Admin Dashboard"
      : userRole === "student"
      ? "Student Dashboard"
      : "Home";

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans">
        {/* Fixed Header */}
        <header className="fixed top-0 left-0 right-0 bg-white dark:bg-gray-800 shadow-sm z-30">
          <div className="container mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex-1 max-w-3xl mx-auto flex items-center space-x-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 text-sm bg-gray-100 dark:bg-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>

              <select
                value={selectedFilterCategory}
                onChange={(e) => setSelectedFilterCategory(e.target.value)}
                className="w-auto px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-500 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              >
                {allCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </header>

        <div className="flex">
          {/* Sidebar */}
          <aside className="fixed left-0 top-0 h-full w-16 md:w-20 bg-white dark:bg-gray-800 shadow-lg z-20 pt-16">
            <nav className="flex flex-col p-2 space-y-2">
              <Link
                to={homeLink}
                className="group relative flex items-center justify-center p-3 text-sm font-medium text-gray-900 dark:text-gray-50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <Home className="w-5 h-5 text-teal-500" />
                <span className="absolute left-full ml-4 whitespace-nowrap hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2">
                  {homeTooltip}
                </span>
              </Link>

              <Link
                to={`/profile/${username}`}
                className="group relative flex items-center justify-center p-3 text-sm font-medium text-gray-900 dark:text-gray-50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <User className="w-5 h-5" />
                <span className="absolute left-full ml-4 whitespace-nowrap hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2">
                  Profile
                </span>
              </Link>

              {userRole === "admin" && (
                <Link
                  to="/admin-dashboard"
                  className="group relative flex items-center justify-center p-3 text-sm font-medium text-gray-900 dark:text-gray-50 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <Briefcase className="w-5 h-5" />
                  <span className="absolute left-full ml-4 whitespace-nowrap hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2">
                    Admin Dashboard
                  </span>
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="group relative flex items-center justify-center p-3 text-sm font-medium text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900 transition-colors w-full"
              >
                <LogOut className="w-5 h-5" />
                <span className="absolute left-full ml-4 whitespace-nowrap hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2">
                  Logout
                </span>
              </button>
            </nav>
          </aside>

          {/* Main Content */}
          <div className="flex-1 pl-16 md:pl-20">
            <main className="pt-16 pb-12 px-4">
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-teal-500 border-t-transparent"></div>
                </div>
              ) : error ? (
                <div className="text-center text-red-500 text-lg">{error}</div>
              ) : filteredAndApprovedProjects.length === 0 ? (
                <div className="text-center text-gray-500 text-lg">
                  No projects found. Try adjusting your search or filters.
                </div>
              ) : (
                <Masonry
                  breakpointCols={breakpointColumnsObj}
                  className="flex w-auto -ml-4"
                  columnClassName="pl-4 bg-clip-padding"
                >
                  {filteredAndApprovedProjects.map((project) => (
                    <motion.div
                      key={project.id}
                      className="mb-4 rounded-xl overflow-hidden bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300"
                      whileHover={{ y: -5 }}
                      onClick={() => setSelectedProject(project)}
                    >
                      <div className="relative pb-[133%] overflow-hidden">
                        <img
                          src={
                            project.image_url ||
                            "https://via.placeholder.com/400x500?text=No+Image"
                          }
                          alt={project.title}
                          className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                          <h3 className="text-white font-bold text-lg mb-2 line-clamp-2">
                            {project.title}
                          </h3>
                          <p className="text-gray-200 text-sm line-clamp-2">
                            {project.description}
                          </p>
                          <div className="flex items-center mt-3 text-sm text-white">
                            <User className="h-4 w-4 mr-1" />
                            <span>{project.uploaded_by}</span>
                            <span className="mx-2">•</span>
                            <span className="bg-teal-500/90 text-white px-2 py-0.5 rounded-full text-xs">
                              {project.category}
                            </span>
                          </div>
                          {project.reviews?.length > 0 && (
                            <div className="flex items-center mt-2">
                              <div className="flex">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star
                                    key={star}
                                    className={`h-4 w-4 ${
                                      star <= (project.average_rating || 0)
                                        ? "text-yellow-400 fill-current"
                                        : "text-gray-300"
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="ml-1 text-xs text-white">
                                ({project.reviews.length})
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </Masonry>
              )}

              {/* Project Details Modal */}
              <AnimatePresence>
                {selectedProject && (
                  <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 20 }}
                      className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col md:flex-row"
                    >
                      {/* Project Image */}
                      <div className="md:w-1/2 h-64 md:h-auto bg-gray-100 dark:bg-gray-700">
                        <img
                          src={
                            selectedProject.image_url ||
                            "https://via.placeholder.com/800x1000?text=No+Image"
                          }
                          alt={selectedProject.title}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Project Details */}
                      <div className="md:w-1/2 p-6 md:p-8 overflow-y-auto">
                        <div className="flex justify-between items-start mb-6">
                          <div>
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                              {selectedProject.title}
                            </h2>
                            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 space-x-4">
                              <span className="flex items-center">
                                <User className="w-4 h-4 mr-1" />
                                {selectedProject.uploaded_by}
                              </span>
                              <span className="flex items-center">
                                <Calendar className="w-4 h-4 mr-1" />
                                {new Date(
                                  selectedProject.created_at
                                ).toLocaleDateString()}
                              </span>
                              <span className="bg-teal-500/10 text-teal-600 dark:text-teal-400 px-3 py-1 rounded-full text-xs font-medium">
                                {selectedProject.category}
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={handleCloseProjectModal}
                            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 dark:text-gray-400"
                          >
                            <X className="w-5 h-5" />
                          </button>
                        </div>

                        <div className="prose dark:prose-invert max-w-none mb-6">
                          <p className="text-gray-700 dark:text-gray-300">
                            {selectedProject.description}
                          </p>
                        </div>

                        {/* Skills */}
                        {selectedProject.skills?.length > 0 && (
                          <div className="mb-6">
                            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3 uppercase tracking-wider">
                              Skills Used
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {selectedProject.skills.map((skill, index) => (
                                <span
                                  key={index}
                                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Project Links */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                          {selectedProject.github && (
                            <a
                              href={selectedProject.github}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center justify-center px-4 py-2.5 rounded-lg bg-gray-900 hover:bg-gray-800 text-white transition-colors text-sm font-medium"
                            >
                              <Github className="w-4 h-4 mr-2" />
                              View on GitHub
                            </a>
                          )}
                          {selectedProject.live_link && (
                            <a
                              href={selectedProject.live_link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center justify-center px-4 py-2.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white transition-colors text-sm font-medium"
                            >
                              <ExternalLink className="w-4 h-4 mr-2" />
                              Live Preview
                            </a>
                          )}
                          <Link
                            to={`/profile/${selectedProject.uploaded_by}`}
                            className="sm:col-span-2 inline-flex items-center justify-center px-4 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white transition-colors text-sm font-medium"
                          >
                            <User className="w-4 h-4 mr-2" />
                            Buy {selectedProject.uploaded_by} Coffee
                          </Link>
                        </div>

                        {/* Reviews Section */}
                        <div className="border-t border-gray-200 dark:border-gray-700 pt-6 mt-6">
                          <div className="flex items-center justify-between mb-6">
                            <h4 className="text-lg font-bold text-gray-900 dark:text-white">
                              Reviews ({selectedProject.reviews?.length || 0})
                            </h4>
                            {renderMessage()}
                          </div>

                          {/* Reviews List */}
                          <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
                            {selectedProject.reviews?.length > 0 ? (
                              selectedProject.reviews.map((review, index) => (
                                <div
                                  key={index}
                                  className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg"
                                >
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="font-medium text-gray-900 dark:text-white">
                                      {review.reviewerName}
                                    </span>
                                    <div className="flex">
                                      {[1, 2, 3, 4, 5].map((star) => (
                                        <Star
                                          key={star}
                                          className={`w-4 h-4 ${
                                            star <= review.rating
                                              ? "text-yellow-400 fill-current"
                                              : "text-gray-300"
                                          }`}
                                        />
                                      ))}
                                    </div>
                                  </div>
                                  <p className="text-sm text-gray-600 dark:text-gray-300">
                                    {review.comment}
                                  </p>
                                </div>
                              ))
                            ) : (
                              <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                                No reviews yet. Be the first to review this
                                project!
                              </p>
                            )}
                          </div>

                          {/* Add Review Form */}
                          <div className="mt-6">
                            <h5 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                              Share your thoughts
                            </h5>
                            <form
                              onSubmit={handleAddReview}
                              className="space-y-3"
                            >
                              <div className="flex items-center">
                                <span className="text-sm text-gray-700 dark:text-gray-300 mr-3">
                                  Your rating:
                                </span>
                                <div
                                  className="flex"
                                  onMouseLeave={() => setHoverRating(0)}
                                >
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                      key={star}
                                      type="button"
                                      onClick={() =>
                                        setNewReview((prev) => ({
                                          ...prev,
                                          rating: star,
                                        }))
                                      }
                                      onMouseEnter={() => setHoverRating(star)}
                                      className="p-1 focus:outline-none"
                                    >
                                      <Star
                                        className={`w-5 h-5 ${
                                          star <=
                                          (hoverRating || newReview.rating)
                                            ? "text-yellow-400 fill-current"
                                            : "text-gray-300"
                                        }`}
                                      />
                                    </button>
                                  ))}
                                </div>
                              </div>
                              <div>
                                <textarea
                                  name="comment"
                                  value={newReview.comment}
                                  onChange={handleReviewChange}
                                  placeholder="Share your experience with this project..."
                                  rows="3"
                                  className="w-full px-4 py-3 text-sm border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                                  required
                                />
                              </div>
                              <button
                                type="submit"
                                disabled={isSubmittingReview}
                                className="w-full px-4 py-2.5 text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {isSubmittingReview
                                  ? "Submitting..."
                                  : "Submit Review"}
                              </button>
                            </form>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                )}
              </AnimatePresence>
            </main>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default ProjectLayout;