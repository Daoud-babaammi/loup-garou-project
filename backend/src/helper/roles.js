const { rolesDefault } = require("../constant/role");

exports.rolesRepartiteur = (game) => {
    const { players } = game;
    let selectRoles = rolesDefault.slice(0, players.length)
    console.log(selectRoles)
    const playersAddsRoles = players.map((value, index) => {
        const nb = (Math.random() * (players.length - index))
        const role = selectRoles[parseInt(nb)]
        selectRoles = selectRoles.filter(value => value != role);

        if(role === "Sorciere"){
            return {
                ...value,
                role,
                isHealingUsable: true,
                isKillingUsable: true,
            }
        }

        return {
            ...value,
            role
        }
    })
    console.log(playersAddsRoles);
    return { ...game, players: playersAddsRoles}
}

exports.checkLinkedUser = (players, lastPlayerKilledId) =>{
    return players.map(value => {
        if(value.loverId == lastPlayerKilledId){
            return {
                ...value,
                isAlive: false,
            }
        }
        return value
    })
}

exports.getRoleByStatus = (status) => {
    switch(status){
        case "Tour_De_La_Sorciers":
            return "Sorciere"
        case "Tour_Des_Delibiration":
            return "All";
        case "Tour_Du_Chasseur":
            return "Chasseur"
        case "Tour_De_Cupidon":
            return "Cupidon"
        case "Tour_De_La_Voyants":
            return "Voyante"
        case "Tour_Du_LoupGarou":
            return "LoupGarou"
    }
} 