import localFont from "next/font/local";
import "./globals.css";

const sigmarOne = localFont({
  src: '../assets/fonts/SigmarOne-Regular.ttf',
  variable: '--font-sigmarone',
  display: 'swap'
});

const robotoCondensed = localFont({
  src: '../assets/fonts/RobotoCondensed.ttf',
  variable: '--font-robotocondensed',
  display: 'swap'
});

export const metadata = {
  title: "MangaPulse - bc reading is fun",
  description: "An alternate manga reader",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${sigmarOne.variable} ${robotoCondensed.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
