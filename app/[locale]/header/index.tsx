import { useLocale, useTranslations } from "next-intl";
import DrawerButton from "./drawerButton";

const Header = () => {
  const t = useTranslations("header");
  const l = useLocale();
  return (
    <header className="header self-stretch h-[4.5rem] bg-white flex flex-row items-center justify-center py-[0.906rem] px-[0.5rem] box-border sticky top-[0] z-[99] max-w-full">
      <div className="self-stretch flex-1 flex flex-row items-center justify-between max-w-[85rem] gap-[1.25rem]">
        <DrawerButton>
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
              {t("menu")}
            </div>
          </div>
        </DrawerButton>
        <button className="cursor-pointer [border:none] p-0 bg-[transparent] h-[1.794rem] w-[6.813rem] overflow-hidden shrink-0 flex flex-col items-center justify-between">
          <img
            className="self-stretch h-[1.794rem] relative max-w-full overflow-hidden shrink-0"
            loading="lazy"
            alt=""
            src="/onewe-logo.svg"
          />
        </button>
        <div className="self-stretch flex flex-row items-center justify-start py-[0rem] pr-[0.5rem] pl-[0rem] gap-[0.25rem]">
          <button className="cursor-pointer [border:none] p-0 bg-[transparent] h-[1.875rem] flex flex-row items-center justify-start gap-[0.188rem]">
            <img
              className="h-[1.125rem] w-[1.125rem] relative overflow-hidden shrink-0"
              loading="lazy"
              alt=""
              src="/globe-icon.svg"
            />
            <div className="self-stretch flex flex-row items-center justify-start py-[0rem] pr-[0.125rem] pl-[0rem]">
              <div className="relative text-[1rem] tracking-[-1px] leading-[1.875rem] font-medium font-bottom-nav-bar-label-text text-gray-700 text-left inline-block min-w-[1.063rem]">
                {l[0].toUpperCase() + l.slice(1)}
              </div>
              <img
                className="h-[0.925rem] w-[0.925rem] relative overflow-hidden shrink-0 z-[1] ml-[-0.125rem]"
                alt=""
                src="/chevrondown.svg"
              />
            </div>
          </button>
          <button className="cursor-pointer [border:none] p-0 bg-[transparent] self-stretch w-[2.163rem] flex flex-row items-center justify-start">
            <img
              className="h-[1.35rem] w-[1.35rem] relative overflow-hidden shrink-0"
              loading="lazy"
              alt=""
              src="/bell04.svg"
            />
            <div className="flex-1 flex flex-row items-center justify-start pt-[1.25rem] px-[0rem] pb-[0rem] z-[1] ml-[-0.625rem]">
              <div className="flex-1 rounded-71xl bg-international-red flex flex-col items-center justify-center p-[0.438rem] border-[1px] border-solid border-white">
                <div className="w-[0.438rem] h-[0.563rem] relative text-[0.75rem] tracking-[-1px] leading-[1.875rem] font-medium font-bottom-nav-bar-label-text text-white text-center flex items-center justify-center shrink-0 min-w-[0.438rem]">
                  3
                </div>
              </div>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
