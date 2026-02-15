import React, { useEffect, useState } from "react";
import { supabase } from "../supabase";
import { useNavigate } from "react-router-dom";

function Gallery() {
  const [paintings, setPaintings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPaintings = async () => {
      const { data, error } = await supabase
        .from("paintings")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error) setPaintings(data || []);
      setLoading(false);
    };

    fetchPaintings();
  }, []);

  if (loading) {
    return <h2 style={{ textAlign: "center" }}>Loading Gallery…</h2>;
  }

  if (paintings.length === 0) {
    return <h2 style={{ textAlign: "center" }}>No artworks yet 🎨</h2>;
  }

  return (
    <div style={container}>
      <div style={grid}>
        {paintings.map((p) => (
          <div
            key={p.id}
            style={card}
            onClick={() => navigate(`/painting/${p.id}`)}
          >
            <img
              src={p.image_url}
              alt={p.title}
              style={image}
            />

            <div style={content}>
              <h3 style={title}>{p.title}</h3>
              <p style={artist}>by {p.artist || "Unknown"}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Gallery;

/* ---------- STYLES ---------- */

const container = {
  maxWidth: "1200px",
  margin: "0 auto",
  padding: "40px 20px",
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
  gap: "24px",
};

const card = {
  background: "#fff",
  borderRadius: "14px",
  overflow: "hidden",
  boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
  cursor: "pointer",
  transition: "transform 0.25s ease",
};

const image = {
  width: "100%",
  height: "220px",        // ✅ FIXED SIZE
  objectFit: "cover",     // ✅ NO STRETCH
};

const content = {
  padding: "14px",
};

const title = {
  margin: 0,
  fontSize: "18px",
};

const artist = {
  marginTop: "6px",
  fontSize: "14px",
  color: "#666",
};
