export const gameInfo = async ({idGame, idPlayer}) => {
    const data = await fetch(`http://localhost:3001/game/${idGame}/${idPlayer}/gameInfo`)

    const json = await data.json();

    return json;
}

export const startGame = async ({idGame, idPlayer}) => {
    const data = await fetch(`http://localhost:3001/game/${idGame}/${idPlayer}/start`,{
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ idGame, idPlayer }),
    })

    const json = await data.json();

    return json;
}

export const voteFor = async ({idGame, idPlayer}, params) => {
    const data = await fetch(`http://localhost:3001/game/${idGame}/${idPlayer}/vote`,{
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ params }),
    })

    const json = await data.json();

    return json;
}