import React from 'react';
import { createRoot } from 'react-dom/client';
import { CommandCenterPage } from './CommandCenterPage';

const root = document.getElementById('root');
if (root) {
  createRoot(root).render(<CommandCenterPage />);
}
