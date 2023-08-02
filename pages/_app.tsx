import type { AppProps } from "next/app";
import Head from "next/head";
import "../modules/auth/AuthCode.css";
import Script from "next/script";
import AppProvider from "../common/context/appState";
import { useLocale, NextIntlClientProvider } from "next-intl";

function WeVerse({ Component, pageProps }: AppProps) {
  // const locale = useLocale();
  return (
    <>
      <Head>
        <title>OneWe</title>
        <link rel="shortcut icon" href="/favicon.ico" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
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
      <NextIntlClientProvider messages={pageProps.messages}>
        <AppProvider>
          <Component {...pageProps} />
        </AppProvider>
      </NextIntlClientProvider>
    </>
  );
}

export default WeVerse;
