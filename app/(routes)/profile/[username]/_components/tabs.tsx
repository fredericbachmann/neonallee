'use client'

import { Fragment, useState } from 'react'

export function ProfileTabs({
  tabs,
}: {
  tabs: { title: string; content: React.ReactNode }[]
}) {
  const [activeTab, setActiveTab] = useState(0)

  return (
    <>
      <div className='text-2xl font-bold underline-offset-4 border-b border-gray-300'>
        <ul className='flex space-x-7 -mb-px pl-5'>
          {tabs.map((tab, index) => (
            <li key={index}>
              {activeTab === index ? (
                <div className='relative'>
                  <div className='absolute top-3 left-2 -z-10 w-full h-7 bg-profile-yellow-900' />
                  <p className='underline'>{tab.title}</p>
                </div>
              ) : (
                <button
                  key={index}
                  className='text-profile-blue-400 underline'
                  onClick={() => setActiveTab(index)}
                >
                  {tab.title}
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>
      <div className='p-5'>{tabs[activeTab].content}</div>
    </>
  )
}
