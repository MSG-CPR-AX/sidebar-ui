export const ContentView = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="flex-grow overflow-y-auto bg-background">
      {children}
    </main>
  )
}
