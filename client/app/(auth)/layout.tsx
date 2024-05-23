import React from 'react'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-[90vh] items-center justify-center px-4">
      {children}
    </div>
  )
}
