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
  }, [user, productId, children]);

  const handlePayment = async () => {
    if (!isLoaded) {
      return;
    }

    if (!user) {
      navigate('/login');
      return;
    }

    try {
      // First check if the backend is responding
      const debugResponse = await fetch('/api/v1/polar/debug', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${await getToken()}`,
        },
      });

      const debugData = await debugResponse.json();

      if (!debugData.polarAccessTokenExists || debugData.polarAccessTokenLength < 10) {
        alert('❌ Polar not configured properly. Click "Test Polar Setup" first to see the issue.');
        return;
      }

      // Redirect to Polar checkout - use the productId prop
      const response = await fetch(`/api/v1/polar/checkout?products=${productId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${await getToken()}`,
        },
      });

      if (response.redirected) {
        window.location.href = response.url;
      } else {
        const data = await response.json();
        if (data.checkout?.url) {
          window.location.href = data.checkout.url;
        } else {
          alert('Failed to initiate checkout. Check console for details.');
        }
      }
    } catch (error) {
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
