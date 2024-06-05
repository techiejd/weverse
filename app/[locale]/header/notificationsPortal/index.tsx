"use client";
import {
  Popover,
  PopoverButton,
  PopoverPanel,
  Transition,
} from "@headlessui/react";
import Image from "next/image";
import { ReactNode } from "react";

export default function NotificationsPortal({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <Popover>
      <PopoverButton className="bg-[transparent]">
        <div className="cursor-pointer [border:none] p-0 bg-[transparent] self-stretch w-[2.163rem] flex flex-row items-center justify-start">
          {children}
          <div className="flex-1 flex flex-row items-center justify-start pt-[1.25rem] px-[0rem] pb-[0rem] z-[1] ml-[-0.625rem]">
            <div className="flex-1 rounded-71xl bg-international-red flex flex-col items-center justify-center p-[0.438rem] border-[1px] border-solid border-white">
              <div className="w-[0.438rem] h-[0.563rem] relative text-[0.75rem] tracking-[-1px] leading-[1.875rem] font-medium font-bottom-nav-bar-label-text text-white text-center flex items-center justify-center shrink-0 min-w-[0.438rem]">
                3
              </div>
            </div>
          </div>
        </div>
      </PopoverButton>
      <Transition
        enter="transition ease-out duration-200"
        enterFrom="opacity-0 translate-y-1"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in duration-150"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-1"
      >
        <PopoverPanel
          anchor="bottom"
          className="divide-y divide-white/5 rounded-xl bg-white/5 text-sm/6 [--anchor-gap:var(--spacing-5)]"
        >
          <div className="p-3">
            <a
              className="block rounded-lg py-2 px-3 transition hover:bg-white/5"
              href="#"
            >
              <p className="font-semibold text-white">Insights</p>
              <p className="text-white/50">Measure actions your users take</p>
            </a>
            <a
              className="block rounded-lg py-2 px-3 transition hover:bg-white/5"
              href="#"
            >
              <p className="font-semibold text-white">Automations</p>
              <p className="text-white/50">Create your own targeted content</p>
            </a>
            <a
              className="block rounded-lg py-2 px-3 transition hover:bg-white/5"
              href="#"
            >
              <p className="font-semibold text-white">Reports</p>
              <p className="text-white/50">Keep track of your growth</p>
            </a>
          </div>
          <div className="p-3">
            <a
              className="block rounded-lg py-2 px-3 transition hover:bg-white/5"
              href="#"
            >
              <p className="font-semibold text-white">Documentation</p>
              <p className="text-white/50">
                Start integrating products and tools
              </p>
            </a>
          </div>
        </PopoverPanel>
      </Transition>
    </Popover>
  );
}
