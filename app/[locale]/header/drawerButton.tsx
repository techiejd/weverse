"use client";
import { ReactNode } from "react";
import { useDrawer } from "../appState";

const DrawerButton = ({ children }: { children: ReactNode }) => {
  const { setDrawerOpen } = useDrawer();
  return (
    <div className="flex flex-row items-center justify-start">
      <button
        className="cursor-pointer py-[0.25rem] px-[0rem] bg-white rounded-lg shadow-[0px_1px_4px_rgba(0,_0,_0,_0.16)] flex flex-row items-center justify-start border-[1px] border-solid border-lightgray"
        onClick={() => {
          setDrawerOpen(true);
        }}
      >
        {children}
      </button>
    </div>
  );
};

export default DrawerButton;
