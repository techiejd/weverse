import { useTranslations } from "next-intl";
import { useContext } from "react";
import { localeDisplayNames } from "../../../../common/utils/translations";
import Image from "next/image";
import { Locale } from "../../../../functions/shared/src";
import { LanguagePortalContext } from "./languagePortalContext";

const LanguagePortalChoosePrimary = () => {
  const {
    chosenPrimaryLocale,
    setChosenPrimaryLocale,
    possibleLocales,
    loading,
    onClose,
    onPrimarySave,
  } = useContext(LanguagePortalContext);
  const t = useTranslations("languagePortal");
  return (
    <div className="flex-1 rounded-xl bg-white overflow-hidden pt-[1.25rem] px-[1rem] pb-[1rem] box-border gap-[1rem] max-w-[42.5rem]">
      <div
        className={`flex flex-col items-end justify-start ${
          loading ? "opacity-20 pointer-events-none" : ""
        }`}
      >
        <button
          className="cursor-pointer p-0 bg-primary-100 w-[3.5rem] h-[3.5rem] relative rounded-9xl box-border border-[8px] border-solid border-primary-50"
          onClick={onClose}
        >
          <div className="absolute top-[calc(50%_-_12px)] left-[calc(50%_-_12px)] w-[1.5rem] h-[1.5rem] overflow-hidden">
            <Image alt="" fill src="/close-icon.svg" />
          </div>
        </button>
        <div className="self-stretch flex flex-col items-start justify-start pt-[0rem] px-[0rem] pb-[0.5rem] gap-[1.5rem] text-left text-[1.125rem] text-gray-900 font-text-md-semibold">
          <div className="self-stretch flex flex-col items-start justify-start gap-[0.5rem]">
            <div className="self-stretch relative leading-[1.75rem] font-semibold">
              {t("chooseYourPrimaryLanguage")}
            </div>
            <div className="self-stretch relative text-[0.875rem] leading-[1.25rem] text-gray-500">
              {t("explanationPrimaryLanguage")}
            </div>
          </div>
          {possibleLocales.map((possibleLocale) => (
            <button
              className="cursor-pointer [border:none] p-0 bg-[transparent] flex flex-row items-start justify-start gap-[0.5rem] w-full"
              key={possibleLocale}
              onClick={() => {
                setChosenPrimaryLocale(possibleLocale as Locale);
              }}
            >
              <div className="flex flex-col items-start justify-start pt-[0.125rem] px-[0rem] pb-[0rem]">
                <input
                  className={`${
                    possibleLocale === chosenPrimaryLocale
                      ? "border-primary-50 accent-primary-50"
                      : ""
                  } cursor-pointer m-0 w-[1rem] h-[1rem] flex flex-row items-start justify-start`}
                  type="radio"
                  name="radioGroup-1"
                  readOnly
                  checked={possibleLocale === chosenPrimaryLocale}
                />
              </div>
              <div className="relative text-[0.875rem] leading-[1.25rem] font-medium font-text-md-semibold text-gray-700 text-left inline-block">
                {localeDisplayNames[possibleLocale as Locale]}
              </div>
            </button>
          ))}
        </div>
        <div className="self-stretch flex flex-col items-start justify-start gap-[0.75rem]">
          <button
            className="cursor-pointer [border:none] p-0 bg-[transparent] self-stretch rounded-lg flex flex-row items-start justify-start"
            onClick={onPrimarySave}
          >
            <div className="flex-1 shadow-[0px_1px_2px_rgba(16,_24,_40,_0.05)] rounded-lg bg-primary-600 overflow-hidden flex flex-row items-center justify-center py-[0.5rem] px-[1.25rem] border-[1px] border-solid border-primary-600">
              <div className="relative text-[1rem] leading-[1.5rem] font-semibold font-text-md-semibold text-white text-left inline-block">
                {t("save")}
              </div>
            </div>
          </button>
          <button
            className="cursor-pointer [border:none] p-0 bg-[transparent] self-stretch rounded-lg flex flex-row items-start justify-start"
            onClick={onClose}
          >
            <div className="flex-1 shadow-[0px_1px_2px_rgba(16,_24,_40,_0.05)] rounded-lg bg-white overflow-hidden flex flex-row items-center justify-center py-[0.5rem] px-[1.25rem] border-[1px] border-solid border-gray-300">
              <div className="relative text-[1rem] leading-[1.5rem] font-semibold font-text-md-semibold text-gray-700 text-left inline-block">
                {t("cancel")}
              </div>
            </div>
          </button>
        </div>
      </div>
      {loading && (
        <div
          role="status"
          className="absolute -translate-x-1/2 -translate-y-1/2 top-2/4 left-1/2"
        >
          <svg
            aria-hidden="true"
            className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-primary-600"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
        </div>
      )}
    </div>
  );
};

export default LanguagePortalChoosePrimary;
