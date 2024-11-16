// src/app/_app.tsx
import type { AppProps } from 'next/app';
import '../styles/globals.css';
import Head from "next/head";

export default function MyApp({ Component, pageProps }: AppProps) {

  return (

    <>
      <title>dSupport Home</title>
      <Head>
        {/* Meta viewport para todas las páginas */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <Component {...pageProps} />
    </>

  );
}
