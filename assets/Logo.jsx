import paw from "/paws-logo.png";
import pawBlack from "/paws-logo-black.png";
import { Link } from "react-router";

export const Logo = () => {
  return (
    <Link
      to="/"
      aria-label="KindPaws home"
      className="flex gap-2 items-center font-[Cherry_Bomb_One]"
    >
      <img src={paw} alt="" className="sm:w-10 w-5 pointer-events-none" />
      <h3 className="sm:text-2xl text-white ">KindPaws</h3>
    </Link>
  );
};
export const LogoBlack = () => {
  return (
    <Link
      to="/"
      aria-label="KindPaws home"
      className="flex gap-2 items-center font-[Cherry_Bomb_One]"
    >
      <img src={pawBlack} alt="" className="sm:w-10 w-5 pointer-events-none" />
      <h3 className="sm:text-2xl text-black ">KindPaws</h3>
    </Link>
  );
};
