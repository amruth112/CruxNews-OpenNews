import React from 'react';
import { StoreProvider } from './stores/newsStore';
import { Layout } from './components/layout/Layout';
import { StoryFeed } from './components/home/StoryFeed';

export default function App() {
  return (
    <React.StrictMode>
      <StoreProvider>
        <Layout>
          {/* Currently we just render the home view which handles switching to StoryRoom dynamically based on selectedClusterId */}
          <div className="w-full h-full">
            <StoryFeed />
          </div>
        </Layout>
      </StoreProvider>
    </React.StrictMode>
  );
}
