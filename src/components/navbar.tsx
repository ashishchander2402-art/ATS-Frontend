import { NavLink } from 'react-router-dom'

const navbar = () => {
  return (
    <>
        <nav className="w-full bg-slate-800 px-6 py-4 text-white">
        <ul className="flex gap-6">
        <li>
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive
                ? "text-blue-400 font-semibold"
                : "hover:text-blue-300"
            }
          >
            Home
          </NavLink>
        </li>
        <li>
          <NavLink
            to="/test"
            className={({ isActive }) =>
              isActive
                ? "text-blue-400 font-semibold"
                : "hover:text-blue-300"
            }
          >
            test
          </NavLink>
        </li>
      </ul>
    </nav>
    </>
  )
}

export default navbar