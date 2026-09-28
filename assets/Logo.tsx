import Link from "next/link";
import Image from "next/image";

export const Logo = () => {
  return (
    <Link
      href="/"
      aria-label="KindPaws home"
      className="flex gap-2 items-center font-[Cherry_Bomb_One]"
    >
      <Image
        src="/paws-logo.png"
        alt=""
        width={40}
        height={40}
        className="sm:w-10 w-5 pointer-events-none"
      />
      <h3 className="sm:text-2xl text-white">KindPaws</h3>
    </Link>
  );
};

export const LogoBlack = () => {
  return (
    <Link
      href="/"
      aria-label="KindPaws home"
      className="flex gap-2 items-center font-[Cherry_Bomb_One]"
    >
      <Image
        src="/paws-logo-black.png"
        alt=""
        width={40}
        height={40}
        className="sm:w-10 w-5 pointer-events-none"
      />
      <h3 className="sm:text-2xl text-black">KindPaws</h3>
    </Link>
  );
};
