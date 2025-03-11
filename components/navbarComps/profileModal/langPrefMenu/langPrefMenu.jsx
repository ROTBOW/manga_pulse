'use client';

import langToCode from "@/utils/langToCode";
import Flag from 'react-world-flags';
import { useEffect, useState } from "react";
import langToCountry from "@/utils/langToCountry";
import { LANGPREFS } from "@/utils/enums";



const LangPrefMenu = ({resetView}) => {
    const prefs = localStorage.getItem(LANGPREFS);
    const [langs, setLangs] = useState(
        (prefs !== null) ?
        JSON.parse(prefs) :
        []
    );

    /**
     * Updates state slice "langs" by adding or removing a lang code on toggle.
     */
    const updateLangs = (code) => {
        setLangs(oldData => {
            if (oldData.includes(code)) {
                return oldData.filter(lang => lang !== code);
            }
            return [...oldData, code];
        });
    }

    useEffect(() => {
        localStorage.setItem(LANGPREFS, JSON.stringify(langs));
    }, [langs])

    const genOptions = () => {
        let options = [];

        for (const [k, v] of Object.entries(langToCode)) {
            options.push(
                <li key={v} className="flex items-center">
                    <input
                        type="checkbox"
                        onChange={() => updateLangs(v)}
                        checked={langs.includes(v)}
                        className="mr-1"
                    />
                    <div className="flex items-center">
                        <Flag code={langToCountry[v]} className="h-4 w-6 object-cover rounded mr-1"/>
                        {k}
                    </div>
                </li>
            )
        }
        return options
    }

    return (
        <>
        <div className="flex flex-col font-robotoCondensed text-md">
            <button 
                onClick={() => {resetView(-1)}}
                className="p-1 bg-gray-700 rounded mb-2"
            >
                Back
            </button>

            <ol className="overflow-x-auto px-2" style={{height: '70vh'}}>
                {genOptions()}
            </ol>

        </div>
        <p className="mt-0.5 text-xs italic text-white text-opacity-45 font-robotoCondensed">Give it a few seconds then refresh to see changes</p>
        </>
    )
};

export default LangPrefMenu;