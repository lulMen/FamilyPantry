import { NavLink } from "react-router-dom";

function NavBar() {
  return (
    <nav className="bg-white border-b shadow-sm px-6 py-3 flex items-center gap-6">
      <span className="font-bold text-lg text-green-600">FamilyPantry</span>
      <NavLink
        to="/pantry"
        className={({ isActive }) =>
          isActive
            ? "text-green-600 font-semibold"
            : "text-gray-600 hover:text-green-600"
        }
      >
        Pantry
      </NavLink>
      <NavLink
        to="/recipes"
        className={({ isActive }) =>
          isActive
            ? "text-green-600 font-semibold"
            : "text-gray-600 hover:text-green-600"
        }
      >
        Recipes
      </NavLink>
      <NavLink
        to="/shopping-lists"
        className={({ isActive }) =>
          isActive
            ? "text-green-600 font-semibold"
            : "text-gray-600 hover:text-green-600"
        }
      >
        Shopping Lists
      </NavLink>
    </nav>
  );
}

export default NavBar;
