import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../supabase";

function PaintingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [painting, setPainting] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPainting = async () => {
      const { data, error } = await supabase
        .from("paintings")
        .select("*")
        .eq("id", id)
        .single();

      if (error || !data) {
        setPainting(null);
        setLoading(false);
        return;
      }

      // ⏰ Limited-time exhibition check (SAFE ADDITION)
      const now = new Date();

      if (data.exhibition_start && data.exhibition_end) {
        const start = new Date(data.exhibition_start);
        const end = new Date(data.exhibition_end);

        if (now < start || now > end) {
          setPainting(null);
          setLoading(false);
          return;
        }
      }

      setPainting(data);
      setLoading(false);
    };

    loadPainting();
  }, [id]);

  // ✅ RETURN JSX (THIS WAS MISSING)
  if (loading) return <h2 style={{ textAlign: "center" }}>Loading...</h2>;
  if (!painting)
    return <h2 style={{ textAlign: "center" }}>Exhibition not available</h2>;

  return (
    <div style={page}>
      <button onClick={() => navigate(-1)} style={backBtn}>
        ← Back
      </button>

      <img
        src={painting.image_url}
        alt={painting.title}
        style={image}
      />

      <h2>{painting.title}</h2>
      <p style={desc}>{painting.description}</p>
    </div>
  );
}

export default PaintingDetail;

/* ---------- styles ---------- */

const page = {
  maxWidth: "900px",
  margin: "40px auto",
  textAlign: "center",
};

const image = {
  width: "70%",
  maxHeight: "500px",
  objectFit: "cover",
  borderRadius: "12px",
};

const desc = {
  fontSize: "16px",
  color: "#555",
  marginTop: "10px",
};

const backBtn = {
  marginBottom: "20px",
  padding: "8px 14px",
  cursor: "pointer",
};
