
import * as React from "react"
import { ChevronRight } from "lucide-react"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import useMobile from "@/hooks/use-mobile"

const SidebarContext = React.createContext<{
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}>({
  isOpen: true,
  setIsOpen: () => null,
})

interface SidebarProviderProps {
  defaultIsOpen?: boolean
  children: React.ReactNode
}

export function SidebarProvider({
  defaultIsOpen = true,
  children,
}: SidebarProviderProps) {
  const [isOpen, setIsOpen] = React.useState(defaultIsOpen)

  return (
    <SidebarContext.Provider value={{ isOpen, setIsOpen }}>
      {children}
    </SidebarContext.Provider>
  )
}

export function useSidebar() {
  return React.useContext(SidebarContext)
}

const sidebarVariants = cva(
  "fixed inset-y-0 left-0 z-20 flex w-full flex-col border-r bg-background transition-all sm:w-64 dark:border-gray-800",
  {
    variants: {
      isOpen: {
        true: "translate-x-0",
        false: "-translate-x-full",
      },
    },
    defaultVariants: {
      isOpen: true,
    },
  }
)

interface SidebarProps {
  className?: string
  children?: React.ReactNode
}

export function Sidebar({ className, children }: SidebarProps) {
  const { isOpen } = useSidebar()
  const isMobile = useMobile()
  
  // Auto-hide on mobile
  React.useEffect(() => {
    if (isMobile) {
      const handleClickOutside = (event: MouseEvent) => {
        const sidebar = document.querySelector('[data-sidebar]')
        if (sidebar && !sidebar.contains(event.target as Node)) {
          const { setIsOpen } = useSidebar()
          setIsOpen(false)
        }
      }
      
      document.addEventListener('click', handleClickOutside)
      return () => {
        document.removeEventListener('click', handleClickOutside)
      }
    }
  }, [isMobile])

  return (
    <aside
      className={cn(sidebarVariants({ isOpen }), className)}
      data-sidebar
    >
      {children}
    </aside>
  )
}

export function SidebarHeader({
  className,
  children,
}: {
  className?: string
  children?: React.ReactNode
}) {
  return (
    <div className={cn("flex h-14 items-center border-b px-4", className)}>
      {children}
    </div>
  )
}

export function SidebarContent({
  className,
  children,
}: {
  className?: string
  children?: React.ReactNode
}) {
  return (
    <div className={cn("flex-1 overflow-auto p-4", className)}>{children}</div>
  )
}

export function SidebarFooter({
  className,
  children,
}: {
  className?: string
  children?: React.ReactNode
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 border-t p-4 text-xs text-muted-foreground",
        className
      )}
    >
      {children}
    </div>
  )
}

export function SidebarTrigger() {
  const { isOpen, setIsOpen } = useSidebar()

  return (
    <button
      className={cn(
        buttonVariants({ variant: "outline", size: "icon" }),
        "fixed bottom-4 left-4 z-30 rounded-full shadow-md",
        isOpen && "hidden"
      )}
      onClick={() => setIsOpen(true)}
    >
      <ChevronRight className="h-4 w-4" />
      <span className="sr-only">Toggle Sidebar</span>
    </button>
  )
}

export function SidebarGroup({
  className,
  children,
}: {
  className?: string
  children?: React.ReactNode
}) {
  return <div className={cn("space-y-2", className)}>{children}</div>
}

export function SidebarGroupLabel({
  className,
  children,
}: {
  className?: string
  children?: React.ReactNode
}) {
  return (
    <div
      className={cn(
        "text-xs font-semibold uppercase tracking-wider text-muted-foreground",
        className
      )}
    >
      {children}
    </div>
  )
}

export function SidebarGroupContent({
  className,
  children,
}: {
  className?: string
  children?: React.ReactNode
}) {
  return <div className={cn("space-y-1", className)}>{children}</div>
}

export function SidebarMenu({
  className,
  children,
}: {
  className?: string
  children?: React.ReactNode
}) {
  return (
    <div className={cn("grid gap-1 group-[[data-collapsed=true]]:justify-center", className)}>
      {children}
    </div>
  )
}

export function SidebarMenuItem({
  className,
  children,
}: {
  className?: string
  children?: React.ReactNode
}) {
  return <div className={cn("", className)}>{children}</div>
}

export function SidebarMenuButton({
  className,
  children,
  asChild,
  ...props
}: {
  className?: string
  children?: React.ReactNode
  asChild?: boolean
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const Comp = asChild ? React.Fragment : "button"
  return (
    <Comp
      className={cn(
        "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
        className
      )}
      {...props}
    >
      {children}
    </Comp>
  )
}
