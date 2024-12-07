import React, { createContext, useContext } from 'react';
import { useQuery, useMutation } from 'react-query';
import { toast } from 'react-hot-toast';
import { loadStripe } from '@stripe/stripe-js';
import { payments } from '../services/api';

const SubscriptionContext = createContext(null);

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

export const SubscriptionProvider = ({ children }) => {
  // Fetch available plans
  const { data: plans, isLoading: isLoadingPlans } = useQuery(
    'plans',
    () => payments.getPlans(),
    {
      select: (data) => data.data,
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to fetch plans');
      },
    }
  );

  // Create subscription mutation
  const createSubscriptionMutation = useMutation(
    async (planId) => {
      const { data } = await payments.createSubscription(planId);
      const stripe = await stripePromise;
      return stripe.redirectToCheckout({ sessionId: data.sessionId });
    },
    {
      onError: (error) => {
        toast.error(error.response?.data?.message || 'Failed to create subscription');
      },
    }
  );

  const value = {
    plans: plans || [],
    isLoadingPlans,
    subscribe: createSubscriptionMutation.mutate,
    isSubscribing: createSubscriptionMutation.isLoading,
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};