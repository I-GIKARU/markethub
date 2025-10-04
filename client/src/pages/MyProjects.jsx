"use client";
import React, { useEffect, useState, useRef, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  X,
  Star,
  Clock,
  CheckCircle,
  XCircle,
  Search,
} from "lucide-react";
import { toast } from "sonner";

export default function MyProjects() {
  const navigate = useNavigate();
  const loaderRef = useRef(null);

  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [activeProject, setActiveProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [username, setUsername] = useState("User");

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const API_BASE_URL = "http://127.0.0.1:5555";
  const PROJECTS_PER_PAGE = 10;

  const fetchUsername = useCallback(async () => {
    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch(`${API_BASE_URL}/api/users/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (res.ok && data.username) setUsername(data.username);
    } catch (error) {
      setUsername("User");
    }
  }, []);

  const fetchProjects = useCallback(async () => {
    const token = localStorage.getItem("access_token");
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/users/projects?page=${page}&limit=${PROJECTS_PER_PAGE}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) throw new Error("Fetch failed");
      const data = await res.json();

      if (page === 1) {
        setProjects(data);
        setFilteredProjects(data);
      } else {
        setProjects((prev) => [...prev, ...data]);
        setFilteredProjects((prev) => [...prev, ...data]);
      }

      if (data.length < PROJECTS_PER_PAGE) {
        setHasMore(false);
      }
    } catch (err) {
      toast.error("Failed to load projects.");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [page]);

  useEffect(() => {
    fetchUsername();
  }, [fetchUsername]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  useEffect(() => {
    if (searchTerm === "") {
      setFilteredProjects(projects);
    } else {
      const filtered = projects.filter(
        (p) =>
          p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProjects(filtered);
    }
  }, [searchTerm, projects]);

  // Infinite Scroll Observer
  useEffect(() => {
    if (!hasMore || loadingMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setLoadingMore(true);
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 1 }
    );

    const currentRef = loaderRef.current;
    if (currentRef) observer.observe(currentRef);

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [hasMore, loadingMore]);

  const getStatus = (project) => {
    if (project.isApproved)
      return (
        <span className="text-green-400 flex items-center gap-1">
          <CheckCircle className="w-4 h-4" /> Approved
        </span>
      );
    if (project.review_reason)
      return (
        <span className="text-red-400 flex items-center gap-1">
          <XCircle className="w-4 h-4" /> Rejected
        </span>
      );
    return (
      <span className="text-yellow-400 flex items-center gap-1">
        <Clock className="w-4 h-4" /> Pending
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-[#0d1117] text-white px-4 py-8 font-sans relative z-0">
      {/* Navbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-4 py-4 bg-[#161b22] rounded-xl border border-gray-700 shadow-md shadow-blue-500/10">
        {/* Back button */}
        <div>
          <button
            onClick={() => navigate("/dashboard")}
            className="bg-[#1f6feb] hover:bg-[#388bfd] px-4 py-2 rounded-full flex items-center gap-2 text-white shadow-md"
          >
            <ArrowLeft className="w-4 h-4" /> Dashboard
          </button>
        </div>

        {/* Search Bar Center */}
        <div className="w-full sm:flex-1 sm:px-8">
          <div className="relative w-full max-w-md mx-auto sm:mx-0">
            <input
              type="text"
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-[#0d1117] text-white border border-gray-700 rounded-full focus:outline-none focus:border-blue-500"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
          </div>
        </div>

        {/* Username */}
        <div className="text-right">
          <div className="text-lg font-semibold text-gray-300">
            Welcome, <span className="text-blue-400">{username}</span>!
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      {loading ? (
        <div className="text-center text-gray-400 mt-6">
          Loading projects...
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="text-center text-gray-400 mt-6">
          No matching projects. Try a different search.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 px-1 mt-4">
            {filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                className="bg-[#161b22] rounded-xl shadow-xl hover:shadow-blue-600/30 transition-all border border-gray-700 hover:border-blue-500 cursor-pointer backdrop-blur-md h-[26rem] w-full flex flex-col overflow-hidden"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveProject(project)}
              >
                <img
                  src={
                    project.image_url ||
                    "https://via.placeholder.com/400x300?text=No+Image"
                  }
                  alt="project"
                  className="w-full h-[75%] object-cover"
                />
                <div className="flex flex-col flex-grow justify-between mt-0 px-3 py-2">
                  <h3 className="text-lg font-semibold">{project.title}</h3>
                  <p className="text-sm text-gray-400 line-clamp-2 mb-2">
                    {project.description}
                  </p>
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-1 text-gray-300">
                      <Star className="w-4 h-4 text-yellow-400" />
                      {project.average_rating || "N/A"}
                    </span>
                    {getStatus(project)}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Loader Ref */}
          {hasMore && (
            <div ref={loaderRef} className="text-center text-gray-500 py-6">
              {loadingMore ? "Loading more..." : "Scroll to load more"}
            </div>
          )}
        </>
      )}

      {/* Modal View */}
      <AnimatePresence>
        {activeProject && (
          <motion.div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex justify-center items-center px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-[#0d1117] border border-gray-700 p-6 rounded-xl w-full max-w-2xl relative"
              initial={{ y: 60, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 30, opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <button
                onClick={() => setActiveProject(null)}
                className="absolute top-4 right-4 text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
              <img
                src={
                  activeProject.image_url ||
                  "https://via.placeholder.com/800x300?text=No+Image"
                }
                alt="Preview"
                className="w-full h-[75%] max-h-96 object-cover mb-4"
              />
              <h2 className="text-2xl font-bold mb-2">{activeProject.title}</h2>
              <p className="text-gray-300 mb-3">{activeProject.description}</p>
              <div className="flex flex-wrap items-center justify-between text-sm text-gray-400 mb-2">
                <span>Category: {activeProject.category}</span>
                <span>Rating: {activeProject.average_rating || "N/A"}</span>
              </div>
              {activeProject.review_reason && (
                <p className="text-red-400 text-sm">
                  Rejected because: {activeProject.review_reason}
                </p>
              )}
              <div className="mt-4 flex gap-3">
                {activeProject.githubLink && (
                  <a
                    href={activeProject.githubLink}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm"
                  >
                    GitHub
                  </a>
                )}
                {activeProject.livePreviewUrl && (
                  <a
                    href={activeProject.livePreviewUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm"
                  >
                    Live Demo
                  </a>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
