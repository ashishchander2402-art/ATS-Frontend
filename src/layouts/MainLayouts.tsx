import { Outlet } from "react-router-dom";
import Navbar from "../components/navbar";

const MainLayout = () => {
  return (
    <>
      <Navbar />
      <main className="w-full bg-slate-100 px-6 py-6 min-h-[calc(100vh-56px)]">
        <Outlet />
      </main>
    </>
  );
};

export default MainLayout;