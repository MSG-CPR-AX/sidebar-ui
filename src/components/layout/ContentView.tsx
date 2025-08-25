export const ContentView = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="bg-background flex-grow overflow-y-auto p-2">
      {children}
    </main>
  )
}
