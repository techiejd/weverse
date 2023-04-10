import type { AppProps } from "next/app";
import Head from "next/head";
import Layout from "../common/components/layout";
import "../modules/auth/AuthCode.css";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>OneWe</title>
      </Head>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  );
}

export default MyApp;
