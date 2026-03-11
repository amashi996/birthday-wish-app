// Full Online Birthday Greeting Card App
// Features:
// 🎂 Confetti animation
// 🎵 Birthday music
// 🎁 Custom message
// 📸 Photo upload
// 🌐 Can be hosted online

/* ================= FRONTEND (React) ================= */

// App.jsx

import { useState } from "react";

export default function App() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [photo, setPhoto] = useState(null);
  const [generatedLink, setGeneratedLink] = useState("");

  const createCard = async () => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("message", message);
    formData.append("photo", photo);

    const res = await fetch("http://localhost:5000/create", {
      method: "POST",
      body: formData
    });

    const data = await res.json();
    setGeneratedLink(data.url);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-10 bg-pink-100">
      <div className="bg-white shadow-xl rounded-2xl p-10 max-w-md w-full text-center">
        <h1 className="text-2xl font-bold mb-4">Create Birthday Card 🎉</h1>

        <input
          className="border p-2 w-full mb-3 rounded"
          placeholder="Birthday person's name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <textarea
          className="border p-2 w-full mb-3 rounded"
          placeholder="Custom birthday message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <input
          type="file"
          className="mb-3"
          onChange={(e) => setPhoto(e.target.files[0])}
        />

        <button
          onClick={createCard}
          className="px-4 py-2 rounded bg-pink-500 text-white"
        >
          Generate Card Link
        </button>

        {generatedLink && (
          <div className="mt-4">
            <p>Share this link:</p>
            <a className="text-blue-600" href={generatedLink}>{generatedLink}</a>
          </div>
        )}
      </div>
    </div>
  );
}
