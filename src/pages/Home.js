import React, { useEffect, useState } from "react";
import { supabase } from "../supabase";
import { Link } from "react-router-dom";

function Home() {
  const [paintings, setPaintings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const { data, error } = await supabase
          .from("paintings")
          .select("*")
          .order("created_at", { ascending: false })
          .limit(6);

        if (error) throw error;

        setPaintings(data || []);
      } catch (err) {
        console.error("Home load error:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  return (
    <div>
      {/* ---------- HERO ---------- */}
      <section style={heroStyle}>
        <h1 style={heroTitle}>ArtVerse 🎨</h1>
        <p style={heroText}>
          Discover, share, and explore beautiful artworks
        </p>

        <div style={{ marginTop: "25px" }}>
          <Link to="/gallery" style={heroBtn}>
            Explore Gallery
          </Link>
        </div>
      </section>

      {/* ---------- FEATURED ---------- */}
      <section style={{ padding: "50px" }}>
        <h2 style={{ marginBottom: "25px" }}>
          Featured Artworks
        </h2>

        {loading ? (
          <p>Loading featured artworks…</p>
        ) : paintings.length === 0 ? (
          <p>No artworks yet 🎨</p>
        ) : (
          <div style={gridStyle}>
            {paintings.map((painting) => (
              <Link
                key={painting.id}
                to={`/painting/${painting.id}`}
                style={{
                  textDecoration: "none",
                  color: "inherit",
                }}
              >
                <div style={cardStyle}>
                  <img
                    src={painting.image_url}
                    alt={painting.title}
                    style={imageStyle}
                  />

                  <div style={cardContent}>
                    <h4>{painting.title}</h4>
                    <p style={artistText}>
                      by {painting.artist || "Unknown"}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div
          style={{
            textAlign: "center",
            marginTop: "30px",
          }}
        >
          <Link to="/gallery" style={viewAllBtn}>
            View Full Gallery →
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Home;

/* ---------- STYLES ---------- */

const heroStyle = {
  height: "70vh",
  background:
    "linear-gradient(to right, #020024, #090979, #00d4ff)",
  color: "white",
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  textAlign: "center",
};

const heroTitle = {
  fontSize: "60px",
  marginBottom: "10px",
};

const heroText = {
  fontSize: "18px",
  opacity: 0.9,
};

const heroBtn = {
  padding: "12px 24px",
  background: "white",
  color: "#000",
  borderRadius: "8px",
  textDecoration: "none",
  fontWeight: "600",
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
  gap: "25px",
};

const cardStyle = {
  background: "#fff",
  borderRadius: "14px",
  overflow: "hidden",
  boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
  transition: "transform 0.3s",
};

const imageStyle = {
  width: "100%",
  height: "260px",
  objectFit: "cover",
};

const cardContent = {
  padding: "12px",
};

const artistText = {
  fontSize: "13px",
  color: "#666",
};

const viewAllBtn = {
  textDecoration: "none",
  fontWeight: "bold",
  color: "#2563eb",
};
