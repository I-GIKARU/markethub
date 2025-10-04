


import { Routes, Route } from "react-router-dom";
import "./App.css";
import Landingpage from "./pages/landingpage";
import SignupForm from "./pages/signup";
import LoginForm from "./pages/login";
import ProjectLayout from "./pages/projectlist";
import EcommerceLayout from "./pages/shoppingpage";
import Profile from "./pages/Profile";
import MyProjects from "./pages/MyProjects";
import UploadProject from "./pages/UploadProject";
import { StudentDashBoard } from "./pages/StudentDashBoard";
import NotFound from "./pages/NotFoundpage";
import ContactUs from "./pages/ContactUs";
import ContactMe from "./pages/ContactMe";
import AdminDashboard from "./pages/AdminDashboard";
import MerchUpload from "./pages/MerchUpload";
import App11 from "./pages/Home";
import MoriBotChat from "./components/MoriBotChat";
import MpesaPayment from "./pages/MpesaPayment";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Landingpage />} />
        <Route path="/home" element={<App11 />} />
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/projects" element={<ProjectLayout />} />
        <Route path="/shop" element={<EcommerceLayout />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/profile/:username" element={<Profile />} />
        <Route path="/my-projects" element={<MyProjects />} />

        <Route path="/contact" element={<ContactUs />} />
        <Route path="/contact-me" element={<ContactMe />} />
        <Route path="/dashboard" element={<StudentDashBoard />}>
          <Route path="upload-project" element={<UploadProject />} />
        </Route>
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="upload-merch" element={<MerchUpload />} />

        <Route path="*" element={<NotFound />} />
        <Route path="/mpesa-payment" element={<MpesaPayment />} />
      </Routes>
      <MoriBotChat />
    </>
  );
}

export default App;

























