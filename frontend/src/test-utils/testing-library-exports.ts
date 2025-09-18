// This file re-exports testing utilities to maintain compatibility with React 19
import { render } from '@testing-library/react';
import * as testingLibraryDom from '@testing-library/dom';

// Re-export DOM testing library utilities
export const { 
  screen, 
  fireEvent, 
  waitFor,
  within,
  // Add any other utilities you need
} = testingLibraryDom;

// Re-export render from React testing library
export { render };