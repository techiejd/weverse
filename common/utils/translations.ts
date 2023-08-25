import { GetStaticPropsContext, GetStaticPropsResult } from "next";
import { Locale } from "../../functions/shared/src";
type StaticProps = {
  [x: string | number | symbol]: unknown;
};

export type Messages = typeof import("../../messages/en.json");
export type Locale2Messages = { [key in Locale]: Messages };

export function WithTranslationsStaticProps(
  gsp?: (
    context: GetStaticPropsContext
  ) => Promise<GetStaticPropsResult<StaticProps>>
) {
  return async (context: GetStaticPropsContext) => {
    const { locale } = context;
    const othersPromise = gsp ? gsp(context) : Promise.resolve({ props: {} });
    const messagesPromise = import(`../../messages/${locale}.json`);
    const [others, messages] = await Promise.all([
      othersPromise,
      messagesPromise,
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
          },
          revalidate: others.revalidate,
        }
      : others;
  };
}

//TODO(techiejd): Create a context that allows for useLocale2Messages hook.
export const spreadTranslationsStaticProps = async (
  context: GetStaticPropsContext
) => {
  const [en, es] = await Promise.all([
    import("../../messages/en.json"),
    import("../../messages/es.json"),
  ]);
  return {
    props: {
      en: en.default,
      es: es.default,
    },
  };
};
