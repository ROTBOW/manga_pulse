import { getTopTitles } from "@/utils/getReq";




/**
 * The GET function fetches top titles based on a specified content rating and returns a JSON response.
 * @param req - The `req` parameter in the code snippet represents the request object that is passed to
 * the `GET` function. It seems to be used to extract the search parameters from the URL of the request
 * in order to fetch top titles based on the content rating specified in the search parameters.
 * @returns The GET function is returning a Response object with the fetched data from the getTopTitles
 * function. If the fetching is successful, it returns the fetched data as a JSON string with the
 * appropriate status and content type headers. If there is an error during fetching, it returns an
 * error message as a JSON string with a status of 500
 */
export const GET = async (req) => {
    const searchParams = req.nextUrl.searchParams;
    
    try {
        const response = await getTopTitles(JSON.parse(searchParams.get('contentRating')));
        const data = await response.json();
        return new Response(JSON.stringify(data), {
            status: response.status,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Error fetching top titles:', error);
        return new Response(JSON.stringify({error: 'Failed to fetch top titles'}), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}