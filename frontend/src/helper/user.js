export const setIdPlayer = (idPlayer) => {
    try{
        localStorage.setItem("idPlayer", idPlayer);
        return true
    }catch{
        return false
    }
}

export const getIdPlayer = () => {
    try {
        const idPlayer = localStorage.getItem('idPlayer');
        return idPlayer;
    } catch (err) {
        console.error(err)
        return "";
    }
}