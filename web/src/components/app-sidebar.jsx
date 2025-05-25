import React from "react"
import { Link } from 'rwsdk'
import { siteConfig } from "../config/site"

export function AppSidebar({ variant }) {
  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex items-center gap-2">
        <Link to="/" className="font-bold text-lg">
          {siteConfig.name}
        </Link>
      </div>
      <nav className="flex flex-col gap-2">
        <Link to="/" className="py-2 px-3 rounded-md hover:bg-accent">
          Dashboard
        </Link>
      </nav>
    </div>
  )
}