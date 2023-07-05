import React, {useState} from 'react'
import { useQuery } from 'react-query'
import { gameInfo, voteFor } from '../../service/game'
import { useParams } from 'react-router-dom'
import { getIdPlayer } from '../../helper/user';
import { SalleAttend } from '../SalleAttend/SalleAttend';
import { useDispatch, useSelector } from 'react-redux';
import { isNightSelector, roleSelector } from '../../store/selectore/application';
import { changeNight, setRole } from '../../store/slice/application';
import { SelectedPlayer } from '../../components/SelectedPlayer';
import { launchActions } from '../../service/actions';
import SelectedPotion from '../../components/SelectedPotion';
import "./Game.css"


export function Game() {
  const { idGame } = useParams();
  const idPlayer = getIdPlayer();
  const isNight = useSelector(isNightSelector);
  const role = useSelector(roleSelector);
  const [revealedRole, setRevealedRole] = useState(null);
  const dispatch = useDispatch();

  const {isError, isLoading, error, data, refetch} = useQuery({queryKey:["GameInfo"], queryFn: () => gameInfo({idGame, idPlayer}), refetchInterval: 5000})

  
  if (isLoading){
    return <div className="loading">...loading</div>
  }
  
  
  if (isError){
    return <div>{error.message}</div>
  }

  if(data.isStart && data.isNight !== isNight){
    dispatch(changeNight())
  }
  
  if(data.isStart && data.user.role !== role){
    dispatch(setRole(data.user.role))
  }

  if(data.status === 'Salle_Attend'){
    return (<SalleAttend listPlayer={data.listPlayer} gameInfo={{ idGame, idPlayer }} isLaunchable={data.isLaunchable && data.isStableBy}/>);
  }

  if(data.youTurn && data.status === 'Tour_Du_LoupGarou'){
    const player = data.listPlayer.filter(value => value.isAlive === true && value.id !== idPlayer);

    const onSubmit = async (userSelected) => {
      const params = {
        targetPlayerId: userSelected[0]
      }

      const data = await launchActions(params, {idGame, idPlayer, actions: "loupgarou"})

      if(data.code === 200){
        refetch();
      }

      return data;
    }

    return <SelectedPlayer title={"Qui vouler vous tuer"} players={player} nbSelected={1} onSubmit={onSubmit}/>
  }

  if (data.youTurn && data.status === 'Tour_De_La_Sorciers'){
    const players = data.listPlayer.filter(value => value.isAlive === true && value.id !== idPlayer);
    const onSubmit = async (action, selectedPlayerId) =>{
        const params = {
          targetPlayerId: selectedPlayerId,
          action
        }

        const data = await launchActions(params, {idGame, idPlayer, actions: "sorcier"})

        if(data.code === 200){
          refetch();
        }

        return data
    }

    return <SelectedPotion players={players} onSubmit={onSubmit}/>
  }

  if (data.youTurn && data.status === 'Tour_Des_Delibiration'){
    const player = data.listPlayer.filter(value => value.isAlive === true && value.id !== idPlayer);

    const onSubmit = async (userSelected) => {
      const params = {
        voteFor: userSelected[0]
      }

      const data = await voteFor({idGame, idPlayer}, params)

      if(data.code === 200){
        refetch();
      }

      return data;
    }

    return <SelectedPlayer title={"Pour qui voter vous ?"} players={player} nbSelected={1} onSubmit={onSubmit}/>
  }

  if (data.youTurn && data.status === 'Tour_Du_Chasseur'){
      const player = data.listPlayer.filter(value => value.isAlive === true && value.id !== idPlayer);

      const onSubmit = async (userSelected) => {
        const params = {
          targetPlayerId: userSelected[0]
        }

      const data = await launchActions(params, {idGame, idPlayer, actions: "chasseur"})

      if(data.code === 200){
        refetch();
      }

      return data;
    }

    return <SelectedPlayer title={"Qui vouler vous amener avec vous dans mort"} players={player} nbSelected={1} onSubmit={onSubmit}/>
  }

  if (data.youTurn && data.status === 'Tour_De_Cupidon'){
    const players = data.listPlayer.filter(value => value.isAlive)

    const onSubmit = async (userSelected) =>{
        const params = {
          firstLoverId: userSelected[0],
          secondLoverId: userSelected[1]
        }

        const data = await launchActions(params, {idGame, idPlayer, actions: "cupidon"})

        if(data.code === 200){
          refetch();
        }

        return data
    }

    return <SelectedPlayer title="Qui voulais vous marier ?" players={players} nbSelected={2} onSubmit={onSubmit}/>
  }

  if (data.status === 'Game_Win_Villageois'){
    return (
      <div className="resultWrapper">
          <h1>Victoire des villageois</h1>
      </div>
    )
}

if (data.status === 'Game_Win_LoupGarou'){
  return (
    <div className="resultWrapper">
      <h1>Victoire des loups-garous</h1>
    </div>
  )
}

  if (data.youTurn && data.status === 'Tour_De_La_Voyants'){
    
    const players = data.listPlayer.filter(value => value.isAlive === true && value.id !== idPlayer);

    const onSubmit = async (userSelected) => {
      const params = {
        targetPlayerId: userSelected[0]
      }
  
      const data = await launchActions(params, {idGame, idPlayer, actions: "voyants"})
  
      if(data.code === 200){
        setRevealedRole(data.role);
      }

      return data
    }

    if (revealedRole) {
      return (
        <div className="resultWrapper">
          <h2 className="revealedRole">Le rôle du joueur sélectionné est {revealedRole}.</h2>
        </div>
      )
  }

    return (
      <SelectedPlayer
      title={"Qui voulez-vous inspecter?"}
      players={players}
      nbSelected={1}
      onSubmit={onSubmit}
    />
    )
  }

  return (
    <></>
  )
}
