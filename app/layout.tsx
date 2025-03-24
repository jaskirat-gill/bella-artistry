import "./globals.css";
import Footer from "../components/Layout/Footer";
import Header from "../components/Layout/Header";
import { ReactNode } from "react";
import { MasterConfig } from "@/lib/types";
import ConfigContextProvider from "@/components/ConfigContextProvider";
import { getMasterConfig } from "@/api/controller";

/**
 * Using force dynamic so changes in business assets (e.g. services) are immediately reflected.
 * If you prefer having it reflected only after redeploy (not recommended) please remove it
 * **/
export const revalidate = 0;

interface LayoutProps {
  children: ReactNode;
}

export default async function RootLayout({ children }: LayoutProps) {
  const masterConfig: MasterConfig[] = await getMasterConfig();

  return (
    <html lang="en">
      <head>
        <title>Bella Artistry</title>
        <meta name="description" content="Bella Artistry" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="parallax-background">
        <ConfigContextProvider config={masterConfig[0]}>
          <>
            <Header />
            <main className="bg-transparent min-h-[600px]">{children}</main>
            <Footer />
          </>
        </ConfigContextProvider>
      </body>
    </html>
  );
}
