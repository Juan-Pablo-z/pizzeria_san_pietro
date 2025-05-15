import { Providers } from "@/providers";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import '@/css/general/main.css'

const inter = Poppins({
  style: "normal",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Restaurante Yuli",
};

interface Props {
  children: React.ReactNode;
  params: { locale: string };
}

export default async function RootLayout({
  children,
  params: { locale },
}: Readonly<Props>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`} suppressHydrationWarning={true}>
        <Providers>
          <ToastContainer stacked />
          {children}
        </Providers>
      </body>
    </html>
  );
}
