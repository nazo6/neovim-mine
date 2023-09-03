import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Provider } from "./provider";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Neovim mine",
  description: "Find neovim plugins",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta
          name="google-site-verification"
          content={process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION}
        />
      </head>
      <body className={inter.className + " [scrollbar-gutter:stable]"}>
        <Script
          id="gtag"
          src={"https://www.googletagmanager.com/gtag/js?id=" +
            process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}
        >
        </Script>
        <Script id="ga">
          {`
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}');
`}
        </Script>
        <Provider>{children}</Provider>
      </body>
    </html>
  );
}
