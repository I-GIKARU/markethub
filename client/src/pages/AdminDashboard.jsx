import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  CheckCircle,
  XCircle,
  Clock,
  MessageSquare,
  User,
  Calendar,
  Filter,
  Home,
  ShoppingCart,
  Code,
  LogOut,
  Download,
  Users,
  ChevronLeft,
  ChevronRight,
  BarChart2,
  RefreshCw,
  FolderKanban,
  ExternalLink,
} from "lucide-react";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [allProjects, setAllProjects] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [activeTab, setActiveTab] = useState("pending");
  const [filterCategory, setFilterCategory] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const [rejectionReasonInput, setRejectionReasonInput] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const PROJECTS_PER_PAGE = 2;
  const [adminStats, setAdminStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(false);

  const API_BASE_URL = "http://127.0.0.1:5555/api";

  const getAuthToken = () => localStorage.getItem("access_token");

  const fetchAdminStats = async () => {
    setStatsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/admin/stats/projects`, {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setAdminStats(data);
      } else {
        console.error("Failed to fetch admin stats:", response.statusText);
        if (response.status === 401 || response.status === 403) {
          navigate("/login");
        }
      }
    } catch (error) {
      console.error("Error fetching admin stats:", error);
    } finally {
      setStatsLoading(false);
    }
  };

  const fetchAllProjects = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/admin/projects`, {
        headers: {
          Authorization: `Bearer ${getAuthToken()}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setAllProjects(data);
      } else if (response.status === 401 || response.status === 403) {
        alert("Session expired or unauthorized. Please log in again.");
        navigate("/login");
      } else {
        console.error("Failed to fetch projects:", response.statusText);
        alert("Failed to fetch projects.");
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
      alert("An error occurred while fetching projects.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!getAuthToken()) {
      navigate("/login");
      return;
    }
    fetchAllProjects();
    fetchAdminStats();
  }, [navigate]);

  const filteredProjects = allProjects.filter((project) => {
    const matchesCategory =
      filterCategory === "all" || project.category === filterCategory;
    const matchesTab =
      (activeTab === "pending" &&
        !project.isApproved &&
        !project.review_reason) ||
      (activeTab === "approved" && project.isApproved) ||
      (activeTab === "rejected" &&
        !project.isApproved &&
        project.review_reason);
    return matchesCategory && matchesTab;
  });

  const indexOfLastProject = currentPage * PROJECTS_PER_PAGE;
  const indexOfFirstProject = indexOfLastProject - PROJECTS_PER_PAGE;
  const currentProjects = filteredProjects.slice(
    indexOfFirstProject,
    indexOfLastProject
  );

  const totalPages = Math.ceil(filteredProjects.length / PROJECTS_PER_PAGE);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleApprove = async (projectId) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/admin/projects/${projectId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getAuthToken()}`,
          },
          body: JSON.stringify({ isApproved: true, review_reason: null }),
        }
      );

      if (response.ok) {
        alert("Project approved successfully!");
        setSelectedMessage(null);
        fetchAllProjects();
        fetchAdminStats();
      } else {
        const errorData = await response.json();
        console.error("Failed to approve project:", errorData);
        alert(
          `Failed to approve project: ${errorData.msg || response.statusText}`
        );
      }
    } catch (error) {
      console.error("Error approving project:", error);
      alert("An error occurred while approving the project.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async (projectId) => {
    if (!rejectionReasonInput.trim()) {
      alert("Please provide a reason for rejection.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/admin/projects/${projectId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getAuthToken()}`,
          },
          body: JSON.stringify({
            isApproved: false,
            review_reason: rejectionReasonInput.trim(),
          }),
        }
      );

      if (response.ok) {
        alert("Project rejected successfully!");
        setSelectedMessage(null);
        setRejectionReasonInput("");
        fetchAllProjects();
        fetchAdminStats();
      } else {
        const errorData = await response.json();
        console.error("Failed to reject project:", errorData);
        alert(
          `Failed to reject project: ${errorData.msg || response.statusText}`
        );
      }
    } catch (error) {
      console.error("Error rejecting project:", error);
      alert("An error occurred while rejecting the project.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user_role");
    navigate("/login");
  };

  const getStatusBadge = (project) => {
    if (project.isApproved) {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
          <CheckCircle className="w-4 h-4 mr-1" /> Approved
        </span>
      );
    } else if (!project.isApproved && project.review_reason) {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
          <XCircle className="w-4 h-4 mr-1" /> Rejected
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
          <Clock className="w-4 h-4 mr-1" /> Pending Review
        </span>
      );
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 text-gray-800">
      {/* Sidebar */}
      <div className="w-64 bg-gray-700 p-6 flex flex-col justify-between shadow-xl">
        <div>
          <h2 className="text-2xl font-bold text-white mb-8 flex items-center">
            <User className="mr-3 w-6 h-6" /> Admin Panel
          </h2>
          <nav>
            <ul>
              <li className="mb-4">
                <Link
                  to="/"
                  className="flex items-center text-indigo-200 hover:text-white transition-colors duration-200 p-2 rounded-lg hover:bg-indigo-600"
                >
                  <Home className="mr-3" /> Home
                </Link>
              </li>
              <li className="mb-4">
                <Link
                  to="/admin-dashboard"
                  className="flex items-center bg-indigo-600 text-white font-medium p-2 rounded-lg"
                >
                  <MessageSquare className="mr-3" /> Project Submissions
                </Link>
              </li>
              <li className="mb-4">
                <Link
                  to="/shop"
                  className="flex items-center text-indigo-200 hover:text-white transition-colors duration-200 p-2 rounded-lg hover:bg-indigo-600"
                >
                  <ShoppingCart className="mr-3" /> Merchandise
                </Link>
              </li>
              <li className="mb-4">
                <Link
                  to="/projects"
                  className="flex items-center text-indigo-200 hover:text-white transition-colors duration-200 p-2 rounded-lg hover:bg-indigo-600"
                >
                  <FolderKanban className="mr-3" /> Projects
                </Link>
              </li>
              <li className="mb-4">
                <Link
                  to="/admin/users"
                  className="flex items-center text-indigo-200 hover:text-white transition-colors duration-200 p-2 rounded-lg hover:bg-indigo-600"
                >
                  <Users className="mr-3" /> Users
                </Link>
              </li>
            </ul>
          </nav>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center text-indigo-200 hover:text-white transition-colors duration-200 p-2 rounded-lg hover:bg-indigo-600"
        >
          <LogOut className="mr-3" /> Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col p-8 overflow-y-auto bg-gray-100">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Project Submissions Dashboard
          </h1>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <select
              className="bg-white border border-gray-300 text-gray-700 py-2 pl-10 pr-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
              value={filterCategory}
              onChange={(e) => {
                setFilterCategory(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="all">All Categories</option>
              <option value="web">Web Development</option>
              <option value="mobile">Mobile Development</option>
              <option value="data">Data Science</option>
              <option value="ui/ux">UI/UX Design</option>
              <option value="ai/ml">AI/ML</option>
              <option value="other">Other</option>
            </select>
          </div>
        </header>

        {/* Admin Statistics Section */}
        <section className="bg-white p-6 rounded-xl shadow-md mb-8 border border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-800 flex items-center">
              <BarChart2 className="mr-3 text-indigo-600" /> Dashboard Overview
            </h3>
            <button
              onClick={fetchAdminStats}
              className="flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-lg text-white font-medium transition-colors shadow-sm"
              disabled={statsLoading}
            >
              <RefreshCw
                className={`w-4 h-4 mr-2 ${statsLoading ? "animate-spin" : ""}`}
              />
              {statsLoading ? "Refreshing..." : "Refresh Stats"}
            </button>
          </div>
          {adminStats ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-indigo-50 p-5 rounded-lg flex flex-col items-center border border-indigo-100">
                <span className="text-4xl font-bold text-indigo-600">
                  {adminStats.total_projects}
                </span>
                <p className="text-gray-600">Total Projects</p>
              </div>
              <div className="bg-green-50 p-5 rounded-lg flex flex-col items-center border border-green-100">
                <span className="text-4xl font-bold text-green-600">
                  {adminStats.approved_projects}
                </span>
                <p className="text-gray-600">Approved</p>
              </div>
              <div className="bg-yellow-50 p-5 rounded-lg flex flex-col items-center border border-yellow-100">
                <span className="text-4xl font-bold text-yellow-600">
                  {adminStats.pending_projects}
                </span>
                <p className="text-gray-600">Pending</p>
              </div>
              <div className="bg-red-50 p-5 rounded-lg flex flex-col items-center border border-red-100">
                <span className="text-4xl font-bold text-red-600">
                  {adminStats.rejected_projects}
                </span>
                <p className="text-gray-600">Rejected</p>
              </div>
              <div className="md:col-span-2 lg:col-span-2 bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                <span className="text-4xl font-bold text-indigo-600">
                  {adminStats.average_review_rating}
                </span>
                <p className="text-gray-600">Average Project Rating</p>
              </div>
              <div className="md:col-span-2 lg:col-span-2 bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                <h4 className="text-lg font-semibold text-gray-800 mb-2">
                  Top 5 Reviewed Projects
                </h4>
                {adminStats.top_projects_by_reviews &&
                adminStats.top_projects_by_reviews.length > 0 ? (
                  <ul className="space-y-2">
                    {adminStats.top_projects_by_reviews.map(
                      (project, index) => (
                        <li
                          key={index}
                          className="flex justify-between items-center p-2 hover:bg-gray-50 rounded"
                        >
                          <span className="text-gray-700">{project.title}</span>
                          <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded">
                            {project.review_count} reviews
                          </span>
                        </li>
                      )
                    )}
                  </ul>
                ) : (
                  <p className="text-gray-500 text-sm">No reviews yet.</p>
                )}
              </div>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">
              {statsLoading
                ? "Loading statistics..."
                : "No statistics available."}
            </p>
          )}
        </section>

        {/* Project List and Review Panel */}
        <div className="flex flex-grow gap-6">
          {/* Projects List Section */}
          <div className="w-1/2 bg-white p-6 rounded-xl shadow-md border border-gray-200 flex flex-col">
            <div className="flex mb-6 border-b border-gray-200">
              <button
                className={`py-3 px-4 text-sm font-medium ${
                  activeTab === "pending"
                    ? "border-b-2 border-indigo-500 text-indigo-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => {
                  setActiveTab("pending");
                  setCurrentPage(1);
                  setSelectedMessage(null);
                }}
              >
                Pending (
                {
                  allProjects.filter((p) => !p.isApproved && !p.review_reason)
                    .length
                }
                )
              </button>
              <button
                className={`py-3 px-4 text-sm font-medium ${
                  activeTab === "approved"
                    ? "border-b-2 border-indigo-500 text-indigo-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => {
                  setActiveTab("approved");
                  setCurrentPage(1);
                  setSelectedMessage(null);
                }}
              >
                Approved ({allProjects.filter((p) => p.isApproved).length})
              </button>
              <button
                className={`py-3 px-4 text-sm font-medium ${
                  activeTab === "rejected"
                    ? "border-b-2 border-indigo-500 text-indigo-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => {
                  setActiveTab("rejected");
                  setCurrentPage(1);
                  setSelectedMessage(null);
                }}
              >
                Rejected (
                {
                  allProjects.filter((p) => !p.isApproved && p.review_reason)
                    .length
                }
                )
              </button>
            </div>

            {isLoading ? (
              <div className="text-center py-10 text-gray-500">
                <div className="animate-pulse flex flex-col items-center">
                  <div className="h-4 w-32 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 w-24 bg-gray-200 rounded"></div>
                </div>
              </div>
            ) : filteredProjects.length === 0 ? (
              <div className="text-center py-10 text-gray-500">
                No {activeTab} projects found in this category.
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto pr-2">
                  {currentProjects.map((project) => (
                    <div
                      key={project.id}
                      className={`bg-white p-4 rounded-lg mb-3 cursor-pointer hover:bg-indigo-50 transition-colors duration-200 border ${
                        selectedMessage?.id === project.id
                          ? "border-indigo-300 ring-1 ring-indigo-200"
                          : "border-gray-200"
                      }`}
                      onClick={() => {
                        setSelectedMessage(project);
                        setRejectionReasonInput(project.review_reason || "");
                      }}
                    >
                      <div className="flex justify-between items-start">
                        <h3 className="text-lg font-semibold text-gray-800 mb-1">
                          {project.title}
                        </h3>
                        {getStatusBadge(project)}
                      </div>
                      <p className="text-gray-500 text-xs mb-2">
                        Uploaded by: {project.uploaded_by || "Unknown Uploader"}
                      </p>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {project.description}
                      </p>
                      <div className="flex justify-between items-center text-xs text-gray-500">
                        <span className="bg-gray-100 px-2 py-1 rounded">
                          {project.category}
                        </span>
                        <span className="bg-gray-100 px-2 py-1 rounded ml-2">
                          {project.tech_stack}
                        </span>
                        <span className="text-gray-400">
                          {new Date(project.updated_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center mt-4 space-x-1">
                    <button
                      onClick={handlePrevPage}
                      disabled={currentPage === 1}
                      className="p-2 rounded-lg bg-white border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <button
                          key={page}
                          onClick={() => paginate(page)}
                          className={`px-3 py-1 rounded-md text-sm ${
                            currentPage === page
                              ? "bg-indigo-600 text-white"
                              : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
                          }`}
                        >
                          {page}
                        </button>
                      )
                    )}
                    <button
                      onClick={handleNextPage}
                      disabled={currentPage === totalPages}
                      className="p-2 rounded-lg bg-white border border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Project Review Panel */}
          <div className="w-1/2 bg-white p-6 rounded-xl shadow-md border border-gray-200">
            <h2 className="text-xl font-bold mb-6 text-gray-800 flex items-center">
              <MessageSquare className="mr-2 text-indigo-600" /> Project Review
            </h2>
            <div className="bg-white p-4 rounded-lg h-full overflow-y-auto border border-gray-200">
              {selectedMessage ? (
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-semibold text-indigo-600">
                      {selectedMessage.title}
                    </h3>
                    {getStatusBadge(selectedMessage)}
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <p className="text-sm text-gray-500">Uploaded By</p>
                      <p className="font-medium text-gray-700">
                        {selectedMessage.uploaded_by || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Category</p>
                      <p className="font-medium text-gray-700">
                        {selectedMessage.category || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Tech Stack</p>
                      <p className="font-medium text-gray-700">
                        {selectedMessage.tech_stack || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">For Sale</p>
                      <p className="font-medium text-gray-700">
                        {selectedMessage.price || "Not For Sell"}
                      </p>
                    </div>

                  </div>

                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-500 mb-3">
                      Project Links
                    </h4>
                    <div className="space-y-2">
                      {selectedMessage.github_link && (
                        <div className="mb-3">
                          <h4 className="text-md font-semibold text-gray-200 flex items-center mb-1">
                            <ExternalLink className="w-4 h-4 mr-2 text-gray-500" />{" "}
                            GitHub Repository:
                          </h4>

                          <a
                            href={selectedMessage.github_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300 underline transition-colors break-words"
                          >
                            {selectedMessage.github_link}
                          </a>
                        </div>
                      )}
                      {selectedMessage.live_preview_url && ( // MODIFIED LINE
                        <a
                          href={selectedMessage.live_preview_url} // MODIFIED LINE
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-indigo-600 hover:text-indigo-800 hover:underline text-sm"
                        >
                          <Calendar className="w-4 h-4 mr-2" /> Live Preview
                        </a>
                      )}
                      {selectedMessage.file && (
                        <a
                          href={`${API_BASE_URL.replace("/api", "")}${
                            selectedMessage.file
                          }`}
                          download
                          className="flex items-center text-indigo-600 hover:text-indigo-800 hover:underline text-sm"
                        >
                          <Download className="w-4 h-4 mr-2" /> Download Project
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Collaborators */}
                  {selectedMessage.collaborators &&
                    selectedMessage.collaborators.length > 0 && (
                      <div className="mb-6">
                        <h4 className="text-sm font-semibold text-gray-500 mb-2 flex items-center">
                          <Users className="w-4 h-4 mr-2" /> Collaborators
                        </h4>
                        <ul className="bg-gray-50 p-3 rounded-lg">
                          {selectedMessage.collaborators.map(
                            (collab, index) => (
                              <li
                                key={index}
                                className="py-1 border-b border-gray-200 last:border-0"
                              >
                                <p className="text-gray-700 font-medium">
                                  {collab.username}
                                </p>
                                <p className="text-gray-500 text-xs">
                                  {collab.email}
                                </p>
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                    )}

                  {/* Review Details */}
                  {selectedMessage.status_changed_by && (
                    <div className="mb-6">
                      <h4 className="text-sm font-semibold text-gray-500 mb-2">
                        Review Details
                      </h4>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-gray-700">
                          <span className="font-medium">Reviewed by:</span>{" "}
                          {selectedMessage.status_changed_by}
                        </p>
                        {selectedMessage.review_reason && (
                          <p className="text-gray-700 mt-2">
                            <span className="font-medium">Reason:</span>{" "}
                            {selectedMessage.review_reason}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  {!selectedMessage.isApproved &&
                    !selectedMessage.review_reason && (
                      <div className="mt-6 pt-4 border-t border-gray-200">
                        <button
                          onClick={() => handleApprove(selectedMessage.id)}
                          className="w-full bg-green-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center space-x-2 mb-3 shadow-sm"
                          disabled={isLoading}
                        >
                          <CheckCircle className="w-5 h-5" />
                          <span>Approve Project</span>
                        </button>
                        <div className="mt-4">
                          <label
                            htmlFor="rejectionReason"
                            className="block text-sm font-medium text-gray-700 mb-2"
                          >
                            Rejection Reason
                          </label>
                          <textarea
                            id="rejectionReason"
                            className="w-full p-3 bg-white border border-gray-300 rounded-lg text-gray-700 placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
                            rows="3"
                            placeholder="Provide a clear reason for rejection..."
                            value={rejectionReasonInput}
                            onChange={(e) =>
                              setRejectionReasonInput(e.target.value)
                            }
                          />
                          <button
                            onClick={() => handleReject(selectedMessage.id)}
                            className="w-full mt-2 bg-red-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-red-700 transition-colors flex items-center justify-center space-x-2 shadow-sm"
                            disabled={isLoading}
                          >
                            <XCircle className="w-5 h-5" />
                            <span>Reject Project</span>
                          </button>
                        </div>
                      </div>
                    )}
                </div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center p-6 text-center">
                  <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <h4 className="font-medium text-gray-700 mb-2">
                    Select a Submission
                  </h4>
                  <p className="text-gray-500 text-sm max-w-xs">
                    Choose a project from the list to review and take action.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

