import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Gallery from "./pages/Gallery";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Upload from "./pages/Upload";
import UserPosts from "./pages/UserPosts";
import Exhibition from "./pages/Exhibition";
import ExhibitionArtworkDetail from "./pages/ExhibitionArtworkDetail";
import PaintingDetail from "./pages/PaintingDetail";
import ProtectedRoute from "./components/ProtectedRoute";

/* 🔹 Layout wrapper to control Navbar */
function Layout() {
  const location = useLocation();

  // ❌ Hide Navbar on login & signup pages
  const hideNavbar =
    location.pathname === "/" ||
    location.pathname === "/login";

  return (
    <>
      {!hideNavbar && <Navbar />}

      <Routes>
        {/* ---------- PUBLIC ---------- */}
        <Route path="/" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/exhibition" element={<Exhibition />} />

        {/* ---------- DETAILS ---------- */}
        <Route
          path="/painting/:id"
          element={<PaintingDetail />}
        />

        <Route
          path="/exhibition/:artistId/:artworkId"
          element={<ExhibitionArtworkDetail />}
        />

        {/* ---------- PROTECTED ---------- */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        <Route
          path="/upload"
          element={
            <ProtectedRoute>
              <Upload />
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-posts"
          element={
            <ProtectedRoute>
              <UserPosts />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}

export default App;
