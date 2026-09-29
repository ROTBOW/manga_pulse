'use client'
import { usePreferences } from "../../preferencesProvider";

const ContentPrefMenu = ({resetView}) => {
    const {contentPrefs, setContentPrefs} = usePreferences();

    return (
        <>
        <div className="flex flex-col font-robotoCondensed text-md">
            <button 
                onClick={() => {resetView(-1)}}
                className="p-1 bg-gray-700 rounded-sm mb-2"
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
        <p className="text-xs italic text-white/45 font-robotoCondensed">Changes apply automatically.</p>
        </>
    )
};

export default ContentPrefMenu;
