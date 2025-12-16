import React, { useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { useUser, useAuth } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';

const PaymentButton = ({
  productId,
  children = "Upgrade to Pro",
  className = "",
  variant = "default"
}) => {
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();
  const navigate = useNavigate();

  // Debug logging
  useEffect(() => {
    console.log('🔵 PaymentButton rendered');
    console.log('🔵 User:', user?.id);
    console.log('🔵 Product ID:', productId);
    console.log('🔵 Children:', children);
  }, [user, productId, children]);

  const handlePayment = async () => {
    console.log('🚀 Payment button clicked!');
    console.log('User:', user?.id);
    console.log('Product ID:', productId);

    if (!isLoaded) {
      console.log('❌ Clerk not loaded yet');
      return;
    }

    if (!user) {
      console.log('❌ No user, redirecting to login');
      navigate('/login');
      return;
    }

    console.log('✅ User authenticated, making API call...');

    try {
      console.log('📡 Making request to /api/v1/polar/debug...');

      // First check if the backend is responding
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
        console.error('❌ Polar not configured properly');
        alert('❌ Polar not configured properly. Click "Test Polar Setup" first to see the issue.');
        return;
      }

      console.log('✅ Configuration looks good, making checkout request...');

      // Redirect to Polar checkout - use the productId prop
      const response = await fetch(`/api/v1/polar/checkout?products=${productId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${await getToken()}`,
        },
      });

      console.log('📡 Checkout response status:', response.status);
      console.log('📡 Checkout response headers:', Object.fromEntries(response.headers.entries()));

      if (response.redirected) {
        console.log('✅ Redirected to:', response.url);
        window.location.href = response.url;
      } else {
        const data = await response.json();
        console.log('📡 Checkout response data:', data);
        if (data.checkout?.url) {
          console.log('✅ Checkout URL found:', data.checkout.url);
          window.location.href = data.checkout.url;
        } else {
          console.error('❌ No checkout URL in response:', data);
          alert('Failed to initiate checkout. Check console for details.');
        }
      }
    } catch (error) {
      console.error('❌ Payment error:', error);
      console.error('❌ Error name:', error.name);
      console.error('❌ Error message:', error.message);
      console.error('❌ Error stack:', error.stack);
      alert('Payment error: ' + error.message + '\n\nMake sure your backend is running and Polar is configured.');
    }
  };

  if (!isLoaded) {
    return (
      <Button disabled variant={variant} className={className}>
         <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        Processing...
      </Button>
    );
  }

  return (
    <Button
      onClick={() => {
        console.log('🖱️ Button clicked!');
        handlePayment();
      }}
      variant={variant}
      className={className}
    >
      {children}
    </Button>
  );
};

export default PaymentButton;
