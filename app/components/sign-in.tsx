'use client'
import { Modal } from "flowbite-react";
import { signIn, useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function SignInModal({showModal, setShowModal}: {showModal: boolean, setShowModal: Function}) {
    const { data: session, status } = useSession()

    useEffect(() => {
        //if (!(status === 'loading') && !session) void
        if (!(status === 'loading') && session) setShowModal(false)
    }, [session, status]
    )

    return <Modal dismissible show={showModal}>
        <iframe src="/api/auth/signin/google"/>
    </Modal>
}