"use client";

import { Provider } from "jotai";

export function HomeProvider({ children }: { children: React.ReactNode }) {
  return (
    <Provider>
      <head>
        <script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}
        >
        </script>
        <script>
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
          
            gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}');
          `}
        </script>
      </head>
      {children}
    </Provider>
  );
}
