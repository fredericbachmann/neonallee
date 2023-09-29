'use client'

import { Avatar } from "flowbite-react"

export function ArticleAuthors({ authors }: {
    authors: {
        user: {
            image: string | null;
            name: string | null;
        };
        username: string;
    }[]
}) {
    return <div>
        {authors.map((author) =>
            <div>
                <Avatar img={author.user.image!} rounded />
                {author.user.name}
            </div>
        )}

    </div>
}