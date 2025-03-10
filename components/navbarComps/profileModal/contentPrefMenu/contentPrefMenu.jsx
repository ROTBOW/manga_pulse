'use client'
import { CONTENTPREFS } from "@/utils/enums";
import { useEffect, useState, useRef } from "react";

const ContentPrefMenu = ({resetView}) => {
    // get prefs from localstorage for our default, if nothing is saved we use the default
    const prefs = localStorage.getItem(CONTENTPREFS);
    const [contentPrefs, setContentPrefs] = useState(
        (prefs !== null) ?
        JSON.parse(prefs) :
        {
            safe: true,
            suggestive: true,
            erotica: false,
            pornographic: false
        }
    );
    
    const contentPrefsRef = useRef(contentPrefs);

    useEffect(() => {
        // Update the ref whenever contentPrefs changes
        contentPrefsRef.current = contentPrefs;
    }, [contentPrefs]);

    useEffect(() => { 
        return () => {
            // On dismount (whenever the menu is closed) save the settings
            localStorage.setItem(CONTENTPREFS, JSON.stringify(contentPrefsRef.current))
        }
    }, []);

    return (
        <>
        <div className="flex flex-col font-robotoCondensed text-md">
            <button 
                onClick={() => {resetView(-1)}}
                className="p-1 bg-gray-700 rounded mb-2"
            >
                Back
            </button>

            <label>
                <input
                    type='checkbox'
                    onChange={(e) => setContentPrefs((prefs) => ({
                        ...prefs,
                        safe: e.target.checked,
                    }))}
                    checked={contentPrefs.safe}
                    className="mr-1"
                />
                Safe
            </label>
            <label>
                <input
                    type='checkbox'
                    onChange={(e) => setContentPrefs((prefs) => ({
                        ...prefs,
                        suggestive: e.target.checked,
                    }))}
                    checked={contentPrefs.suggestive}
                    className="mr-1"
                />
                Suggestive
            </label>
            <label>
                <input
                    type='checkbox'
                    onChange={(e) => setContentPrefs((prefs) => ({
                        ...prefs,
                        erotica: e.target.checked,
                    }))}
                    checked={contentPrefs.erotica}
                    className="mr-1"
                />
                Erotica
            </label>
            <label>
                <input
                    type='checkbox'
                    onChange={(e) => setContentPrefs((prefs) => ({
                        ...prefs,
                        pornographic: e.target.checked,
                    }))}
                    checked={contentPrefs.pornographic}
                    className="mr-1"
                />
                Pornographic
            </label>

        </div>
        <p className="text-xs italic text-white text-opacity-45 font-robotoCondensed">Give it a few seconds then refresh to see changes</p>
        </>
    )
};

export default ContentPrefMenu;