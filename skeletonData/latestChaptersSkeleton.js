const chapterSlice = {
    "id": "",
    "type": "",
    "attributes": {
        "volume": null,
        "chapter": "",
        "title": "",
        "translatedLanguage": "",
        "externalUrl": "",
        "publishAt": "",
        "readableAt": "",
        "createdAt": "",
        "updatedAt": "",
        "pages": 0,
        "version": 0
    },
    "relationships": [
        {
            "id": "",
            "type": "",
            "attributes": {
                "name": "",
                "altNames": [
                    {
                        "en": ""
                    },
                    {
                        "en": ""
                    },
                    {
                        "en": ""
                    }
                ],
                "locked": false,
                "website": "",
                "ircServer": null,
                "ircChannel": null,
                "discord": "",
                "contactEmail": "",
                "description": "",
                "twitter": "",
                "mangaUpdates": "",
                "focusedLanguages": [
                    ""
                ],
                "official": false,
                "verified": false,
                "inactive": false,
                "publishDelay": null,
                "exLicensed": false,
                "createdAt": "",
                "updatedAt": "",
                "version": 0
            }
        },
        {
            "id": "",
            "type": ""
        },
        {
            "id": "",
            "type": ""
        }
    ],
    "title": "",
    "cover_art": ""
}
let latestChaptersSkeleton = [];
for (let i = 0; i < 30; i++) {
    latestChaptersSkeleton.push(chapterSlice);
}

export default latestChaptersSkeleton;