import "../styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import Layout from "../common/components/layout";
import initAuth from "../common/context/firebase/initAuth";

initAuth();

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <meta
          name="facebook-domain-verification"
          content="ao4g23h8ibbwhvvvb9sh30lstl4pz2"
        />
        <title>OneWe</title>
      </Head>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  );
}

export default MyApp;
