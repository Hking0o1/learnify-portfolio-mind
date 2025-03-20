
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

interface LoadingProps {
  text?: string;
  size?: "small" | "medium" | "large";
  variant?: "primary" | "secondary" | "default";
  fullScreen?: boolean;
}

export function Loading({
  text = "Loading...",
  size = "medium",
  variant = "default",
  fullScreen = false,
}: LoadingProps) {
  const sizes = {
    small: "h-4 w-4",
    medium: "h-8 w-8",
    large: "h-12 w-12",
  };

  const colors = {
    primary: "text-primary",
    secondary: "text-secondary",
    default: "text-muted-foreground",
  };

  const Container = ({ children }: { children: React.ReactNode }) => {
    if (fullScreen) {
      return (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
          {children}
        </div>
      );
    }

    return <>{children}</>;
  };

  return (
    <Container>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col items-center justify-center gap-3"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Loader2 className={`${sizes[size]} ${colors[variant]}`} />
        </motion.div>
        {text && <p className="text-muted-foreground">{text}</p>}
      </motion.div>
    </Container>
  );
}

export function LoadingButton({ 
  loading, 
  children 
}: { 
  loading: boolean, 
  children: React.ReactNode 
}) {
  return (
    <>
      {loading ? (
        <div className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Loading...</span>
        </div>
      ) : (
        children
      )}
    </>
  );
}

export function PageLoader() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="relative">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center animate-pulse">
          <span className="text-white font-bold text-2xl">P</span>
        </div>
        
        <motion.div
          className="absolute -inset-3 rounded-full border-t-2 border-blue-500"
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          style={{ borderRadius: "50%" }}
        />
      </div>
      
      <p className="mt-6 text-muted-foreground">Loading your learning experience...</p>
    </div>
  );
}
