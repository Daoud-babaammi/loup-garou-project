import React from 'react'
import './PlayerCard.css'
import { getUserImage } from '../../helper/image'

export function PlayerCard({ onClick, userInfo, isSelected}) {
  console.log(userInfo)
  return (
    <li className={`CardUserSelected ${isSelected ? "CardUserSelected--selected" : ""}`} onClick={onClick}>
        <img src={getUserImage(userInfo.imageUser)} alt='profil user'/>
        <p>{userInfo.name}</p>
    </li>
  )
}
