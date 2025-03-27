
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface InviteRequest {
  email: string;
  sender_id: string;
  message?: string;
}

export const inviteAPI = {
  // Send invitation to a friend
  inviteFriend: async (inviteData: InviteRequest) => {
    try {
      // This would typically send an email through a Supabase Edge Function
      // For now, we'll mock the functionality
      console.log('Invitation sent to:', inviteData.email);
      
      // In a real implementation, you might store the invitation in a database table
      return { success: true, message: 'Invitation sent successfully' };
    } catch (error) {
      console.error('Error sending invitation:', error);
      throw error;
    }
  }
};

// Custom hook for invite operations with toast notifications
export const useInviteAPI = () => {
  const { toast } = useToast();
  
  return {
    ...inviteAPI,
    
    // Invite friend with toast
    inviteFriendWithToast: async (inviteData: InviteRequest) => {
      try {
        const result = await inviteAPI.inviteFriend(inviteData);
        toast({
          title: "Invitation Sent",
          description: `Invitation sent to ${inviteData.email}`,
        });
        return result;
      } catch (error) {
        console.error("Error sending invitation:", error);
        toast({
          title: "Error",
          description: error.message || "Failed to send invitation",
          variant: "destructive",
        });
        throw error;
      }
    }
  };
};
