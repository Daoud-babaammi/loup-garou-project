import React from 'react';
import { Route, Routes } from "react-router-dom";
import './App.css';
import { RolesCard } from './components/RolesCard';
import { Home } from './view/Home/Home';
import { Game } from './view/Games/Game';
import { useSelector } from 'react-redux';
import { isNightSelector, roleSelector } from './store/selectore/application';
import BackgroundSwitcher from './components/BackgroundSwitcher/BackgroundSwitcher';


export function App( ) {
  const role = useSelector(roleSelector);
  const isNight = useSelector(isNightSelector);

  return (
    <div className="Game background" >
      <BackgroundSwitcher isNight={isNight}/>
      <RolesCard roleName={role} />
      <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/game/:idGame" element={<Game/>} />
      </Routes>
    </div>
  );
}


