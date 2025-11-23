import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Topbar from "../components/Topbar";

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Thanks! Message not sent (demo page).");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <Topbar />
      <Navbar />
      <main className="p-8 max-w-3xl mx-auto text-white">
        <h1 className="text-3xl font-bold mb-4">Contact</h1>
        <p className="text-gray-300 mb-6">
          Want to report a bug or request a feature? Drop a message below.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Name</label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full p-2 rounded bg-zinc-900 text-white"
              placeholder="Your name"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Email</label>
            <input
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full p-2 rounded bg-zinc-900 text-white"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-1">Message</label>
            <textarea
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              className="w-full p-2 rounded bg-zinc-900 text-white"
              rows={6}
              placeholder="How can we help?"
            />
          </div>

          <button className="px-4 py-2 bg-secondary rounded-full text-white">
            Send Message
          </button>
        </form>
      </main>
    </div>
  );
}

export default Contact;
