import React from 'react';
import './BackgroundSwitcher.css';
import nightImage from '../../img/night.png'; 
import dayImage from '../../img/day.jpg';


const BackgroundSwitcher = ({ isNight }) => {
  return (
        <img className={"background-switcher" } src={isNight ? nightImage : dayImage} alt="background"  />
  
  );
};

export default BackgroundSwitcher;
