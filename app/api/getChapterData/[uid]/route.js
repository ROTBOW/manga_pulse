import { getChapter } from "@/utils/getReq";


 export const GET = async (req, { params }) => {
    const uid = (await params).uid;

    try {
        const response = await getChapter(uid);
        
        return new Response(JSON.stringify(response), {
            status: response.status,
            headers: { 'Content-Type': 'application/json'}
        });
    } catch (error) {
        console.error('Error fetching chapter data:', error);
        return new Response(JSON.stringify({error: 'failed to fetch chapter'}), {
            status: 500,
            headers: {"Content-Type": 'application/json'}
        })
    }
 }