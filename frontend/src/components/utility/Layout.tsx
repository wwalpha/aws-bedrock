const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="bg-background text-foreground flex h-dvh flex-col items-center overflow-x-auto">
      {children}
    </div>
  )
}

export default Layout
