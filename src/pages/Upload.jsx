import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase";

function Upload() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [type, setType] = useState("gallery");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // get logged-in user
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!user) {
      alert("Please login first");
      return;
    }

    if (!file || !title || !description) {
      alert("All fields required");
      return;
    }

    try {
      setLoading(true);

      /* ---------- UPLOAD IMAGE ---------- */
      const ext = file.name.split(".").pop();
      const filePath = `${user.id}/${Date.now()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("images")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from("images")
        .getPublicUrl(filePath);

      const imageUrl = data.publicUrl;

      /* ---------- GALLERY ---------- */
      if (type === "gallery") {
        const { error } = await supabase.from("paintings").insert({
          title,
          description,
          artist: user.email,
          image_url: imageUrl,
          image_path: filePath,
          user_id: user.id,
        });

        if (error) throw error;

        navigate("/gallery");
      }

      /* ---------- EXHIBITION ---------- */
      if (type === "exhibition") {
        const { error } = await supabase.from("artworks").insert({
          title,
          description,
          image_url: imageUrl,
          image_path: filePath,
          user_id: user.id,
        });

        if (error) throw error;

        navigate("/exhibition");
      }
    } catch (err) {
      console.error("UPLOAD ERROR:", err.message);
      alert("Upload failed. Check console.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={container}>
      <h2>Upload Artwork</h2>

      <form onSubmit={handleUpload}>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          style={input}
        >
          <option value="gallery">Gallery</option>
          <option value="exhibition">Exhibition</option>
        </select>

        <input
          placeholder="Artwork Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={input}
        />

        <textarea
          placeholder="Artwork Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={input}
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
          style={input}
        />

        <button disabled={loading} style={button}>
          {loading ? "Uploading..." : "Upload"}
        </button>
      </form>
    </div>
  );
}

export default Upload;

/* ---------- styles ---------- */

const container = {
  maxWidth: "500px",
  margin: "80px auto",
  padding: "30px",
  background: "#fff",
  borderRadius: "12px",
};

const input = {
  width: "100%",
  padding: "10px",
  marginBottom: "12px",
};

const button = {
  width: "100%",
  padding: "12px",
  background: "#2563eb",
  color: "white",
  border: "none",
  borderRadius: "6px",
};
