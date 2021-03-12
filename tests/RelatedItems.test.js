import React from 'react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import {
  render, fireEvent, waitFor, screen, getByText, toBeInTheDocument
} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import RelatedItems from '../react-client/src/components/related items/RelatedItemsTest.jsx';
import handlers from './msw/handlers.js';
import axios from 'axios';

const server = setupServer(...handlers);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

const fetch = () => {
  return axios.get('/api/products/16060/styles')
  .then((results) => (results.data))
  .catch((err) => (console.log(err)))
}

test('should receive data from a get request and pass it to a component', async () => {
  const styles = await fetch();
  expect(styles.name).toEqual('Forest Green & Black');
  const { container, getByText } = render (<RelatedItems styles={styles} />);
})

test('should render name and price', async() => {
  const { container, getByText } = render(<RelatedItems />)

  await waitFor(() => {
    expect(getByText('Forest Green & Black')).toBeInTheDocument()
  })
})