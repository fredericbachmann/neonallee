'use client'
import { Avatar, Button, Modal } from "flowbite-react";
import React, { useEffect, useState } from "react";
import Share from "./share";
import { useParams } from "next/navigation";

export default function Members({ displayShare }: { displayShare: Boolean }) {
    const { padId }: { padId: string } = useParams()
    const [openModal, setOpenModal] = useState(false)
    const [members, setMembers] = useState<{
        id: string;
        username: string;
        permission: 'OWNER' | 'READ' | 'WRITE';
        image: string | null;
    }[]>([])

    const [updateMembers, setUpdateMembers] = useState(false)
    useEffect(() => {
        setUpdateMembers(false)
        fetch(`/api/etherpad/getMembers/${padId}`).then(res => {
            if (!res.ok) return
            res.json().then(({ members }) => {
                setMembers(members)
            })
        })
    }, [updateMembers])

    return <>
        <Button onClick={() => setOpenModal(true)} color='success' >Nutzer</Button>
        <Modal dismissible show={openModal} onClose={() => setOpenModal(false)}>
            <Modal.Header>Mitbearbeiter</Modal.Header>
            <Modal.Body>
                <div className="space-y-2">
                    {members.map(member =>
                        <div key={member.id} className="flex items-center space-x-3">
                            <Avatar img={member.image!} rounded className="" />
                            <div className="flex-1 text-xl">
                                {member.username}
                            </div>
                            <div>{member.permission}</div>
                        </div>
                    )}
                </div>
            </Modal.Body>
            {displayShare &&
                <Share members={members} updateMembers={setUpdateMembers} />
            }
        </Modal>

    </>
}