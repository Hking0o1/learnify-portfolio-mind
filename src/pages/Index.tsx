
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, BarChart3, BookOpen, Brain, Layers } from "lucide-react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { SignedIn, SignedOut, SignInButton, SignUpButton } from "@clerk/clerk-react";

const Index = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-blue-900/20 opacity-80"></div>
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-gradient-to-br from-blue-400/20 to-purple-400/20 blur-3xl"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                width: `${Math.random() * 400 + 200}px`,
                height: `${Math.random() * 400 + 200}px`,
                transform: `rotate(${Math.random() * 360}deg)`,
                opacity: Math.random() * 0.3 + 0.1,
              }}
            ></div>
          ))}
        </div>

        <div className="container px-4 mx-auto relative z-10">
          <div className="flex flex-col items-center justify-center text-center max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                Personalized Learning with{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-500">
                  AI-Powered Insights
                </span>
              </h1>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            >
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 max-w-2xl">
                Pragati combines advanced machine learning with comprehensive
                learning management to deliver a tailored educational experience
                that adapts to your unique learning style and goals.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <SignedIn>
                <Link to="/dashboard">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 rounded-full text-lg transition-all duration-300 transform hover:scale-105">
                    Go to Dashboard
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </SignedIn>
              
              <SignedOut>
                <SignUpButton mode="modal">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 rounded-full text-lg transition-all duration-300 transform hover:scale-105">
                    Get Started
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </SignUpButton>
                
                <SignInButton mode="modal">
                  <Button variant="outline" className="px-8 py-6 rounded-full text-lg border-2 transition-all duration-300 transform hover:scale-105">
                    Sign In
                  </Button>
                </SignInButton>
              </SignedOut>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6, ease: "easeOut" }}
            className="mt-16 flex justify-center"
          >
            <div className="relative w-full max-w-4xl">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl blur opacity-30"></div>
              <div className="relative overflow-hidden rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-xl">
                <img
                  src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80"
                  alt="Dashboard Preview"
                  className="w-full h-auto rounded-lg"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container px-4 mx-auto">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">
              Advanced Learning Features
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Discover how our platform leverages AI to enhance your learning
              experience and optimize your educational journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <BookOpen className="h-8 w-8 text-blue-500" />,
                title: "Adaptive Learning Paths",
                description:
                  "Personalized course recommendations based on your learning style and progress.",
              },
              {
                icon: <Brain className="h-8 w-8 text-blue-500" />,
                title: "ML-Powered Insights",
                description:
                  "Advanced machine learning algorithms analyze your performance to provide targeted feedback.",
              },
              {
                icon: <BarChart3 className="h-8 w-8 text-blue-500" />,
                title: "Portfolio Analysis",
                description:
                  "Comprehensive assessment of your skills and accomplishments to track growth.",
              },
              {
                icon: <Layers className="h-8 w-8 text-blue-500" />,
                title: "Interactive Content",
                description:
                  "Engage with dynamic learning materials that adapt to your engagement level.",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-gray-50 dark:bg-gray-800 p-8 rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 group hover:border-blue-300 dark:hover:border-blue-800"
              >
                <div className="mb-4 p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg inline-block group-hover:bg-blue-500/20 transition-all duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="container px-4 mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Transform Your Learning Experience?
            </h2>
            <p className="text-xl mb-8 text-blue-100">
              Join thousands of learners who have accelerated their educational
              journey with our AI-powered platform.
            </p>
            
            <SignedIn>
              <Link to="/dashboard">
                <Button className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-6 rounded-full text-lg font-medium transition-all duration-300 transform hover:scale-105">
                  Continue Learning
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </SignedIn>
            
            <SignedOut>
              <SignUpButton mode="modal">
                <Button className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-6 rounded-full text-lg font-medium transition-all duration-300 transform hover:scale-105">
                  Start Learning Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </SignUpButton>
            </SignedOut>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container px-4 mx-auto">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">What Our Users Say</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Hear from students and professionals who have transformed their
              learning with our platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Alex Johnson",
                role: "Software Developer",
                content:
                  "The ML-powered suggestions helped me focus on areas where I needed improvement. I've been able to advance my career faster than I expected.",
              },
              {
                name: "Sarah Williams",
                role: "Data Science Student",
                content:
                  "The portfolio analysis feature gave me insights into my skill gaps and helped me customize my learning path. Incredibly valuable!",
              },
              {
                name: "Michael Chen",
                role: "Product Manager",
                content:
                  "As someone who needs to constantly learn new skills, this platform has been a game-changer for my professional development.",
              },
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 relative"
              >
                <div className="absolute top-0 left-0 transform -translate-x-4 -translate-y-4">
                  <div className="text-6xl text-blue-200 dark:text-blue-800">"</div>
                </div>
                <div className="relative z-10">
                  <p className="text-gray-700 dark:text-gray-300 mb-6">
                    {testimonial.content}
                  </p>
                  <div className="flex items-center">
                    <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {testimonial.name[0]}
                    </div>
                    <div className="ml-4">
                      <h4 className="font-semibold">{testimonial.name}</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
