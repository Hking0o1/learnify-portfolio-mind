
import { SignIn as ClerkSignIn } from "@clerk/clerk-react";
import { motion } from "framer-motion";

const SignIn = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-blue-900/20 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="inline-block w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mb-4">
            <span className="text-white font-semibold text-lg">P</span>
          </div>
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-400">
            Pragati Learning Platform
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Sign in to continue to your dashboard
          </p>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
          <ClerkSignIn />
        </div>
      </motion.div>
    </div>
  );
};

export default SignIn;
