import { getMangaChapters } from "@/utils/getReq";

/**
 * The function GET asynchronously fetches manga chapters based on provided parameters and returns a
 * JSON response.
 * @param req - The `req` parameter in the code snippet represents the request object that is passed to
 * the `GET` function.
 * @returns The GET function is returning a Response object. If the manga chapters are successfully
 * fetched, it returns a Response object with the fetched data in JSON format along with a status code
 * and content type header. If there is an error during the fetching process, it returns a Response
 * object with an error message in JSON format, a status code of 500, and the content type header.
 */
export const GET = async (req) => {
    const searchParams = req.nextUrl.searchParams;

    try {
        const response = await getMangaChapters(searchParams.get('uid'), searchParams.get('order'), JSON.parse(searchParams.get('langs')));
        const data = await response.json();
        return new Response(JSON.stringify(data), {
            status: response.status,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Error fetching manga chapters:', error);
        return new Response(JSON.stringify({ error: 'Failed to fetch manga chapters' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}