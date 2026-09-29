'use client';

import { createContext, useContext, useEffect, useRef, useState } from 'react';

const ReaderMenuContext = createContext(null);

const ReaderMenuProvider = ({children}) => {
    const [showMenu, setShowMenu] = useState(false);
    const hasShownPreview = useRef(false);
    const previewTimer = useRef(null);

    const showMenuPreview = () => {
        if (hasShownPreview.current) return;

        hasShownPreview.current = true;
        setShowMenu(true);

        previewTimer.current = setTimeout(() => {
            setShowMenu(false);
            previewTimer.current = null;
        }, 2500);
    };

    const toggleMenu = () => {
        // Once the reader interacts, their choice takes over from the preview.
        hasShownPreview.current = true;
        clearTimeout(previewTimer.current);
        previewTimer.current = null;
        setShowMenu(visible => !visible);
    };

    useEffect(() => {
        return () => clearTimeout(previewTimer.current);
    }, []);

    return (
        <ReaderMenuContext.Provider value={{showMenu, showMenuPreview, toggleMenu}}>
            {children}
        </ReaderMenuContext.Provider>
    );
};

export const useReaderMenu = () => useContext(ReaderMenuContext);

export default ReaderMenuProvider;
