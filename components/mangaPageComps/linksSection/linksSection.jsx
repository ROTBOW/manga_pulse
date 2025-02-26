

const LinksSectionItem = ({title, id, idOrUrl}) => {
    if (idOrUrl === undefined) {
        return ''
    }
    let link = '';

    switch (id) {
        case 'al':
            link = `https://anilist.co/manga/${idOrUrl}`;
            break;
        
        case 'ap':
            link = `https://www.anime-planet.com/manga/${idOrUrl}`;
            break;
        
        case 'bw':
            link = `https://bookwalker.jp/${idOrUrl}`;
            break;
        
        case 'mu':
            link = `https://www.mangaupdates.com/series.html?id=${idOrUrl}`;
            break;
        
        case 'nu':
            link = `https://www.novelupdates.com/series/${idOrUrl}`;
            break;
        
        case 'kt':
            if (!isNaN(parseInt(idOrUrl))) {
                link = `https://kitsu.app/manga/${idOrUrl}`;
            } else {
                link = `https://kitsu.app/manga/?filter[slug]=${idOrUrl}`
            }
            break;

        case 'mal':
            link = `https://myanimelist.net/manga/${idOrUrl}`;
            break;
        
        case 'amz':
        case 'ebj':
        case 'cdj':
        case 'raw':
        case 'engtl':
        default:
            link = idOrUrl;
    }

    
    return (
        <li className="px-1 bg-gray-800 w-fit rounded text-nowrap m-1 hover:bg-gray-600">
            <a target="_blank" rel="noopener noreferrer" href={link}>
                {title}
            </a>
        </li>
    )
}


const LinksSection = ({links}) => {

    return (
        <div>
            <h3>Buy</h3>
            <ul className="flex w-full flex-wrap">
                <LinksSectionItem title="Offical Raw" id='raw' idOrUrl={links['raw']} />
                <LinksSectionItem title="Offical English" id='engtl' idOrUrl={links['engtl']} />
                <LinksSectionItem title="Book☆Walker" id='bw' idOrUrl={links['bw']} />
                <LinksSectionItem title="Amazon" id='amz' idOrUrl={links['amz']} />
                <LinksSectionItem title="EBookJapan" id='ebj' idOrUrl={links['ebj']} />
                <LinksSectionItem title="CDJapan" id='cdj' idOrUrl={links['cdj']} />
            </ul>

            <h3>Track</h3>
            <ul className="flex w-full flex-wrap">
                <LinksSectionItem title="MangaUpdates" id="mu" idOrUrl={links['mu']} />
                <LinksSectionItem title="Anime-Planet" id="ap" idOrUrl={links['ap']} />
                <LinksSectionItem title="AniList" id="al" idOrUrl={links['al']} />

                <LinksSectionItem title="Kitsu" id="kt" idOrUrl={links['kt']} />
                <LinksSectionItem title="Novel Updates" id="nu" idOrUrl={links['nu']} />
                <LinksSectionItem title="MyAnimeList" id="mal" idOrUrl={links['mal']} />
            </ul>
        </div>
    )
}

export default LinksSection;