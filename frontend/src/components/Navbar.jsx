import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/auth/authSlice";

function Navbar() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <Link to="/" className="font-bold text-lg">
        SkillSwap
      </Link>

      <div className="space-x-4 flex items-center">
        {user ? (
          <>
            <Link to="/profile" className="hover:text-gray-300">
              Profile
            </Link>

            <Link to="/barters" className="hover:text-gray-300">
              Barters
            </Link>

            {/* ✅ Admin Link */}
            {user.role === "Admin" && (
              <Link to="/admin" className="hover:text-yellow-400 font-semibold">
                Admin
              </Link>
            )}

            <button
              onClick={handleLogout}
              className="bg-red-600 px-3 py-1 rounded hover:bg-red-700"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:text-gray-300">
              Login
            </Link>
            <Link to="/register" className="hover:text-gray-300">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;