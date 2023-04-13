import type { AppProps } from "next/app";
import Head from "next/head";
import Layout from "../common/components/layout";
import "../modules/auth/AuthCode.css";
import Script from "next/script";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>OneWe</title>
      </Head>
      {/**<!-- Google tag (gtag.js) -->}*/}
      <Script
        async
        src="https://www.googletagmanager.com/gtag/js?id=G-NN708F3V4T"
      ></Script>
      <Script id="weverse-google-analytics" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-NN708F3V4T');`}
      </Script>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  );
}

export default MyApp;
