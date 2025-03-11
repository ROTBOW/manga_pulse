import { getLatestChapters } from "@/utils/getReq";



/**
 * The GET function fetches the latest chapters based on content rating and languages specified in the
 * request parameters.
 * @param req - The `req` parameter in the code snippet represents the request object that is passed to
 * the `GET` function. It seems to contain a `nextUrl` property, which likely holds the URL of the
 * request. The code then extracts and parses the search parameters from this URL to retrieve values
 * for `
 * @returns The GET function is returning a Response object with the fetched data from the
 * getLatestChapters function. If the data is successfully fetched, it returns a Response with status
 * 200 and the fetched data in JSON format. If there is an error during fetching, it returns a Response
 * with status 500 and an error message in JSON format.
 */
export const GET = async (req) => {
    const searchParams = req.nextUrl.searchParams;

    try {
        const data = await getLatestChapters(JSON.parse(searchParams.get('contentRating')), JSON.parse(searchParams.get('langs')))
        return new Response(data, {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Error fetching latest chapters:', error);
        return new Response(JSON.stringify({ error: 'Failed to fetch latest chapters' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        })
    };

};