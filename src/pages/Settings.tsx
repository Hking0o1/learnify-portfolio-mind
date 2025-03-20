
import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Bell, Globe, Lock, Moon, Shield } from "lucide-react";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("appearance");
  const { toast } = useToast();
  
  const [settings, setSettings] = useState({
    darkMode: false,
    reducedMotion: false,
    highContrast: false,
    emailNotifications: true,
    courseUpdates: true,
    commentReplies: true,
    twoFactorAuth: false,
    sessionTimeout: "30",
    language: "english"
  });

  const handleToggleChange = (field: string) => {
    setSettings(prev => ({
      ...prev,
      [field]: !prev[field as keyof typeof prev]
    }));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveSettings = () => {
    // In a real app, you would save these settings to a database
    toast({
      title: "Settings saved",
      description: "Your preferences have been updated.",
    });
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
            <p className="text-muted-foreground">
              Manage your account settings and preferences
            </p>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <CardHeader className="px-6">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid grid-cols-1 md:grid-cols-4 w-full">
                  <TabsTrigger value="appearance" className="flex items-center gap-2">
                    <Moon className="h-4 w-4" />
                    <span className="hidden md:inline">Appearance</span>
                  </TabsTrigger>
                  <TabsTrigger value="notifications" className="flex items-center gap-2">
                    <Bell className="h-4 w-4" />
                    <span className="hidden md:inline">Notifications</span>
                  </TabsTrigger>
                  <TabsTrigger value="security" className="flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    <span className="hidden md:inline">Security</span>
                  </TabsTrigger>
                  <TabsTrigger value="language" className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    <span className="hidden md:inline">Language</span>
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </CardHeader>
            <CardContent className="p-6 pt-0">
              <TabsContent value="appearance" className="mt-6 space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Display Settings</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Dark Mode</p>
                        <p className="text-sm text-muted-foreground">
                          Use dark theme for reduced eye strain in low light
                        </p>
                      </div>
                      <Switch
                        checked={settings.darkMode}
                        onCheckedChange={() => handleToggleChange('darkMode')}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Reduced Motion</p>
                        <p className="text-sm text-muted-foreground">
                          Minimize animations across the platform
                        </p>
                      </div>
                      <Switch
                        checked={settings.reducedMotion}
                        onCheckedChange={() => handleToggleChange('reducedMotion')}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">High Contrast</p>
                        <p className="text-sm text-muted-foreground">
                          Increase contrast for better readability
                        </p>
                      </div>
                      <Switch
                        checked={settings.highContrast}
                        onCheckedChange={() => handleToggleChange('highContrast')}
                      />
                    </div>
                  </div>
                </div>
                
                <Button onClick={handleSaveSettings}>Save Display Settings</Button>
              </TabsContent>
              
              <TabsContent value="notifications" className="mt-6 space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Notification Preferences</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Email Notifications</p>
                        <p className="text-sm text-muted-foreground">
                          Receive important updates via email
                        </p>
                      </div>
                      <Switch
                        checked={settings.emailNotifications}
                        onCheckedChange={() => handleToggleChange('emailNotifications')}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Course Updates</p>
                        <p className="text-sm text-muted-foreground">
                          Get notified when your courses are updated
                        </p>
                      </div>
                      <Switch
                        checked={settings.courseUpdates}
                        onCheckedChange={() => handleToggleChange('courseUpdates')}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Comment Replies</p>
                        <p className="text-sm text-muted-foreground">
                          Be notified when someone replies to your comments
                        </p>
                      </div>
                      <Switch
                        checked={settings.commentReplies}
                        onCheckedChange={() => handleToggleChange('commentReplies')}
                      />
                    </div>
                  </div>
                </div>
                
                <Button onClick={handleSaveSettings}>Save Notification Settings</Button>
              </TabsContent>
              
              <TabsContent value="security" className="mt-6 space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Security Settings</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Two-Factor Authentication</p>
                        <p className="text-sm text-muted-foreground">
                          Add an extra layer of security to your account
                        </p>
                      </div>
                      <Switch
                        checked={settings.twoFactorAuth}
                        onCheckedChange={() => handleToggleChange('twoFactorAuth')}
                      />
                    </div>
                    
                    <div>
                      <p className="font-medium mb-2">Session Timeout</p>
                      <p className="text-sm text-muted-foreground mb-2">
                        Automatically log out after a period of inactivity
                      </p>
                      <select
                        name="sessionTimeout"
                        value={settings.sessionTimeout}
                        onChange={handleInputChange}
                        className="w-full p-2 rounded-md border border-input bg-background"
                      >
                        <option value="15">15 minutes</option>
                        <option value="30">30 minutes</option>
                        <option value="60">1 hour</option>
                        <option value="120">2 hours</option>
                        <option value="never">Never</option>
                      </select>
                    </div>
                    
                    <div className="pt-4">
                      <Button variant="destructive">
                        Reset Password
                      </Button>
                    </div>
                  </div>
                </div>
                
                <Button onClick={handleSaveSettings}>Save Security Settings</Button>
              </TabsContent>
              
              <TabsContent value="language" className="mt-6 space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Language Preferences</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="font-medium mb-2">Display Language</p>
                      <p className="text-sm text-muted-foreground mb-2">
                        Select your preferred language for the platform interface
                      </p>
                      <select
                        name="language"
                        value={settings.language}
                        onChange={handleInputChange}
                        className="w-full p-2 rounded-md border border-input bg-background"
                      >
                        <option value="english">English</option>
                        <option value="spanish">Spanish</option>
                        <option value="french">French</option>
                        <option value="german">German</option>
                        <option value="chinese">Chinese</option>
                        <option value="japanese">Japanese</option>
                        <option value="hindi">Hindi</option>
                      </select>
                    </div>
                  </div>
                </div>
                
                <Button onClick={handleSaveSettings}>Save Language Settings</Button>
              </TabsContent>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </Layout>
  );
};

export default Settings;
