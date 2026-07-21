import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import LogoutModal from './logoutModal'

const navbar = () => {
  const [isLogoutOpen, setIsLogoutOpen] = useState(false)

  return (
    <>
      <nav className="w-full bg-slate-800 px-6 py-4 text-white">
        <div className='flex justify-between items-center'>
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
            {localStorage.getItem("accessKey") ? (
              <li>
                <NavLink
                  to="/parsinghistory"
                  className={({ isActive }) =>
                    isActive
                      ? "text-blue-400 font-semibold"
                      : "hover:text-blue-300"
                  }
                >
                  History
                </NavLink>
              </li>
            ) : undefined}
          </ul>
          <ul className="flex gap-6">
            <li className='position-left flex items-center'>
              {localStorage.getItem("accessKey") ? (
                <button
                  onClick={() => setIsLogoutOpen(true)}
                  className="hover:text-blue-300 cursor-pointer transition-colors"
                >
                  Logout
                </button>
              ) : (
                <NavLink
                  to="/login"
                  className={({ isActive }) =>
                    isActive
                      ? "text-blue-400 font-semibold"
                      : "hover:text-blue-300"
                  }
                >
                  Login
                </NavLink>
              )}
            </li>
          </ul>
        </div>
      </nav>

      {/* Logout Confirmation Modal */}
      <LogoutModal isOpen={isLogoutOpen} onClose={() => setIsLogoutOpen(false)} />
    </>
  )
}

export default navbar