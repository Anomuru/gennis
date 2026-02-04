import React, {useCallback, useEffect} from "react"
import {NavLink} from "react-router-dom"
import './platformMenuBar.sass'
import {requireMenuItems, ROLES} from "constants/global";
import {useDispatch, useSelector} from "react-redux";
import {setSelectedLocation} from "slices/meSlice";
import {fetchLocations} from "slices/locationsSlice";
import {Logger} from "sass";
import {TaskManagerModal} from "../../../pages/platformContent/platformTaskManager/taskManagerModal/taskManagerModal";


const PlatformMenuBar = ({menuActive, setMenuActive}) => {
    // eslint-disable-next-line react-hooks/exhaustive-deps

    const {role, location, id} = useSelector(state => state.me)
    const onDropMenu = useCallback((e) => {
        const item = e.currentTarget.parentElement
        const subItem = item.querySelector('.sub-item')
        const arrow = item.querySelector('.arrow')


        if (subItem) {
            e.preventDefault()
            subItem.classList.toggle('active')
            arrow.classList.toggle('arrow_active')
        } else {
            const parent = item.parentElement
            const subItems = parent.querySelectorAll('.sub-item')
            subItems.forEach(child => {
                child.classList.remove("active")
            })
            const arrows = parent.querySelectorAll('.arrow')
            arrows.forEach(child => {
                child.classList.remove("arrow_active")
            })
        }
    }, [])


    const mobileMenu = menuActive ? "menu-bar menu-bar-active" : "menu-bar"
    const menuActivated = menuActive ? "menu-bar__menu menu-bar__menu-active" : "menu-bar__menu "
    const descActive = menuActive ? "desc desc_active" : "desc"
    const overlayActive = menuActive ? "overlay overlay-active" : "overlay"


    const renderMultipleMenu = useCallback(() => {
        return requireMenuItems(id).map((item, index) => {
            if (item.children && (role === ROLES.Director || role === ROLES.Accountant || role === ROLES.Main_admin)) {
                return (
                    <MultipleLink
                        key={index}
                        item={item}
                        activeElem={descActive}
                        onDropMenu={onDropMenu}
                        menuActive={menuActive}
                        setMenuActive={setMenuActive}
                        role={role}
                    />
                )
            } else {
                return (
                    <SimpleLink
                        location={location}
                        role={role}
                        key={index}
                        item={item}
                        activeElem={descActive}
                        onDropMenu={onDropMenu}
                        menuActive={menuActive}
                        setMenuActive={setMenuActive}
                    />
                )
            }
        })
    }, [id, role, descActive, onDropMenu, menuActive, setMenuActive, location])


    const renderedMenu = renderMultipleMenu()
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(fetchLocations())
    },[])
    return (
        <>
            <div className={overlayActive}/>
            <nav className={mobileMenu}>
                <ul className={menuActivated}>
                    {renderedMenu}
                </ul>
            </nav>
        </>
    )
}


const MultipleLink = React.memo(({item, activeElem, onDropMenu, setMenuActive, role}) => {

    const {locations} = useSelector(state => state.locations)

    if (item.roles.includes(role)) {
        return (
            <li className="menu-bar__menu-item multiple">
                <NavLink
                    onClick={onDropMenu}
                    to={item.to}
                    className={
                        ({isActive}) =>
                            "menu-bar__menu-link" + (isActive ? " menu-bar__menu-link_active" : "")
                    }
                >
                    <i className={`fas ${item.classIcon} icon-link`}/>
                    <span className={activeElem}>{item.name}</span>
                    <i className="fas fa-chevron-right arrow "/>
                </NavLink>
                <div className="sub-item" key={item.id}>
                    {
                        item.location ?
                            locations.map((itemChild) => {
                                return (
                                    <NavLink
                                        key={itemChild.value}
                                        className={
                                            ({isActive}) =>
                                                "sub-item_link" + (isActive ? " sub-item_link_active" : "")
                                        }
                                        to={`${item.to}/${itemChild.value}`}
                                        onClick={() => {
                                            setMenuActive(false)
                                        }}
                                    >
                                        <div>
                                            <i className={`fas fa-map-marker-alt sub-item_icon-link`}/>
                                            <span className={activeElem}>{itemChild.name}</span>
                                        </div>
                                    </NavLink>
                                )
                            })
                            :
                            item.children.map((itemChild) => {
                                return (
                                    <NavLink
                                        key={itemChild.childId}
                                        className={
                                            ({isActive}) =>
                                                "sub-item_link" + (isActive ? " sub-item_link_active" : "")
                                        }
                                        to={`${item.to}/${itemChild.to}`}
                                        onClick={() => {
                                            setMenuActive(false)
                                        }}
                                    >
                                        <div>
                                            <i className={`fas ${itemChild.iconClazz} sub-item_icon-link`}/>
                                            <span className={activeElem}>{itemChild.childName}</span>
                                        </div>
                                    </NavLink>
                                )
                            })
                    }
                </div>
            </li>
        )
    }
    return null

})

const SimpleLink = React.memo(({item, activeElem, onDropMenu, menuActive, setMenuActive, role, location}) => {

    const dispatch = useDispatch()

    const onClickLink = useCallback(() => {
        // eslint-disable-next-line no-unused-expressions
        if (menuActive) {
            setMenuActive(false)
        }

        if (location) {
            dispatch(setSelectedLocation({id: location}))
        }
    }, [menuActive, onDropMenu, setMenuActive])

    if (item.roles.includes(role)) {
        const linkItem = item.location ? `/${location}` : ""

        return (
            <li className="menu-bar__menu-item">
                <NavLink
                    onClick={onClickLink}
                    to={`${item.to}${linkItem}`}
                    className={({isActive}) => "menu-bar__menu-link" + (isActive ? " menu-bar__menu-link_active" : "")}
                >
                    <i className={`fas  ${item.classIcon} icon-link`}/>
                    <span className={activeElem}>{item.name}</span>
                </NavLink>
            </li>
        )
    }
    return null
})


export default PlatformMenuBar