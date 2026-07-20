import { NavLink } from 'react-router-dom'

const navbar = () => {
  return (
    <>
        <nav className="w-full bg-slate-800 px-6 py-4 text-white">
        <div className='flex justify-between'>
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
        {localStorage.getItem("accessKey") ? 
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
        </li> : undefined 
        }
      </ul>
      <ul className="flex gap-6">
         <li className='position-left'>
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
        </li>
      </ul>
      </div>
    </nav>
    </>
  )
}

export default navbar