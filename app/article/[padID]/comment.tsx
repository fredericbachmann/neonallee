'use client'

import { Button, TextInput } from "flowbite-react"
import { signIn, useSession } from "next-auth/react"
import Image from "next/image"
import { useParams } from "next/navigation"
import { useRef, useState } from "react"
import { HiOutlineTrash } from "react-icons/hi"
import { HiPaperAirplane, HiTrash } from "react-icons/hi2"

export function CommentSection({ isAdmin, commentsProp }: {
    isAdmin: boolean
    commentsProp: {
        text: string,
        id: string,
        userId: string,
        createdAt: Date
        user: {
            name: string | null,
            image: string | null
        }
    }[]
}) {
    const { data: session, status } = useSession()
    const [comments, setComments] = useState(commentsProp)

    function removeComment(commentId: string) {
        setComments(comments.filter(el => el.id !== commentId))
    }

    return <div className="flex-col space-y-5">
        {{
            'loading': <div className="animate-pulse">
                <div className="bg-slate-300 h-10 rounded"></div>
            </div>,
            'unauthenticated': <LoginForComment />,
            'authenticated': <WriteComment />
        }[status]
        }
        {
            comments.map((comment, index) =>
                <Comment
                    comment={comment}
                    showDelete={session && (session.user.id === comment.userId) || isAdmin}
                    removeComment={removeComment}
                    key={index} />
            )
        }
    </div>
}


export function WriteComment() {
    const params = useParams()
    const commentRef = useRef<HTMLInputElement>(null)

    async function postComment() {
        const comment = commentRef.current?.value
        const res = await fetch(`/api/comment?padId=${params.padId}&comment=${comment}`, { method: 'POST' }) // call the internal api
        if (res.status === 401) signIn('google')
        if (res.status === 200) {
            if (commentRef.current) commentRef.current.value = ""
        } // success, clear input field
    }

    return <div>
        <p className="text-xl">Was denkst du?</p>
        <form className="flex space-x-1" onSubmit={postComment}>
            <TextInput type="input" className="flex-1" ref={commentRef} />
            <Button className="h-10" type="submit">
                <HiPaperAirplane />
            </Button>
        </form>
    </div>
}


export function LoginForComment() {
    return <Button outline gradientDuoTone='greenToBlue' onClick={() => signIn('google')}>
        Einloggen, um zu kommentieren
    </Button>
}


export function Comment({ comment, showDelete, removeComment }: { comment: any, showDelete: boolean, removeComment: Function }) {
    const [hover, setHover] = useState(false)
    const [hoverTrash, setHoverTrash] = useState(false)

    const options = {
        year: '2-digit',
        month: 'numeric',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }

    async function deleteComment() {
        const res = await fetch(`/api/comment?commentId=${comment.id}`, { method: 'DELETE' })
        if (res.ok) removeComment(comment.id)
    }

    return <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} className="flex items-center">
        <div className="flex flex-col flex-1">
            <div className="flex space-x-1 items-center">
                <Image src={comment.user.image!} alt="Image of the writer of the comment" width={30} height={30} className="rounded-full" />
                <p className="text-slate-950">{comment.user.name}</p>
                <p className="text-slate-500 text-sm">{comment.createdAt.toLocaleString('de-DE', options)}</p>

            </div>
            <p className="text-slate-700">{comment.text}</p>
        </div>
        {hover && showDelete &&
            <div className="cursor-pointer" onMouseEnter={() => setHoverTrash(true)} onMouseLeave={() => setHoverTrash(false)}>

                {hoverTrash
                    ? <HiTrash onClick={deleteComment} className="h-5 w-5" />
                    : <HiOutlineTrash onClick={deleteComment} className="h-5 w-5" />}
            </div>
        }
    </div>
}