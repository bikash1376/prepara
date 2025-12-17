import express from 'express';
import { Checkout, CustomerPortal, Webhooks } from "@polar-sh/express";
import polar from '../config/polarClient.js';
import User from '../models/User.js';

const router = express.Router();

// Debug route to check environment variables
router.get('/debug', (req, res) => {
  res.json({
    polarAccessTokenExists: !!process.env.POLAR_ACCESS_TOKEN,
    polarWebhookSecretExists: !!process.env.POLAR_WEBHOOK_SECRET,
    polarEnv: process.env.POLAR_ENV,
    frontendUrl: process.env.FRONTEND_URL,
    // Don't expose the actual tokens for security
    polarAccessTokenLength: process.env.POLAR_ACCESS_TOKEN?.length || 0,
    polarWebhookSecretLength: process.env.POLAR_WEBHOOK_SECRET?.length || 0,
  });
});

// Checkout route - initiate payment
router.get('/checkout', (req, res, next) => {
  // console.log('Polar checkout called with products:', req.query.products);
  // console.log('Environment:', process.env.POLAR_ENV);
  // console.log('Access token exists:', !!process.env.POLAR_ACCESS_TOKEN);
  // console.log('Access token length:', process.env.POLAR_ACCESS_TOKEN?.length || 0);

  if (!process.env.POLAR_ACCESS_TOKEN || process.env.POLAR_ACCESS_TOKEN === 'your_polar_access_token_here') {
    return res.status(500).json({
      error: 'Polar access token not configured',
      message: 'Please set POLAR_ACCESS_TOKEN in your .env file'
    });
  }

  Checkout({
    accessToken: process.env.POLAR_ACCESS_TOKEN,
    successUrl: `${process.env.FRONTEND_URL}/payment/success?checkout_id={CHECKOUT_ID}`,
    server: process.env.POLAR_ENV === "sandbox" ? "sandbox" : "production",
    theme: "dark",
  })(req, res, next);
});

// Customer Portal route - manage subscriptions
router.get('/portal', CustomerPortal({
  accessToken: process.env.POLAR_ACCESS_TOKEN,
  server: process.env.POLAR_ENV === "sandbox" ? "sandbox" : "production",
  getCustomerId: (req) => {
    // console.log('Portal access - User:', req.user?.id, 'Polar Customer ID:', req.user?.polarCustomerId);
    // Get Polar customer ID from authenticated user
    return req.user?.polarCustomerId;
  },
}));

// Webhook handler - receive Polar events
router.post('/webhooks', Webhooks({
  webhookSecret: process.env.POLAR_WEBHOOK_SECRET,
  onPayload: async (payload) => {
    // console.log("Polar webhook received:", payload.type, payload.data);

    // Handle different webhook events
    switch (payload.type) {
      case 'checkout.created':
        await handleCheckoutCreated(payload.data);
        break;
      case 'order.paid':
        await handleOrderPaid(payload.data);
        break;
      case 'subscription.created':
        await handleSubscriptionCreated(payload.data);
        break;
      case 'subscription.canceled':
        await handleSubscriptionCanceled(payload.data);
        break;
      default:
        // console.log("Unhandled webhook type:", payload.type);
    }
  },
}));

// Helper functions for webhook handling
async function handleCheckoutCreated(checkout) {
  // console.log("Checkout created:", checkout.id);

  // You can store checkout information if needed
  // This is useful for tracking pending payments
}

async function handleOrderPaid(order) {
  // console.log("Order paid:", order.id);

  // Update user's Polar customer ID if not set
  if (order.customerId && order.customerExternalId) {
    await User.findOneAndUpdate(
      { clerkId: order.customerExternalId },
      { polarCustomerId: order.customerId },
      { upsert: true }
    );
  }

  // Handle successful payment - activate features, grant access, etc.
  // This depends on your business logic
}

async function handleSubscriptionCreated(subscription) {
  // console.log("Subscription created:", subscription.id);

  // Update user's subscription status
  if (subscription.customerId) {
    // You might want to store subscription details in a separate model
    // or add subscription fields to your User model
  }
}

async function handleSubscriptionCanceled(subscription) {
  // console.log("Subscription canceled:", subscription.id);

  // Handle subscription cancellation - revoke access, etc.
  // This depends on your business logic
}

export default router;
