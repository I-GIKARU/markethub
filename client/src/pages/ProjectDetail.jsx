// src/ProjectDetail.jsx
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";

// Dummy projects data (same shape as in ProjectLayout)
const projects = [
  {
    id: 1,
    image: "https://picsum.photos/300/400?random=1",
    title: "Beautiful Mountain Landscape",
    description: "Breathtaking view of snow-capped mountains.",
    price: "KSh 3,249",
  },
  {
    id: 2,
    image: "https://picsum.photos/300/600?random=2",
    title: "Modern Architecture Design",
    description: "Contemporary building with geometric patterns.",
    price: "KSh 11,699",
  },
];

const dummyOwner = {
  name: "Dennis Ngui",
  email: "dennis@example.com",
};

const ProjectDetail = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);

  useEffect(() => {
    const found = projects.find((p) => p.id === parseInt(id));
    if (found) setProject(found);
  }, [id]);

  if (!project) return <div className="text-white p-8">Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow-xl mt-8">
      <img
        src={project.image}
        alt={project.title}
        className="rounded-xl mb-4"
      />
      <h1 className="text-2xl font-bold text-gray-800 mb-2">{project.title}</h1>
      <p className="text-gray-600 mb-4">{project.description}</p>
      <p className="text-black font-semibold">Price: {project.price}</p>

      <div className="mt-6">
        <h3 className="text-lg font-bold">Uploaded by:</h3>
        <p className="text-gray-800">{dummyOwner.name}</p>
        <p className="text-gray-500">{dummyOwner.email}</p>
      </div>
    </div>
  );
};

export default ProjectDetail;
