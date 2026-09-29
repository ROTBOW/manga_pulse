import ReaderMenuProvider from '@/components/chapterReaderComps/readerMenuProvider';

const ChapterLayout = ({children}) => {
    // This layout stays mounted when navigating between chapter IDs.
    return (
        <ReaderMenuProvider>
            {children}
        </ReaderMenuProvider>
    );
};

export default ChapterLayout;
