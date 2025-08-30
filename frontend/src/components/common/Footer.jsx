import React from "react";

export default function Footer() {
  return (
    <footer className="bg-dark text-white text-center py-3 mt-auto">
      © {new Date().getFullYear()} Store Ratings Platform
    </footer>
  );
}
