import React from 'react'
import './SelectedImage.css'
import { PlayerCard } from '../PlayerCard/PlayerCard'

export function SelectedImagePlayer({ selected, onSelected }) {
  const nb = ["1","2","3","4","5","6","7", "8"]
  return (
    <ul className='ListImageUser'>
        {nb && nb.map(value=>{
            return(
                <PlayerCard onClick={() => onSelected(value)} userInfo={{name: value, imageUser: value }} isSelected={value === selected} />
            )
        })}
    </ul>
  )
}
