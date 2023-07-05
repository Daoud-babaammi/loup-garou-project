import React from 'react'
import './SalleAttend.css'
import { startGame } from '../../service/game'
import { getUserImage } from '../../helper/image'

export function SalleAttend({ listPlayer, gameInfo, isLaunchable }) {
  let list = [...listPlayer]
  
  for(let i = list.length; i <= 8; i++){
      list.push({id: "undefined", name: "... place pour un autre jouer"})
  }

  const start = async () => {
    const data = await startGame(gameInfo);

    if(data.code === 400){
      alert("error : ", data.message);
    }
  }

  return (
    <div className='salleAttend'>
        <div className='salleAttend__header'>
          <h2>List des jouer :</h2>
        </div>
        <ul className='salleAttend__listUser'>
            {list && list.map(value => (
              <li className='CardAttend'>
                  <div className='CardAttend__image' >
                    <img src={getUserImage(value.imageUser+ "")} alt="profil user"/>
                  </div>
                  <div className='CardAttend__title'>
                    <p>{value.name}</p>
                  </div>
              </li>
            ))}
        </ul>
        <div className='salleAttend__startGame'>
          {isLaunchable? <button onClick={start}>Start Game</button>: <div><p>il faut etre 5 au minimum et le createur de la partie</p></div>}
        </div>
    </div>
  )
}
