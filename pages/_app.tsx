import "../styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";

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
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
