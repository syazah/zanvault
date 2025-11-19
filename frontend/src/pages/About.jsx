import React from "react";
import Navbar from "../components/Navbar";
import Topbar from "../components/Topbar";

function About() {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Topbar />
      <Navbar />
      <main className="p-8 max-w-4xl mx-auto text-white">
        <h1 className="text-3xl font-bold mb-4">About ZanVault</h1>
        <p className="text-gray-300 mb-4">
          ZanVault is a lightweight file-based database manager built for
          simplicity and speed. It provides an intuitive UI to create databases,
          design schemas, add data and run queries — all backed by a small
          server using Crow.
        </p>

        <section className="mt-6">
          <h2 className="text-2xl font-semibold mb-2">Mission</h2>
          <p className="text-gray-300">
            Make data storage approachable for developers who want a fast local
            datastore without heavy dependencies.
          </p>
        </section>

        <section className="mt-6">
          <h2 className="text-2xl font-semibold mb-2">Links</h2>
          <ul className="list-disc list-inside text-gray-300">
            <li>Quick start guides and docs are available on the Docs page.</li>
            <li>Use the Query Builder to compose and run queries visually.</li>
          </ul>
        </section>
      </main>
    </div>
  );
}

export default About;
