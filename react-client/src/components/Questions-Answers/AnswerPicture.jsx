import React, { useState } from 'react';
import Modal from 'react-modal';

const AnswerPicture = (props) => {
  const [currentPic, setCurrentPic] = useState([]);
  const [photoClicked, setClicked] = useState(false);

  const selectedPhoto = (image) => {
    setCurrentPic(image);
    setClicked(!photoClicked);
  };

  const correct = () => currentPic.url;

  return (
    <div widgetName="QA" style={{ paddingLeft: '30px' }}>
      {props.answer.photos.length > 0 ? (
        <div className="answerImages">
          {props.answer.photos.map((image, index) => (
            <div widgetName="QA" key={index}>
              <Modal
                ariaHideApp={false}
                isOpen={photoClicked}
                className="ModalStyle"
                overlayClassName="ModalOverlay"
                onRequestClose={() => setClicked(!photoClicked)}
                contentLabel="Example Modal"
              >
                <button widgetName="QA" className="buttonModal" onClick={() => { setClicked(!photoClicked); }}>X</button>
                <img widgetName="QA" className="imgModal" src={correct(image)} alt="" key={index} />

              </Modal>
              <img widgetName="QA" onClick={() => { selectedPhoto(image); }} className="img" src={image.url} alt="" key={index} />
            </div>
          ))}
        </div>
      )
        : null}
    </div>

  );
};

export default AnswerPicture;
