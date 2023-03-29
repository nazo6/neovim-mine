import "./globals.css";
import { Analytics } from "./Analytics";

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
        <Analytics />
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
