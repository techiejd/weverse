import { AbstractIntlMessages, useLocale, useTranslations } from "next-intl";
import DrawerButton from "./drawerButton";
import LanguagePortal from "./languagePortal";
import { locale, Locale } from "../../../functions/shared/src";
import { getTranslations } from "next-intl/server";
import NotificationsPortal from "./notificationsPortal";
import Image from "next/image";

const getLocalePortalMessages = async () => {
  const possibleLocales = Object.keys(locale.Enum) as Locale[];
  return possibleLocales.reduce(async (acc, l) => {
    return {
      ...(await acc),
      [l]: await import(`../../../messages/languagePortal/${l}.json`),
    };
  }, Promise.resolve({} as Record<Locale, AbstractIntlMessages>));
};

const Header = async () => {
  const t = await getTranslations("header");
  const l = useLocale();
  const languagePortalMessages = await getLocalePortalMessages();
  return (
    <header className="header self-stretch h-[4.5rem] bg-white flex flex-row items-center justify-center py-[0.906rem] px-[0.5rem] box-border sticky top-[0] max-w-full">
      <div className="self-stretch flex-1 flex flex-row items-center justify-between max-w-[85rem] gap-[1.25rem]">
        <DrawerButton>
          <div className="h-[1.875rem] rounded-lg overflow-hidden flex flex-row items-center justify-center py-[0.188rem] px-[0.5rem] box-border">
            <div className="h-[1.5rem] w-[1.5rem] relative overflow-hidden shrink-0">
              <Image alt="" src="/menu.svg" fill />
            </div>
          </div>
          <div className="flex flex-row items-center justify-start py-[0rem] pr-[0.5rem] pl-[0rem]">
            <div className="relative text-[1rem] tracking-[-1px] leading-[1.875rem] font-medium font-bottom-nav-bar-label-text text-gray-700 text-left inline-block min-w-[2.5rem]">
              {t("menu")}
            </div>
          </div>
        </DrawerButton>
        <button className="cursor-pointer [border:none] p-0 bg-[transparent] h-[1.794rem] w-[6.813rem] overflow-hidden shrink-0 flex flex-col items-center justify-between">
          <div className="self-stretch h-[1.794rem] relative max-w-full overflow-hidden shrink-0">
            <Image alt="" src="/onewe-logo.svg" fill />
          </div>
        </button>
        <div className="self-stretch flex flex-row items-center justify-start py-[0rem] pr-[0.5rem] pl-[0rem] gap-[0.25rem]">
          <LanguagePortal messages={JSON.stringify(languagePortalMessages)}>
            <div className="h-[1.35rem] w-[1.35rem] relative overflow-hidden shrink-0">
              <Image alt="globe" src="/globe-icon.svg" fill />
            </div>
            <div className="self-stretch flex flex-row items-center justify-start py-[0rem] pr-[0.125rem] pl-[0rem]">
              <div className="relative text-[1rem] tracking-[-1px] leading-[1.875rem] font-medium font-bottom-nav-bar-label-text text-gray-700 text-left inline-block min-w-[1.063rem]">
                {l[0].toUpperCase() + l.slice(1)}
              </div>
              <div className="h-[0.925rem] w-[0.925rem] relative overflow-hidden shrink-0 z-[1] ml-[-0.125rem]">
                <Image alt="" src="/chevrondown.svg" fill />
              </div>
            </div>
          </LanguagePortal>
          <NotificationsPortal>
            <div className="h-[1.35rem] w-[1.35rem] relative overflow-hidden shrink-0">
              <Image alt="notifications bell" fill src="/bell04.svg" />
            </div>
          </NotificationsPortal>
        </div>
      </div>
    </header>
  );
};

export default Header;
