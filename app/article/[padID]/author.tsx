'use client'

import { Avatar } from "flowbite-react"

export function ArticleAuthors({ authors }: {
    authors: {
        username: string;
        id: string;
        user: {
            image: string | null;
        };
    }[]
}) {
    return <div>
        {authors.map((author) =>
            <div key={author.id}>
                <Avatar img={author.user.image!} rounded />
                {author.username}
            </div>
        )}
    </div>
}