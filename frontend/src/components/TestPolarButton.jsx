import React, { useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { useUser, useAuth } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';

const TestPolarButton = () => {
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();
  const navigate = useNavigate();

  // Debug logging
  useEffect(() => {
  }, [user, isLoaded]);

  const testPolarSetup = async () => {
    if (!isLoaded) {
      alert('Please wait for authentication to load...');
      return;
    }

    if (!user) {
      navigate('/login');
      return;
    }

    try {
      // First, check the debug endpoint
      const debugResponse = await fetch('/api/v1/polar/debug', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${await getToken()}`,
        },
      });

      const debugData = await debugResponse.json();

      if (!debugData.polarAccessTokenExists || debugData.polarAccessTokenLength < 10) {
        alert('❌ Polar access token not configured properly!\n\nPlease check your .env file and make sure:\n1. POLAR_ACCESS_TOKEN is set to your actual token\n2. POLAR_WEBHOOK_SECRET is set\n3. POLAR_ENV is set to "sandbox"\n\nDebug info: ' + JSON.stringify(debugData, null, 2));
        return;
      }

      // Test the checkout endpoint
      const response = await fetch('/api/v1/polar/checkout?products=814199b9-07a6-4fe4-a1dc-e808cfa16f5c', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${await getToken()}`,
        },
      });

      if (response.redirected) {
        alert('✅ Success! Redirecting to Polar checkout...');
        window.location.href = response.url;
      } else {
        const data = await response.json();

        if (data.error) {
          alert('❌ Configuration Error: ' + data.message + '\n\nDebug info: ' + JSON.stringify(debugData, null, 2));
        } else {
          alert('⚠️ Unexpected response. Check console for details.\nStatus: ' + response.status + '\nData: ' + JSON.stringify(data, null, 2));
        }
      }
    } catch (error) {
      alert('❌ Error: ' + error.message + '\n\nMake sure your backend server is running on port 5000.');
    }
  };

  if (!isLoaded) {
    return (
      <Button disabled variant="outline">
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        Loading...
      </Button>
    );
  }

  return (
    <Button
      onClick={() => {
        testPolarSetup();
      }}
      variant="outline"
    >
      Test Polar Setup
    </Button>
  );
};

export default TestPolarButton;
