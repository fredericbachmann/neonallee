'use client'
import Link from 'next/link'
import ProfileDropdown from './dropdown'
import { Burger, Button, Drawer, Group } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import Image from 'next/image'
import logo from '@/public/neon.png'

export default function ActionBar({
    children,
}: {
    children?: React.ReactNode
}) {
    const [opened, { toggle, close }] = useDisclosure(false)

    const links = (
        <>
            <Button
                component={Link}
                href='/user-pads'
                variant='subtle'
                size='md'
            >
                Meine Dokumente
            </Button>
            <Button component={Link} href='/artists' variant='subtle' size='md'>
                Alle KünstlerInnen
            </Button>
        </>
    )

    return (
        <div className='flex items-center justify-between p-3 border-b'>
            <Link href='/' className='text-2xl'>
                <Image src={logo} alt='logo' height={40} width={90} />
            </Link>

            <div className='flex items-center space-x-5'>
                <Group className='flex' visibleFrom='xs'>
                    {links}
                </Group>
                {children}
                <ProfileDropdown />
                <Burger opened={opened} onClick={toggle} hiddenFrom='xs' />
                <Drawer
                    opened={opened}
                    onClose={close}
                    position='right'
                    title={<p className='font-semibold text-2xl'>Neonallee</p>}
                >
                    <div className='flex flex-col'>{links}</div>
                </Drawer>
            </div>
        </div>
    )
}
