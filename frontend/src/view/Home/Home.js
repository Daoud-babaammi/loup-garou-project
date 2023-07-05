import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { loginGame } from '../../service/user';
import { setIdPlayer } from '../../helper/user';
import "./Home.css"
import { SelectedImagePlayer } from '../../components/SelectedImageUser';
export function Home() {
  const [gameData, setGameData] = useState({ imageUser: "1"});
  const navigate = useNavigate();

  const handlerChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    setGameData(state => {
      return {
        ...state,
        [name]: value
      }
    })
  }

  const onSelected = (selected) =>{
    setGameData(state => {
      return {
        ...state,
        imageUser: selected
      }
    })
  }

  const joinGame = async () => {
    const userInfo = { playerName: gameData.username, idGame: gameData.idGame || "Null", imageUser: gameData.imageUser }

    const data = await loginGame(userInfo);

    if (data.code === 202){
      setIdPlayer(data.idPlayer)
      navigate(`/game/${data.idGame}`);
    }
  
  }

  const createGame = async () => {
      const userInfo = {
        playerName: gameData.username,
        imageUser: gameData.imageUser
      }

      const data = await loginGame(userInfo)

      if(data.code === 202){
        setIdPlayer(data.idPlayer)
        navigate(`/game/${data.idGame}`)
      }
  }

  return (
    <div className="home-container">
        <SelectedImagePlayer selected={gameData.imageUser} onSelected={onSelected} />
        <input onChange={handlerChange} name="username" id="username" placeholder="Nom du joueur"/>
        <input onChange={handlerChange} name="idGame" id="idGame" placeholder="ID de la partie"/>
        <div>
          <button onClick={createGame} >Créer une partie</button>
          <button onClick={joinGame}>Joindre une partie</button>
        </div>
    </div>
  )
}
