import {Link} from "react-router-dom";
import "./platformHeader.sass"

import logo from "assets/logo/Logo.png"
import {useAuth} from "hooks/useAuth";
import { BackUrlForDoc} from "constants/global";
import img from "assets/user-interface/user_image.png";
import {useSelector} from "react-redux";


const PlatformHeader = ({setMenuActive,menuActive}) => {

    const {name,surname,id} = useAuth()
    const {profile_photo} = useSelector(state => state.me)

    const activedMenu = menuActive ?  "menu-logo menu-logo_active": "menu-logo"

    const userImg = profile_photo ? `${BackUrlForDoc}${profile_photo}` : null

    return (
        <div className="appHeader">
            <div>
                <div className={activedMenu} onClick={()=> setMenuActive(!menuActive)}>
                    <div className="menu-logo__wrapper">
                        <span className="menu-logo__item" />
                        <span className="menu-logo__item" />
                        <span className="menu-logo__item" />
                    </div>
                </div>
                <div className="logo">
                    <img  src={logo} alt="Logo"/>
                    <span>Gennis</span>
                </div>
            </div>
            <div>
                <div className="user">
                    <div className="user__info programmer">
                        <span>{surname}</span>
                        <span>{name}</span>
                    </div>

                    <div className="user__img">
                        <Link to={`me/${id}`}>
                            <img src={userImg ? userImg : img} alt=""/>
                        </Link>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default PlatformHeader