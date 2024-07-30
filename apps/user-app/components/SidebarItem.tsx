"use client";

import { usePathname, useRouter } from "next/navigation";

export const SidebarItem = ({
  name,
  Icon,
  href,
}: {
  name: string;
  href: string;
  Icon: JSX.Element;
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const selected: boolean = pathname === href;

  return (
    <div
      className={`flex pl-14 cursor-pointer p-2 hover:bg-gray-300`}
      onClick={() => {
        router.push(href);
      }}
    >
      <div
        className={`flex gap-x-4 ${selected ? "text-[#6a51a6]" : "text-slate-600"} `}
      >
        <div className="flex flex-col justify-center items-center">{Icon}</div>
        <div
          className={`font-bold text-lg ${selected ? "text-[#6a51a6]" : "text-slate-600"}`}
        >
          {name}
        </div>
      </div>
    </div>
  );
};
