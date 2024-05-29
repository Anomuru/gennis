import {motion} from "framer-motion";
import {Link} from "react-router-dom";
import classNames from "classnames";
import {useContext, useState} from "react";
import {isMobile} from "react-device-detect";

import WebButton from "components/webSite/webSiteUI/webButton/webButton";
import {Context} from "pages/webSite";

import img from 'assets/website/Group 1952.png';
import cls from "./style.module.sass";

const Header = ({status, setStatus}) => {
    const {sectionTop} = useContext(Context)

    const [activeItem, setActiveItem] = useState("home")
    const [activeBar, setActiveBar] = useState(false)

    const menuList = [
        {
            name: "home",
            title: "Bosh sahifa",
            type: "btn"
        },
        {
            name: "about",
            title: "Biz haqimizda",
            type: "btn"
        },
        {
            name: "course",
            title: "Kurslar",
            type: "btn"
        },
        {
            name: "result",
            title: "Natijalar",
            type: "btn"
        },
        {
            name: "teacher",
            title: "O’qituvchilar",
            type: "btn"
        },
        {
            name: "news",
            title: "Yangiliklar",
            type: "btn"
        },
        {
            name: "advantages",
            title: "Afzallilar",
            type: "btn"
        },
        {
            name: "books",
            title: "Kitoblar",
            type: "link",
            href: "/books"
        },
        {
            name: "consulting",
            title: "Consulting",
            type: "link",
            href: "/"
        },
        {
            name: "contact",
            title: "Bog’lanish",
            type: "btn"
        }
    ]

    const toLink = (top) => {
        setStatus(false)
        setActiveBar(false)
        window.scrollTo(0, top - 100)
    }

    const renderMenu = (arr) => {
        return (
            <ul className={cls.header__menuItems}>
                {
                    arr.map((item, i) => {
                        if (item.type === "link") {
                            return (
                                <motion.li
                                    className={classNames(cls.header__item, {
                                        [cls.active]: activeItem === item.name
                                    })}
                                >
                                    <Link
                                        to={item.href}
                                        style={{
                                            textDecoration: "none",
                                            color: "#686868"
                                        }}
                                    >
                                        {item.title}
                                    </Link>
                                </motion.li>
                            )
                        }
                        return (
                            <motion.li
                                className={classNames(cls.header__item, {
                                    [cls.active]: activeItem === item.name
                                })}
                                key={i}
                                onClick={() => {
                                    toLink(sectionTop[item.name])
                                    setActiveItem(item.name)
                                }}
                            >
                                {item.title}
                            </motion.li>
                        )
                    })
                }
            </ul>
        )
    }

    return (
        isMobile ? <HeaderMobile
            children={renderMenu(menuList)}
            activeBar={activeBar}
            status={status}
        /> : <HeaderPc
            children={renderMenu(menuList)}
            setActiveBar={setActiveBar}
            activeBar={activeBar}
            status={status}
        />
    )
}

const HeaderPc = ({status, activeBar, setActiveBar, children}) => {
    return (
        <header className={classNames(cls.header, {
            [cls.active]: status
        })}>
            <div className={cls.header__hamburger}>
                <i
                    className={classNames(
                        activeBar ? "fas fa-times" : "fas fa-bars", cls.header__icon
                    )}
                    onClick={() => setActiveBar(!activeBar)}
                />
            </div>
            <div
                className={classNames(cls.header__menu, {
                    [cls.active]: activeBar
                })}
            >
                <div className={classNames(cls.header__menuInner, {
                    [cls.active]: activeBar
                })}>
                    <div className={cls.header__logo}>
                        <img
                            src={img}
                            alt=""
                        />
                    </div>
                    {children}
                </div>
            </div>
            <Link
                to={'/login'}
                style={{cursor: "pointer"}}
            >
                {
                    isMobile ? null : <WebButton style={"light"}>Login</WebButton>
                }
            </Link>
        </header>
    )
}


const HeaderMobile = ({children, activeBar, status}) => {
    return (
        <header className={classNames(cls.header, {
            [cls.active]: status
        })}>
            <div
                className={classNames(cls.header__menu, {
                    [cls.active]: status
                })}
            >
                <div className={classNames(cls.header__menuInner, {
                    [cls.active]: activeBar
                })}>
                    <div className={cls.header__logo}>
                        <img
                            src={img}
                            alt=""
                        />
                    </div>
                    {children}
                </div>
            </div>
        </header>
    )
}

export default Header