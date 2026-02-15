import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "../supabase";

function ExhibitionArtworkDetail() {
  const { artworkId } = useParams();
  const navigate = useNavigate();

  const [artwork, setArtwork] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const { data, error } = await supabase
          .from("artworks")
          .select("*")
          .eq("id", artworkId)
          .single();

        if (error) throw error;

        setArtwork(data);
      } catch (err) {
        console.error("Artwork load error:", err.message);
        setArtwork(null);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [artworkId]);

  if (loading) {
    return <h2 style={{ textAlign: "center" }}>Loading…</h2>;
  }

  if (!artwork) {
    return <h2 style={{ textAlign: "center" }}>Artwork not found</h2>;
  }

  return (
    <div style={pageStyle}>
      <button style={backButton} onClick={() => navigate(-1)}>
        ← Back
      </button>

      <img
        src={artwork.image_url}
        alt={artwork.title}
        style={imageStyle}
      />

      <h1>{artwork.title}</h1>

      <p style={descStyle}>
        {artwork.description || "No description"}
      </p>
    </div>
  );
}

export default ExhibitionArtworkDetail;

/* ---------- STYLES ---------- */

const pageStyle = {
  maxWidth: "900px",
  margin: "40px auto",
  padding: "0 20px",
};

const backButton = {
  marginBottom: "20px",
  padding: "8px 14px",
  background: "#f3f4f6",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
};

const imageStyle = {
  width: "100%",
  maxHeight: "500px",
  objectFit: "cover",
  borderRadius: "12px",
  marginBottom: "20px",
};

const descStyle = {
  fontSize: "16px",
  color: "#555",
};
