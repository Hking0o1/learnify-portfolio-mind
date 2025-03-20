
import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useUser } from "@clerk/clerk-react";
import { useToast } from "@/hooks/use-toast";

const Profile = () => {
  const { user, isLoaded } = useUser();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("general");
  
  // Profile form state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    bio: "",
    headline: "",
    website: "",
    twitter: "",
    linkedin: "",
    github: ""
  });

  // Load user data when available
  useState(() => {
    if (isLoaded && user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        bio: "",
        headline: "",
        website: "",
        twitter: "",
        linkedin: "",
        github: ""
      });
    }
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real application, you would save this data to a database
    toast({
      title: "Profile updated",
      description: "Your profile information has been saved.",
    });
  };

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Profile</h1>
            <p className="text-muted-foreground">
              Manage your personal information and account
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="md:col-span-1"
          >
            <Card>
              <CardContent className="p-6 flex flex-col items-center">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage src={user?.imageUrl} alt={user?.fullName || "User"} />
                  <AvatarFallback className="text-2xl">
                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                  </AvatarFallback>
                </Avatar>
                <h3 className="text-lg font-medium">{user?.fullName}</h3>
                <p className="text-sm text-muted-foreground mb-4">{user?.primaryEmailAddress?.emailAddress}</p>
                <div className="w-full">
                  <Button className="w-full mb-2">Change Avatar</Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="md:col-span-3"
          >
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Update your personal details and public profile
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                  <TabsList>
                    <TabsTrigger value="general">General</TabsTrigger>
                    <TabsTrigger value="social">Social</TabsTrigger>
                    <TabsTrigger value="preferences">Preferences</TabsTrigger>
                  </TabsList>

                  <TabsContent value="general" className="space-y-4">
                    <form onSubmit={handleSubmit}>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label htmlFor="firstName" className="text-sm font-medium">
                              First Name
                            </label>
                            <Input
                              id="firstName"
                              name="firstName"
                              value={formData.firstName}
                              onChange={handleInputChange}
                            />
                          </div>
                          <div className="space-y-2">
                            <label htmlFor="lastName" className="text-sm font-medium">
                              Last Name
                            </label>
                            <Input
                              id="lastName"
                              name="lastName"
                              value={formData.lastName}
                              onChange={handleInputChange}
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="email" className="text-sm font-medium">
                            Email
                          </label>
                          <Input
                            id="email"
                            value={user?.primaryEmailAddress?.emailAddress || ""}
                            readOnly
                            disabled
                          />
                          <p className="text-xs text-muted-foreground">
                            To change your email, use the Clerk email settings
                          </p>
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="headline" className="text-sm font-medium">
                            Headline
                          </label>
                          <Input
                            id="headline"
                            name="headline"
                            placeholder="Professional title or status"
                            value={formData.headline}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="bio" className="text-sm font-medium">
                            Bio
                          </label>
                          <textarea
                            id="bio"
                            name="bio"
                            rows={4}
                            className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            placeholder="Tell others about yourself"
                            value={formData.bio}
                            onChange={handleInputChange}
                          />
                        </div>
                        <Button type="submit">Save Changes</Button>
                      </div>
                    </form>
                  </TabsContent>

                  <TabsContent value="social" className="space-y-4">
                    <form onSubmit={handleSubmit}>
                      <div className="grid gap-4 py-4">
                        <div className="space-y-2">
                          <label htmlFor="website" className="text-sm font-medium">
                            Website
                          </label>
                          <Input
                            id="website"
                            name="website"
                            placeholder="https://your-website.com"
                            value={formData.website}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="twitter" className="text-sm font-medium">
                            Twitter
                          </label>
                          <Input
                            id="twitter"
                            name="twitter"
                            placeholder="@username"
                            value={formData.twitter}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="linkedin" className="text-sm font-medium">
                            LinkedIn
                          </label>
                          <Input
                            id="linkedin"
                            name="linkedin"
                            placeholder="https://linkedin.com/in/username"
                            value={formData.linkedin}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="github" className="text-sm font-medium">
                            GitHub
                          </label>
                          <Input
                            id="github"
                            name="github"
                            placeholder="https://github.com/username"
                            value={formData.github}
                            onChange={handleInputChange}
                          />
                        </div>
                        <Button type="submit">Save Changes</Button>
                      </div>
                    </form>
                  </TabsContent>

                  <TabsContent value="preferences" className="space-y-4">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <h3 className="text-lg font-medium">Communication Preferences</h3>
                        <p className="text-sm text-muted-foreground">
                          Manage how we communicate with you
                        </p>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" id="email-updates" className="w-4 h-4" />
                          <label htmlFor="email-updates" className="text-sm font-medium">
                            Email updates about new courses
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" id="email-announcements" className="w-4 h-4" />
                          <label htmlFor="email-announcements" className="text-sm font-medium">
                            Platform announcements
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="checkbox" id="email-digests" className="w-4 h-4" />
                          <label htmlFor="email-digests" className="text-sm font-medium">
                            Weekly learning digests
                          </label>
                        </div>
                      </div>
                      
                      <Button>Save Preferences</Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
