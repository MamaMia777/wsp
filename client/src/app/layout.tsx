import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import Provider from "./utils/Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "WSP",
  description: "Created by WSP",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} h-screen`}>
        <Provider>
          <main className=" text-primary font-medium text-small">
            <Header />
            <section>{children}</section>
          </main>
        </Provider>
      </body>
    </html>
  );
}
