import loupGarou from '../img/LoupGarou.png'
import Villageois from  '../img/Villageois.png'
import Voyante from '../img/Voyante.png'
import Sorciere from '../img/Sorciere.png'
import Chasseur from '../img/Chasseur.png'
import Cupidon from '../img/Cupidon.png'
import ImageUser1 from '../img/imageuser1.png'
import ImageUser2 from '../img/imageuser2.png'
import ImageUser3 from '../img/imageuser3.png'
import ImageUser4 from '../img/imageuser4.png'
import ImageUser5 from '../img/imageuser5.png'
import ImageUser6 from '../img/imageuser6.png'
import ImageUser7 from '../img/imageuser7.png'
import ImageUser8 from '../img/imageuser8.png'

export const getImagesRoles = (role) => {
    switch (role) {
        case 'LoupGarou':
            return loupGarou
        case 'Voyante':
            return Voyante
        case 'Sorciere':
            return Sorciere;
        case 'Chasseur':
            return Chasseur;
        case 'Cupidon':
            return Cupidon;
        default:
            return Villageois;

    }
}

export const getUserImage = (index) => {
    console.log(index)
    switch (index) {
        case "2":
            return ImageUser2;
        case "3":
            return ImageUser3;
        case "4":
            return ImageUser4;
        case "5":
            return ImageUser5;
        case "6":
            return ImageUser6;
        case "7":
            return ImageUser7;
        case "8":
            return ImageUser8;
        case "1":
        default:
            return ImageUser1;
    }
} 