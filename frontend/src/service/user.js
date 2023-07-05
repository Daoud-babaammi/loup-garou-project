export const loginGame = async(body) => {
    console.log(body)

    const data = await fetch('http://localhost:3001/game/login', {
        method: "POST",
        headers:{
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    });

    const json = await data.json();

    return json;
}