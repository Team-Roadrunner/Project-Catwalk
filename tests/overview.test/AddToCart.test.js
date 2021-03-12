import React from 'react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import {
  render, getByPlaceholderText, waitFor, screen, getByText, getByRole
} from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import axios from 'axios';
import userEvent from '@testing-library/user-event';
import handlers from '../msw/handlers.js';
import AddToCart from '../../react-client/src/components/product-overview/AddToCart.jsx';

const server = setupServer(...handlers);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

// AddToCart props -
// product (object),
// selectedStyle (style id num),
// styleOptions (array of styles, each has an associated 'skus' object)

describe('add to cart module', () => {
  describe('dropdown behavior', () => {
    test('if there is no stock, the size dropdown should be disabled and read OUT OF STOCK', async () => {

      const product = await axios.get('/api/shared/products/').then(data => data.data);
      const styles = await axios.get('/api/products/16060/styles').then(data => data.data);

      render(<AddToCart product={product} styleOptions={styles} selectedStyle={1} />);

      // need to figure out how to test react-select tags for their disabled property

    });
    test('if there is no size selected, the qty dropdown should be disabled and read -', async () => {

    });
    test('whenever a size is selected, the qty dropdown should default/reset to 1', async () => {

    });
    test('whenever a new style or product is selected, both dropdowns should return to their default states', async () => {

    });
  });
  describe('the add to cart button', () => {
    test('should be hidden if there is no stock', async () => {
    });
    test('on click, if no size is selected, the size dropdown should open automatically and a message should appear', async () => {
    });
    test('on click, if a valid size and qty are selected, a post request should be sent to the cart API and an alert should appear', async () => {
    });
  });
});