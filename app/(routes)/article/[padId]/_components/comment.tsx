'use client'

import { Button, TextInput } from '@mantine/core'
import { signIn, useSession } from 'next-auth/react'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { HiPaperAirplane, HiTrash, HiOutlineTrash } from 'react-icons/hi2'
import { deleteComment, sendComment } from '../_actions/comment'
import { zodResolver } from '@hookform/resolvers/zod'
import { _Comment, writeCommentSchema, writeCommentSchemaType } from '../types'

export function CommentSection({
  isAdmin,
  comments,
}: {
  isAdmin: boolean
  comments: _Comment[]
}) {
  const { data: session, status } = useSession()

  return (
    <div className='flex-col space-y-5'>
      {
        {
          loading: (
            <div className='animate-pulse'>
              <div className='bg-slate-300 h-10 rounded'></div>
            </div>
          ),
          unauthenticated: <LoginForComment />,
          authenticated: <WriteComment />,
        }[status]
      }
      <br />
      {comments.map((comment, index) => (
        <Comment
          comment={comment}
          showDelete={
            (session && session.user.id === comment.userId) || isAdmin
          }
          key={index}
        />
      ))}
    </div>
  )
}

function WriteComment() {
  const params = useParams()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<writeCommentSchemaType>({
    resolver: zodResolver(writeCommentSchema),
  })

  return (
    <div>
      <p className='text-xl'>Was denkst du?</p>
      <form
        className='flex space-x-1'
        onSubmit={handleSubmit(async (data) => {
          await sendComment(data)
          reset()
        })}
      >
        <input {...register('padId')} type='hidden' value={params.padId} />
        <TextInput
          {...register('comment')}
          type='input'
          className='flex-1'
          error={errors.comment?.message}
        />
        <Button className='h-10' type='submit'>
          <HiPaperAirplane />
        </Button>
      </form>
    </div>
  )
}

function LoginForComment() {
  return (
    <Button variant='outline' onClick={() => signIn('google')}>
      Einloggen, um zu kommentieren
    </Button>
  )
}

function Comment({
  comment,
  showDelete,
}: {
  comment: _Comment
  showDelete: boolean
}) {
  const [hoverTrash, setHoverTrash] = useState(false)

  const options = {
    year: '2-digit',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  } as const

  return (
    <div className='flex items-center group'>
      <div className='flex flex-col flex-1'>
        <div className='flex space-x-1 items-center'>
          <Link
            className='flex space-x-1 items-center'
            href={
              comment.user.author
                ? `/profile/${comment.user.author.username}`
                : ''
            }
          >
            <Image
              src={comment.user.image!}
              alt='Image of the writer of the comment'
              width={30}
              height={30}
              className='rounded-full'
            />
            <p className='text-slate-950'>{comment.user.name}</p>
          </Link>
          <p className='text-slate-500 text-sm'>
            {comment.createdAt.toLocaleString('de-DE', options)}
          </p>
        </div>
        <p className='text-slate-700'>{comment.text}</p>
      </div>
      {showDelete && (
        <button
          className='hidden group-hover:block'
          onMouseEnter={() => setHoverTrash(true)}
          onMouseLeave={() => setHoverTrash(false)}
          onClick={() => deleteComment(comment.id)}
        >
          {hoverTrash ? (
            <HiTrash className='h-5 w-5' />
          ) : (
            <HiOutlineTrash className='h-5 w-5' />
          )}
        </button>
      )}
    </div>
  )
}
