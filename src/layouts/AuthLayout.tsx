import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div className="flex min-h-screen w-full bg-slate-50 font-sans">
      {/* Left Column: Visual Banner (Desktop only) */}
      <div className="relative hidden w-[45%] bg-[url('/banner.png')] bg-fit bg-no-repeat bg-center flex-col justify-between overflow-hidden p-0 text-center lg:flex">
      </div>

      {/* Right Column: Active Auth Form Card */}
      <div className="flex w-full flex-col items-center justify-center p-6 sm:p-12 lg:w-[55%] bg-[#f1f5f9]">
        <div className="w-full max-w-[460px]">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
