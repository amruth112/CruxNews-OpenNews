import React from 'react';
import { StoreProvider } from './stores/newsStore';
import { ErrorBoundary } from './components/shared/ErrorBoundary';
import { Layout } from './components/layout/Layout';
import { StoryFeed } from './components/home/StoryFeed';

export default function App() {
  return (
    <React.StrictMode>
      <ErrorBoundary>
        <StoreProvider>
          <Layout>
            <div className="w-full h-full">
              <StoryFeed />
            </div>
          </Layout>
        </StoreProvider>
      </ErrorBoundary>
    </React.StrictMode>
  );
}
