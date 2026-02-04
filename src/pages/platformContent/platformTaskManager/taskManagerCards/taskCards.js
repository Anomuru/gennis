import React, { useEffect, useState } from "react";
import taskCardBack from "../../../../assets/background-img/TaskCardBack.png";
import taskCardBack2 from "../../../../assets/background-img/TaskCardBack2.png";
import taskCardBack3 from "../../../../assets/background-img/greenBg.png";
import taskCardBack4 from "../../../../assets/background-img/blackBg.png";
import taskCardBack5 from "../../../../assets/background-img/navyBg.png";
import taskCardBack6 from "../../../../assets/background-img/grayBg.png";
import { motion } from "framer-motion";
import classNames from "classnames";
import cls from "../platformTaskManager.module.sass";
import unknownUser from "../../../../assets/user-interface/user_image.png";


export const TaskCard = ({ item, index, activeMenu, click, onDelete, getStudentId, isCompleted, setActiveModal }) => {




    const [style, setStyle] = useState({})

    const renderBgImage = (color) => {
        switch (color) {
            case "red":
                return `url(${taskCardBack})`
            case "yellow":
                return `url(${taskCardBack2})`
            case "green":
                return `url(${taskCardBack3})`
            case "black":
                return `url(${taskCardBack4})`
            case "navy":
                return `url(${taskCardBack5})`
            default:
                return `url(${taskCardBack6})`

        }
    }


    useEffect(() => {
        switch (activeMenu) {
            case "leads":
                setStyle({
                    backImage: renderBgImage(item?.status),
                })
                break;
            default:

                setStyle({
                    // generalBack: `${cls.b}`,
                    // generalBack: item?.moneyType === "red" ?
                    //     "#FFE4E6" : item.moneyType === 'navy' ? "navy" : item.moneyType === "black" ? "black" :  "#FEF9C3",

                    backImage: renderBgImage(item?.moneyType)
                })
                break;
        }
    }, [activeMenu, item.moneyType, item?.status])


    return (
        <motion.div
            key={index}
            className={classNames(cls.item, cls[item?.moneyType || item?.status || "noColor"])}
            style={{
                color: item.moneyType === "navy" ? "white" : item.moneyType === "black" ? "white" : ""
            }}
        >
            {
                (activeMenu === "leads" && !isCompleted) ?
                    <i
                        className={classNames("fas fa-trash", cls.icon)}
                        onClick={() => {
                            onDelete(true)
                            getStudentId({ id: item?.id, status: item?.status })
                        }}
                    /> : null
            }
            <div
                className={classNames(cls.item__info, {
                    [cls.active]: activeMenu === "leads"
                })}

            >
                {
                    activeMenu === "leads" ? null : <h2
                        className={cls.debt}

                    >
                        {
                            activeMenu === "debtors" ? item?.balance : item?.registered_date
                        }
                    </h2>
                }
                <h2 style={{ color: item.moneyType === "navy" ? "white" : item?.moneyType === "black" ? "white" : "" }}
                    className={cls.username}>{item?.name} {item?.surname}</h2>
                <ul
                    className={classNames(cls.infoList, {
                        [cls.active]: activeMenu === "leads"
                    })}
                >
                    <li className={cls.infoList__item}>number: <span>{item?.phone}</span></li>

                    {/*{*/}
                    {/*    activeMenu === "debtors" ? <>*/}
                    {/*        <li className={cls.infoList__item}>Ingliz tili: <span>390000</span></li>*/}
                    {/*        <li className={cls.infoList__item}>IT: <span>390000</span></li>*/}
                    {/*    </> : null*/}
                    {/*}*/}
                    {
                        activeMenu === "leads" ?
                            <li className={cls.infoList__item}>Register date: <span>{item?.day}  </span></li> :
                            <>
                                <li className={cls.infoList__item}>Koment: <span>{item?.comment}  </span></li>


                            </>
                    }
                    {
                        activeMenu === "newStudents" ?
                            <>
                                {/*{item?.subjects?.map(item =>*/}
                                {/*    (*/}
                                {/*        <li className={cls.infoList__item}>Fan: <span>{item}</span></li>*/}
                                {/*    )*/}
                                {/*)}*/}
                                <li className={cls.infoList__item}>Fani: <span>{item?.subjects.map(item => (
                                    `${item ? item : item?.name} `
                                ))}</span></li>
                                <li className={cls.infoList__item}>Number: <span>{item?.phone}</span></li>
                                <li className={cls.infoList__item}>Parent number: <span>{item?.parent}</span></li>
                            </> : null
                    }
                    {
                        activeMenu === "debtors" ?
                            <>

                                <li className={cls.infoList__item}>Tel status: <span>{item?.reason}</span></li>

                                <li className={cls.infoList__item}>Number: <span>{item?.phone}</span></li>
                                <li className={cls.infoList__item}>Parent number: <span>{item?.parent}</span></li>
                            </>


                            : null
                    }
                </ul>
            </div>
            <div
                className={cls.item__image}
                style={{ backgroundImage: style.backImage }}
            >
                <div
                    className={cls.circle}
                    onClick={
                        () =>
                        // (item.status === "green" || isCompleted) ? null :
                        {
                            click(item?.id)
                            setActiveModal(true)
                        }
                    }
                >
                    <img src={unknownUser} alt="" />
                </div>
            </div>

        </motion.div>
    )
}