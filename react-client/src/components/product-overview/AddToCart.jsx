import React, { useState, useEffect } from 'react';
import header from '../../../../config.js';
import axios from 'axios';
import Select from 'react-select';

export default function AddToCart(props) {

  // last todos on this component i think: test out of stock conditional renders with the following product, and make react-select tags look less weird with css
  // https://app-hrsei-api.herokuapp.com/api/fec2/hr-lax/products/16392/styles
  // style_id: 85741
  // sku_id: 496214

  const { selectedProduct, selectedStyle, styles, getStyleName } = props;
  const [size, selectSize] = useState('');
  const [qty, selectQty] = useState(1);
  const [sizeMenuOpen, toggleSizeMenu] = useState(false);
  const [qtyMenuOpen, toggleQtyMenu] = useState(false);
  const [outOfStock, warning] = useState(false);
  const [message, changeMessage] = useState('');

  function getQtyOrEntireSKU(sku = null) {
    // find selected style id in the styles-options array
    for (let option of styles) {
      if (option.style_id === selectedStyle) {
        for (let each in option.skus) {
          // find currently selected size of the style
          if (option.skus[each].size === size) {
            // use that quantity
            return sku ? each : option.skus[each].quantity;
          }
        }
      }
    }
  }

  const getSizeOptions = () => {
    let sizeOptions = [];

    // find selected style id in the styles-options array
    for (let option of styles) {
      if (option.style_id === selectedStyle) {
        // when found, use the size property of the objects in the option's skus array to populate options
        if (Object.keys(option.skus).length) {
          if (outOfStock === true) {
            warning(false);
            changeMessage('');
          }
          for (let each in option.skus) {
            // only sizes that are currently in stock for the style selected should be listed
            if (option.skus[each].quantity > 0) {
              let o = option.skus[each].size
              sizeOptions.push({ value: o, label: o });
            }
          }
        } else {
          if (outOfStock === false) {
            warning(true);
            changeMessage('OUT OF STOCK');
          }
        }
      }
    }
    return sizeOptions
  }

  const getQtyOptions = () => {
    let qtyOptions = getQtyOrEntireSKU()

    // hard limit 15
    if (qtyOptions > 15) {
      qtyOptions = 15
    };

    let options = [];
    for (let i = 1; i <= qtyOptions; i++) {
      options.push({ value: Number(i), label: String(i) })
    }

    return options

  }


  const pleaseSelectSize = () => {
    toggleSizeMenu(true);
    changeMessage('Please select a size.')
  }

  const add = () => {
    // If both a valid size and valid quantity are selected: Clicking this button will add the product to the user’s cart.
    if (size === '') {
      pleaseSelectSize();
    } else if (qty > 0) {
      let cart = {
        sku_id: Number(getQtyOrEntireSKU('sku')),
      };
      axios.post('https://app-hrsei-api.herokuapp.com/api/fec2/hr-lax/cart', cart, header)
        .then(() => {
          axios.get('https://app-hrsei-api.herokuapp.com/api/fec2/hr-lax/cart', header)
            .then((result) => {
              console.log('cart:', result.data);
            })
        })
        .catch((err) => {
          console.error(err)
        })
      alert(`Added (${qty}) size ${size} ${selectedProduct.name} in ${getStyleName()} to cart!`)
    }
  }

  const handleSizeSelect = (sizeOption) => {
    selectSize(sizeOption.value);
    selectQty(1);
    toggleSizeMenu(false);
    changeMessage('');
  }

  const handleQtySelect = (qtyOption) => {
    selectQty(qtyOption.value);
    toggleQtyMenu(false);
  }

  return (
    <div className='add-to-cart'>
      {styles.length && selectedStyle !== 0 && selectedProduct ?
        <div style={{ display: 'flex', flexDirection: 'column' }}>

          <span className='add-to-cart-message'>{message}</span>
          <div style={{ display: 'flex', flexFlow: 'row-nowrap', }}>

            {/* size dropdown should become inactive and read OUT OF STOCK when there's no stock */}
            <Select
              id='size-selector'
              onFocus={() => toggleSizeMenu(true)}
              blurInputOnSelect={true}
              onChange={handleSizeSelect}
              disabled={outOfStock}
              options={getSizeOptions()}
              placeholder={outOfStock ? 'OUT OF STOCK' : 'SELECT SIZE'}
              menuIsOpen={sizeMenuOpen}
              isSearchable={false}
            >
            </Select>

            {/* qty dropdown is disabled until a size is selected*/}
            <Select
              id='qty-selector'
              onFocus={() => toggleQtyMenu(true)}
              blurInputOnSelect={true}
              onChange={handleQtySelect}
              disabled={size === '' ? true : false}
              options={getQtyOptions()}
              placeholder={size === '' ? '-' : null}
            >
            </Select>

          </div>
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            {/* add to cart button should be hidden when there's no stock */}
            {outOfStock ? null : <button className='add-to-cart-button' onClick={() => add()}><span>ADD TO BAG</span><span>+</span></button>}
            {/* no idea what this button is but its on the mock */}
            <button className='favorite-button'>☆</button>
          </div>
        </div>
        : null}
    </div>
  )
}


