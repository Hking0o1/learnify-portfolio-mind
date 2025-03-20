
import { useState } from "react";
import { SignIn } from "@clerk/clerk-react";
import { motion } from "framer-motion";
import { Loader2, BookOpen, Trophy, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

// Floating elements animation
const FloatingElement = ({ children, delay = 0 }) => {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{
        delay,
        duration: 0.5,
        y: {
          duration: 2.5,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut"
        }
      }}
    >
      {children}
    </motion.div>
  );
};

const InstructorLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const features = [
    {
      icon: <BookOpen className="h-8 w-8 text-blue-500" />,
      title: "Create Courses",
      description: "Build engaging learning experiences"
    },
    {
      icon: <Trophy className="h-8 w-8 text-amber-500" />,
      title: "Track Progress",
      description: "Monitor student achievements"
    },
    {
      icon: <Users className="h-8 w-8 text-green-500" />,
      title: "Engage Students",
      description: "Interactive learning tools"
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-blue-900/20 relative overflow-hidden">
      {/* Background animated elements */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-blue-400/10 dark:bg-blue-400/5"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 300 + 50}px`,
              height: `${Math.random() * 300 + 50}px`,
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.1, 0.2, 0.1],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="container mx-auto px-4 py-12 flex flex-col lg:flex-row items-center justify-between gap-12 z-10">
        {/* Left content section */}
        <div className="w-full lg:w-1/2 space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400 mb-4">
              Instructor Portal
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
              Empower your teaching with our advanced learning platform. Create engaging courses, track student progress, and make a difference.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <FloatingElement key={index} delay={index * 0.2}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col items-center text-center"
                >
                  <div className="mb-4 p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    {feature.description}
                  </p>
                </motion.div>
              </FloatingElement>
            ))}
          </div>

          <div className="mt-12 flex items-center justify-center">
            {isLoading && <Loader2 className="h-8 w-8 animate-spin" />}
          </div>
        </div>

        {/* Login section */}
        <div className="w-full lg:w-1/2 max-w-md mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700"
          >
            <div className="p-6 text-center border-b border-gray-200 dark:border-gray-700">
              <div className="inline-block w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mb-4">
                <span className="text-white font-semibold text-lg">P</span>
              </div>
              <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400">
                Instructor Sign In
              </h2>
            </div>
            
            <SignIn 
              path="/instructor-login"
              routing="path"
              signUpUrl="/sign-up"
              redirectUrl="/instructor"
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default InstructorLogin;
