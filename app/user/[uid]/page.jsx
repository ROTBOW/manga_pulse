import { redirect } from "next/navigation";



const UserPage = async ({ params }) => {
    const UID = (await params).uid;

    // until this is built it will redirect to WIP route
    redirect('/WIP');

    return (
        <div>
            user page
        </div>
    )
}


export default UserPage;