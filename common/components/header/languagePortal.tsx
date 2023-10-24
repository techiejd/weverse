import { Language } from "@mui/icons-material";
import {
  CircularProgress,
  Dialog,
  IconButton,
  InputLabel,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { NextIntlClientProvider, useTranslations } from "next-intl";
import { useState, Fragment, Dispatch, SetStateAction } from "react";
import { locale, Locale } from "../../../functions/shared/src";
import { Locale2Messages, localeDisplayNames } from "../../utils/translations";
import Image from "next/image";
import { useAppState } from "../../context/appState";

const ChoosingPrimary = ({
  setChoosing,
}: {
  setChoosing: Dispatch<SetStateAction<"primary" | "content">>;
}) => {
  const t = useTranslations("header.languagePortal");
  return (
    <Fragment>
      <div className="flex flex-row items-center justify-center py-0 pr-0 pl-6 mix-blend-normal">
        <div className="rounded-10xl bg-white w-[163px] flex flex-row items-center justify-center py-2.5 px-4 box-border">
          <div className="relative leading-[20px] font-semibold">
            {t("primaryLanguage")}
          </div>
        </div>
      </div>
      <button
        className="cursor-pointer [border:none] p-0 bg-[transparent] flex flex-row items-center justify-center mix-blend-normal"
        onClick={() => setChoosing("content")}
      >
        <div className="rounded-10xl w-[143px] flex flex-row items-center justify-center py-2.5 px-4 box-border">
          <div className="relative text-sm leading-[20px] font-medium font-text-sm-regular text-primary-700 text-center">
            {t("polyglot?")}
          </div>
        </div>
      </button>
    </Fragment>
  );
};
const ChoosingContent = ({
  setChoosing,
}: {
  setChoosing: Dispatch<SetStateAction<"primary" | "content">>;
}) => {
  const t = useTranslations("header.languagePortal");
  return (
    <Fragment>
      <button
        className="cursor-pointer [border:none] p-0 bg-[transparent] flex flex-row items-center justify-center mix-blend-normal"
        onClick={() => setChoosing("primary")}
      >
        <div className="rounded-10xl w-[143px] flex flex-row items-center justify-center py-2.5 px-4 box-border">
          <div className="relative text-sm leading-[20px] font-medium font-text-sm-regular text-primary-700 text-center">
            {t("primaryLanguage")}
          </div>
        </div>
      </button>
      <div className="flex flex-row items-center justify-center mix-blend-normal ml-[-6px]">
        <div className="rounded-10xl bg-white flex flex-row items-center justify-center py-2.5 px-8">
          <div className="relative leading-[20px] font-semibold">
            {t("polyglot?")}
          </div>
        </div>
      </div>
    </Fragment>
  );
};

const AsRadio = ({
  selectedLocale,
  setSelectedLocale,
  l,
  setSelectedLocales,
}: {
  selectedLocale: Locale;
  setSelectedLocale: Dispatch<SetStateAction<Locale>>;
  setSelectedLocales: Dispatch<SetStateAction<Locale[]>>;
  l: Locale;
}) => (
  <input
    className="cursor-pointer flex flex-row items-center justify-center"
    type="radio"
    name="primaryLanguage"
    value={l}
    checked={selectedLocale === l}
    onChange={() => {
      const prevSelectedLocale = selectedLocale;
      setSelectedLocale(l);
      setSelectedLocales((prevSelectedLocales) => [
        ...prevSelectedLocales.filter((x) => x !== prevSelectedLocale),
        l,
      ]);
    }}
  />
);

const AsCheckbox = ({
  selectedLocales,
  setSelectedLocales,
  l,
  defaultLocale,
}: {
  selectedLocales: Locale[];
  setSelectedLocales: Dispatch<SetStateAction<Locale[]>>;
  l: Locale;
  defaultLocale: Locale;
}) => (
  <input
    className="flex flex-row items-center justify-center"
    type="checkbox"
    disabled={l === defaultLocale}
    checked={selectedLocales.includes(l)}
    onChange={(e) => {
      if (e.target.checked) {
        setSelectedLocales([...selectedLocales, l]);
      } else {
        setSelectedLocales(selectedLocales.filter((x) => x !== l));
      }
    }}
  />
);

const AppLanguageModalContent = ({
  onClose,
  selectedLocale,
  setSelectedLocale,
}: {
  onClose: () => void;
  selectedLocale: Locale;
  setSelectedLocale: Dispatch<SetStateAction<Locale>>;
}) => {
  const [loading, setLoading] = useState(false);
  const appState = useAppState();
  const t = useTranslations("header.languagePortal");
  const inputTranslations = useTranslations("input");
  const [choosing, setChoosing] = useState<"primary" | "content">("primary");
  const possibleLocales = Object.keys(locale.Enum);
  const [requestedContentLocales, setRequestedContentLocales] = useState(
    appState.languages.content
  );
  const setLanguages = appState.useSetLanguages();
  return (
    <div className="language-selection-modal w-full rounded-xl bg-white shadow-[0px_20px_24px_-4px_rgba(16,_24,_40,_0.08),_0px_8px_8px_-4px_rgba(16,_24,_40,_0.03)] h-[692px] overflow-hidden shrink-0 flex flex-col items-start justify-start px-4 pb-4 box-border gap-[24px] max-w-[680px]">
      <div className="self-stretch flex flex-col items-end justify-start gap-[16px] text-gray-900">
        <button
          className="cursor-pointer p-0 bg-primary-100 relative rounded-9xl box-border w-14 h-14 border-[8px] border-solid border-primary-50"
          onClick={onClose}
        >
          <div className="absolute top-[calc(50%_-_16px)] left-[calc(50%_-_16px)] w-6 h-6 overflow-hidden">
            <Image fill alt="" src="/close-icon.svg" />
          </div>
        </button>
        <div className="self-stretch flex flex-col items-start justify-start gap-[8px]">
          <div className="self-stretch relative text-lg leading-[28px] font-semibold">
            {t("chooseYourLanguage")}
          </div>
          <div className="self-stretch flex flex-col items-center justify-center p-2.5 text-center text-primary-700">
            <div className="rounded-12xl bg-primary-50 w-[297px] flex flex-row items-center justify-center py-1 pr-2.5 pl-1 box-border mix-blend-multiply">
              {choosing === "primary" ? (
                <ChoosingPrimary setChoosing={setChoosing} />
              ) : (
                <ChoosingContent setChoosing={setChoosing} />
              )}
            </div>
          </div>
          <div className="self-stretch relative leading-[20px] text-gray-500">
            {t(
              choosing == "primary"
                ? "explanationPrimaryLanguage"
                : "explanationContentLanguages"
            )}
          </div>
        </div>
      </div>
      {loading ? (
        <CircularProgress />
      ) : (
        possibleLocales.map((l) => (
          <div className="flex flex-row items-center justify-start" key={l}>
            <label className="flex flex-row items-center justify-start gap-[8px]">
              {choosing === "primary" ? (
                <AsRadio
                  l={l as Locale}
                  selectedLocale={selectedLocale}
                  setSelectedLocale={setSelectedLocale}
                  setSelectedLocales={setRequestedContentLocales}
                />
              ) : (
                <AsCheckbox
                  l={l as Locale}
                  selectedLocales={requestedContentLocales}
                  setSelectedLocales={setRequestedContentLocales}
                  defaultLocale={selectedLocale}
                />
              )}
              <div className="relative leading-[20px] font-medium">
                {localeDisplayNames[l as Locale]}
              </div>
            </label>
          </div>
        ))
      )}
      <div className="self-stretch flex flex-col items-start justify-start gap-[12px]">
        <div className="cursor-pointer [border:none] p-0 bg-[transparent] self-stretch rounded-lg flex flex-row items-start justify-start">
          <button
            disabled={loading}
            className="cursor-pointer py-2.5 px-[18px] bg-primary-600 flex-1 rounded-lg shadow-[0px_1px_2px_rgba(16,_24,_40,_0.05)] overflow-hidden flex flex-row items-center justify-center border-[1px] border-solid border-primary-600"
            onClick={() => {
              setLoading(true);
              setLanguages({
                primary: selectedLocale,
                content: requestedContentLocales,
              }).then(() => {
                setLoading(false);
                onClose();
              });
            }}
          >
            <div className="relative text-base leading-[24px] font-semibold font-text-sm-regular text-white text-left">
              {inputTranslations("save")}
            </div>
          </button>
        </div>
        <button
          className="cursor-pointer [border:none] p-0 bg-[transparent] self-stretch rounded-lg flex flex-row items-start justify-start"
          onClick={onClose}
        >
          <div className="flex-1 rounded-lg bg-white shadow-[0px_1px_2px_rgba(16,_24,_40,_0.05)] overflow-hidden flex flex-row items-center justify-center py-2.5 px-[18px] border-[1px] border-solid border-gray-300">
            <div className="relative text-base leading-[24px] font-semibold font-text-sm-regular text-gray-700 text-left">
              {inputTranslations("cancel")}
            </div>
          </div>
        </button>
      </div>
    </div>
  );
};

const AppLanguageModal = ({
  onClose,
  locale2Messages,
}: {
  onClose: () => void;
  locale2Messages: Locale2Messages;
}) => {
  const appState = useAppState();
  const [requestedLocale, setRequestedLocale] = useState<Locale>(
    appState.languages.primary
  );

  return (
    <NextIntlClientProvider messages={locale2Messages[requestedLocale]}>
      <AppLanguageModalContent
        onClose={onClose}
        selectedLocale={requestedLocale}
        setSelectedLocale={setRequestedLocale}
      />
    </NextIntlClientProvider>
  );
};

const LanguagePortal = ({
  locale2Messages,
}: {
  locale2Messages: Locale2Messages;
}) => {
  const appState = useAppState();
  const [languageModalOpen, setLanguageModalOpen] = useState(false);
  const onClose = () => setLanguageModalOpen(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));
  return (
    <Fragment>
      <Dialog
        open={languageModalOpen}
        onClose={onClose}
        fullScreen={fullScreen}
      >
        <AppLanguageModal onClose={onClose} locale2Messages={locale2Messages} />
      </Dialog>
      <InputLabel
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          mx: 1,
        }}
      >
        <IconButton
          onClick={() => {
            setLanguageModalOpen(true);
          }}
        >
          <Language color="primary" />
        </IconButton>
        <Typography color="primary">
          {appState.languages.primary.toUpperCase()}
        </Typography>
      </InputLabel>
    </Fragment>
  );
};

export default LanguagePortal;
