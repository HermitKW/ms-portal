import React from "react";
import * as locales from '@mui/material/locale';

type SupportedLocales = keyof typeof locales;

type LocaleProvider = {
    locale: SupportedLocales,
    setLocale: (data: SupportedLocales) => void
};


export const LocaleContext = React.createContext<LocaleProvider>(null);