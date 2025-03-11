import { headers } from "next/headers";


// warning page for a content rating check,
// feature is on hiatus right now. I may implement it later which is why I'm leaving this code here

const Warning = () => {
    const headList = headers();
    const url = new URL(headList.get('referer') || 'http://localhost');
    const query = url.searchParams.get('origin');

    return (
        <div>
            woahhhh
            this came with this data!
            {query}
        </div>
    )
};


export default Warning;