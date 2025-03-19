import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { Check, Clock, Filter, Search, Star } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { useSearch } from "@/hooks/use-search";

const Courses = () => {
  const location = useLocation();
  
  const getInitialSearchQuery = () => {
    const searchParams = new URLSearchParams(location.search);
    return searchParams.get("search") || "";
  };
  
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
  
  const { searchQuery, setSearchQuery, handleSearch, handleKeyDown } = useSearch({
    onSearch: (query) => {
      console.log("Searching for:", query);
    }
  });
  
  useEffect(() => {
    const initialQuery = getInitialSearchQuery();
    if (initialQuery) {
      setSearchQuery(initialQuery);
    }
  }, [location.search]);

  const categories = [
    "Machine Learning",
    "Data Analysis",
    "Portfolio Management",
    "Risk Assessment",
    "Financial Analysis",
    "Leadership",
  ];

  const levels = ["Beginner", "Intermediate", "Advanced"];

  const allCourses = [
    {
      id: 1,
      title: "Machine Learning Fundamentals",
      instructor: "Dr. Alex Johnson",
      rating: 4.8,
      reviews: 245,
      level: "Beginner",
      duration: "8 weeks",
      category: "Machine Learning",
      image: "https://images.unsplash.com/photo-1591453089816-0fbb971b454c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      enrolled: true,
      progress: 65,
      popularity: 98,
      match: 95,
    },
    {
      id: 2,
      title: "Advanced Data Analysis",
      instructor: "Prof. Sarah Williams",
      rating: 4.6,
      reviews: 189,
      level: "Advanced",
      duration: "10 weeks",
      category: "Data Analysis",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      enrolled: true,
      progress: 42,
      popularity: 85,
      match: 88,
    },
    {
      id: 3,
      title: "Portfolio Management Strategies",
      instructor: "Michael Chen",
      rating: 4.9,
      reviews: 312,
      level: "Intermediate",
      duration: "6 weeks",
      category: "Portfolio Management",
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      enrolled: true,
      progress: 89,
      popularity: 92,
      match: 97,
    },
    {
      id: 4,
      title: "Python for Data Science",
      instructor: "Emily Parker",
      rating: 4.7,
      reviews: 276,
      level: "Beginner",
      duration: "8 weeks",
      category: "Data Analysis",
      image: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      enrolled: false,
      progress: 0,
      popularity: 95,
      match: 98,
    },
    {
      id: 5,
      title: "Financial Portfolio Analysis",
      instructor: "Robert Smith",
      rating: 4.5,
      reviews: 168,
      level: "Intermediate",
      duration: "7 weeks",
      category: "Financial Analysis",
      image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      enrolled: false,
      progress: 0,
      popularity: 82,
      match: 92,
    },
    {
      id: 6,
      title: "Deep Learning Applications",
      instructor: "Lisa Wong",
      rating: 4.8,
      reviews: 205,
      level: "Advanced",
      duration: "12 weeks",
      category: "Machine Learning",
      image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      enrolled: false,
      progress: 0,
      popularity: 90,
      match: 87,
    },
    {
      id: 7,
      title: "Risk Assessment Techniques",
      instructor: "James Wilson",
      rating: 4.4,
      reviews: 132,
      level: "Intermediate",
      duration: "5 weeks",
      category: "Risk Assessment",
      image: "https://images.unsplash.com/photo-1579621970588-a35d0e7ab9b6?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      enrolled: false,
      progress: 0,
      popularity: 75,
      match: 89,
    },
    {
      id: 8,
      title: "Leadership for Analysts",
      instructor: "Jessica Taylor",
      rating: 4.7,
      reviews: 198,
      level: "Beginner",
      duration: "4 weeks",
      category: "Leadership",
      image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      enrolled: false,
      progress: 0,
      popularity: 88,
      match: 81,
    },
  ];

  const filterCourses = (courses: typeof allCourses) => {
    return courses.filter((course) => {
      const matchesSearch =
        searchQuery === "" ||
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.instructor.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategories.length === 0 ||
        selectedCategories.includes(course.category);

      const matchesLevel =
        selectedLevels.length === 0 || selectedLevels.includes(course.level);

      return matchesSearch && matchesCategory && matchesLevel;
    });
  };

  const enrolledCourses = allCourses.filter((course) => course.enrolled);
  const recommendedCourses = allCourses
    .filter((course) => !course.enrolled)
    .sort((a, b) => b.match - a.match);
  const popularCourses = allCourses
    .filter((course) => !course.enrolled)
    .sort((a, b) => b.popularity - a.popularity);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  const renderCourseCards = (courses: typeof allCourses) => {
    const filteredCourses = filterCourses(courses);

    if (filteredCourses.length === 0) {
      return (
        <div className="col-span-full py-10 text-center">
          <p className="text-gray-500 dark:text-gray-400">
            No courses match your filters. Try adjusting your search criteria.
          </p>
        </div>
      );
    }

    return (
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {filteredCourses.map((course) => (
          <motion.div key={course.id} variants={item}>
            <Card className="overflow-hidden border-none shadow-md hover:shadow-lg transition-all duration-300 h-full flex flex-col">
              <div className="relative h-48">
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-white font-semibold text-lg line-clamp-2">
                    {course.title}
                  </h3>
                  <p className="text-gray-200 text-sm">{course.instructor}</p>
                </div>
                {course.match > 90 && (
                  <div className="absolute top-4 right-4 bg-green-600 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1">
                    <Star className="h-3 w-3" fill="white" /> {course.match}% Match
                  </div>
                )}
              </div>
              <CardContent className="flex-grow p-6">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-500 mr-1" fill="currentColor" />
                    <span className="text-sm font-medium">{course.rating}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                      ({course.reviews})
                    </span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {course.level}
                  </Badge>
                </div>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
                  <Clock className="h-4 w-4 mr-1" />
                  <span>{course.duration}</span>
                </div>
                {course.enrolled && (
                  <div className="mt-2 mb-4">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {course.progress}% Complete
                      </span>
                    </div>
                    <Progress value={course.progress} className="h-1" />
                  </div>
                )}
              </CardContent>
              <CardFooter className="pt-0 px-6 pb-6">
                <Link to={`/courses/${course.id}`} className="w-full">
                  <Button
                    className={`w-full ${
                      course.enrolled
                        ? "bg-blue-600 hover:bg-blue-700"
                        : "bg-blue-600 hover:bg-blue-700"
                    }`}
                  >
                    {course.enrolled ? "Continue Learning" : "Enroll Now"}
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    );
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  const handleLevelChange = (level: string) => {
    setSelectedLevels((prev) =>
      prev.includes(level)
        ? prev.filter((l) => l !== level)
        : [...prev, level]
    );
  };

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Courses</h1>
            <p className="text-gray-500 dark:text-gray-400">
              Discover courses tailored to your learning journey
            </p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          <Card className="lg:w-64 shrink-0 border-none shadow-md">
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Filter className="h-5 w-5 mr-2" />
                Filters
              </CardTitle>
            </CardHeader>
            <CardContent className="px-6 pb-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium mb-3">Categories</h3>
                  <ScrollArea className="h-44">
                    <div className="space-y-2 pr-4">
                      {categories.map((category) => (
                        <div key={category} className="flex items-center space-x-2">
                          <Checkbox
                            id={`category-${category}`}
                            checked={selectedCategories.includes(category)}
                            onCheckedChange={() => handleCategoryChange(category)}
                          />
                          <label
                            htmlFor={`category-${category}`}
                            className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {category}
                          </label>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>

                <Separator />

                <div>
                  <h3 className="text-sm font-medium mb-3">Level</h3>
                  <div className="space-y-2">
                    {levels.map((level) => (
                      <div key={level} className="flex items-center space-x-2">
                        <Checkbox
                          id={`level-${level}`}
                          checked={selectedLevels.includes(level)}
                          onCheckedChange={() => handleLevelChange(level)}
                        />
                        <label
                          htmlFor={`level-${level}`}
                          className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {level}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setSelectedCategories([]);
                    setSelectedLevels([]);
                    setSearchQuery("");
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="flex-1">
            <div className="mb-6">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search courses by title, instructor, or category..."
                  className="pl-10 py-5 bg-white dark:bg-gray-900"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
              </form>
            </div>

            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full md:w-auto grid-cols-2 md:grid-cols-4 mb-6">
                <TabsTrigger value="all">All Courses</TabsTrigger>
                <TabsTrigger value="enrolled">My Courses</TabsTrigger>
                <TabsTrigger value="recommended">Recommended</TabsTrigger>
                <TabsTrigger value="popular">Popular</TabsTrigger>
              </TabsList>

              <TabsContent value="all">{renderCourseCards(allCourses)}</TabsContent>

              <TabsContent value="enrolled">
                {renderCourseCards(enrolledCourses)}
              </TabsContent>

              <TabsContent value="recommended">
                {renderCourseCards(recommendedCourses)}
              </TabsContent>

              <TabsContent value="popular">
                {renderCourseCards(popularCourses)}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Courses;
