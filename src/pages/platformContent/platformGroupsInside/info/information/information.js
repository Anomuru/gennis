import React from "react";
import classNames from "classnames";
import {Link} from "react-router-dom";

import RequireAuthChildren from "components/requireAuthChildren/requireAuthChildren";
import {ROLES} from "constants/global";

import cls from "./style.module.sass";

const Information = ({data, statistics}) => {
    const dataKeys = Object?.keys(data)

    return (
        <div className={classNames(cls.item, cls.information)}>
            <div className={cls.information__header}>
                <div className={cls.information__header__box}>
                    <span className={cls.information__header__box__span}>
                    <svg className="w-[45px] h-[45px] text-gray-800 dark:text-white" aria-hidden="true"
                         xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
  <path stroke="white" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
        d="M10 3v4a1 1 0 0 1-1 1H5m4 8h6m-6-4h6m4-8v16a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V7.914a1 1 0 0 1 .293-.707l3.914-3.914A1 1 0 0 1 9.914 3H18a1 1 0 0 1 1 1Z"/>
</svg>

                </span>
                    <h1>Gruppa ma'lumotlari</h1>
                </div>

                <RequireAuthChildren allowedRules={[ROLES.Admin, ROLES.Director, ROLES.Programmer]}>
                    <Link
                        to={`../../changeGroupInfo`}
                        className={cls.information__icons}
                    >
                        <i className="fas fa-edit"/>
                    </Link>
                </RequireAuthChildren>

            </div>
            <div className={cls.information__container}>
                {
                    dataKeys.map(item => {
                        return (
                            <div className={cls.information__item}>
                                <span>{data[item].name}: </span>
                                <span>{
                                    typeof data[item].value === "number"
                                        ? data[item].value.toLocaleString()
                                        : data[item].value
                                } </span>
                            </div>
                        )
                    })


                    // data.map(item => {
                    //     return (
                    //         <div className="information__item">
                    //             <span>{item.name}: </span>
                    //             <span>{item.value}</span>
                    //         </div>
                    //     )
                    // })
                }
                <div className={cls.information__item}>
                    <span>Davomat foizi: </span>
                    <span>{statistics.attendance_percentage}%</span>
                </div>
                <div className={cls.information__item}>
                    <span>Chegirma foizi: </span>
                    <span>{statistics.discount_percentage}%</span>
                </div>
                <div className={cls.information__item}>
                    <span>Chegirma miqdori: </span>
                    <span>{statistics.discount_summ}</span>
                </div>
            </div>
        </div>
    )
}

export default Information;