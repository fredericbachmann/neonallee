'use client'
import ActionBar from "@/app/components/app-bar";
import { Button } from "@mui/material";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context";
import { useRouter } from "next/navigation";

export default function UserPadsAppBar() {
    const router = useRouter();

    return <ActionBar>
        <Button variant="contained" onClick={() => newPad(router)}>neues Dokument</Button>
    </ActionBar>
}


async function newPad(router: AppRouterInstance) {

    const res = await fetch('/api/etherpad/create')
    if (!res.ok) {
        throw new Error('failed to fetch data')
    }
    const route = (await res.json()).padRoute

    router.push(`/pad/${route}`)
}