export const createUser = async(username) => {
    const data = await fetch("http://localhost:8000/user/game", {
        method: "POST",
        body: JSON.parse({username})
    })

    return await data.json();
}