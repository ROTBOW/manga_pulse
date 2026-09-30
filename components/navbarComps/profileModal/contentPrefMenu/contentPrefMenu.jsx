'use client'
import { usePreferences } from "../../preferencesProvider";

const contentOptions = [
    {code: 'safe', label: 'Safe'},
    {code: 'suggestive', label: 'Suggestive'},
    {code: 'erotica', label: 'Erotica'},
    {code: 'pornographic', label: 'Pornographic'},
];

const ContentPrefMenu = ({resetView}) => {
    const {contentPrefs, setContentPrefs} = usePreferences();

    return (
        <div className="space-y-4">
            <button
                type="button"
                onClick={resetView}
                className="rounded-lg px-2 py-1 text-sm text-emerald-400 hover:bg-emerald-400/10 focus-visible:outline-2 focus-visible:outline-emerald-400"
            >
                <span aria-hidden="true">← </span>All options
            </button>
            <fieldset className="space-y-2">
                <legend className="mb-3 text-sm text-gray-400">Choose the content ratings you want to see.</legend>
                {contentOptions.map(option => (
                    <label
                        key={option.code}
                        className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-gray-700 bg-gray-700/25 px-4 py-3 transition-colors hover:bg-gray-700/60 has-checked:border-emerald-400/40 has-checked:bg-emerald-400/5"
                    >
                        {option.label}
                        <input
                            type="checkbox"
                            checked={contentPrefs[option.code]}
                            onChange={event => {
                                const isChecked = event.target.checked;
                                setContentPrefs(prefs => ({...prefs, [option.code]: isChecked}));
                            }}
                            className="h-4 w-4 accent-emerald-400 focus-visible:outline-2 focus-visible:outline-emerald-400"
                        />
                    </label>
                ))}
            </fieldset>
            <p className="border-t border-gray-700 pt-3 text-xs text-gray-400">Changes apply automatically.</p>
        </div>
    );
};

export default ContentPrefMenu;
