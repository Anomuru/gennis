import React from 'react';
import classNames from "classnames";
import {Link} from "react-router-dom";

import RequireAuthChildren from "components/requireAuthChildren/requireAuthChildren";
import {BackUrlForDoc, ROLES} from "constants/global";

import cls from "./style.module.sass";
import user_img from "assets/user-interface/user_image.png";

const Students = ({data, stringCheck, LinkToUser}) => {
    return (
        <div className={classNames(cls.item, cls.students)}>
            <div className={cls.students__header}>
                <div className={cls.students__header__box}>
                    <span className={cls.students__header__box__span}>
                        <svg className="w-[45px] h-[45px] text-gray-800 dark:text-white" aria-hidden="true"
                             xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
  <path stroke="white" stroke-linecap="round" stroke-width="2"
        d="M4.5 17H4a1 1 0 0 1-1-1 3 3 0 0 1 3-3h1m0-3.05A2.5 2.5 0 1 1 9 5.5M19.5 17h.5a1 1 0 0 0 1-1 3 3 0 0 0-3-3h-1m0-3.05a2.5 2.5 0 1 0-2-4.45m.5 13.5h-7a1 1 0 0 1-1-1 3 3 0 0 1 3-3h3a3 3 0 0 1 3 3 1 1 0 0 1-1 1Zm-1-9.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z"/>
</svg>

                    </span>
                    <h1>O'quvchilar ro'yxati</h1>
                </div>
                <RequireAuthChildren allowedRules={[ROLES.Admin, ROLES.Director, ROLES.Programmer]}>
                    <Link
                        to={`../../changeGroupStudents`}
                        className={cls.students__icons}
                    >
                        <i className="fas fa-edit"/>
                    </Link>
                </RequireAuthChildren>
            </div>
            <div className={cls.students__container}>
                {
                    data.map(item => {
                        const userImg = item.photo_profile ? `${BackUrlForDoc}${item.photo_profile}` : user_img
                        return (
                            <div className={cls.students__item} >
                                <div className={cls.students__item__arounder}>
                                    <span className={cls.students__item__span}>
                                        <h1>
                                           {stringCheck(item.name.slice(0,1))}
                                        </h1>

                                    </span>

                                <div onClick={e => LinkToUser(e, item.id)} className={cls.info}>
                                    <span>{stringCheck(item.name)}</span>
                                    <span>{stringCheck(item.surname)}</span>
                                </div>
                                </div>
                                <RequireAuthChildren
                                    allowedRules={[ROLES.Admin, ROLES.Director, ROLES.Programmer, ROLES.Teacher]}>
                                    <div>
                                        <div className={`${cls.money} ${cls[item.moneyType]}`}>{Number(item.money).toLocaleString()}</div>
                                    </div>
                                </RequireAuthChildren>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    );
};

export default Students;