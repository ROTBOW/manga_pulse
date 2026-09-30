'use client';

import langToCode from "@/utils/langToCode";
import Flag from 'react-world-flags';
import { usePreferences } from "../../preferencesProvider";
import langToCountry from "@/utils/langToCountry";

const LangPrefMenu = ({resetView}) => {
    const {langs, setLangs} = usePreferences();

    const updateLangs = (code) => {
        setLangs(oldData => {
            if (oldData.includes(code)) {
                return oldData.filter(lang => lang !== code);
            }

            return [...oldData, code];
        });
    };

    const genOptions = () => {
        let options = [];

        for (const [language, code] of Object.entries(langToCode)) {
            options.push(
                <li key={code}>
                    <label className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-gray-700 bg-gray-700/25 px-3 py-2.5 transition-colors hover:bg-gray-700/60 has-checked:border-emerald-400/40 has-checked:bg-emerald-400/5">
                        <span className="flex items-center gap-3">
                            <Flag
                                code={langToCountry[code]}
                                alt=""
                                className="h-4 w-6 rounded-sm object-cover"
                            />
                            {language}
                        </span>
                        <input
                            type="checkbox"
                            onChange={() => updateLangs(code)}
                            checked={langs.includes(code)}
                            className="h-4 w-4 shrink-0 accent-emerald-400 focus-visible:outline-2 focus-visible:outline-emerald-400"
                        />
                    </label>
                </li>
            );
        }

        return options;
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between gap-3">
                <button
                    type="button"
                    onClick={resetView}
                    className="rounded-lg px-2 py-1 text-sm text-emerald-400 hover:bg-emerald-400/10 focus-visible:outline-2 focus-visible:outline-emerald-400"
                >
                    <span aria-hidden="true">← </span>All options
                </button>
                <span className="rounded-full bg-emerald-400/10 px-2.5 py-1 text-xs text-emerald-400">{langs.length} selected</span>
            </div>
            <p className="text-sm text-gray-400">Choose the chapter languages in your feed.</p>
            <ul aria-label="Chapter languages" className="max-h-[45dvh] space-y-2 overflow-y-auto overscroll-contain p-1">
                {genOptions()}
            </ul>
            <p className="border-t border-gray-700 pt-3 text-xs text-gray-400">Changes apply automatically.</p>
        </div>
    );
};

export default LangPrefMenu;
