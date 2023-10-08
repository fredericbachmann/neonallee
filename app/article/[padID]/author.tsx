'use client'

import { Avatar } from "flowbite-react"
import Link from "next/link";

export function ArticleAuthors({ authors }: {
    authors: {
        username: string;
        id: string;
        user: {
            image: string | null;
        };
    }[]
}) {
    return <div className="space-y-2">
        {authors.map((author) =>
            <div key={author.id} className="max-w-fit">
                <Link href={`/profile/${author.username}`}>
                    <div className="flex space-x-3 place-items-center">
                        <Avatar img={author.user.image!} rounded />
                        <div>{author.username}</div>
                    </div>
                </Link>
            </div>
        )}
    </div>
}