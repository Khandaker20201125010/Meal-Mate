import "./globals.css";
import { Roboto } from "next/font/google";


const roboto = Roboto({ weight: ["400", "700"], subsets: ["latin"] });

export const metadata = {
  title: "MEALMATE | Home",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="light">
      <body className={`${roboto.className}`}>
        {children}
      </body>
    </html>
  );
}
