import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AppWrap, MotionWrap } from '../../wrapper';
import Modal from 'react-modal';
import { Tooltip } from 'react-tooltip';
import { Typewriter } from 'react-simple-typewriter'; // Import Typewriter

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

import './About.scss';
import client from '../../client';
import { urlFor } from '../../client';

Modal.setAppElement('#root');

const About = () => {
  const [abouts, setAbouts] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const query =
      '*[_type == "about"]{title, description, imgUrl, certificates}';

    client.fetch(query).then((data) => {
      console.log('Fetched data:', data);
      setAbouts(data);
    });
  }, []);

  const handleImageClick = (imgUrl) => {
    setSelectedImage(imgUrl);
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
  };

  return (
    <div className="about__header">
      {/* Implementing the typewriter effect */}
      <h1>
        <Typewriter
          words={["I'm A Creative.", "I'm A Designer.", "I'm A Developer."]}
          loop={Infinity}
          cursor
          cursorStyle="_"
          typeSpeed={70}
          deleteSpeed={50}
          delaySpeed={1000}
        />
      </h1>
      <p>
        A small river named Duden flows by their place and supplies it with the
        necessary regalia...
      </p>

      <div>
        {abouts.map((about, index) => (
          <motion.div
            whileHover={{
              y: -10,
              rotate: 10,
              scale: 1.05,
            }}
            whileTap={{
              scaleX: -1,
              rotate: 10,
              y: -10,
            }}
            animate="visible"
            style={{ cursor: 'pointer' }}
            initial="hidden"
            transition={{ duration: 0.5, type: 'tween' }}
            key={about.title + index}
          >
            <button className="contact-button">Contact Me!</button>
          </motion.div>
        ))}
      </div>

      <div className="app__profiles">
        {abouts.map((about, index) => (
          <div key={about.title + index} className="app__profile-item">
            {about.imgUrl && (
              <img src={urlFor(about.imgUrl)} alt={about.title} />
            )}

            <div className="app__profile-text">
              <h2 className="bold-text">{about.title}</h2>
              <p className="p-text">{about.description}</p>

              <h3 className="bold-text">My Certifications</h3>

              <div className="app__certificates">
                {about.certificates?.map((certificate, certIndex) => (
                  <React.Fragment key={certificate.title + certIndex}>
                    <motion.div
                      whileInView={{ opacity: 1 }}
                      whileHover={{ scale: 1.05 }}
                      transition={{ duration: 0.5, type: 'tween' }}
                      className="app__certificate-item"
                      data-tooltip-id={`certificate-tooltip-${certIndex}`}
                      data-tooltip-content={certificate.description}
                    >
                      {certificate.imgUrl && (
                        <img
                          src={urlFor(certificate.imgUrl)}
                          alt={certificate.title}
                          className="app__certificate-img"
                          onClick={() =>
                            handleImageClick(urlFor(certificate.imgUrl))
                          }
                        />
                      )}
                    </motion.div>
                    <Tooltip
                      id={`certificate-tooltip-${certIndex}`}
                      effect="solid"
                      arrowColor="#fff"
                      className="certificate-tooltip"
                    />
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={!!selectedImage}
        onRequestClose={handleCloseModal}
        className="modal"
        overlayClassName="modal-overlay"
      >
        <button onClick={handleCloseModal} className="modal-close">
          <FontAwesomeIcon icon={faTimes} />
        </button>
        <img
          src={selectedImage}
          alt="Enlarged Certificate"
          className="modal-image"
        />
      </Modal>
    </div>
  );
};

export default AppWrap(
  MotionWrap(About, 'app__about'),
  'about',
  'app__whitebg'
);
