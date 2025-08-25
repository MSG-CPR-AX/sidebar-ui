import React from 'react'

export const ContentView = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="flex-grow overflow-y-auto bg-gray-900 p-2">
      {children}
    </main>
  )
}
