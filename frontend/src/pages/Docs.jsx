import React from "react";
import Navbar from "../components/Navbar";
import Topbar from "../components/Topbar";
import Header from "../components/Header";

function Docs() {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Topbar />
      <Navbar />
      <Header />
      <main className="p-8 max-w-5xl mx-auto text-white">
        <h1 className="text-3xl font-bold mb-4">Documentation</h1>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">Getting started</h2>
          <p className="text-gray-300">
            - Create an account, then create a database from the dashboard.
            <br />
            - Add tables and define schemas via the Database page.
            <br />
            - Use the Query Builder to run queries visually or execute raw
            queries.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="text-2xl font-semibold mb-2">API</h2>
          <p className="text-gray-300">
            The frontend proxies requests to the backend on /api/v1/* — see
            routes in the server under{" "}
            <code className="text-xs">crowServer/routes</code>.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-2">Query Builder tips</h2>
          <ul className="list-disc list-inside text-gray-300">
            <li>Select fields, add joins and where conditions, then execute.</li>
            <li>Use GROUP BY and aggregates for summarized results.</li>
          </ul>
        </section>
      </main>
    </div>
  );
}

export default Docs;
