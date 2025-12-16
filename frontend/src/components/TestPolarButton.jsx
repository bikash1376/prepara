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
    console.log('🟡 TestPolarButton rendered');
    console.log('🟡 User from useUser:', user?.id);
    console.log('🟡 Is loaded:', isLoaded);
  }, [user, isLoaded]);

  const testPolarSetup = async () => {
    console.log('🟡 TestPolarButton clicked!');
    console.log('🟡 User from useUser:', user?.id);
    console.log('🟡 Is loaded:', isLoaded);

    if (!isLoaded) {
      console.log('❌ Clerk not loaded yet');
      alert('Please wait for authentication to load...');
      return;
    }

    if (!user) {
      console.log('❌ No user, redirecting to login');
      navigate('/login');
      return;
    }

    console.log('✅ User authenticated, testing Polar setup...');

    try {
      console.log('📡 Making request to /api/v1/polar/debug...');

      // First, check the debug endpoint
      console.log('Checking configuration...');
      const debugResponse = await fetch('/api/v1/polar/debug', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${await getToken()}`,
        },
      });

      console.log('📡 Debug response status:', debugResponse.status);
      console.log('📡 Debug response headers:', Object.fromEntries(debugResponse.headers.entries()));

      const debugData = await debugResponse.json();
      console.log('📡 Debug data received:', debugData);

      if (!debugData.polarAccessTokenExists || debugData.polarAccessTokenLength < 10) {
        console.error('❌ Polar access token not configured properly');
        alert('❌ Polar access token not configured properly!\n\nPlease check your .env file and make sure:\n1. POLAR_ACCESS_TOKEN is set to your actual token\n2. POLAR_WEBHOOK_SECRET is set\n3. POLAR_ENV is set to "sandbox"\n\nDebug info: ' + JSON.stringify(debugData, null, 2));
        return;
      }

      // Test the checkout endpoint
      console.log('Testing checkout with product ID: 814199b9-07a6-4fe4-a1dc-e808cfa16f5c');
      const response = await fetch('/api/v1/polar/checkout?products=814199b9-07a6-4fe4-a1dc-e808cfa16f5c', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${await getToken()}`,
        },
      });

      console.log('📡 Checkout response status:', response.status);
      console.log('📡 Checkout response headers:', Object.fromEntries(response.headers.entries()));

      if (response.redirected) {
        console.log('✅ Redirected to:', response.url);
        alert('✅ Success! Redirecting to Polar checkout...');
        window.location.href = response.url;
      } else {
        const data = await response.json();
        console.log('📡 Checkout response data:', data);

        if (data.error) {
          console.error('❌ Configuration Error:', data.message);
          alert('❌ Configuration Error: ' + data.message + '\n\nDebug info: ' + JSON.stringify(debugData, null, 2));
        } else {
          console.log('⚠️ Unexpected response');
          alert('⚠️ Unexpected response. Check console for details.\nStatus: ' + response.status + '\nData: ' + JSON.stringify(data, null, 2));
        }
      }
    } catch (error) {
      console.error('❌ Test error:', error);
      console.error('❌ Error name:', error.name);
      console.error('❌ Error message:', error.message);
      console.error('❌ Error stack:', error.stack);
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
        console.log('🖱️ Test button clicked!');
        testPolarSetup();
      }}
      variant="outline"
    >
      Test Polar Setup
    </Button>
  );
};

export default TestPolarButton;
