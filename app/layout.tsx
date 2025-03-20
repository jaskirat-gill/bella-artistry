import './globals.css';
import Footer from './components/Layout/Footer';
import Header from './components/Layout/Header';

/**
 * Using force dynamic so changes in business assets (e.g. services) are immediately reflected.
 * If you prefer having it reflected only after redeploy (not recommended) please remove it
 * **/
export const revalidate = 0;

export default function RootLayout(layoutProps: any) {
  const { children } = layoutProps;
  // Removed wixSession and Wix-specific logic
  const isAuthenticated = true; // Dummy authentication check

  return (
    <html lang="en">
      <head>
        <title>Bella Artistry</title>
        <meta
          name="description"
          content="Bella Artistry"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="https://dummyimage.com/favicon.ico" />
      </head>
      {isAuthenticated ? (
        <body className="parallax-background">
          <Header />
          <main className="bg-transparent min-h-[600px]">{children}</main>
          <Footer />
        </body>
      ) : (
        <body>
          <main className="max-w-full-content mx-auto bg-white pt-32">
            <h1>
              Page not available. Please check your environment configuration.
            </h1>
          </main>
        </body>
      )}
    </html>
  );
}
