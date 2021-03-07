import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import header from '../../../../config.js';
import Stars from '../Reviews/Ratings/Stars.jsx';
import Carousel from 'react-elastic-carousel';
import styled from 'styled-components'

const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)',
    zIndex: 12
  }
};

function RelatedItemCard(props) {
  const [thumbnails, updateThumbnails] = useState([]);
  const [modalIsOpen, updateModalIsOpen] = useState(false);
  const [compareName, updateCompareName] = useState('');
  const [compareFeatures, updateCompareFeatures] = useState([]);

  useEffect(() => {
    let thumbnailsArr = [];
    for (let i = 0; i < props.stylesData.length; i++) {
      thumbnailsArr.push([Number(props.stylesData[i].product_id), props.stylesData[i].results[0].photos[0].thumbnail_url])
    }
    updateThumbnails(thumbnailsArr)
  }, [props.stylesData])

  let relatedFeaturesArr = props.dataArr.map(({id, name, features}) => ({id, name, features}))
  let currentFeaturesArr = [{id: props.currentProductFeatures.id, name: props.currentProductFeatures.name, features: props.currentProductFeatures.features}]
  let allFeatures = currentFeaturesArr.concat(relatedFeaturesArr)

  let getThumbnail = (id) => {
    for (let i = 0; i < thumbnails.length; i++) {
      if (id === thumbnails[i][0]) {
        return thumbnails[i][1]
      }
    }
  }

  let modalState = (e) => {
    let compFeat = []
    updateModalIsOpen(true)
    updateCompareName(e.target.name)
    for (let i = 0; i < allFeatures.length; i++) {
      if (allFeatures[i].id === Number(e.target.value)) {
        compFeat.push(allFeatures[i])
      }
    }
    updateCompareFeatures(compFeat)
  }

  if (props.stylesData.length === 0 || props.currentProductFeatures.length === 0) {
    return null
  } else {
    return (
      <div style={{display: 'flex', flexDirection: 'row'}}>
      <Carousel itemsToShow={4}>
      {props.dataArr.map((item, i) => (
        <div id="relatedItemCard" key={i}>
        {/* {console.log(item)} */}
          <img id="related-img" onClick={() => (props.selectProduct(item.id))} src={getThumbnail(item.id)} />
          <button id="star-button" name={item.name} value={item.id} onClick={modalState}>&#9734;</button>
          <div id="related-desc">
            <div id="cardCategory">{item.category}</div>
            <div id="cardName">{item.name}</div>
            <div id="cardPrice">${item.sale_price ? item.sale_price : item.default_price}</div>
            <Stars id="cardStars" avgRating={props.avgRating} />
          </div>
        </div>
      ))}
      </Carousel>
      <Modal
        ariaHideApp={false}
        isOpen={modalIsOpen}
        style={customStyles}
        onRequestClose={() => updateModalIsOpen(false)}>
        <h3 id="comparing">Comparing</h3>
        <table className="table">
          <thead>
            <tr>
              <th>{props.currentProductFeatures.name}</th>
              <th></th>
              <th>{compareName}</th>
            </tr>
          </thead>
          <tbody>
                {
                  currentFeaturesArr[0].features.map((feature, i) => (
                    <tr id="modal-features" key={i}>
                      <td id="left-checkmark">&#10004;</td>
                      <td>{feature.value ? feature.value : null} {feature.value ? feature.feature : null}</td>
                      <td></td>
                    </tr>
                  ))
                }
                {
                compareFeatures.length ?
                compareFeatures[0].features.map((feature, i) => (
                  <tr id="modal-features" key={i} >
                    <td></td>
                      <td>{feature.value ? feature.value : null} {feature.value ? feature.feature : null}</td>
                      <td id="right-checkmark">&#10004;</td>
                  </tr>
                ))
                : null
                }
          </tbody>
        </table>
        <button style={{textAlign: 'center'}} onClick={() => updateModalIsOpen(false)}>Close</button>
      </Modal>
      </div>
    )
  }
}

export default RelatedItemCard