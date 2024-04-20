import {
  GetServerSidePropsContext,
  GetServerSidePropsResult,
  GetStaticPropsContext,
  GetStaticPropsResult,
} from "next";
import { Locale, locale } from "../../functions/shared/src";
import { useAppState } from "../context/appState";
export type BaseProps = {
  [x: string | number | symbol]: unknown;
};

export type Messages = typeof import("../../messages/en.json");
export type Locale2Messages = { [key in Locale]: Messages };

//TODO(techiejd): Create a context that allows for useLocale2Messages hook.
const spreadTranslationsStaticProps = async () => {
  const [en, es, fr] = await Promise.all([
    import("../../messages/en.json"),
    import("../../messages/es.json"),
    import("../../messages/fr.json"),
  ]);
  return {
    props: {
      en: en.default,
      es: es.default,
      fr: fr.default,
    },
  };
};

export const WithTranslationsServerSideProps = <T extends BaseProps>(
  gssp?: (
    context: GetServerSidePropsContext
  ) => Promise<GetServerSidePropsResult<T>>
) => {
  return async (context: GetServerSidePropsContext) => {
    const { locale } = context;
    const othersPromise = gssp ? gssp(context) : Promise.resolve({ props: {} });
    const messagesPromise = import(`../../messages/${locale}.json`);
    const spreadTranslationsStaticPropsPromise =
      spreadTranslationsStaticProps();
    const [others, messages, spreadTranslations] = await Promise.all([
      othersPromise,
      messagesPromise,
      spreadTranslationsStaticPropsPromise,
    ]);
    type PropsResult = {
      props: any;
    };
    const isProps = (o: typeof others): o is PropsResult => {
      return (others as PropsResult).props !== undefined;
    };
    return isProps(others)
      ? {
          props: {
            ...others.props,
            messages: messages.default,
            ...spreadTranslations.props,
          },
        }
      : others;
  };
};

export function WithTranslationsStaticProps(
  gsp?: (
    context: GetStaticPropsContext
  ) => Promise<GetStaticPropsResult<BaseProps>>
) {
  return async (context: GetStaticPropsContext) => {
    const { locale } = context.params as { locale: Locale };
    const othersPromise = gsp ? gsp(context) : Promise.resolve({ props: {} });
    const messagesPromise = import(`../../messages/${locale}.json`);
    const spreadTranslationsStaticPropsPromise =
      spreadTranslationsStaticProps();
    const [others, messages, spreadTranslations] = await Promise.all([
      othersPromise,
      messagesPromise,
      spreadTranslationsStaticPropsPromise,
    ]);
    type PropsResult = {
      props: any;
      revalidate?: number | boolean;
    };
    const isProps = (o: typeof others): o is PropsResult => {
      return (others as PropsResult).props !== undefined;
    };
    return isProps(others)
      ? {
          props: {
            ...others.props,
            messages: messages.default,
            ...spreadTranslations.props,
          },
          revalidate: others.revalidate,
        }
      : others;
  };
}

export const localeDisplayNames = {
  [locale.Values.en]: "English",
  [locale.Values.es]: "Español",
  [locale.Values.fr]: "Français",
  [locale.Values.de]: "Deutsch",
  [locale.Values.pl]: "Polski",
  [locale.Values.pt]: "Português",
};

export const useLocalizedPresentationInfo = <T extends object>(
  localizableObj: ({ locale?: Locale } & { [key in Locale]?: T }) | undefined
) => {
  const appState = useAppState();
  const userLocale = appState.languages.primary;
  if (!localizableObj) return undefined;
  const objInUserPrimaryLanguage = userLocale && localizableObj[userLocale];
  const objInUserAnyLanguage = (() => {
    // So here we are trying to find the first language that the user has which is also a key in localizableObj.
    const possibleLanguages = appState.languages.content;
    const firstLanguage = possibleLanguages.find((l) => l in localizableObj);
    return firstLanguage ? localizableObj[firstLanguage] : undefined;
  })();
  const objInItsOwnLanguage = localizableObj[localizableObj?.locale!]!;
  return (
    objInUserPrimaryLanguage || objInUserAnyLanguage || objInItsOwnLanguage
  );
};

export async function localesSpreadPaths() {
  return {
    paths: Object.values(locale.Values).map((locale) => ({
      params: { locale },
    })),
    fallback: false,
  };
}
