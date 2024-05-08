import { createContext, Dispatch, SetStateAction, useState } from "react";
import { Locale, locale } from "../../../../functions/shared/src";

// Define the type for your context value
const defaultContext: {
  chosenPrimaryLocale: Locale;
  setChosenPrimaryLocale: React.Dispatch<React.SetStateAction<Locale>>;
  chosenLocales: Locale[];
  setChosenLocales: React.Dispatch<React.SetStateAction<Locale[]>>;
  possibleLocales: Locale[];
  loading: boolean;
  requestBack: () => void;
  onClose: () => Promise<void>;
  onPrimarySave: () => Promise<void>;
  onContentSaveAndClose: () => Promise<void>;
} = {
  chosenPrimaryLocale: "en" as Locale,
  setChosenPrimaryLocale: () => null,
  possibleLocales: ["en"],
  chosenLocales: ["en"],
  setChosenLocales: () => null,
  loading: false,
  requestBack: () => null,
  onClose: () => Promise.resolve(),
  onPrimarySave: () => Promise.resolve(),
  onContentSaveAndClose: () => Promise.resolve(),
};

// Create the context
const LanguagePortalContext = createContext(defaultContext);

export { LanguagePortalContext };
