import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { supabase } from "../supabase";

function Landing() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // get current user
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setLoading(false);
    });

    // listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <div className="bg-gray-950 text-white min-h-screen">
      {/* ---------- HERO ---------- */}
      <div className="h-screen flex flex-col justify-center items-center text-center bg-gradient-to-br from-black via-gray-900 to-gray-800 px-6">
        <motion.h1
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-6xl md:text-7xl font-bold mb-6"
        >
          ArtVerse 🎨
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="text-gray-400 text-lg max-w-xl mb-8"
        >
          A digital space where creativity meets imagination.
        </motion.p>

        {!loading && (
          <div className="flex gap-4 flex-wrap justify-center">
            <Link
              to="/gallery"
              className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold transition"
            >
              Explore Gallery
            </Link>

            {!user && (
              <>
                <Link
                  to="/login"
                  className="bg-gray-700 hover:bg-gray-600 px-6 py-3 rounded-lg font-semibold transition"
                >
                  Login
                </Link>

                {/* Signup route */}
                <Link
                  to="/"
                  className="bg-white text-black hover:bg-gray-200 px-6 py-3 rounded-lg font-semibold transition"
                >
                  Sign Up
                </Link>
              </>
            )}

            {user && (
              <Link
                to="/my-posts"
                className="bg-gray-700 hover:bg-gray-600 px-6 py-3 rounded-lg font-semibold transition"
              >
                My Page
              </Link>
            )}
          </div>
        )}
      </div>

      {/* ---------- FEATURED ---------- */}
      <div className="p-12">
        <h2 className="text-4xl font-bold mb-10 text-center">
          Featured Artworks
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <img
            src="https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800"
            alt="Abstract artwork"
            className="rounded-xl shadow-xl hover:scale-105 transition duration-500"
          />

          <img
            src="https://images.unsplash.com/photo-1492724441997-5dc865305da7?w=800"
            alt="Classic artwork"
            className="rounded-xl shadow-xl hover:scale-105 transition duration-500"
          />

          <img
            src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800"
            alt="Nature artwork"
            className="rounded-xl shadow-xl hover:scale-105 transition duration-500"
          />
        </div>
      </div>

      {/* ---------- ABOUT ---------- */}
      <div className="bg-gray-900 p-16 text-center">
        <h2 className="text-3xl font-bold mb-6">
          About ArtVerse
        </h2>

        <p className="text-gray-400 max-w-3xl mx-auto leading-relaxed">
          ArtVerse is a platform built to showcase and explore digital paintings.
          Discover modern, abstract, classic, and nature-inspired artworks
          created by talented artists.
        </p>
      </div>
    </div>
  );
}

export default Landing;
