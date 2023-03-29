import Script from "next/script";

import "./globals.css";

export const metadata = {
  title: "Neovim Mine",
  description: "Excavate neovim plugins!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full bg-gray-900">
        <Script
          async
          strategy="lazyOnload"
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.GA_TRACKING_ID}`}
        />
        <Script id="ga" strategy="afterInteractive">
          {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${process.env.GA_TRACKING_ID}', {
            page_path: window.location.pathname,
          });
        `}
        </Script>
        <h1 className="text-center">
          <span className="font-extrabold text-transparent text-3xl bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500 ">
            Neovim Mine
          </span>
        </h1>

        {children}
      </body>
    </html>
  );
}
