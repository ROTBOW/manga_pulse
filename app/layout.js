import localFont from "next/font/local";
import "./globals.css";

const sigmarOne = localFont({
  src: '../assets/fonts/SigmarOne-Regular.ttf',
  variable: '--font-sigmarone',
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
        className={`${sigmarOne.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
