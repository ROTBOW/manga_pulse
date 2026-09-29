'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { CONTENTPREFS, LANGPREFS } from '@/utils/enums';

const defaultContentPrefs = {
    safe: true,
    suggestive: true,
    erotica: false,
    pornographic: false
};

const PreferencesContext = createContext(null);

const PreferencesProvider = ({children}) => {
    const [contentPrefs, setContentPrefs] = useState(defaultContentPrefs);
    const [langs, setLangs] = useState([]);
    const [preferencesReady, setPreferencesReady] = useState(false);

    useEffect(() => {
        try {
            const storedContent = JSON.parse(localStorage.getItem(CONTENTPREFS));

            if (storedContent && typeof storedContent === 'object') {
                const savedPrefs = {...defaultContentPrefs};

                for (const rating of Object.keys(defaultContentPrefs)) {
                    if (typeof storedContent[rating] === 'boolean') {
                        savedPrefs[rating] = storedContent[rating];
                    }
                }

                setContentPrefs(savedPrefs);
            }
        } catch {
            // Keep defaults if saved preferences cannot be read.
        }

        try {
            const storedLangs = JSON.parse(localStorage.getItem(LANGPREFS));

            if (Array.isArray(storedLangs)) {
                setLangs(storedLangs.filter(lang => typeof lang === 'string'));
            }
        } catch {
            // Language preferences can recover independently of content preferences.
        }

        setPreferencesReady(true);
    }, []);

    useEffect(() => {
        if (!preferencesReady) return;

        try {
            localStorage.setItem(CONTENTPREFS, JSON.stringify(contentPrefs));
            localStorage.setItem(LANGPREFS, JSON.stringify(langs));
        } catch {
            // Live preferences still work when browser storage is unavailable.
        }
    }, [contentPrefs, langs, preferencesReady]);

    return (
        <PreferencesContext.Provider value={{
            contentPrefs,
            setContentPrefs,
            langs,
            setLangs,
            preferencesReady
        }}>
            {children}
        </PreferencesContext.Provider>
    );
};

export const usePreferences = () => useContext(PreferencesContext);

export default PreferencesProvider;
