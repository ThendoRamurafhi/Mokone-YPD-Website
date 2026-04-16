import React from 'react';
import logo from '../../assets/logo.png'; // adjust extension if needed

const YPDLogo = ({ width = 40, height = 40 }) => (
  <img
    src={logo}
    alt="AME YPD Logo"
    width={width}
    height={height}
    style={{ objectFit: 'contain', display: 'block' }}
  />
);

export default YPDLogo;