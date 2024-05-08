"use client";
import { Fragment, ReactNode, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Locale, locale } from "../../../../functions/shared/src";
import { AbstractIntlMessages, NextIntlClientProvider } from "next-intl";
import LanguagePortalChoosePrimary from "./languagePortalChoosePrimary";
import LanguagePortalChooseContent from "./languagePortalChooseContent";
import { LanguagePortalContext } from "./languagePortalContext";
import { useLanguages } from "../../appState";

const LanguagePortal = ({
  children,
  messages,
}: {
  children: ReactNode;
  messages: string;
}) => {
  const [open, setOpen] = useState(false);
  const {
    languages,
    refreshLanguages,
    useSetPrimaryLanguage,
    useSetContentLanguages,
  } = useLanguages();
  const setPrimaryLanguage = useSetPrimaryLanguage();
  const setContentLanguages = useSetContentLanguages();
  const startingLocale = languages.primary;
  const [chosenPrimaryLocale, setChosenPrimaryLocale] =
    useState<Locale>(startingLocale);
  const [primaryRequestsRefresh, setPrimaryRequestsRefresh] = useState(false);
  const [chosenLocales, setChosenLocales] = useState<Locale[]>(
    languages.content
  );
  const [contentRequestsRefreshAndSet, setContentRequestsRefreshAndSet] =
    useState(false);
  const possibleLocales = Object.keys(locale.Enum) as Locale[];
  const localeMessages = JSON.parse(messages) as Record<
    Locale,
    AbstractIntlMessages
  >;
  const [choosing, setChoosing] = useState<"primary" | "content">("primary");
  const [primaryLeft, setPrimaryLeft] = useState(false);
  const [contentLeft, setContentLeft] = useState(false);
  const [loading, setLoading] = useState(false);
  const [requestedBack, setRequestedBack] = useState(false);
  const [modalLeft, setModalLeft] = useState(false);
  const requestBack = () => {
    setRequestedBack(true);
  };
  const onClose = async (internalRefreshAndSetContent?: boolean) => {
    console.log("On CLose Called");
    console.log({
      loading,
      primaryRequestsRefresh,
      contentRequestsRefreshAndSet,
      internalRefreshAndSetContent,
    });
    if (loading) return;
    setLoading(true);
    if (
      !primaryRequestsRefresh &&
      !contentRequestsRefreshAndSet &&
      !internalRefreshAndSetContent
    ) {
      setOpen(false);
      return;
    }
    if (contentRequestsRefreshAndSet || internalRefreshAndSetContent) {
      await setContentLanguages(chosenLocales);
    }
    refreshLanguages();
    setOpen(false);
  };
  const onPrimarySave = async () => {
    setLoading(true);
    if (chosenPrimaryLocale !== startingLocale) {
      setPrimaryRequestsRefresh(true);
    } else {
      setPrimaryRequestsRefresh(false);
    }
    await setPrimaryLanguage(chosenPrimaryLocale);
    if (
      languages.content.length > 1 ||
      languages.content[0] !== chosenPrimaryLocale
    ) {
      setChosenLocales([chosenPrimaryLocale]);
      setContentRequestsRefreshAndSet(true);
    }
    setChoosing("content");
    setLoading(false);
  };
  const onContentSaveAndClose = async () => {
    if (!contentRequestsRefreshAndSet) {
      if (
        languages.content.length != chosenLocales.length ||
        !languages.content.every((locale, i) => chosenLocales[i] == locale)
      ) {
        setContentRequestsRefreshAndSet(true);
      }
    }
    onClose(true);
  };
  useEffect(() => {
    if (!open && modalLeft) {
      setChoosing("primary");
      setPrimaryLeft(false);
      setContentLeft(false);
      setRequestedBack(false);
      setModalLeft(false);
      setLoading(false);
      setPrimaryRequestsRefresh(false);
      setContentRequestsRefreshAndSet(false);
    }
  }, [open, modalLeft]);
  useEffect(() => {
    if (requestedBack) {
      setChoosing("primary");
      setPrimaryLeft(false);
    }
  }, [requestedBack]);
  return (
    <Fragment>
      <Transition.Root show={open} as={Fragment}>
        <Dialog className="language-portal relative z-10" onClose={onClose}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            afterLeave={() => {
              setModalLeft(true);
            }}
          >
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 w-screen overflow-y-auto">
            <div className="flex min-h-full justify-center p-4 text-center items-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:scale-95"
              >
                <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:w-full sm:max-w-lg">
                  <NextIntlClientProvider
                    messages={localeMessages[chosenPrimaryLocale]}
                    locale={chosenPrimaryLocale}
                  >
                    <LanguagePortalContext.Provider
                      value={{
                        chosenPrimaryLocale,
                        setChosenPrimaryLocale,
                        chosenLocales,
                        setChosenLocales,
                        possibleLocales,
                        loading,
                        requestBack,
                        onClose,
                        onPrimarySave,
                        onContentSaveAndClose,
                      }}
                    >
                      <Transition
                        show={
                          requestedBack
                            ? contentLeft && choosing == "primary"
                            : choosing == "primary"
                        }
                        {...(requestedBack
                          ? {
                              enter: "ease-out duration-500",
                              enterFrom: "opacity-0 translate-y-4 sm:scale-95",
                              enterTo: "opacity-100 translate-y-0 sm:scale-100",
                              afterEnter: () => setRequestedBack(false),
                            }
                          : {})}
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                        leaveTo="opacity-0 translate-y-4 sm:scale-95"
                        afterLeave={() => setPrimaryLeft(true)}
                      >
                        <LanguagePortalChoosePrimary />
                      </Transition>
                      <Transition
                        show={choosing == "content" && primaryLeft}
                        enter="ease-out duration-500"
                        enterFrom="opacity-0 translate-y-4 sm:scale-95"
                        enterTo="opacity-100 translate-y-0 sm:scale-100"
                        afterEnter={() => setContentLeft(false)}
                        {...(requestedBack
                          ? {
                              leave: "ease-in duration-200",
                              leaveFrom:
                                "opacity-100 translate-y-0 sm:scale-100",
                              leaveTo: "opacity-0 translate-y-4 sm:scale-95",
                              afterLeave: () => setContentLeft(true),
                            }
                          : {})}
                      >
                        <LanguagePortalChooseContent />
                      </Transition>
                    </LanguagePortalContext.Provider>
                  </NextIntlClientProvider>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
      <button
        className="cursor-pointer [border:none] p-0 bg-[transparent] h-[1.875rem] flex flex-row items-center justify-start gap-[0.188rem]"
        onClick={() => {
          setOpen(true);
        }}
      >
        {children}
      </button>
    </Fragment>
  );
};

export default LanguagePortal;
