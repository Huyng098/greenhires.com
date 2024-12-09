"use client";

import { useAuthStore } from "@/stores/auth";
import { Check } from "@phosphor-icons/react";
import classNames from "classnames";

import Image from "next/image";
import { toast } from "sonner";

const themes = [
  {
    id: 0,
    value: "#f0f9ff",
  },
  {
    id: 1,
    value: "#0000002B",
  },
  {
    id: 2,
    value: "#A5ECCE6B",
  },
  {
    id: 3,
    value: "#FFFFFF",
  },
  {
    id: 4,
    value: "#2F566B",
  },
];

export default function Appearance() {
  const { user, setUser } = useAuthStore()();

  return (
    <div className="flex flex-col gap-5 w-10/12 rounded-lg shadow px-4 py-16 border border-solid border-hoduc-bg-gray_darker ">
      <p className="font-bold">Appearance</p>
      <p className="text-gray-400">Custom your editing place</p>
      <div className="grid grid-cols-3 gap-5">
        {themes.map((item) => (
          <div
            key={item.id}
            className={classNames(
              "relative aspect-[1/1.4142] items-center justify-center"
            )}
            style={{
              width: "calc(0.1 * 834mm)",
              height: "calc(0.1 * 339mm)",
            }}
          >
            {user?.theme === item.value && (
              <div className="absolute inset-1/2 z-20">
                <Check
                  size={40}
                  color="green"
                  weight="bold"
                  className="-translate-x-1/2 -translate-y-1/2"
                />
              </div>
            )}
            <Image
              alt={`Template ${item.id}`}
              src={`/images/dashboard/appearance${item.id}.svg`}
              fill
              objectFit="contain"
              className="cursor-pointer transition ease-in-out delay-550 duration-300 hover:scale-105"
              onClick={() => {
                if (user) {
                  setUser({
                    ...user,
                    theme: item.value as
                      | "#f0f9ff"
                      | "#0000002B"
                      | "#A5ECCE6B"
                      | "#FFFFFF"
                      | "#2F566B",
                  });
                  toast.success("Change theme successfully");
                }
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
