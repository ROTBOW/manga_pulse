import Image from "next/image";
import Navbar from "@/components/navbar/navbar";

import { getPopTitles } from "@/utils/getReq";



const Home = async () => {
  let popTitles = await getPopTitles();
  
  return (
    <div className="flex flex-col items-center">
      <Navbar/>

      {
        popTitles.length != 0 ?
          <div>
            {popTitles[0].attributes.title.en}
            <Image src={`https://mangadex.org/covers/${popTitles[0].id}/${popTitles[0].relationships[3].attributes.fileName}`} width="100" height="100" alt='managa cover'/>
          </div>
        :
        <div>no data</div> // to be replaced with a loading component
      }

    </div>
  );
}


export default Home;