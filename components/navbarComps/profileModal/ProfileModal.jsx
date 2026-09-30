'use client'
import { useEffect, useRef, useState } from "react";

import ContentPrefMenu from "./contentPrefMenu/contentPrefMenu";
import LangPrefMenu from "./langPrefMenu/langPrefMenu";

const navComps = [ContentPrefMenu, LangPrefMenu];
const menuTitles = ['Content Filter', 'Chapter Languages'];

const ProfileModal = ({hideModal}) => {
    const [curSubModal, setCurSubModal] = useState(-1);
    const dialogRef = useRef(null);
    const headingRef = useRef(null);
    const menuButtonRefs = useRef([]);

    useEffect(() => {
        const dialog = dialogRef.current;
        const opener = document.activeElement;

        dialog.showModal();

        return () => {
            dialog.close();
            opener?.focus();
        };
    }, []);

    useEffect(() => {
        if (curSubModal !== -1) headingRef.current?.focus();
    }, [curSubModal]);

    const resetView = () => {
        const previousMenu = curSubModal;
        setCurSubModal(-1);
        requestAnimationFrame(() => menuButtonRefs.current[previousMenu]?.focus());
    };

    const renderMenu = () => {
        if (curSubModal !== -1) {
            const Comp = navComps[curSubModal];
            return <Comp resetView={resetView} />;
        }

        return (
            <div className="space-y-3">
                {/* Replace this disabled entry with the profile link when the page is ready. */}
                <button
                    type="button"
                    disabled
                    className="flex w-full items-center justify-between gap-3 rounded-xl border border-dashed border-gray-600 bg-gray-700/20 p-4 text-left"
                >
                    <span>
                        <span className="block text-base text-gray-300">Your profile</span>
                        <span className="mt-1 block text-sm text-gray-400">A space for your manga journey.</span>
                    </span>
                    <span className="shrink-0 rounded-full bg-rose-400/10 px-2 py-1 text-xs text-rose-400">Coming soon</span>
                </button>

                <p className="px-1 pt-3 text-xs uppercase tracking-[0.18em] text-gray-400">Reading preferences</p>
                {menuTitles.map((title, idx) => (
                    <button
                        key={title}
                        ref={element => { menuButtonRefs.current[idx] = element; }}
                        type="button"
                        onClick={() => setCurSubModal(idx)}
                        className="group flex w-full items-center justify-between gap-3 rounded-xl border border-gray-700 bg-gray-700/25 p-4 text-left transition-colors hover:border-rose-400/50 hover:bg-gray-700/60 focus-visible:outline-2 focus-visible:outline-emerald-400"
                    >
                        <span>
                            <span className="block text-base text-gray-200 group-hover:text-rose-400">{title}</span>
                        </span>
                        <span className="text-xl text-emerald-400" aria-hidden="true">›</span>
                    </button>
                ))}
            </div>
        );
    };

    return (
        <dialog
            ref={dialogRef}
            aria-labelledby="profile-menu-heading"
            onCancel={event => {
                event.preventDefault();
                hideModal(false);
            }}
            onClick={event => {
                if (event.target === event.currentTarget) hideModal(false);
            }}
            className="fixed inset-auto right-4 top-20 m-0 max-h-[calc(100dvh-6rem)] w-96 max-w-[calc(100vw-2rem)] overflow-y-auto rounded-2xl border border-gray-700 bg-gray-800 p-0 text-gray-200 shadow-2xl backdrop:bg-black/20 backdrop:backdrop-blur-[2px] sm:right-[17%]"
        >
            <div className="p-5 font-robotoCondensed">
                <div className="mb-5 flex items-center justify-between gap-3 border-b border-emerald-400/75 pb-4">
                    <div>
                        <h2
                            id="profile-menu-heading"
                            ref={headingRef}
                            tabIndex={-1}
                            className="font-sigmarOne text-lg text-rose-400 focus:outline-none"
                            >
                            {curSubModal === -1 ? 'Experince settings' : menuTitles[curSubModal]}
                        </h2>
                    </div>
                    <button
                        type="button"
                        onClick={() => hideModal(false)}
                        aria-label="Close profile menu"
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gray-600 text-xl text-gray-400 hover:border-rose-400 hover:text-rose-400 focus-visible:outline-2 focus-visible:outline-emerald-400"
                    >
                        ×
                    </button>
                </div>
                {renderMenu()}
            </div>
        </dialog>
    );
};

export default ProfileModal;
