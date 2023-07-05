export const launchActions = async (body, {idGame, idPlayer, actions}) => {
    const data = await fetch(`http://localhost:3001/game/action/${idGame}/${idPlayer}/${actions} `, {
        method:"POST",
        headers:{
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    })

    const json = await data.json()

    return json;
}

