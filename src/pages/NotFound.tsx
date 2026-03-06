import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-black font-sans antialiased selection:bg-white/20">
      <div className="flex items-center gap-5">
        <h1 className="text-[24px] font-medium text-white border-r border-white/30 pr-5 leading-[49px]">
          404
        </h1>
        <div className="inline-block">
          <h2 className="text-[14px] font-normal text-white leading-[49px]">
            This page could not be found.
          </h2>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
