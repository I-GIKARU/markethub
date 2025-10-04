// import React, { useState } from "react";
// import {
//   PlusCircle,
//   Image,
//   DollarSign,
//   Package,
//   FileText,
//   Tag,
//   ListFilter,
// } from "lucide-react";

// const MerchUpload = () => {
//   const [formData, setFormData] = useState({
//     name: "",
//     description: "",
//     price: "",
//     image_url: "",
//     stock_quantity: "",
//     category: "",
//   });

//   const categories = [
//     "electronics",
//     "accessories",
//     "footwear",
//     "clothing",
//     "home",
//     "health",
//     "defense",
//   ];

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prevData) => ({
//       ...prevData,
//       [name]: value,
//     }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();

//     if (!formData.category) {
//       alert("Please select a category");
//       return;
//     }

//     fetch("http://localhost:5555/api/admin/merchandise", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${localStorage.getItem("access_token")}`,
//       },
//       body: JSON.stringify({
//         name: formData.name,
//         description: formData.description,
//         price: parseFloat(formData.price),
//         image_url: formData.image_url,
//         stock_quantity: parseInt(formData.stock_quantity, 10),
//         category: formData.category.toLowerCase(),
//       }),
//     })
//       .then((response) => {
//         if (!response.ok) {
//           throw new Error(`HTTP error! status: ${response.status}`);
//         }
//         return response.json();
//       })
//       .then((data) => {
//         console.log("Success:", data);
//         alert("Merchandise added successfully!");
//         setFormData({
//           name: "",
//           description: "",
//           price: "",
//           image_url: "",
//           stock_quantity: "",
//           category: "",
//         });
//       })
//       .catch((error) => {
//         console.error("Error:", error);
//         alert("Failed to add merchandise. See console for details.");
//       });
//   };

//   return (
//     <div className="min-h-screen bg-gray-900 text-gray-100 p-8 flex justify-center items-center">
//       <div className="bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-md">
//         <h2 className="text-3xl font-bold text-teal-400 mb-6 text-center flex items-center justify-center gap-3">
//           <PlusCircle size={28} /> Add New Merchandise
//         </h2>
//         <form onSubmit={handleSubmit} className="space-y-5">
//           <div>
//             <label
//               htmlFor="name"
//               className="block text-gray-300 text-sm font-medium mb-1 flex items-center gap-2"
//             >
//               <Tag size={18} /> Product Name
//             </label>
//             <input
//               type="text"
//               id="name"
//               name="name"
//               value={formData.name}
//               onChange={handleChange}
//               placeholder="e.g., Quantum Headphones"
//               className="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 focus:border-teal-500 focus:ring-teal-500 text-gray-100"
//               required
//             />
//           </div>

//           <div>
//             <label
//               htmlFor="description"
//               className="block text-gray-300 text-sm font-medium mb-1 flex items-center gap-2"
//             >
//               <FileText size={18} /> Description
//             </label>
//             <textarea
//               id="description"
//               name="description"
//               value={formData.description}
//               onChange={handleChange}
//               placeholder="Detailed description of the product"
//               rows="4"
//               className="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 focus:border-teal-500 focus:ring-teal-500 text-gray-100"
//             ></textarea>
//           </div>

//           <div>
//             <label
//               htmlFor="price"
//               className="block text-gray-300 text-sm font-medium mb-1 flex items-center gap-2"
//             >
//               <DollarSign size={18} /> Price
//             </label>
//             <input
//               type="number"
//               id="price"
//               name="price"
//               value={formData.price}
//               onChange={handleChange}
//               placeholder="0.00"
//               step="0.01"
//               min="0"
//               className="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 focus:border-teal-500 focus:ring-teal-500 text-gray-100"
//               required
//             />
//           </div>

//           <div>
//             <label
//               htmlFor="image_url"
//               className="block text-gray-300 text-sm font-medium mb-1 flex items-center gap-2"
//             >
//               <Image size={18} /> Image URL
//             </label>
//             <input
//               type="url"
//               id="image_url"
//               name="image_url"
//               value={formData.image_url}
//               onChange={handleChange}
//               placeholder="https://example.com/product.jpg"
//               className="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 focus:border-teal-500 focus:ring-teal-500 text-gray-100"
//             />
//           </div>

//           <div>
//             <label
//               htmlFor="category"
//               className="block text-gray-300 text-sm font-medium mb-1 flex items-center gap-2"
//             >
//               <ListFilter size={18} /> Category
//             </label>
//             <select
//               id="category"
//               name="category"
//               value={formData.category}
//               onChange={handleChange}
//               className="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 focus:border-teal-500 focus:ring-teal-500 text-gray-100"
//               required
//             >
//               <option value="">Select a category</option>
//               {categories.map((cat) => (
//                 <option key={cat} value={cat}>
//                   {cat.charAt(0).toUpperCase() + cat.slice(1)}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div>
//             <label
//               htmlFor="stock_quantity"
//               className="block text-gray-300 text-sm font-medium mb-1 flex items-center gap-2"
//             >
//               <Package size={18} /> Stock Quantity
//             </label>
//             <input
//               type="number"
//               id="stock_quantity"
//               name="stock_quantity"
//               value={formData.stock_quantity}
//               onChange={handleChange}
//               placeholder="0"
//               min="0"
//               className="w-full px-4 py-2 rounded-md bg-gray-700 border border-gray-600 focus:border-teal-500 focus:ring-teal-500 text-gray-100"
//               required
//             />
//           </div>

//           <button
//             type="submit"
//             className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-4 rounded-md transition-colors duration-200 shadow-lg"
//           >
//             Add Merchandise
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default MerchUpload;

import React, { useState } from "react";
import {
  PlusCircle,
  Image,
  DollarSign, // We'll keep this icon, as it's a generic currency icon
  Package,
  FileText,
  Tag,
  ListFilter,
  ArrowLeft,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const MerchUpload = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "", // Keep as string for input field
    image_url: "",
    stock_quantity: "",
    category: "",
  });

  const categories = [
    "electronics",
    "accessories",
    "footwear",
    "clothing",
    "home",
    "health",
    "defense",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.category) {
      alert("Please select a category");
      return;
    }

    // Convert price to a number, handling potential empty string or non-numeric input
    const parsedPrice = parseFloat(formData.price);
    if (isNaN(parsedPrice)) {
      alert("Please enter a valid number for the price.");
      return;
    }

    // Convert stock quantity to an integer
    const parsedStockQuantity = parseInt(formData.stock_quantity, 10);
    if (isNaN(parsedStockQuantity) || parsedStockQuantity < 0) {
      alert("Please enter a valid whole number for stock quantity.");
      return;
    }

    fetch("http://localhost:5555/api/admin/merchandise", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
      body: JSON.stringify({
        name: formData.name,
        description: formData.description,
        price: parsedPrice, // Send as a number
        image_url: formData.image_url,
        stock_quantity: parsedStockQuantity, // Send as a number
        category: formData.category.toLowerCase(),
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        alert("Merchandise added successfully!");
        setFormData({
          name: "",
          description: "",
          price: "",
          image_url: "",
          stock_quantity: "",
          category: "",
        });
      })
      .catch((error) => {
        console.error("Error:", error);
        alert("Failed to add merchandise.");
      });
  };

  // Function to format price for display (e.g., KSh 1,234.00)
  const formatPriceForDisplay = (price) => {
    if (!price) return '';
    try {
      const numericPrice = parseFloat(price);
      if (isNaN(numericPrice)) return price; // Return as is if not a valid number
      return new Intl.NumberFormat('en-KE', {
        style: 'currency',
        currency: 'KES',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(numericPrice);
    } catch (e) {
      console.error("Error formatting price:", e);
      return price; // Fallback
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-gray-100 p-6 flex justify-center items-center relative">
      <button
        onClick={() => navigate(-1)}
        className="absolute top-6 left-6 text-teal-400 hover:text-white transition-colors duration-300"
        aria-label="Go back"
      >
        <ArrowLeft className="w-6 h-6" />
      </button>

      <div className="w-full max-w-lg bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-xl shadow-teal-500/10">
        <h2 className="text-3xl font-bold text-teal-400 mb-6 text-center flex items-center justify-center gap-3">
          <PlusCircle size={28} /> Add New Merchandise
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Product Name */}
          <FormField
            icon={<Tag size={18} className="text-teal-300" />}
            label="Product Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            type="text"
            placeholder="e.g., Quantum Headphones"
            required
          />

          {/* Description */}
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-1 flex items-center gap-2">
              <FileText size={18} className="text-teal-300" /> Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Detailed description of the product"
              rows="4"
              className="w-full px-4 py-2 rounded-md bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300 resize-y"
            ></textarea>
          </div>

          {/* Price */}
          <FormField
            icon={<DollarSign size={18} className="text-teal-300" />}
            label="Price (KSh)" 
            name="price"
            value={formData.price} // Input value remains as a string
            onChange={handleChange}
            type="number"
            placeholder="0.00"
            step="0.01"
            min="0"
            required
            // Optional: You could display the formatted value next to the input
            // For simplicity, we'll let the user type numbers and format on submission
          />

          {/* Image URL */}
          <FormField
            icon={<Image size={18} className="text-teal-300" />}
            label="Image URL"
            name="image_url"
            value={formData.image_url}
            onChange={handleChange}
            type="url"
            placeholder="https://example.com/image.jpg"
          />

          {/* Category */}
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-1 flex items-center gap-2">
              <ListFilter size={18} className="text-teal-300" /> Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-md bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300 appearance-none"
              required
            >
              <option value="" className="bg-gray-800 text-gray-300">
                Select a category
              </option>
              {categories.map((cat) => (
                <option key={cat} value={cat} className="bg-gray-800 text-gray-300">
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Stock */}
          <FormField
            icon={<Package size={18} className="text-teal-300" />}
            label="Stock Quantity"
            name="stock_quantity"
            value={formData.stock_quantity}
            onChange={handleChange}
            type="number"
            placeholder="0"
            min="0"
            required
          />

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 px-4 bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 rounded-lg text-white font-bold transition-all duration-300 shadow-lg hover:shadow-teal-500/50 transform hover:-translate-y-0.5"
          >
            Add Merchandise
          </button>
        </form>
      </div>
    </div>
  );
};

// Reusable Input Field Component
const FormField = ({
  icon,
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder = "",
  ...props
}) => (
  <div>
    <label className="block text-gray-300 text-sm font-medium mb-1 flex items-center gap-2">
      {icon} {label}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full px-4 py-2 rounded-md bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all duration-300"
      {...props}
    />
  </div>
);

export default MerchUpload;