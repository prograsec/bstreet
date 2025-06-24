"use client";
// ^-- This directive tells Next.js that this component runs on the client side only
//     This is required because we're using React hooks and browser-specific APIs

import superjson from "superjson";
// Import QueryClient type for TypeScript typing
import type { QueryClient } from "@tanstack/react-query";
// Import QueryClientProvider to wrap our app with React Query functionality
import { QueryClientProvider } from "@tanstack/react-query";
// Import TRPC client creation function and HTTP batch link for efficient request batching
import { createTRPCClient, httpBatchLink } from "@trpc/client";
// Import function to create TRPC React context with hooks
import { createTRPCContext } from "@trpc/tanstack-react-query";
// Import React's useState hook for component state management
import { useState } from "react";
// Import our custom query client factory function
import { makeQueryClient } from "./query-client";
// Import the AppRouter type that defines all our TRPC procedures
import type { AppRouter } from "./routers/_app";

// Create TRPC context with React hooks - this gives us useTRPC hook and TRPCProvider
// The AppRouter type ensures type safety for all our API calls
export const { TRPCProvider, useTRPC } = createTRPCContext<AppRouter>();

// Global variable to store the query client in the browser
// This prevents creating multiple query clients during React's re-renders
let browserQueryClient: QueryClient;

// Function to get or create a query client
function getQueryClient() {
  // Check if we're running on the server (during SSR)
  if (typeof window === "undefined") {
    // Server: always make a new query client for each request
    // This prevents data leakage between different user requests
    return makeQueryClient();
  }
  // Browser: make a new query client only if we don't already have one
  // This is very important, so we don't re-make a new client if React
  // suspends during the initial render. This may not be needed if we
  // have a suspense boundary BELOW the creation of the query client
  if (!browserQueryClient) browserQueryClient = makeQueryClient();
  return browserQueryClient;
}

// Function to determine the correct URL for TRPC API calls
function getUrl() {
  // Determine the base URL depending on environment
  const base = (() => {
    // If running in browser, use relative URLs (empty string)
    if (typeof window !== "undefined") return "";
    // If running on server, use the full URL from environment variable
    return process.env.NEXT_PUBLIC_APP_URL;
  })();
  // Return the complete TRPC API endpoint URL
  return `${base}/api/trpc`;
}

// Main TRPC React Provider component that wraps the entire app
export function TRPCReactProvider(
  props: Readonly<{
    children: React.ReactNode; // The child components to wrap
  }>
) {
  // NOTE: Avoid useState when initializing the query client if you don't
  //       have a suspense boundary between this and the code that may
  //       suspend because React will throw away the client on the initial
  //       render if it suspends and there is no boundary

  // Get the query client (either existing browser client or new server client)
  const queryClient = getQueryClient();

  // Create TRPC client with useState to ensure it's only created once per component lifecycle
  const [trpcClient] = useState(() =>
    // Create the actual TRPC client with our AppRouter type for full type safety
    createTRPCClient<AppRouter>({
      links: [
        // Use HTTP batch link to group multiple requests into single HTTP calls for better performance
        httpBatchLink({
          transformer: superjson, // Uncomment if you use a data transformer for Date, BigInt, etc.
          url: getUrl(), // Use our URL function to get the correct API endpoint
        }),
      ],
    })
  );

  // Return the provider hierarchy: QueryClient -> TRPC -> Children
  return (
    // Provide React Query client to all child components
    <QueryClientProvider client={queryClient}>
      {/* Provide TRPC client and query client to all child components */}
      <TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
        {props.children}
      </TRPCProvider>
    </QueryClientProvider>
  );
}
