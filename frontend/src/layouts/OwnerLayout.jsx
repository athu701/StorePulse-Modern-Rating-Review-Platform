import React from "react";
import Navbar from "./components/Common/Navbar";
import Footer from "./components/Common/Footer";

export default function OwnerLayout({ children }) {
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <main className="flex-fill">{children}</main>
      <Footer />
    </div>
  );
}
