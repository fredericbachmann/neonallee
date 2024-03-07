'use client'
import { Button, Modal } from 'flowbite-react'
import React, { useEffect, useState } from 'react'
import Share from './share'
import { useParams } from 'next/navigation'
import Image from 'next/image'

export default function Members({ displayShare }: { displayShare: Boolean }) {
  const { padId }: { padId: string } = useParams()
  const [openModal, setOpenModal] = useState(false)
  const [members, setMembers] = useState<
    {
      id: string
      username: string
      permission: 'OWNER' | 'READ' | 'WRITE'
      image: string | null
    }[]
  >([])

  const [updateMembers, setUpdateMembers] = useState(false)
  useEffect(() => {
    setUpdateMembers(false)
    fetch(`/api/etherpad/getMembers/${padId}`).then((res) => {
      if (!res.ok) return
      res.json().then(({ members }) => {
        setMembers(members)
      })
    })
  }, [updateMembers, padId])

  return (
    <>
      <Button onClick={() => setOpenModal(true)} color='success'>
        Nutzer
      </Button>
      <Modal dismissible show={openModal} onClose={() => setOpenModal(false)}>
        <Modal.Header>Co-AutorInnen</Modal.Header>
        <Modal.Body>
          <div className='space-y-2'>
            {members.map((member) => (
              <div key={member.id} className='flex items-center space-x-3'>
                <Image
                  src={member.image!}
                  alt='Image of the author'
                  width={35}
                  height={35}
                  className='rounded-full'
                />
                <p className='text-lg flex-1'>{member.username}</p>
                <p className='text-sm text-slate-700'>
                  {
                    {
                      READ: 'Leser',
                      WRITE: 'Schreiber',
                      OWNER: 'Inhaber',
                    }[member.permission]
                  }
                </p>
              </div>
            ))}
          </div>
        </Modal.Body>
        {displayShare && (
          <Share members={members} updateMembers={setUpdateMembers} />
        )}
      </Modal>
    </>
  )
}
