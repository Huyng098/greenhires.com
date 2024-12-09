"use client";
import { RichInput } from "@/components/controls/texteditor";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useI18n } from "@/config/i18n/client";
import { countries } from "@/constants/country";
import { useResumeCRUD } from "@/lib/hooks/useResume";
import { useResumeStore } from "@/stores/resume";
import { CaretDown } from "@phosphor-icons/react";
import { State } from "country-state-city";
import Image from "next/image";
import { useMemo, useState } from "react";
import { SectionResumeTitle } from "../Shared/section-title";

export const PersonalDetail = () => {
  const t = useI18n();
  const { updateBasics } = useResumeCRUD({
    component: "basics",
  });
  const [openDropdownCountry, setOpenDropdownCountry] = useState(false);
  const [openDropdownCity, setOpenDropdownCity] = useState(false);
  const basics = useResumeStore()((state) => state.resume.resume_data?.basics) || {};
  const setValue = useResumeStore()((state) => state.setResume);
  const country = useMemo(() => {
    return countries.find((country) => country.label === basics?.country);
  }, [basics]);
  const citiesOptions = useMemo(() => {
    if (basics?.country) {
      return State?.getStatesOfCountry(country?.code);
    }
    return [];
  }, [basics]);

  return (
    <div id="basics">
      <SectionResumeTitle
        identifier="basics"
        section={basics as any}
        setValue={setValue}
      />
      <div className="flex-1">
        <div className="flex flex-col gap-3">
          <div>
            <p className="mb-1">{t("personaldetail.headline")}</p>
            <RichInput
              content={basics?.headline}
              id="Headline"
              isHasAIOption={false}
              hideToolbar={true}
              onChange={(value) => updateBasics("basics.headline", value)}
            />
          </div>

          <div className="flex gap-2 text-sm flex-col sm:flex-row">
            <div className="w-full">
              <p className="mb-1">{t("personaldetail.firstname")}</p>
              <RichInput
                content={basics?.firstname}
                topic="Firstname"
                id="Firstname"
                isHasAIOption={false}
                hideToolbar={true}
                onChange={(value) => updateBasics("basics.firstname", value)}
              />
            </div>
            <div className="w-full">
              <p className="mb-1">{t("personaldetail.lastname")}</p>
              <RichInput
                content={basics?.lastname}
                topic="Lastname"
                id="Lastname"
                isHasAIOption={false}
                hideToolbar={true}
                onChange={(value) => updateBasics("basics.lastname", value)}
              />
            </div>
          </div>
          <div className="flex gap-2 text-sm flex-col sm:flex-row">
            <div className="w-full">
              <p className="mb-1">{t("personaldetail.email")}</p>
              <RichInput
                content={basics.email}
                topic="Email"
                id="Email"
                isHasAIOption={false}
                hideToolbar={true}
                onChange={(value) => updateBasics("basics.email", value)}
              />
            </div>
            <div className="w-full">
              <p className="mb-1">{t("personaldetail.phone")}</p>
              <RichInput
                content={basics.phone}
                topic="Phone"
                id="Phone"
                isHasAIOption={false}
                hideToolbar={true}
                onChange={(value) => updateBasics("basics.phone", value)}
              />
            </div>
          </div>
          <div className="flex gap-2 text-sm flex-col sm:flex-row">
            <div className="w-full relative">
              <p className="mb-1">{t("personaldetail.country")}</p>
              <RichInput
                content={basics.country}
                topic="Country"
                id="Country"
                isHasAIOption={false}
                hideToolbar={true}
                onChange={(value) => updateBasics("basics.country", value)}
              />

              <DropdownMenu
                open={openDropdownCountry}
                onOpenChange={setOpenDropdownCountry}
              >
                <DropdownMenuTrigger asChild>
                  <CaretDown
                    size={20}
                    className="cursor-pointer absolute right-[5px] top-1/2"
                    weight="light"
                  />
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-64 h-64 overflow-auto"
                  align="center"
                >
                  <Command>
                    <CommandInput placeholder="Search country..." />
                    <CommandList>
                      <CommandEmpty>No country found.</CommandEmpty>
                      {countries.map((country) => (
                        <CommandItem
                          onSelect={(value) => {
                            updateBasics("basics.country", value);
                            setOpenDropdownCountry(false);
                          }}
                          value={country.label}
                          key={country.label}
                        >
                          <div className="flex gap-2">
                            <Image
                              key={country.code}
                              className="mr-2 flex-shrink-0"
                              loading="lazy"
                              width="20"
                              height="20"
                              src={`https://flagcdn.com/w20/${country.code.toLowerCase()}.png`}
                              alt="code"
                            />
                            {country.label} ({country.code}) + {country.phone}
                          </div>
                        </CommandItem>
                      ))}
                    </CommandList>
                  </Command>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="w-full relative">
              <p className="mb-1">{t("personaldetail.city")}</p>
              <RichInput
                content={basics.city}
                topic="City"
                id="City"
                isHasAIOption={false}
                hideToolbar={true}
                onChange={(value) => updateBasics("basics.city", value)}
              />
              <DropdownMenu
                open={openDropdownCity}
                onOpenChange={setOpenDropdownCity}
              >
                <DropdownMenuTrigger asChild>
                  <CaretDown
                    size={20}
                    className="cursor-pointer absolute right-[5px] top-1/2"
                    weight="light"
                  />
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-64 h-64 overflow-auto"
                  align="center"
                >
                  <Command>
                    <CommandInput placeholder="Search country..." />
                    <CommandList>
                      <CommandEmpty>No city found.</CommandEmpty>
                      {citiesOptions.map((item) => (
                        <CommandItem
                          onSelect={(value) => {
                            updateBasics("basics.city", value);
                            setOpenDropdownCity(false);
                          }}
                          value={item.name}
                          key={item.isoCode}
                        >
                          {item.name}
                        </CommandItem>
                      ))}
                    </CommandList>
                  </Command>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <div className="w-full">
            <p className="mb-1">{t("personaldetail.address")}</p>
            <RichInput
              content={basics.address}
              topic="Address"
              id="Address"
              isHasAIOption={false}
              hideToolbar={true}
              onChange={(value) => updateBasics("basics.address", value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
