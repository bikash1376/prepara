import React, { useEffect } from 'react';
import { Button } from './ui/button';
import { useUser, useAuth } from '@clerk/clerk-react';
import { Settings, CreditCard } from 'lucide-react';

const CustomerPortal = ({ className = "", variant = "outline" }) => {
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();

  // Debug logging
  useEffect(() => {
    console.log('🟠 CustomerPortal rendered');
    console.log('🟠 User:', user?.id);
    console.log('🟠 Is loaded:', isLoaded);
  }, [user, isLoaded]);

  const handlePortalAccess = async () => {
    console.log('🟠 CustomerPortal clicked!');
    console.log('🟠 User:', user?.id);

    if (!isLoaded) {
      console.log('❌ Clerk not loaded yet');
      return;
    }

    if (!user) {
      console.log('❌ No user');
      return;
    }

    try {
      // Redirect to Polar customer portal
      const response = await fetch('/api/v1/polar/portal', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${await getToken()}`,
        },
      });

      if (response.redirected) {
        window.location.href = response.url;
      } else {
        const data = await response.json();
        if (data.portal?.url) {
          window.location.href = data.portal.url;
        } else {
          console.error('Failed to access customer portal:', data);
          alert('No active subscription found. Please upgrade to Pro first.');
        }
      }
    } catch (error) {
      console.error('Portal access error:', error);
      alert('Portal access error: ' + error.message);
    }
  };

  if (!isLoaded) {
    return (
      <Button disabled variant={variant} className={className}>
        Loading...
      </Button>
    );
  }

  return (
    <Button
      onClick={handlePortalAccess}
      variant={variant}
      className={className}
    >
      <Settings className="h-4 w-4 mr-2" />
      Manage Subscription
    </Button>
  );
};

export default CustomerPortal;
