import React, {useCallback, useEffect, useState} from 'react';

import {useDispatch, useSelector} from "react-redux";
import DefaultLoader from "components/loader/defaultLoader/DefaultLoader";

import "../tables.sass"

import { useAuth } from "hooks/useAuth";
import { BackUrl, headers, ROLES} from "constants/global";
import { useHttp } from "hooks/http.hook";
import { setMessage } from "slices/messageSlice";


const BooksTable = React.memo(({books,activeRowsInTable,funks}) =>  {

    const {fetchBooksStatus} = useSelector(state => state.books)
    const [booksList,setBooksList] = useState([])


    const {role} = useAuth()


    useEffect(()=> {
        setBooksList(books)
    },[books])


    const stringCheck = (name) => {
        if (name?.length > 10) {
            return (
                <>
                    {name.substring(0,10)}...
                    <div className="popup">
                        {name}
                    </div>
                </>
            )
        }
        return name
    }

    const dispatch = useDispatch()
    const {request} = useHttp()


    const confirmAdmin = (id,type) => {
        request(`${BackUrl}send_campus_money`, "POST",JSON.stringify({order_id:id,admin_confirm: type}),headers())
            .then(res => {
                dispatch(setMessage({
                    msg: res.msg,
                    type: "success",
                    active : true
                }))
            })
            .then(() => {
                setBooksList(books => books.map(item => {
                    if (item.id === id) {
                        return {
                            ...item,
                            admin_confirm : !item.admin_confirm
                        }
                    }
                    return item
                }))
            })
    }


    const confirmEditor = (id) => {
        request(`${BackUrl}order_confirm/${id}`, "GET",null,headers())
            .then(res => {
                dispatch(setMessage({
                    msg: res.msg,
                    type: "success",
                    active : true
                }))
            })
            .then(() => {
                setBooksList(books => books.map(item => {
                    if (item.id === id) {
                        return {
                            ...item,
                            editor_confirm : !item.editor_confirm
                        }
                    }
                    return item
                }))
            })
    }


    const renderElements = useCallback(() => {
        return booksList?.map((item,index) => {
            return (
                <tr key={index} >
                    <td>{index + 1}</td>
                    {activeRowsInTable?.book ? <td className="bookName">{item.book.name}</td> : null}
                    {activeRowsInTable?.name ? <td >{stringCheck(item.name)}</td> : null}
                    {activeRowsInTable?.surname ? <td >{stringCheck(item.surname)}</td> : null}
                    {activeRowsInTable?.role ? <td > {item.role}</td> : null}
                    {activeRowsInTable?.group ? <td > {item.group.name}</td> : null}
                    {activeRowsInTable?.price ? <td>{item.book.price.toLocaleString()}</td> : null}
                    {activeRowsInTable?.date ? <td>{item.date}</td> : null}
                    {activeRowsInTable?.reason ? <td>{stringCheck(item?.reason)}</td> : null}
                    {activeRowsInTable?.isPaid ?
                        <>
                            {
                                item?.isPaid ?
                                <td style={{color: "green"}}>Ha</td>
                                :
                                <td style={{color: "red"}}>Yoq</td>
                            }
                        </>
                        : null
                    }
                    {activeRowsInTable?.location  && role === ROLES.Editor  ? <td>{item.location.name}</td>: null}
                    {activeRowsInTable?.confirmEditor ?  <td> <input onChange={() => confirmEditor(item.id)} checked={item.editor_confirm} disabled={role !== ROLES.Editor }  type="checkbox"/>  </td> : null}
                    {activeRowsInTable?.confirmAdmin ?  <td> <input onChange={(e) => confirmAdmin(item.id,e.target.checked)} checked={item.admin_confirm} type="checkbox"  disabled={role === ROLES.Editor} /> </td> : null}
                    {activeRowsInTable?.deleteOrder &&  !item.editor_confirm  && !item.admin_confirm && !item.delete_order
                        ?
                        <td className={"deleteBtn"}>
                            <span
                                onClick={() => {
                                    funks.setChangingData({name: item.name,id: item.id})
                                    funks.changeModal("deleteOrder")
                                }}
                                className="delete"
                            >
                                <i className="fas fa-times"></i>
                            </span>
                        </td>
                        : null
                    }
                </tr>
            )
        })
    },[activeRowsInTable, booksList])


    const renderedUsers = renderElements()

    if (fetchBooksStatus === "loading") {
        return <DefaultLoader/>
    } else if (fetchBooksStatus === "error") {
        console.log('error')
    }

    return (
        <div className="tableBox">
            <table className="groupsTable">
                <thead>
                    <tr className="tbody_th" key={1000000}>
                        <th/>
                        {activeRowsInTable?.name ? <th >Kitob nomi</th> : null}
                        {activeRowsInTable?.name ? <th >Ism</th> : null}
                        {activeRowsInTable?.surname ? <th >Familya</th> : null}
                        {activeRowsInTable?.role ? <th >Rol</th> : null}
                        {activeRowsInTable?.group ? <th >Guruh</th> : null}
                        {activeRowsInTable?.price ?  <th>Kitob narxi</th> : null}
                        {activeRowsInTable?.date ?  <th>Sana</th> : null}
                        {activeRowsInTable?.reason ?  <th>Sabab</th> : null}
                        {activeRowsInTable?.isPaid ?  <th>Tolangan</th> : null}
                        {activeRowsInTable?.location && role === ROLES.Editor ?  <th>Manzil</th> : null}
                        {activeRowsInTable?.confirmEditor ?  <th>Yubordim</th> : null}
                        {activeRowsInTable?.confirmAdmin ?  <th>Qabul qildim</th> : null}
                        {activeRowsInTable?.deleteOrder && role === ROLES.Admin ?  <th>Zakazni O'chirish</th> : null}
                    </tr>
                </thead>
                <tbody>
                    {renderedUsers}
                </tbody>
            </table>
        </div>
    );
})




export default BooksTable;
