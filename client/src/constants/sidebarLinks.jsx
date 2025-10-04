import {
  IconHome,
  IconFolder,
  IconUser,
  IconLogout,
  IconUpload,
} from "@tabler/icons-react";

export const sidebarLinks = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: <IconHome size={18} />,
  },
  {
    label: "My Projects",
    href: "/dashboard/projects",
    icon: <IconFolder size={18} />,
  },
  {
    label: "Profile",
    href: "/dashboard/profile",
    icon: <IconUser size={18} />,
  },
  {
    label: "Upload",
    href: "/dashboard/upload",
    icon: <IconUpload size={18} />,
  },
  {
    label: "Logout",
    href: "#", // href can remain '#' as onClick handles navigation
    icon: <IconLogout size={18} />,
    onClick: () => {
      // Clear the authentication token from local storage
      localStorage.removeItem("token");
      localStorage.removeItem("user"); // Assuming you might store user details too
      // Redirect to the root route (your homepage/hero section)
      window.location.href = "/"; // <--- THIS IS THE CHANGE FOR HERO SECTION
    },
  },
];