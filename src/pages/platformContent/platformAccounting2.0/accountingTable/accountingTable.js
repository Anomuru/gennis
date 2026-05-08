import React, { useMemo, useState } from "react";
import cls from "./accountingTable.module.sass"

import { useDispatch, useSelector } from "react-redux";
import {
    newAccountingData, newAccountingDataLoading, newAccountingSelectOptionValue,
    newAccountingTotalCount
} from "../model/accountingSelector";
import DefaultLoader from "components/loader/defaultLoader/DefaultLoader";
import { RenderTh } from "../accountingRender/renderTh";
import { RenderTd } from "../accountingRender/renderTd";

import Modal from "components/platform/platformUI/modal";
import Confirm from "components/platform/platformModals/confirm/confirm";
import ConfimReason from "components/platform/platformModals/confirmReason/confimReason";
import { changePaymentType, onDeleteItem } from "../model/accountingSlice";
import Select from "components/platform/platformUI/select";
import DefaultLoaderSmall from "components/loader/defaultLoader/defaultLoaderSmall";
import { useHttp } from "hooks/http.hook";
import { BackUrl, headers } from "constants/global";
import { RenderRoute } from "pages/platformContent/platformAccounting2.0/renderRoute/renderRoute";
import { setMessage } from "slices/messageSlice";


export const AccountingTable = ({
    currentPage,
    setCurrentPage,
    handleDelete,
    // pageSize = 10,
    currentPage2,
    setCurrentPage2,
    pageSize
}) => {

    const options = [
        {
            value: "cash",
            name: "Cash"
        },
        {
            value: "bank",
            name: "Bank"
        },
        {
            value: "click",
            name: "Click"
        }
    ]
    const loading = useSelector(newAccountingDataLoading)
    const data = useSelector(newAccountingData)

    const [confirmModal, setConfirmModal] = useState(false)
    const [confirm, setConfirm] = useState("")
    //delete item olish uchun
    const [item, setItem] = useState({})
    const dispatch = useDispatch()
    const [changeActive, setChangeActive] = useState(false)
    const { request } = useHttp()
    const [renderRoute, setRenderRoute] = useState({})

    const selectedValue = useSelector(newAccountingSelectOptionValue)
    const selectOption = useSelector(newAccountingSelectOptionValue);
    const totalPage = useSelector(newAccountingTotalCount)

    console.log(data, "data")

    const onDelete = () => {

        if (selectedValue === "teachersSalary" || selectedValue === "employeesSalary") {
            request(`${BackUrl}account/${renderRoute.delete}/${item.id}/${item.user_id}`, "POST", JSON.stringify({}), headers())
                .then(res => {
                    setConfirm("")

                    setConfirmModal(false)

                    dispatch(onDeleteItem(item.id))
                    setItem({})
                    dispatch(setMessage({
                        msg: res.msg,
                        type: "success",
                        active: true
                    }))
                })
        } else {
            request(`${BackUrl}account/${renderRoute.delete}/${item.id}${selectOption === "assistentSalary" ? `/${item.user_id}` : ""}`, "POST", JSON.stringify({}), headers())
                .then(res => {
                    setConfirm("")

                    setConfirmModal(false)

                    dispatch(onDeleteItem(item.id))
                    setItem({})
                    dispatch(setMessage({
                        msg: res.msg,
                        type: "success",
                        active: true
                    }))
                })
        }


    }


    const changePayment = (id, value) => {
        request(`${BackUrl}account/${renderRoute.change}/${item.id}/${value}${item.user_id ? `/${item.user_id}` : ""}`, "GET", null, headers())
            .then(res => {
                dispatch(changePaymentType({ id, typePayment: value }));
                setChangeActive(false)
                setItem({})
                dispatch(setMessage({
                    msg: res.msg,
                    type: "success",
                    active: true
                }))
            })

    };

    console.log(data, "data")
    return (
        <>

            {selectedValue === "bookPayment" ? <div style={{ display: "flex", gap: "1rem" }}>

                <div
                    style={{ width: "50%" }}
                // className={cls.card}
                >
                    <div className={cls.tableWrapper}>
                        {loading ? <DefaultLoader /> : <table className={cls.table}>
                            <thead>
                                <tr>
                                    <RenderTh />
                                </tr>
                            </thead>
                            <tbody>
                                {data?.book_overheads?.length > 0 && data.book_overheads?.map((item, index) => {
                                    return (
                                        <tr key={item?.id}>
                                            <RenderTd setChangeActive={setChangeActive} setItem={setItem} item={item}
                                                index={index}
                                                setConfirmModal={setConfirmModal} />
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>}
                    </div>
                    <Pagination totalPage={totalPage?.book_overheads?.total} loading={loading} currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                        pageSize={pageSize} />
                </div>
                <div
                    style={{ width: "50%" }}
                // className={cls.card}
                >
                    <div className={cls.tableWrapper}>
                        {loading ? <DefaultLoader /> : <table className={cls.table}>
                            <thead>
                                <tr>
                                    <RenderTh />
                                </tr>
                            </thead>
                            <tbody>
                                {data?.book_payments?.length > 0 && data.book_payments?.map((item, index) => {

                                    return (
                                        <tr key={item?.id}>
                                            <RenderTd setChangeActive={setChangeActive} setItem={setItem} item={item}
                                                index={index}
                                                setConfirmModal={setConfirmModal} />
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>}
                    </div>
                    <Pagination totalPage={totalPage?.book_payments?.total} loading={loading} currentPage={currentPage2}
                        setCurrentPage={setCurrentPage2}
                        pageSize={pageSize} />
                </div>

            </div> :
                <div className={cls.card}>
                    <div className={cls.tableWrapper}>
                        {loading ? <DefaultLoader /> : <table className={cls.table}>
                            <thead>
                                <tr>
                                    <RenderTh />
                                </tr>
                            </thead>
                            <tbody>
                                {data.length > 0 && data?.map((item, index) => (
                                    <tr key={item?.id}>
                                        <RenderTd setChangeActive={setChangeActive} setItem={setItem} item={item}
                                            index={index}
                                            setConfirmModal={setConfirmModal} />
                                    </tr>
                                ))}
                            </tbody>
                        </table>}
                    </div>
                    <Pagination totalPage={totalPage?.total} loading={loading} currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                        pageSize={pageSize} />
                </div>
            }


            <Modal activeModal={confirmModal} setActiveModal={() => setConfirmModal(false)}>
                <Confirm setActive={setConfirmModal} text={"O'chirilsinmi?"}
                    getConfirm={setConfirm} />
            </Modal>
            {
                confirm === "yes" ?
                    <Modal
                        activeModal={confirmModal}
                        setActiveModal={() => {
                            setConfirmModal(false)
                            setConfirm("")
                        }}
                    >
                        <ConfimReason getConfirm={onDelete} reason={true} />
                    </Modal> : null
            }
            <Modal activeModal={changeActive} setActiveModal={() => setChangeActive(false)}>
                <div className="changeTypePayment">
                    <Select
                        options={options}
                        name={""}
                        title={"Payment turi"}
                        onChangeOption={changePayment}
                        id={item.id}
                        defaultValue={item.typePayment}
                    />
                </div>
            </Modal>
            <RenderRoute setRenderRoute={setRenderRoute} />

        </>
    );
};


const Pagination = ({
    currentPage,
    setCurrentPage,
    handleDelete,
    pageSize,
    loading,
    totalPage
}) => {

    const totalPages = Math.ceil(totalPage / pageSize);
    const pages = useMemo(() => {
        const visiblePages = [];
        const maxVisible = 5;

        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) visiblePages.push(i);
        } else {
            let start = Math.max(1, currentPage - 2);
            let end = Math.min(totalPages, start + maxVisible - 1);
            if (end - start < maxVisible - 1) start = Math.max(1, end - maxVisible + 1);
            for (let i = start; i <= end; i++) visiblePages.push(i);
        }

        return visiblePages;
    }, [totalPages, currentPage]);

    return (
        <div className={cls.pagination}>
            {/*{loading ? <div style={{width: "fit-content"}}><DefaultLoaderSmall/></div> : <>*/}

            <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className={cls.pageBtn}
            >
                <i className={"fas fa-chevron-left"} />
            </button>

            {pages.map((page) => (
                <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`${cls.pageBtn} ${currentPage === page ? cls.activePage : ""
                        }`}
                >
                    {page}
                </button>
            ))}

            <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className={cls.pageBtn}
            >
                <i className={"fas fa-chevron-right"} />
            </button>
            {/*</>}*/}
        </div>
    )
}