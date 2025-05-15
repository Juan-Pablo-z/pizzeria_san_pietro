import Image from "next/image";
import Link from "next/link";
import { LoginForm } from "./LoginForm";

export default function LoginPage() {
  return (
    <>
      <div
        className="flex w-full items-center overflow-hidden min-h-dvh h-dvh basis-full img-background"
        style={{
          backgroundImage: `url(/images/title-bg-sm.webp)`,
        }}
      >
        <div className="overflow-y-auto flex flex-wrap w-full h-dvh">
          <div
            className="lg:block hidden flex-1 overflow-hidden text-[40px] leading-[48px] text-default-600 lg:w-1/2"
          >
            <div className="flex justify-center items-center min-h-screen">
              <Link href="/" className="animate__fade-in-left animate__pulse">
                <Image
                  src="/images/yuli-logo.png"
                  alt="Logo Restaurante Yuli"
                  width={400}
                  height={400}
                  className="mb-10 h-64 w-64"
                />
              </Link>
            </div>
          </div>
          <div className="lg:w-1/2 w-full flex flex-col items-center justify-center">
            <LoginForm />
          </div>
          <div className="absolute bottom-0 lg:block hidden text-white py-5 px-5 text-xl w-full">
            Ingresa a la plataforma{" "}
            <span className="text-white font-bold ms-1">Restaurante Yuli</span>
          </div>
        </div>
      </div>
    </>
  );
}
