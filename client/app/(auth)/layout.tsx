import React from 'react'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <div className="mx-auto flex h-full justify-center">{children}</div>
}
