import { useState } from "react";
import { Mail, Send } from "lucide-react";

const ContactMe = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // You can add backend/API logic here
    console.log("Form submitted:", formData);
    setSubmitted(true);
    setFormData({ name: "", email: "", message: "" });

    setTimeout(() => setSubmitted(false), 4000); // Reset message after 4 seconds
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 py-16 px-4 flex justify-center items-center">
      <div className="max-w-2xl w-full bg-white p-8 rounded-2xl shadow-lg">
        <h2 className="text-3xl font-bold mb-6 text-center">Contact Me</h2>

        <div className="flex items-center justify-center mb-6 text-gray-600">
          <Mail className="w-5 h-5 mr-2" />
          <span>youremail@example.com</span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-1 font-medium">Name</label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Email</label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Message</label>
            <textarea
              name="message"
              rows="5"
              required
              value={formData.message}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-black text-white py-3 rounded-md flex items-center justify-center gap-2 hover:bg-gray-800 transition"
          >
            <Send size={18} />
            Send Message
          </button>

          {submitted && (
            <p className="text-green-600 text-center mt-3 font-medium">
              Message sent successfully!
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default ContactMe;
