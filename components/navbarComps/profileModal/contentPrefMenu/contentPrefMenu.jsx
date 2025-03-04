'use client'
import { useEffect, useState } from "react";

const ContentPrefMenu = ({resetView}) => {
    const [contentPrefs, setContentPrefs] = useState({
        safe: true,
        suggestive: true,
        erotica: false,
        pornographic: false
    })

    useEffect(() => { 
        // check if prefs were saved in localstorage, if so update the state to match it
        if (localStorage.getItem('contentPrefs') === null) {
            // no saved pref, so we default
            localStorage.setItem(
                'contentPrefs',
                JSON.stringify(contentPrefs)
            )
        } else {
            // if there is a saved pref, we update the local state to reflect it
            setContentPrefs(JSON.parse(localStorage.getItem('contentPrefs')))
        }
    }, [])

    useEffect(() => {
        // whenever we change one of these options we update local storage to reflect the change
        localStorage.setItem(
            'contentPrefs',
            JSON.stringify(contentPrefs)
        )

    }, [contentPrefs])

    return (
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
                />
                Pornographic
            </label>
        </div>
    )
};

export default ContentPrefMenu;