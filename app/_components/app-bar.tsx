'use client'
import Link from 'next/link'
import ProfileDropdown from './dropdown'
import { Burger, Button, Drawer, Group } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import Image from 'next/image'

export default function ActionBar({
  children,
}: {
  children?: React.ReactNode
}) {
  const [opened, { toggle, close }] = useDisclosure(false)

  const links = (
    <>
      <Button component={Link} href='/user-pads' variant='subtle' size='md'>
        Meine Dokumente
      </Button>
    </>
  )

  return (
    <div className='flex items-center justify-between p-3 border-b'>
      <Link href='/' className='text-2xl'>
        <Image src='/icon.jpg' alt='logo' height={44} width={44} />
      </Link>

      <div className='flex items-center space-x-5'>
        <Group className='flex' visibleFrom='xs'>
          {links}
        </Group>
        {children}
        <ProfileDropdown />
        <Burger opened={opened} onClick={toggle} hiddenFrom='xs' />
        <Drawer opened={opened} onClose={close} position='right'>
          <div className='flex flex-col'>{links}</div>
        </Drawer>
      </div>
    </div>
  )
}
