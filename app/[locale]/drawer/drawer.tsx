"use client";
import { FC, useCallback } from "react";
import EZDrawer from "react-modern-drawer";
import "react-modern-drawer/dist/index.css";
import "./drawer.css";
import { useDrawer } from "../appState";

const Drawer: FC<{ children?: React.ReactNode }> = (props) => {
  const onHomeClick = useCallback(() => {}, []);
  const { drawerOpen, setDrawerOpen } = useDrawer();

  return (
    <EZDrawer
      onClose={() => setDrawerOpen(false)}
      open={drawerOpen}
      direction="left"
      size={304}
      className="drawer tracking-[normal] leading-[normal] h-full overflow-auto"
      {...props}
    >
      <section className="h-[1225px] flex-1 bg-white overflow-hidden flex flex-col items-start justify-start pt-[45px] px-4 pb-[102px] box-border text-center text-sm text-dark-green font-text-sm-regular">
        <div className="self-stretch flex flex-col items-start justify-start py-0 px-0 gap-[32px]">
          <div className="self-stretch flex flex-row items-center justify-start gap-[42px]">
            <div className="flex-1 flex flex-row items-start justify-start gap-[29px]">
              <button className="cursor-pointer [border:none] py-0 pr-5 pl-0 bg-[transparent] flex flex-row items-center justify-start gap-[4px]">
                <img
                  className="h-6 w-6 relative overflow-hidden shrink-0"
                  alt=""
                  src="/globe02.svg"
                />
                <div className="flex flex-row items-center justify-start gap-[2px]">
                  <div className="relative text-sm leading-[20px] font-medium font-text-sm-regular text-dark-green text-center inline-block min-w-[49px]">
                    English
                  </div>
                  <img
                    className="h-[15px] w-[15px] relative overflow-hidden shrink-0 object-contain"
                    alt=""
                    src="/chevronleft@2x.png"
                  />
                </div>
              </button>
            </div>
            <button
              className="cursor-pointer p-0 bg-[transparent] h-[34px] w-[34px] relative rounded-lg box-border overflow-hidden shrink-0 border-[1px] border-solid border-whitesmoke-1000"
              onClick={() => {
                setDrawerOpen(false);
              }}
            />
          </div>
          <div className="self-stretch flex flex-col items-start justify-start gap-[24px]">
            <button className="cursor-pointer [border:none] py-0 pr-5 pl-0 bg-[transparent] flex flex-row items-center justify-start gap-[8px]">
              <img
                className="h-6 w-6 relative overflow-hidden shrink-0"
                alt=""
              />
              <div className="relative text-lg leading-[28px] font-medium font-text-sm-regular text-dark-green text-left">
                Login or Sign up
              </div>
            </button>
            <button className="cursor-pointer [border:none] p-0 bg-[transparent] self-stretch flex flex-row items-center justify-start gap-[10px]">
              <img
                className="h-10 w-10 rounded-29xl object-cover min-h-[40px]"
                alt=""
              />
              <div className="flex-1 flex flex-col items-start justify-center py-[5px] px-0 gap-[8px]">
                <div className="self-stretch flex flex-row items-start justify-start py-0 pr-[130px] pl-0 gap-[1px]">
                  <div className="relative text-base leading-[12px] font-medium font-text-sm-regular text-transparent !bg-clip-text [background:linear-gradient(rgba(0,_0,_0,_0.2),_rgba(0,_0,_0,_0.2)),_linear-gradient(rgba(0,_0,_0,_0.2),_rgba(0,_0,_0,_0.2)),_linear-gradient(rgba(0,_0,_0,_0.2),_rgba(0,_0,_0,_0.2)),_#170056] [-webkit-background-clip:text] [-webkit-text-fill-color:transparent] text-center inline-block min-w-[38px]">
                    Juan
                  </div>
                  <div className="relative text-base leading-[12px] font-medium font-text-sm-regular text-transparent !bg-clip-text [background:linear-gradient(rgba(0,_0,_0,_0.2),_rgba(0,_0,_0,_0.2)),_linear-gradient(rgba(0,_0,_0,_0.2),_rgba(0,_0,_0,_0.2)),_linear-gradient(rgba(0,_0,_0,_0.2),_rgba(0,_0,_0,_0.2)),_#170056] [-webkit-background-clip:text] [-webkit-text-fill-color:transparent] text-center inline-block min-w-[54px]">
                    Gomez
                  </div>
                </div>
                <div className="h-2.5 relative text-sm leading-[20px] font-medium font-text-sm-regular text-inactive-grey text-center flex items-center justify-center min-w-[104px]">
                  View my profile
                </div>
              </div>
            </button>
            <button className="cursor-pointer [border:none] p-0 bg-[transparent] self-stretch flex flex-row items-center justify-start gap-[10px]">
              <div className="h-10 w-10 rounded-29xl bg-gainsboro-100 flex flex-row items-center justify-center p-2 box-border">
                <img
                  className="h-6 w-6 relative overflow-hidden shrink-0"
                  alt=""
                />
              </div>
              <div className="flex-1 flex flex-col items-start justify-center py-[5px] px-0 gap-[8px]">
                <div className="self-stretch flex flex-row items-start justify-start">
                  <div className="w-[55px] relative text-base leading-[12px] font-medium font-text-sm-regular text-transparent !bg-clip-text [background:linear-gradient(rgba(0,_0,_0,_0.2),_rgba(0,_0,_0,_0.2)),_linear-gradient(rgba(0,_0,_0,_0.2),_rgba(0,_0,_0,_0.2)),_linear-gradient(rgba(0,_0,_0,_0.2),_rgba(0,_0,_0,_0.2)),_#170056] [-webkit-background-clip:text] [-webkit-text-fill-color:transparent] text-center flex items-center justify-center overflow-hidden text-ellipsis whitespace-nowrap">
                    OneWe
                  </div>
                </div>
                <div className="h-2.5 relative text-sm leading-[20px] font-medium font-text-sm-regular text-inactive-grey text-center flex items-center justify-center">
                  View my impact project
                </div>
              </div>
            </button>
            <div className="self-stretch flex flex-col items-start justify-start gap-[12px]">
              <button className="cursor-pointer py-2.5 px-5 bg-dark-green self-stretch rounded-lg flex flex-row items-center justify-center whitespace-nowrap border-[1px] border-solid border-dark-green">
                <div className="relative text-[17px] leading-[20px] font-semibold font-text-sm-regular text-white text-center inline-block min-w-[37px]">{`Post `}</div>
              </button>
              <button className="cursor-pointer py-2.5 px-6 bg-[transparent] rounded-lg flex flex-row items-center justify-center whitespace-nowrap border-[1px] border-solid border-dark-green">
                <div className="relative text-base leading-[20px] font-semibold font-text-sm-regular text-dark-green text-center">
                  Onboard your impact project
                </div>
              </button>
              <button className="cursor-pointer py-2.5 px-[19px] bg-[transparent] rounded-lg flex flex-row items-center justify-center whitespace-nowrap border-[1px] border-solid border-dark-green">
                <div className="relative text-base leading-[20px] font-semibold font-text-sm-regular text-dark-green text-center">
                  Create another impact project
                </div>
              </button>
            </div>
          </div>
          <div className="flex flex-col items-start justify-start py-0 pr-5 pl-0 gap-[32px]">
            <button
              className="cursor-pointer [border:none] p-0 bg-[transparent] flex flex-row items-center justify-start gap-[8px]"
              onClick={onHomeClick}
            >
              <img
                className="h-6 w-6 relative overflow-hidden shrink-0"
                alt=""
              />
              <div className="relative text-lg leading-[28px] font-medium font-text-sm-regular text-dark-green text-left inline-block min-w-[51px]">
                Home
              </div>
            </button>
            <button className="cursor-pointer [border:none] p-0 bg-[transparent] flex flex-row items-center justify-start gap-[9px]">
              <img
                className="h-6 w-6 relative overflow-hidden shrink-0"
                alt=""
              />
              <div className="relative text-lg leading-[28px] font-medium font-text-sm-regular text-dark-green text-left inline-block min-w-[84px]">
                My giving
              </div>
            </button>
            <button className="cursor-pointer [border:none] p-0 bg-[transparent] flex flex-row items-center justify-start gap-[10px]">
              <img
                className="h-6 w-6 relative overflow-hidden shrink-0"
                alt=""
              />
              <div className="relative text-lg leading-[28px] font-medium font-text-sm-regular text-dark-green text-center">
                Support OneWe
              </div>
            </button>
            <button className="cursor-pointer [border:none] p-0 bg-[transparent] flex flex-row items-center justify-start gap-[10px]">
              <div className="relative text-lg leading-[28px] font-medium font-text-sm-regular text-dark-green text-center inline-block min-w-[71px]">
                Sign out
              </div>
              <img
                className="h-6 w-6 relative overflow-hidden shrink-0"
                alt=""
              />
            </button>
          </div>
        </div>
      </section>
    </EZDrawer>
  );
};

export default Drawer;
