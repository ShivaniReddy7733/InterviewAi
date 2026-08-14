"use client"
import { UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect } from 'react'

function Header() {
  const path = usePathname()

  useEffect(() => {
    console.log(path)
  }, [])

  return (
    <div className='flex items-center justify-between px-6 py-4 bg-secondary shadow-sm'>
      
      {/* Logo + Text */}
      <div className="flex items-center space-x-4">
        <img
          src="/MockTalk_logo.jpg"
          alt="MockTalk Logo"
          className="w-16 h-16 rounded-full object-cover shadow"
        />
       <div className="flex flex-col">
        <h1 className="text-xl font-semibold text-gray-800">MockTalk</h1>
        <p className="text-sm text-gray-500 mt-2">Mock today, master tomorrow</p>
       </div>

      </div>

      {/* Navigation */}
      <ul className='hidden md:flex gap-6 text-sm font-medium text-gray-800'>
        <Link href="/dashboard">
          <li className={`cursor-pointer transition-all hover:text-primary hover:font-bold ${path === '/dashboard' && 'text-primary font-bold'}`}>
            Dashboard
          </li>
        </Link>
        <Link href="/dashboard/questions">
          <li className={`cursor-pointer transition-all hover:text-primary hover:font-bold ${path === '/dashboard/questions' && 'text-primary font-bold'}`}>
            Questions
          </li>
        </Link>
        <Link href="/dashboard/upgrade">
          <li className={`cursor-pointer transition-all hover:text-primary hover:font-bold ${path === '/dashboard/upgrade' && 'text-primary font-bold'}`}>
            Upgrade
          </li>
        </Link>
      </ul>

      {/* User Profile Button */}
      <UserButton />
    </div>
  )
}

export default Header
