
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Play, UserPlus } from 'lucide-react';
import { useInviteAPI } from '@/services/invites';
import { useProgressAPI } from '@/services/progress';
import { useUserAuth } from '@/contexts/AuthContext';

export function ActionButtons() {
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteMessage, setInviteMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isLoadingResume, setIsLoadingResume] = useState(false);
  const { inviteFriendWithToast } = useInviteAPI();
  const { resumeLearningWithToast } = useProgressAPI();
  const { user } = useUserAuth();
  const navigate = useNavigate();

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail || !user?.id) return;
    
    setIsSending(true);
    try {
      await inviteFriendWithToast({
        email: inviteEmail,
        sender_id: user.id,
        message: inviteMessage
      });
      setInviteEmail('');
      setInviteMessage('');
    } catch (error) {
      console.error('Failed to send invite:', error);
    } finally {
      setIsSending(false);
    }
  };

  const handleResumeLearning = async () => {
    if (!user?.id) return;
    
    setIsLoadingResume(true);
    try {
      const learningData = await resumeLearningWithToast(user.id);
      navigate(`/courses/${learningData.course_id}`);
    } catch (error) {
      console.error('Failed to resume learning:', error);
    } finally {
      setIsLoadingResume(false);
    }
  };

  return (
    <div className="flex space-x-2">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            <UserPlus className="h-4 w-4" />
            Invite Friends
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Invite a Friend</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleInvite} className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input 
                id="email" 
                type="email" 
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="friend@example.com"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Personal Message (Optional)</Label>
              <Textarea 
                id="message" 
                value={inviteMessage}
                onChange={(e) => setInviteMessage(e.target.value)}
                placeholder="Hey! Check out this learning platform."
                rows={3}
              />
            </div>
            <div className="flex justify-end gap-2">
              <DialogClose asChild>
                <Button type="button" variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit" isLoading={isSending} loadingText="Sending">
                Send Invitation
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      <Button 
        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
        onClick={handleResumeLearning}
        isLoading={isLoadingResume}
        loadingText="Loading"
      >
        <Play className="h-4 w-4" />
        Resume Learning
      </Button>
    </div>
  );
}
