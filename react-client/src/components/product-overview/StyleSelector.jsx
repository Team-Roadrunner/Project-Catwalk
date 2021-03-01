import React, { useState, useEffect } from 'react';
import axios from 'axios';
import header from '../../../../config.js';
import AddToCart from './AddToCart.jsx';

function StyleSelector(props) {

  const { selectedProduct, selectedStyle, selectStyle, updatePrice, updateSale, updatePhotos, selectPhoto } = props;

  const [styles, updateStyles] = useState([]);

  const getStyles = (id) => {
    axios.get(`https://app-hrsei-api.herokuapp.com/api/fec2/hr-lax/products/${id}/styles`, header)
      .then((res) => {
        updateStyles(res.data.results);
        updatePhotos(res.data.results[0].photos);

        // By default, the style selected will be the first in the list
        let def = res.data.results[0];
        handleSelect(def.style_id, def.original_price, def.sale_price, def.photos[0].url);
      })
      .catch((err) => {
        console.error(err)
      })
  };

  const handleSelect = (styleID, price, sale, photo, shouldGetPhotos = false) => {
    selectStyle(styleID);
    updatePrice(price);
    updateSale(sale);
    selectPhoto(photo);
    if (shouldGetPhotos) {
      let photos = [];
      if (styles.length) {
        for (let style of styles) {
          if (style.style_id === styleID) {
            for (let photo of style.photos) {
              photos.push(photo)
            }
          }
        }
      }
      updatePhotos(photos);
    }

  }

  useEffect(() => {
    if (selectedProduct !== null) {
      getStyles(selectedProduct.id)
    }
  }, [selectedProduct])

  // buttons do render from their thumbnail_image props but this css still needs a lot of work
  const makeButtonCSS = (thumbnail) => {
    return {
      border: '2px solid black',
      width: 50,
      height: 50,
      marginRight: 5,
      borderRadius: '50%',
      backgroundImage: `url(${thumbnail})`,
      backgroundSize: 'contain',
    }
  }


  const getNameOfSelectedStyle = (uppercase = null) => {
    for (let option of styles) {
      if (option.style_id === selectedStyle) {
        return uppercase ? option.name.toUpperCase() : option.name
      }
    }
  }

  return (
    <div className='style-selector'>
      {styles.length ?
        <div>
          <div style={{ display: 'flex', flexDirection: 'row', fontSize: 16 }}>
            <span style={{ fontWeight: 'bold', marginRight: 5 }}>STYLE ></span>
            <span>{getNameOfSelectedStyle('uppercase')}</span>
          </div>

          <div className='style-options-container'
            // first time using 'grid', 'template columns' and 'auto rows' - will come back to this
            // for some reason this grid css only works inline, not when i move it to css file??
            style={{ width: 200, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gridAutoRows: 60 }}>
            {styles.map((option, index) => {
              return <div key={index}>

                <div className='checkmark' id={selectedStyle === option.style_id ? 'on' : 'off'}>✔</div>

                <button key={index}
                  className='style-option-button'
                  style={makeButtonCSS(option.photos[0].thumbnail_url)}
                  onClick={() => handleSelect(option.style_id, option.original_price, option.sale_price, option.photos[0].url, true)}>
                </button>
              </div>
            })}
          </div>
          <AddToCart selectedProduct={selectedProduct} selectedStyle={selectedStyle} styles={styles} getStyleName={getNameOfSelectedStyle} />
        </div>
        : null
      }
    </div >
  )
}

export default StyleSelector;