import React, {useCallback, useEffect, useState} from 'react';
import {Link, useNavigate, useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import DefaultLoader from "components/loader/defaultLoader/DefaultLoader";
import img from "assets/user-interface/user_image.png";

import classNames from "classnames";
import {fetchMyInfo, logout} from "slices/meSlice";

import "pages/platformContent/platformMe/platformMeProfile/platformMeProfile.sass"
import {useAuth} from "hooks/useAuth";
import {BackUrlForDoc} from "constants/global";


const PlatformMeProfile = () => {

    const {userId} = useParams()

    const dispatch = useDispatch()
    const {username} = useAuth()

    useEffect(()=> {
        dispatch(fetchMyInfo(userId))
    },[dispatch])


    const [activeOptions,setActiveOptions] = useState(false)


    const {extraInfo,meLoadingStatus,links,role,id,profile_photo} = useSelector(state => state.me)


    const handleClick = (e) => {
        if (!e.target.classList.contains("modalOptions") && activeOptions) {
            setActiveOptions(false)
        }
    }



    const renderElements = useCallback(() => {
        return (
            <div className="profile__main-item information">
                <h1>Foydalanuvchi ma'lumotlari:</h1>
                <div className="information__container">
                    <UserInfo data={extraInfo}/>
                </div>
            </div>
        )
    },[extraInfo])


    const renderLinks = useCallback(() => {
        return links.map(link => {
            return (
                <Link to={`../${link.link}/${id}/${role}`} className="option">
                    <i className={`fas ${link.iconClazz}`} />
                    <span>{link.title}</span>
                </Link>
            )
        })
    },[id, links, role])



    const renderedItems = renderElements()
    const renderedLinks = renderLinks()

    const navigate = useNavigate()

    const onLogout = () => {
        dispatch(logout())
        navigate('/login')
    }



    if (meLoadingStatus === 'loading') {
        return <DefaultLoader/>
    }




    const userImg = profile_photo ? `${BackUrlForDoc}${profile_photo}` : null

    return (
        <>
            <div className="profile" onClick={handleClick}>
                <div className="profile__container">
                    <header className="profile__header">
                        <div>
                            <img  rel="preload" className="profile-img" crossOrigin="Anonymous" src={userImg ? userImg : img} alt=""/>
                            <h2 className="profile-username">{username}</h2>
                        </div>
                        <div>
                            <i className="fas fa-user profile-rankIcon" />
                            <span className="profile-rankName">User</span>
                        </div>
                        <div>
                            {/*<div className="profile__header-btn"></div>*/}
                            {/*<div className="profile__header-btn"></div>*/}
                            <div
                                onClick={() => setActiveOptions(!activeOptions)}
                                className="profile__header-btn"
                            >
                                <i className="fas fa-ellipsis-v" />
                                <div
                                    className={classNames('modalOptions', {
                                        "active": activeOptions
                                    })}
                                >
                                    {renderedLinks}
                                    <div onClick={onLogout} className="option">
                                        <i className="fas fa-sign-out-alt" />
                                        <span>Chiqish</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </header>

                    <div className="profile__subHeader">

                    </div>

                    <main className="profile__main">
                        {renderedItems}
                    </main>
                </div>
            </div>
        </>
    );
};



const UserInfo = React.memo(({data}) => {
    const keysData = Object.keys(data)
    return keysData.map(key => {
        // if (data[key] !== {}) return
        if (Object.keys(data[key]).length < 1) return
        if (data[key].value === "username") return
        const style = {
            order: data[key].order,
            display: data[key].display ? data[key].display : "flex"
        }

        if (Array.isArray(data[key].value)) {
            return (
                <div style={style} className="information__item array">
                    <span>{data[key].name}:</span>
                    <div>
                        {
                            data[key]?.value.map( item => {
                                return (
                                    <span> {item.name}</span>
                                )
                            })
                        }
                    </div>
                </div>
            )
        }
        return (
            <div style={style} className="information__item">
                <span>{data[key].name}:</span>
                <span>{data[key].value}</span>
            </div>
        )
    })

})



export default PlatformMeProfile;
