import React, { useState } from 'react'
import { getImagesRoles } from '../../helper/image'
import './index.css'

export function RolesCard({ roleName }) {
  const [isHidden, setIsHidden] = useState(true);
  
  const afficheHandler = () => {
    setIsHidden(!isHidden)
  }

  return (
    <div className="Card" onClick={afficheHandler} >
        {isHidden? <button>Afficher</button>: <img src={getImagesRoles(roleName)} className='Card__roleImage' alt={`Role de utilisateur ${roleName}`} />}
    </div>  
  )
}
