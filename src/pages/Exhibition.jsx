import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase";

function Exhibition() {
  const navigate = useNavigate();
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadArtworks = async () => {
      try {
        const { data, error } = await supabase
          .from("artworks")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) throw error;

        setArtworks(data || []);
      } catch (err) {
        console.error("Exhibition load error:", err.message);
      } finally {
        setLoading(false);
      }
    };

    loadArtworks();
  }, []);

  if (loading) {
    return <h2 style={{ textAlign: "center" }}>Loading Exhibition…</h2>;
  }

  if (artworks.length === 0) {
    return (
      <h2 style={{ textAlign: "center" }}>
        No exhibitions yet 🎭
      </h2>
    );
  }

  return (
    <div style={container}>
      <h1 style={{ marginBottom: 30 }}>Exhibition 🎨</h1>

      <div style={grid}>
        {artworks.map((art) => (
          <div
            key={art.id}
            style={card}
            onClick={() =>
              // ✅ FIX: pass BOTH params
              navigate(`/exhibition/${art.user_id}/${art.id}`)
            }
          >
            <img
              src={art.image_url}
              alt={art.title}
              style={image}
            />

            <div style={content}>
              <h3>{art.title}</h3>
              <p style={desc}>
                {art.description?.slice(0, 80)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Exhibition;

/* ---------- STYLES ---------- */

const container = {
  maxWidth: "1200px",
  margin: "0 auto",
  padding: "40px 20px",
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
  gap: "25px",
};

const card = {
  background: "#fff",
  borderRadius: "14px",
  overflow: "hidden",
  boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
  cursor: "pointer",
};

const image = {
  width: "100%",
  height: "260px",
  objectFit: "cover",
};

const content = {
  padding: "14px",
};

const desc = {
  fontSize: "13px",
  color: "#555",
};
