import React from 'react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import {
  render, fireEvent, waitFor, screen, getByText,
} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import ReviewsTest from '../react-client/src/components/Reviews/ReviewsTest.jsx';
import handlers from './msw/handlers.js';
import axios from 'axios'

const server = setupServer(...handlers);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test('it should render a review body', async () => {
  const { container, getByText } = render(<ReviewsTest />)

  await waitFor(() => {
    expect(getByText('Comfortable and practical.')).toBeInTheDocument()
  })
})