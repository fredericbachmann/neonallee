'use client'
import { Button } from "flowbite-react"
import { useState } from "react"
import SignInModal from "../components/sign-in"

export default function Page() {
    const [showModal, setShowModal] = useState(false)

    return <div className="">
        <Button onClick={() => setShowModal(true)} >login</Button>
        <SignInModal showModal={showModal} setShowModal={setShowModal} />
    </div>
}