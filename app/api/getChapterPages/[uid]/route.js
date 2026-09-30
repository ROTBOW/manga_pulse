import { getChapterPages } from "@/utils/getReq";




export const GET = async (req, { params }) => {
    const uid = (await params).uid;

    try {
        const response = await getChapterPages(uid);
        
        return new Response(JSON.stringify(response), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-store'
            }

        });

    } catch (error) {
        console.error('Error fetching manga pages:', error);
        return new Response(JSON.stringify({error: 'failed to fetch pages' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        })
    };
};
