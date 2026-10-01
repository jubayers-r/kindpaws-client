import { NavItems } from "@/data/NavItems";
import Link from "next/link";

export const QuickLinks = () => {
  return (
    <div className="flex flex-col gap-5 text-center md:text-left lg:items-center lg:text-center">
      <h3 className="font-[Paytone_One] text-xl">Quicklinks</h3>
      <ul className="flex flex-col gap-2">
        {NavItems.map((item, i) => (
          <li key={i}>
            <span
              aria-hidden="true"
              className="h-1.5 w-1.5 rounded-full bg-orange-400 lg:mx-4 hidden md:inline-block lg:hidden mr-3"
            />
            <Link href={item.href} className="hover:text-amber-500">
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default QuickLinks;
