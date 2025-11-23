import React from "react";
import Navbar from "../components/Navbar";
import Topbar from "../components/Topbar";

function Features() {
  const features = [
    "File-based databases with simple JSON storage",
    "Visual Query Builder (SELECT, JOIN, WHERE, GROUP BY)",
    "Schema editor and per-table schema validation",
    "Lightweight Crow-based backend",
    "Exportable query results",
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Topbar />
      <Navbar />
      <main className="p-8 max-w-4xl mx-auto text-white">
        <h1 className="text-3xl font-bold mb-4">Features</h1>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {features.map((f, i) => (
            <li
              key={i}
              className="bg-zinc-900 p-4 rounded border border-zinc-800 text-gray-200"
            >
              {f}
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}

export default Features;
