import React, { useState } from 'react'
import { SelectedPlayer } from '../SelectedPlayer'
import "./SelectedPotion.css"

export default function SelectedPotion({ players, onSubmit, playerDead}) {
  const [actionSelected, setActionSelected] = useState("")

  return (
    <>
        {actionSelected !== "kill" ? (<div className="SelectedPotion">
            <div className="SelectedPotion__header">
                <h2>Choisier un Potion</h2>
            </div>
            <div className="SelectedPotion__actions">
                <button onClick={() => onSubmit("heal", playerDead)}>Potion de soin</button>
                <button onClick={() => setActionSelected("kill")}>Potion de mort</button>
            </div>
        </div>): (<SelectedPlayer title="Qui voulez vous tuer" players={players} onSubmit={(UserSelected) => onSubmit("kill", UserSelected[0])} nbSelected={1}/>)}
    </>
  )
}
