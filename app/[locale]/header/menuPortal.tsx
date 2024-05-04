"use client";
import { ReactNode } from "react";
import { useDrawer } from "../appState";

const MenuPortal = ({ children }: { children: ReactNode }) => {
  const { setDrawerOpen } = useDrawer();
  return (
    <div className="flex flex-row items-center justify-start">
      <button
        className="cursor-pointer py-[0.25rem] px-[0rem] bg-white rounded-lg shadow-[0px_1px_4px_rgba(0,_0,_0,_0.16)] flex flex-row items-center justify-start border-[1px] border-solid border-lightgray"
        onClick={() => {
          setDrawerOpen(true);
        }}
      >
        <div className="h-[1.875rem] rounded-lg overflow-hidden flex flex-row items-center justify-center py-[0.188rem] px-[0.5rem] box-border">
          <img
            className="h-[1.5rem] w-[1.5rem] relative overflow-hidden shrink-0"
            loading="lazy"
            alt=""
            src="/menu.svg"
          />
        </div>
        <div className="flex flex-row items-center justify-start py-[0rem] pr-[0.5rem] pl-[0rem]">
          <div className="relative text-[1rem] tracking-[-1px] leading-[1.875rem] font-medium font-bottom-nav-bar-label-text text-gray-700 text-left inline-block min-w-[2.5rem]">
            {children}
          </div>
        </div>
      </button>
    </div>
  );
};

export default MenuPortal;
