"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  Search,
  ShoppingCart,
  Plus,
  Minus,
  X,
  CheckCircle,
  ArrowLeft,
  Filter,
  CreditCard,
  DollarSign,
  Smartphone,
  ChevronRight,
  ChevronLeft,
  Home,
  Settings,
  Star,
  Package,
  ListFilter,
  SlidersHorizontal,
  FolderKanban,
  ChevronDown,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom"; // Import Link and useNavigate from react-router-dom

const EcommerceLayout = () => {
  const navigate = useNavigate(); // Initialize navigate hook

  const [searchTerm, setSearchTerm] = useState("");
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false); // This will still be used for Cash on Delivery confirmation
  const [orderNumber, setOrderNumber] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 20000000000000]);
  const [sortOption, setSortOption] = useState("name-asc");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(8);

  const [checkoutStep, setCheckoutStep] = useState("cart");
  const [selectedPayment, setSelectedPayment] = useState(null); // 'creditCard', 'mPesa', 'cash'
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false); // Unused state, can be removed if not planned for future use

  const [userEmail, setUserEmail] = useState(null);
  const [userRole, setUserRole] = useState(null);

  // New state to hold products fetched from the database
  const [productsFromDb, setProductsFromDb] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [errorFetchingProducts, setErrorFetchingProducts] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const accessToken = localStorage.getItem("access_token");
      if (!accessToken) {
        console.log("No access token found. User not logged in.");
        return;
      }

      try {
        const response = await fetch(
          "http://localhost:5555/api/users/profile",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (response.ok) {
          const userData = await response.json();
          setUserEmail(userData.email);
          setUserRole(userData.role);
          console.log("User data fetched:", userData);
        } else {
          console.error(
            "Failed to fetch user profile:",
            response.status,
            response.statusText
          );
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          setUserEmail(null);
          setUserRole(null);
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUserProfile();
  }, []);

  // This useEffect fetches products from the database
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:5555/api/merchandise");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (
          Array.isArray(data) &&
          data.every((p) => typeof p.name === "string")
        ) {
          setProductsFromDb(data);
        } else {
          console.error("Fetched data is not in expected format:", data);
          setErrorFetchingProducts(
            "Fetched product data is malformed. Please check your backend response for 'name' property."
          );
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        setErrorFetchingProducts(
          "Failed to load products. Please try again later. (Check backend server and endpoint)"
        );
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchProducts();
  }, []);

  const allProducts = productsFromDb;

  // Dynamically generate categories from productsFromDb and add the fixed categories
  const dynamicCategories = [
    ...new Set(allProducts.map((p) => p.category).filter(Boolean)),
  ];
  const categories = [
    "all",
    "electronics",
    "accessories",
    "footwear",
    "clothing",
    "home",
    "health",
    "defense",
    ...dynamicCategories,
  ].filter((value, index, self) => self.indexOf(value) === index); // Ensure uniqueness

  const addToCart = (product) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [
          ...prevItems,
          {
            ...product,
            quantity: 1,
            name: product.name,
            description: product.description,
          },
        ];
      }
    });
  };

  const removeFromCart = (productId) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.id !== productId)
    );
  };

  const updateQuantity = (productId, amount) => {
    setCartItems((prevItems) =>
      prevItems
        .map((item) =>
          item.id === productId
            ? { ...item, quantity: item.quantity + amount }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const calculateTotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const handleCheckout = () => {
    setCheckoutStep("payment");
  };

  const handlePayment = () => {
    if (selectedPayment) {
      setCheckoutStep("summary");
    } else {
      alert("Please select a payment method.");
    }
  };

  // MODIFIED: completeOrder to navigate based on selectedPayment
  const completeOrder = () => {
    const totalAmount = calculateTotal();
    const orderDetails = {
      items: cartItems.map((item) => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
      total: totalAmount,
      // You can add more details like user_id, shipping address etc.
    };

    if (selectedPayment === "mPesa") {
      // Navigate to M-Pesa payment page, passing totalAmount directly in state
      navigate("/mpesa-payment", { state: { totalAmount: totalAmount } });
    } else if (selectedPayment === "creditCard") {
      // Navigate to Stripe payment page, passing order details
      navigate("/stripe-payment", { state: { order: orderDetails } });
    } else if (selectedPayment === "cash") {
      // For cash on delivery, show success message immediately and clear cart
      const newOrderNumber = `MM-${Date.now()}-${Math.floor(
        Math.random() * 1000
      )}`;
      setOrderNumber(newOrderNumber);
      setShowSuccess(true);
      setCartItems([]);
      setCheckoutStep("cart"); // Reset checkout step for next purchase
      // Optionally, send a request to your backend to record this cash order
      console.log("Cash on Delivery order placed:", orderDetails);
    } else {
      alert("No payment method selected.");
    }
  };

  const handleCategoryClick = (category) => {
    setCurrentPage(1);
    if (category === "all") {
      setSelectedCategories([]);
    } else {
      setSelectedCategories((prev) =>
        prev.includes(category)
          ? prev.filter((c) => c !== category)
          : [...prev, category]
      );
    }
  };

  const handlePriceRangeChange = (e, type) => {
    const value = Number(e.target.value);
    setPriceRange((prev) => {
      if (type === "min") {
        return [value, Math.max(value, prev[1])];
      } else {
        return [Math.min(value, prev[0]), value];
      }
    });
    setCurrentPage(1);
  };

  const filteredProducts = allProducts
    .filter((product) => {
      if (!product || typeof product.name !== "string") {
        console.warn("Skipping malformed product:", product);
        return false;
      }

      const matchesSearch =
        searchTerm === "" ||
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.description &&
          product.description.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesCategory =
        selectedCategories.length === 0 ||
        (product.category &&
          selectedCategories.includes(product.category.toLowerCase()));

      const matchesPrice =
        product.price >= priceRange[0] && product.price <= priceRange[1];

      return matchesSearch && matchesCategory && matchesPrice;
    })
    .sort((a, b) => {
      if (typeof a.name !== "string" || typeof b.name !== "string") {
        console.warn("Attempted to sort products with missing/invalid names:", {
          a,
          b,
        });
        return 0;
      }
      switch (sortOption) {
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        default:
          return 0;
      }
    });

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber < 1 || pageNumber > totalPages) return;
    setCurrentPage(pageNumber);
  };

  const showAdminButton =
    userEmail === "samtomashi@moringaschool.com" || userRole === "admin";

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex">
      <motion.div
        initial={{ x: -250 }}
        animate={{ x: sidebarOpen ? 0 : -250 }}
        transition={{ type: "tween", duration: 0.3 }}
        className="fixed inset-y-0 left-0 z-40 w-64 bg-gray-800 p-5 shadow-lg flex flex-col justify-between"
      >
        <div>
          <h2 className="text-3xl font-bold text-teal-400 mb-8">
            <Link
              to="/"
              className="hover:text-teal-300 transition-colors duration-200"
            >
              MORINGA MART
            </Link>
          </h2>
          <nav>
            <ul>
              {/* HOME icon - dynamic based on role */}
              <li className="mb-4">
                <Link
                  to={userRole === "user" ? "/home" : "/"}
                  className="flex items-center text-gray-300 hover:text-teal-400 transition-colors duration-200"
                >
                  <Home className="mr-3 h-5 w-5" /> Home
                </Link>
              </li>

              {/* Products - visible to all */}
              <li className="mb-4">
                <Link
                  to="/products"
                  className="flex items-center text-gray-300 hover:text-teal-400 transition-colors duration-200"
                >
                  <Package className="mr-3 h-5 w-5" /> Products
                </Link>
              </li>

              {/* Favorites - visible to all */}
              <li className="mb-4">
                <Link
                  to="/favorites"
                  className="flex items-center text-gray-300 hover:text-teal-400 transition-colors duration-200"
                >
                  <Star className="mr-3 h-5 w-5" /> Favorites
                </Link>
              </li>

              {/* Dashboard - conditional by role */}
              {userRole === "student" && (
                <li className="mb-4">
                  <Link
                    to="/dashboard"
                    className="flex items-center text-gray-300 hover:text-teal-400 transition-colors duration-200"
                  >
                    <FolderKanban className="mr-3 h-5 w-5" /> Dashboard
                  </Link>
                </li>
              )}

              {userRole === "admin" && (
                <li className="mb-4">
                  <Link
                    to="/admin-dashboard"
                    className="flex items-center text-gray-300 hover:text-teal-400 transition-colors duration-200"
                  >
                    <FolderKanban className="mr-3 h-5 w-5" /> Admin Dashboard
                  </Link>
                </li>
              )}

              {/* Upload - only for admin */}
              {userRole === "admin" && (
                <li className="mb-4">
                  <Link
                    to="/upload-merch"
                    className="flex items-center gap-2 text-gray-300 hover:text-teal-400 transition-colors duration-200"
                  >
                    <Plus className="w-5 h-5" />
                    <span>Upload</span>
                  </Link>
                </li>
              )}
            </ul>
          </nav>

          <div className="mt-8 pt-4 border-t border-gray-700">
            <h3 className="text-lg font-bold text-gray-200 mb-3 flex items-center">
              <SlidersHorizontal className="mr-2 h-5 w-5" /> Price Range
            </h3>
            <div className="mb-2 text-gray-300 text-sm">
              Ksh.{priceRange[0]} - Ksh.{priceRange[1]}
            </div>
            <div className="flex flex-col space-y-4">
              <div>
                <label
                  htmlFor="minPrice"
                  className="block text-gray-400 text-sm mb-1"
                >
                  Min Price: Ksh.{priceRange[0]}
                </label>
                <input
                  id="minPrice"
                  type="range"
                  min="0"
                  max="20000000000000"
                  value={priceRange[0]}
                  onChange={(e) => handlePriceRangeChange(e, "min")}
                  className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer range-sm accent-teal-500"
                />
              </div>
              <div>
                <label
                  htmlFor="maxPrice"
                  className="block text-gray-400 text-sm mb-1"
                >
                  Max Price: Ksh.{priceRange[1]}
                </label>
                <input
                  id="maxPrice"
                  type="range"
                  min="0"
                  max="20000000000000"
                  value={priceRange[1]}
                  onChange={(e) => handlePriceRangeChange(e, "max")}
                  className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer range-sm accent-teal-500"
                />
              </div>
            </div>
            <button
              onClick={() => setPriceRange([0, 20000000000000])}
              className="mt-3 text-sm text-red-400 hover:text-red-500"
            >
              Reset Price
            </button>
          </div>
        </div>
        <div className="text-sm text-gray-500">
          <p>&copy; 2025 Moringa Mart</p>
          <p>Version 1.0</p>
        </div>
      </motion.div>

      <div
        className={cn("flex-1 flex flex-col", sidebarOpen ? "ml-64" : "ml-0")}
      >
        <header className="bg-gray-800 p-5 shadow-md flex items-center justify-between z-20">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-400 hover:text-teal-400 transition-colors duration-200 mr-4"
          >
            {sidebarOpen ? (
              <ChevronLeft size={24} />
            ) : (
              <ChevronRight size={24} />
            )}
          </button>
          <div className="relative flex-1 px-8 max-w-lg">
            <Search className="absolute left-10 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search products..."
              className="w-full rounded-full border border-gray-600 bg-gray-800 py-2 pl-12 pr-4 text-gray-300 focus:border-teal-500 focus:ring-teal-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            onClick={() => setIsCartOpen(!isCartOpen)}
            className="relative text-gray-400 hover:text-teal-400 transition-colors duration-200 mr-5"
          >
            <ShoppingCart size={24} />
            {cartItems.length > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                {cartItems.length}
              </span>
            )}
          </button>
        </header>

        <div className="bg-gray-700 py-3 px-6 flex items-center justify-start space-x-6 shadow-sm z-10 overflow-x-auto">
          <span className="text-gray-300 font-semibold mr-2 flex items-center">
            <Filter className="mr-2 h-4 w-4" />
            Categories:
          </span>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryClick(category)}
              className={cn(
                "px-3 py-1 rounded-full text-sm font-medium transition-colors duration-200",
                selectedCategories.includes(category) ||
                  (category === "all" && selectedCategories.length === 0)
                  ? "bg-teal-600 text-white"
                  : "bg-gray-600 text-gray-300 hover:bg-gray-500 hover:text-white"
              )}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>

        <main className="flex-1 p-6 overflow-y-auto">
          {loadingProducts ? (
            <div className="flex h-64 items-center justify-center rounded-lg border border-gray-700 bg-gray-800 shadow-xl">
              <p className="text-lg text-gray-500">Loading products...</p>
            </div>
          ) : errorFetchingProducts ? (
            <div className="flex h-64 items-center justify-center rounded-lg border border-red-700 bg-red-900 shadow-xl text-red-300">
              <p className="text-lg">{errorFetchingProducts}</p>
            </div>
          ) : currentProducts.length === 0 ? (
            <div className="flex h-64 items-center justify-center rounded-lg border border-gray-700 bg-gray-800 shadow-xl">
              <p className="text-lg text-gray-500">
                No matching schematics found. Adjust scan parameters.
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {currentProducts.map((product) => (
                  <motion.div
                    key={product.id}
                    className="relative overflow-hidden rounded-lg bg-gray-800 shadow-xl"
                    whileHover={{ y: -5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="h-48 w-full object-cover"
                    />
                    <div className="p-5 flex flex-col h-[180px]">
                      <h3 className="mb-2 text-xl font-bold text-teal-400">
                        {product.name}
                      </h3>
                      <p className="mb-4 text-gray-400 flex-grow overflow-hidden line-clamp-3">
                        {product.description}
                      </p>
                      <div className="flex items-center justify-between mt-auto">
                        <span className="text-l font-bold text-green-400">
                          Ksh.{product.price}
                        </span>
                        <button
                          onClick={() => addToCart(product)}
                          className="rounded-lg bg-teal-600 px-4 py-2 font-bold text-white shadow-lg hover:bg-teal-700 transition-colors duration-200"
                        >
                          Buy
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="mt-10 flex justify-center items-center space-x-2">
                  <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 rounded-lg bg-gray-700 text-gray-300 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  {[...Array(totalPages)].map((_, index) => (
                    <button
                      key={index + 1}
                      onClick={() => paginate(index + 1)}
                      className={cn(
                        "px-4 py-2 rounded-lg font-medium transition-colors",
                        currentPage === index + 1
                          ? "bg-teal-600 text-white"
                          : "bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white"
                      )}
                    >
                      {index + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 rounded-lg bg-gray-700 text-gray-300 hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      <motion.div
        initial={{ x: 300 }}
        animate={{ x: isCartOpen ? 0 : 300 }}
        transition={{ type: "tween", duration: 0.3 }}
        className="fixed inset-y-0 right-0 z-50 w-80 bg-gray-800 p-5 shadow-lg flex flex-col"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-teal-400">Your Cart</h2>
          <button
            onClick={() => setIsCartOpen(false)}
            className="text-gray-400 hover:text-red-500 transition-colors duration-200"
          >
            <X size={24} />
          </button>
        </div>

        {/* MODIFIED: showSuccess only for Cash on Delivery */}
        {checkoutStep === "summary" &&
        selectedPayment === "cash" &&
        showSuccess ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center h-full text-center text-green-400"
          >
            <CheckCircle size={64} className="mb-4" />
            <h3 className="text-xl font-bold mb-2">Order Confirmed!</h3>
            <p className="text-lg">Order Number:</p>
            <p className="text-xl font-mono">{orderNumber}</p>
            <p className="text-md text-gray-400 mt-4">
              Thank you for your purchase! Your cash on delivery order has been
              placed.
            </p>
            <button
              onClick={() => {
                setShowSuccess(false);
                setIsCartOpen(false);
              }}
              className="mt-8 py-3 px-6 rounded-lg font-bold bg-teal-600 hover:bg-teal-700 text-white shadow-lg transition-colors duration-200"
            >
              Continue Shopping
            </button>
          </motion.div>
        ) : (
          <div className="flex-1 flex flex-col">
            {cartItems.length === 0 && checkoutStep === "cart" ? (
              <div className="flex h-full items-center justify-center text-gray-500 text-center">
                <p>
                  Your cart is currently empty. <br /> Start adding some
                  schematics!
                </p>
              </div>
            ) : (
              <>
                {checkoutStep === "cart" && (
                  <div className="h-0 flex-grow overflow-y-auto pr-2">
                    {cartItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-4 rounded-lg border border-gray-700 bg-gray-800 p-4 shadow-md mb-3 transition-all duration-200 hover:border-teal-500"
                      >
                        <div className="relative shrink-0">
                          <img
                            src={item.image_url}
                            alt={item.name}
                            className="h-20 w-20 object-cover rounded-md"
                          />
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="absolute -right-2 -top-2 rounded-full bg-red-600 p-1 text-white hover:bg-red-700 transition-colors"
                          >
                            <X size={16} />
                          </button>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-200">
                            {item.name}
                          </h3>
                          <p className="text-sm text-gray-400">
                            Ksh.{item.price}
                          </p>
                          <div className="flex items-center mt-2">
                            <button
                              onClick={() => updateQuantity(item.id, -1)}
                              className="bg-gray-700 text-gray-300 px-2 py-1 rounded-l-md hover:bg-gray-600 transition-colors"
                            >
                              <Minus size={16} />
                            </button>
                            <span className="bg-gray-900 text-gray-100 px-3 py-1">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, 1)}
                              className="bg-gray-700 text-gray-300 px-2 py-1 rounded-r-md hover:bg-gray-600 transition-colors"
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {checkoutStep === "payment" && (
                  <div className="h-0 flex-grow overflow-y-auto pr-2 space-y-4">
                    <h3 className="text-xl font-bold text-gray-100 mb-4">
                      Select Payment Method
                    </h3>
                    <label className="flex items-center p-4 rounded-lg border border-gray-700 bg-gray-800 hover:border-teal-500 transition-colors cursor-pointer">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="creditCard"
                        checked={selectedPayment === "creditCard"}
                        onChange={() => setSelectedPayment("creditCard")}
                        className="form-radio text-teal-500 h-5 w-5"
                      />
                      <CreditCard className="ml-4 mr-3 text-gray-400" />
                      <span className="text-gray-200">Credit Card</span>
                    </label>
                    <label className="flex items-center p-4 rounded-lg border border-gray-700 bg-gray-800 hover:border-teal-500 transition-colors cursor-pointer">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="mPesa"
                        checked={selectedPayment === "mPesa"}
                        onChange={() => setSelectedPayment("mPesa")}
                        className="form-radio text-teal-500 h-5 w-5"
                      />
                      <Smartphone className="ml-4 mr-3 text-gray-400" />
                      <span className="text-gray-200">M-Pesa</span>
                    </label>
                    <label className="flex items-center p-4 rounded-lg border border-gray-700 bg-gray-800 hover:border-teal-500 transition-colors cursor-pointer">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cash"
                        checked={selectedPayment === "cash"}
                        onChange={() => setSelectedPayment("cash")}
                        className="form-radio text-teal-500 h-5 w-5"
                      />
                      <DollarSign className="ml-4 mr-3 text-gray-400" />
                      <span className="text-gray-200">Cash on Delivery</span>
                    </label>
                  </div>
                )}

                {checkoutStep === "summary" && (
                  <div className="h-0 flex-grow overflow-y-auto pr-2">
                    <h3 className="text-xl font-bold text-gray-100 mb-4">
                      Order Summary
                    </h3>
                    {cartItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-between items-center bg-gray-800 p-3 rounded-md mb-2"
                      >
                        <span className="text-gray-300">
                          {item.name} x {item.quantity}
                        </span>
                        <span className="text-gray-200">
                          Ksh.{(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                    <div className="mt-4 pt-4 border-t border-gray-700 flex justify-between items-center text-xl font-bold text-teal-400">
                      <span>Total:</span>
                      <span>Ksh.{calculateTotal().toFixed(2)}</span>
                    </div>
                    <div className="mt-4 text-gray-300">
                      <p>
                        Payment Method:{" "}
                        <span className="font-bold">
                          {selectedPayment === "creditCard" && "Credit Card"}
                          {selectedPayment === "mPesa" && "M-Pesa"}
                          {selectedPayment === "cash" && "Cash on Delivery"}
                        </span>
                      </p>
                    </div>
                  </div>
                )}

                <div className="mt-auto pt-4 border-t border-gray-700">
                  <div className="flex justify-between items-center text-xl font-bold text-teal-400 mb-4">
                    <span>Total:</span>
                    <span>Ksh.{calculateTotal().toFixed(2)}</span>
                  </div>
                  {checkoutStep === "cart" && (
                    <button
                      onClick={handleCheckout}
                      disabled={cartItems.length === 0}
                      className={`w-full py-3 rounded-lg font-bold transition-colors duration-200 ${
                        cartItems.length === 0
                          ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                          : "bg-teal-600 hover:bg-teal-700 text-white shadow-lg"
                      }`}
                    >
                      Proceed to Checkout
                    </button>
                  )}
                  {checkoutStep === "payment" && (
                    <div className="flex flex-col space-y-3">
                      <button
                        onClick={handlePayment}
                        disabled={!selectedPayment}
                        className={`w-full py-3 rounded-lg font-bold transition-colors duration-200 ${
                          !selectedPayment
                            ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                            : "bg-teal-600 hover:bg-teal-700 text-white shadow-lg"
                        }`}
                      >
                        Confirm Payment
                      </button>
                      <button
                        onClick={() => setCheckoutStep("cart")}
                        className="w-full py-3 rounded-lg font-bold bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors"
                      >
                        <ArrowLeft className="inline-block mr-2" size={18} />{" "}
                        Back to Cart
                      </button>
                    </div>
                  )}
                  {checkoutStep === "summary" && (
                    <div className="flex flex-col space-y-3">
                      <button
                        onClick={completeOrder}
                        className="w-full py-3 rounded-lg font-bold bg-green-600 hover:bg-green-700 text-white shadow-lg transition-colors duration-200"
                      >
                        Place Order
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default EcommerceLayout;