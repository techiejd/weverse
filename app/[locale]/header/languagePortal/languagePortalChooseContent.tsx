import { useTranslations } from "next-intl";
import { Dispatch, SetStateAction, useContext, useState } from "react";
import { localeDisplayNames } from "../../../../common/utils/translations";
import Image from "next/image";
import { Locale } from "../../../../functions/shared/src";
import { LanguagePortalContext } from "./languagePortalContext";
import { LoadingCard } from "./loading";

const ChooseLanguageButton = ({
  possibleLocale,
  chosenLocales,
  setChosenLocales,
}: {
  possibleLocale: Locale;
  chosenLocales: Locale[];
  setChosenLocales: Dispatch<SetStateAction<Locale[]>>;
}) => {
  const t = useTranslations("languagePortal");
  const chosenIndex = chosenLocales.indexOf(possibleLocale);
  const chosen = chosenIndex != -1;
  const isPrimary = chosenIndex == 0;
  return (
    <button
      className={`cursor-pointer [border:none] p-0 bg-[transparent] flex flex-row items-start justify-start gap-[0.5rem] w-full ${
        isPrimary ? "opacity-60 pointer-events-none" : ""
      }`}
      key={possibleLocale}
      disabled={isPrimary}
      onClick={() => {
        chosen
          ? setChosenLocales(
              chosenLocales.filter((locale) => locale !== possibleLocale)
            )
          : setChosenLocales([...chosenLocales, possibleLocale]);
      }}
    >
      <div className="flex flex-col items-start justify-start pt-[0.125rem] px-[0rem] pb-[0rem]">
        <input
          className={`${
            chosen
              ? "accent-primary-50 m-0 h-[1rem] w-[1rem]"
              : "m-0 h-[1.125rem] w-[1rem]"
          }`}
          checked={chosen}
          type="checkbox"
          readOnly
        />
      </div>
      <div className="relative text-[0.875rem] leading-[1.25rem] font-medium font-text-md-semibold text-gray-700 text-left inline-block">
        <span>{localeDisplayNames[possibleLocale as Locale]}</span>
        {isPrimary && (
          <span className="text-inactive-grey"> ({t("primaryLanguage")})</span>
        )}
        {chosen && !isPrimary && (
          <span className="text-inactive-grey">
            {" "}
            ({t("ordinalLanguage", { index: chosenIndex + 1 })})
          </span>
        )}
      </div>
    </button>
  );
};

const LanguagePortalChooseContent = () => {
  const {
    chosenLocales,
    setChosenLocales,
    possibleLocales,
    requestBack,
    onClose,
    onContentSaveAndClose,
    loading,
  } = useContext(LanguagePortalContext);
  const t = useTranslations("languagePortal");
  return (
    <div className="flex-1 rounded-xl bg-white overflow-hidden pt-[1.25rem] px-[1rem] pb-[1rem] box-border gap-[1rem] max-w-[42.5rem]">
      <div
        className={`flex flex-col items-end justify-start ${
          loading ? "opacity-20 pointer-events-none" : ""
        }`}
      >
        <div className="self-stretch flex flex-row items-start justify-between">
          <button
            className="cursor-pointer [border:none] p-0 bg-[transparent] w-[3rem] relative rounded-9xl h-[3rem]"
            onClick={requestBack}
          >
            <div className="absolute top-[0.75rem] left-[-0.062rem] w-[1.5rem] h-[1.5rem] overflow-hidden">
              <Image alt="" fill src="/userplus.svg" />
            </div>
          </button>
          <button
            className="cursor-pointer p-0 bg-primary-100 w-[3.5rem] h-[3.5rem] relative rounded-9xl box-border border-[8px] border-solid border-primary-50"
            onClick={onClose}
          >
            <div className="absolute top-[calc(50%_-_12px)] left-[calc(50%_-_12px)] w-[1.5rem] h-[1.5rem] overflow-hidden">
              <Image alt="" fill src="/close-icon.svg" />
            </div>
          </button>
        </div>
        <div className="self-stretch flex flex-col items-start justify-start pt-[0rem] px-[0rem] pb-[0.5rem] gap-[1.5rem] text-left text-[1.125rem] text-gray-900 font-text-md-semibold">
          <div className="self-stretch flex flex-col items-start justify-start gap-[0.5rem]">
            <div className="self-stretch relative leading-[1.75rem] font-semibold">
              {t("doYouSpeakMultipleLanguages")}
            </div>
            <div className="self-stretch relative text-[0.875rem] leading-[1.25rem] text-gray-500">
              {t("explanationContentLanguages")}
            </div>
          </div>
          {possibleLocales.map((possibleLocale, i) => (
            <ChooseLanguageButton
              possibleLocale={possibleLocale}
              chosenLocales={chosenLocales}
              setChosenLocales={setChosenLocales}
              key={possibleLocale}
            />
          ))}
        </div>
        <div className="self-stretch flex flex-col items-start justify-start gap-[0.75rem]">
          <button
            className="cursor-pointer [border:none] p-0 bg-[transparent] self-stretch rounded-lg flex flex-row items-start justify-start"
            onClick={onContentSaveAndClose}
          >
            <div className="flex-1 shadow-[0px_1px_2px_rgba(16,_24,_40,_0.05)] rounded-lg bg-primary-600 overflow-hidden flex flex-row items-center justify-center py-[0.5rem] px-[1.25rem] border-[1px] border-solid border-primary-600">
              <div className="relative text-[1rem] leading-[1.5rem] font-semibold font-text-md-semibold text-white text-left inline-block">
                {t("saveAndClose")}
              </div>
            </div>
          </button>
          <button
            className="cursor-pointer [border:none] p-0 bg-[transparent] self-stretch rounded-lg flex flex-row items-start justify-start"
            onClick={onClose}
          >
            <div className="flex-1 shadow-[0px_1px_2px_rgba(16,_24,_40,_0.05)] rounded-lg bg-white overflow-hidden flex flex-row items-center justify-center py-[0.5rem] px-[1.25rem] border-[1px] border-solid border-gray-300">
              <div className="relative text-[1rem] leading-[1.5rem] font-semibold font-text-md-semibold text-gray-700 text-left inline-block">
                {t("close")}
              </div>
            </div>
          </button>
        </div>
      </div>
      {loading && <LoadingCard />}
    </div>
  );
};

export default LanguagePortalChooseContent;
