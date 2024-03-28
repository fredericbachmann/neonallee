'use client'
import { Button, Modal } from '@mantine/core'
import { useState } from 'react'
import Share from './share'
import Image from 'next/image'

export default function Members({
  displayShare,
  members,
}: {
  displayShare: Boolean
  members: _Members
}) {
  const [openModal, setOpenModal] = useState(false)
  return (
    <>
      <Button onClick={() => setOpenModal(true)} color='green'>
        Nutzer
      </Button>
      <Modal
        opened={openModal}
        onClose={() => setOpenModal(false)}
        title='Co-AutorInnen'
      >
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
        {displayShare && <Share members={members} />}
      </Modal>
    </>
  )
}
