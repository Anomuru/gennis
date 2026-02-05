import React, { c, useCallback, useEffect, useState } from 'react';

import { useDispatch } from "react-redux";
import DefaultLoader from "components/loader/defaultLoader/DefaultLoader";
import user_img from "assets/user-interface/user_image.png"

import "../tables.sass"

import { useLocation, useNavigate } from "react-router-dom";
import { BackUrl, BackUrlForDoc } from "constants/global";


const UsersTable = React.memo(({
    funcsSlice,
    users,
    activeRowsInTable,
    fetchUsersStatus,
    pageName,
    blockLink,
    checkedUsers,
    setLinkUser,
    cache
}) => {

    const [usersList, setUsersList] = useState([])
    const location = useLocation();
    const dispatch = useDispatch()

    useEffect(() => {
        setUsersList(users)
    }, [users])

    // console.log(usersList, "usersList1");


    const navigate = useNavigate()

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const LinkToUser = (e, id) => {
        if (cache) {
            navigate(`../profile/${id}`);
        } else {
            if (!blockLink) {
                const isDelete = e.target.classList.contains("delete") || e.target.classList.contains("fa-times");
                const isCheckbox = e.target.type === "checkbox";

                if (!isCheckbox && !isDelete) {
                    const isInParentsList = location.pathname.includes("parentsList");
                    const path = isInParentsList ? `../parentList/${id}` : `../../profile/${id}`;
                    navigate(path);
                }
            }
        }
    }

    useEffect(() => {
        if (checkedUsers?.length !== 0 && checkedUsers) {
            setUsersList(users => users.map(item => {
                const newL = checkedUsers?.filter(user => user.id === item.id)
                if (newL.length > 0) {
                    return { ...newL[0] }
                } else {
                    return { ...item, checked: false }
                }
            }))
        } else {
            if (checkedUsers) {
                setUsersList(users => users?.map(item => {
                    return { ...item, checked: false }
                }))
            }
        }
    }, [checkedUsers])
    // console.log(usersList, "usersList2");

    const stringCheck = (name, length = 10) => {
        if (name?.length > length) {
            return (
                <>
                    {name.substring(0, length)}...
                    <div className="popup">
                        {name}
                    </div>
                </>
            )
        }
        return name
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const onChecked = (id) => {
        setUsersList(users => users.map(item => {
            if (item.id === id) {
                return { ...item, checked: !item.checked }
            }
            return item
        }))

        if (funcsSlice?.setChecked.type === "simpleFunc") {
            funcsSlice?.setChecked.func(id)
        } else {
            dispatch(funcsSlice?.setChecked.func({ id }))
        }
    }
    // console.log(usersList, "usersList3");

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const onDelete = (id, type) => {
        funcsSlice?.onDelete(id, type)
    }

    // useEffect(() => {
    //
    //     const filteredUsers = usersList.filter(item => item.checked)
    //
    // },[usersList])




    const renderElements = useCallback(() => {
        return usersList?.map((item, index) => {

            const userImg = item.photo_profile ? `${BackUrlForDoc}${item.photo_profile}` : user_img

            return (
                <tr key={index} >
                    <td>{index + 1}</td>
                    <td className="imgTd" onClick={(e) => LinkToUser(e, item.id)}><img src={userImg} alt="userImg" /></td>
                    {activeRowsInTable.fullname ? <td>{item.name} {item.surname}</td> : ""}
                    {activeRowsInTable.name ? <td>{stringCheck(item.name)}</td> : null}
                    {activeRowsInTable.surname ? <td>{stringCheck(item.surname)}</td> : null}
                    {activeRowsInTable.username ? <td>{stringCheck(item.username)}</td> : null}
                    {activeRowsInTable.phone ? <td>{item.phone}</td> : null}
                    {activeRowsInTable.reason ? <td>{stringCheck(item.reason, 30)}</td> : null}
                    {activeRowsInTable.job ? <td>{item.job}</td> : null}
                    {activeRowsInTable.age ? <td>{item.age}</td> : null}
                    {activeRowsInTable.reg_date ? <td>{item.reg_date}</td> : null}
                    {activeRowsInTable.deleted_date ? <td>{item.deleted_date}</td> : null}
                    {activeRowsInTable.deletedDate ? <td>{item.deleted_date}</td> : null}
                    {
                        activeRowsInTable.comment ?
                            <td>
                                {item.comment?.substring(0, 15)}
                                <div className="popup">
                                    {item.comment}
                                </div>
                            </td> : null
                    }
                    {
                        activeRowsInTable?.subjects ?
                            <td>

                                {
                                    item?.subjects?.map((item, index) => {
                                        return <span key={index} className="subject">

                                            {
                                                item?.substring(0, 8)
                                            }...
                                        </span>
                                    })
                                }
                            </td> : null
                    }
                    {
                        activeRowsInTable.money ?
                            <td>
                                <span
                                    className={`money ${item.moneyType}`}
                                >
                                    {item.money}
                                </span>

                            </td> : null
                    }
                    {
                        activeRowsInTable.shift ?
                            typeof item.shift === "string" ?
                                <td>
                                    {item.shift?.substring(0, 15)}
                                    <div className="popup">
                                        {item.shift}
                                    </div>
                                </td> :
                                item?.shift?.map(item => {
                                    return (
                                        <td>
                                            {item?.substring(0, 15)}
                                            <div className="popup">
                                                {item}
                                            </div>
                                        </td>
                                    )
                                })
                            : null
                    }
                    {
                        activeRowsInTable.checked ?
                            <td>
                                <input
                                    checked={item.checked}
                                    onChange={() => onChecked(item.id)}
                                    type="checkbox"
                                />
                            </td> : null
                    }
                    {
                        activeRowsInTable.radio ?
                            item.color !== "red" ?
                                <td>
                                    <input
                                        name="radio"
                                        checked={item.radioChecked}
                                        onChange={() => onChecked(item.id)}
                                        type="radio"
                                    />
                                </td>
                                : <td />
                            : null
                    }
                    {
                        activeRowsInTable.delete || item.status ?
                            <td>
                                <div
                                    onClick={() => onDelete(item.id, "delete")}
                                    className="delete"
                                >
                                    <i className="fas fa-times" />
                                </div>
                            </td> : null
                    }
                    {
                        activeRowsInTable.returnDeleted ?
                            <td >
                                <div
                                    onClick={() => onDelete(item.id, "returnDeleted")}
                                    className="delete"
                                >
                                    <i className="fas fa-times" />
                                </div>
                            </td> : null
                    }
                    {
                        activeRowsInTable.color ?
                            <td>
                                <div className="status">
                                    {
                                        item.color === "green" ?
                                            <span className="green" />
                                            :
                                            <span className="red" />
                                    }
                                </div>
                            </td> : null
                    }
                </tr>

            )
        })
    }, [LinkToUser, activeRowsInTable, onChecked, onDelete, usersList])





    const renderedUsers = renderElements()

    if (fetchUsersStatus === "loading") {
        return <DefaultLoader />
    } else if (fetchUsersStatus === "error") {
        console.log('error')
    }


    return (
        <div className="tableBox">
            <table className={pageName}>
                <thead>
                    <tr className="tbody_th">
                        <th />
                        <th />
                        {activeRowsInTable.fullname ? <th>F.I.O</th> : null}
                        {activeRowsInTable.name ? <th>Ism</th> : null}
                        {activeRowsInTable.surname ? <th>Familya</th> : null}
                        {activeRowsInTable.username ? <th>Username</th> : null}
                        {activeRowsInTable.phone ? <th>Tel.</th> : null}
                        {activeRowsInTable.reason ? <th>Sabab</th> : null}
                        {activeRowsInTable.job ? <th>Kasb</th> : null}
                        {activeRowsInTable.age ? <th>Yoshi</th> : null}
                        {activeRowsInTable.reg_date ? <th>Reg. sana</th> : null}
                        {activeRowsInTable.deleted_date ? <th>O'chir. sana</th> : null}
                        {activeRowsInTable.deletedDate ? <th>O'chir. sana</th> : null}
                        {activeRowsInTable.comment ? <th>Izoh</th> : null}
                        {activeRowsInTable.subjects ? <th>Fanlar</th> : null}
                        {activeRowsInTable.subject ? <th>Fani</th> : null}
                        {activeRowsInTable.shift ? <th>Holat</th> : null}
                        {activeRowsInTable.money ? <th>Hisobi</th> : null}
                    </tr>
                </thead>
                <tbody>
                    {renderedUsers}
                </tbody>
            </table>
        </div>
    );
})




export default UsersTable;