import { GetStaticPropsContext, GetStaticPropsResult } from "next";
type StaticProps = {
  [x: string | number | symbol]: unknown;
};

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
