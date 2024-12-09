"use client";

import { ChangeEvent } from "react";
import { Locale } from "@/config";
import { useChangeLocale, useI18n } from "@/config/i18n/client";
import Image from "next/image";
import { MenuItem, Select, SelectChangeEvent } from "@mui/material";

export const LanguageSelect = ({ locale }: { locale: Locale }) => {
  const changeLocale = useChangeLocale();
  const t = useI18n();

  const onLanguageChange = (e: SelectChangeEvent<"vn" | "en">) => {
    if (e.target.value !== locale) {
      // @ts-ignore
      changeLocale(e.target.value as Locale);
    }
  };

  return (
    <div className="p-2 flex gap-2 items-center cursor-pointer">
      <div className="menu aspect-square flex items-center">
        <Image src="/icons/global.svg" alt="language" width={19} height={19} />
      </div>
      <Select
        value={locale}
        title="language"
        id="language"
        name="language"
        className="cursor-pointer focus:outline-none text-primary"
        sx={{
          ".MuiSelect-select": { display: "flex", gap: 1 },
          fieldset: { border: "0 solid !important" },
        }}
        MenuProps={{
          disableScrollLock: true,
        }}
        onChange={onLanguageChange}
      >
        <MenuItem value={"vn"} sx={{ display: "flex", gap: 1 }}>
          <Image
            src={"/images/language/vn_icon.svg"}
            width={20}
            height={20}
            alt="vn"
          />
          <div>{t("language.vietnamese")}</div>
        </MenuItem>
        <MenuItem value={"en"} sx={{ display: "flex", gap: 1 }}>
          <Image
            src={"/images/language/en_icon.svg"}
            width={20}
            height={20}
            alt="vn"
          />
          <div>{t("language.english")}</div>
        </MenuItem>
      </Select>
    </div>
  );
};
