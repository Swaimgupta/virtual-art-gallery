import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../supabase";

function PaintingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [painting, setPainting] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPainting = async () => {
      const { data, error } = await supabase
        .from("paintings")
        .select("*")
        .eq("id", id)
        .single();

      if (!error) {
        setPainting(data);
      }

      setLoading(false);
    };

    fetchPainting();
  }, [id]);

  if (loading) {
    return <h2 style={{ textAlign: "center" }}>Loading…</h2>;
  }

  if (!painting) {
    return <h2 style={{ textAlign: "center" }}>Painting not found</h2>;
  }

  return (
    <div style={container}>
      {/* BACK */}
      <button onClick={() => navigate(-1)} style={backBtn}>
        ← Back
      </button>

      {/* IMAGE */}
      <img
        src={painting.image_url}
        alt={painting.title}
        style={imageStyle}
      />

      {/* TITLE */}
      <h1 style={titleStyle}>{painting.title}</h1>

      {/* ARTIST */}
      <p style={artistStyle}>
        By {painting.artist || "Unknown Artist"}
      </p>

      {/* DESCRIPTION */}
      <p style={descStyle}>
        {painting.description || "No description available"}
      </p>
    </div>
  );
}

export default PaintingDetail;

/* ---------- STYLES ---------- */

const container = {
  maxWidth: "1100px",
  margin: "40px auto",
  padding: "0 20px",
  textAlign: "center",
};

const backBtn = {
  marginBottom: "20px",
  padding: "8px 14px",
  background: "#2563eb",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
};

const imageStyle = {
  width: "70%",           // ✅ IMAGE SIZE FIX
  maxHeight: "500px",
  objectFit: "cover",
  borderRadius: "12px",
  display: "block",
  margin: "20px auto",
};

const titleStyle = {
  marginTop: "20px",
  fontSize: "28px",
};

const artistStyle = {
  fontSize: "16px",
  fontWeight: "600",
  color: "#555",
  marginTop: "8px",
};

const descStyle = {
  fontSize: "15px",
  color: "#666",
  maxWidth: "700px",
  margin: "15px auto",
  lineHeight: "1.6",
};
