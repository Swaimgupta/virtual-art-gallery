import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabase";

function UserPosts() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [galleryPosts, setGalleryPosts] = useState([]);
  const [exhibitionPosts, setExhibitionPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          setLoading(false);
          return;
        }

        setUser(user);

        /* ---------- MY GALLERY ---------- */
        const { data: galleryData } = await supabase
          .from("paintings")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        setGalleryPosts(galleryData || []);

        /* ---------- MY EXHIBITION ---------- */
        const { data: exhibitionData } = await supabase
          .from("artworks")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        setExhibitionPosts(exhibitionData || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  /* ---------- DELETE GALLERY ---------- */
  const deleteGallery = async (id, imagePath) => {
    if (!window.confirm("Delete this artwork?")) return;

    if (imagePath) {
      await supabase.storage.from("images").remove([imagePath]);
    }

    await supabase.from("paintings").delete().eq("id", id);

    setGalleryPosts((prev) => prev.filter((p) => p.id !== id));
  };

  /* ---------- DELETE EXHIBITION ---------- */
  const deleteExhibition = async (id, imagePath) => {
    if (!window.confirm("Delete this exhibition artwork?")) return;

    if (imagePath) {
      await supabase.storage.from("images").remove([imagePath]);
    }

    await supabase.from("artworks").delete().eq("id", id);

    setExhibitionPosts((prev) => prev.filter((p) => p.id !== id));
  };

  if (loading) {
    return <h2 style={{ textAlign: "center" }}>Loading…</h2>;
  }

  if (!user) {
    return <h2 style={{ textAlign: "center" }}>Please login</h2>;
  }

  return (
    <div style={pageStyle}>
      {/* HEADER */}
      <h1>My Page 🎨</h1>
      <p>{user.email}</p>

      {/* UPLOAD */}
      <div style={uploadCard}>
        <Link to="/upload" style={uploadBtn}>
          + Upload Artwork
        </Link>
      </div>

      {/* ---------- GALLERY ---------- */}
      <h2>My Gallery</h2>
      <div style={gridStyle}>
        {galleryPosts.map((post) => (
          <div key={post.id} style={cardStyle}>
            <img
              src={post.image_url}
              alt={post.title}
              style={imageStyle}
              onClick={() => navigate(`/painting/${post.id}`)}
            />

            <div style={cardContent}>
              <h4>{post.title}</h4>

              <button
                style={deleteBtn}
                onClick={() =>
                  deleteGallery(post.id, post.image_path)
                }
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ---------- EXHIBITION ---------- */}
      <h2 style={{ marginTop: 50 }}>My Exhibition</h2>
      <div style={gridStyle}>
        {exhibitionPosts.map((art) => (
          <div key={art.id} style={cardStyle}>
            <img
              src={art.image_url}
              alt={art.title}
              style={imageStyle}
              onClick={() =>
                navigate(`/exhibition/${art.artist_id}/${art.id}`)
              }
            />

            <div style={cardContent}>
              <h4>{art.title}</h4>

              <button
                style={deleteBtn}
                onClick={() =>
                  deleteExhibition(art.id, art.image_path)
                }
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default UserPosts;

/* ---------- STYLES ---------- */

const pageStyle = {
  padding: "40px",
  maxWidth: "1200px",
  margin: "0 auto",
};

const uploadCard = {
  margin: "20px 0 40px",
};

const uploadBtn = {
  padding: "10px 18px",
  background: "#2563eb",
  color: "white",
  borderRadius: "8px",
  textDecoration: "none",
  fontWeight: "600",
};

const gridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
  gap: "20px",
};

const cardStyle = {
  background: "#fff",
  borderRadius: "14px",
  overflow: "hidden",
  boxShadow: "0 8px 20px rgba(0,0,0,0.1)",
};

const imageStyle = {
  width: "100%",
  height: "200px",
  objectFit: "cover",
  cursor: "pointer",
};

const cardContent = {
  padding: "12px",
  textAlign: "center",
};

const deleteBtn = {
  marginTop: "8px",
  padding: "6px 12px",
  background: "red",
  color: "white",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
};
