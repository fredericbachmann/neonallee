'use client'

import { useState } from 'react'
import { NewReleases, Serieses, _Author } from './profileList'

export function ProfileTabs({ artist }: { artist: _Author }) {
  const [activeTab, setActiveTab] = useState(0)
  const tabs = [
    { title: 'Neu', content: <NewReleases artist={artist} /> },
    { title: "Author's Pick", content: <>Noch nicht implementiert</> },
    { title: 'Serien', content: <Serieses artist={artist} /> },
  ]

  return (
    <>
      <div className='text-2xl font-bold underline-offset-4 border-b border-gray-300'>
        <ul className='flex space-x-7 -mb-px pl-5'>
          {tabs.map((tab, index) => (
            <li key={index}>
              {activeTab === index ? (
                <div className='relative'>
                  <div className='absolute top-3 left-2 w-full h-7 bg-highlight' />
                  <p className='underline relative z-10'>{tab.title}</p>
                </div>
              ) : (
                <button
                  key={index}
                  className='text-gray-600 underline'
                  onClick={() => setActiveTab(index)}
                >
                  {tab.title}
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>
      <ul className='p-5 flex flex-col space-y-8'>{tabs[activeTab].content}</ul>
    </>
  )
}
