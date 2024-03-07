import ActionBar from '@/app/_components/app-bar'

export default async function Component() {
  const pad = {
    id: 'lkdsgkdsjg',
    name: 'Titel',
    published: true,
    description: 'Beispielbeschreibung für einen Beispieltext',
  }

  const pads = [pad, pad, pad, pad, pad, pad, pad, pad, pad, pad, pad] // duplicate the pads

  return (
    <>
      <ActionBar />
      <div className='grid grid-cols-3 gap-8'>
        {pads.map((_, i) => (
          <img
            src='https://picsum.photos/400/200'
            key={i}
            className='min-w-80 max-w-lg w-full'
          />
        ))}
      </div>
    </>
  )
}
