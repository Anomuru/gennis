import classNames from "classnames";
import React, {useEffect, useMemo, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate, useParams} from "react-router-dom";
import Confirm from "../../../components/platform/platformModals/confirm/confirm";
import ConfimReason from "../../../components/platform/platformModals/confirmReason/confimReason";
import Button from "../../../components/platform/platformUI/button";
import Modal from "../../../components/platform/platformUI/modal";
import Search from "../../../components/platform/platformUI/search";
import Table from "../../../components/platform/platformUI/table";
import {BackUrl, headers} from "../../../constants/global";
import {useHttp} from "../../../hooks/http.hook";
import {fetchAssistant, onDeleteAssistant} from "../../../slices/assistantSlice";

import cls from "../platformParentsList/platformParentsList.module.sass";

export const PlatformAssistants = () => {

    const { locationId } = useParams();
    const dispatch = useDispatch();
    const { data , loading, error } = useSelector(state => state.assistantSlice);
    const [search, setSearch] = useState("")
    const [active, setActive] = useState(false)
    const navigate = useNavigate()
    const [isConfirm, setIsConfirm] = useState(false)
    const [activeUser, setActiveUser] = useState(null)


    const [activeModal, setActiveModal] = useState(false)

    const { request } = useHttp()

    useEffect(() => {
        if (locationId) {
            dispatch(fetchAssistant({ locationId, type: active }));
            // dispatch(fetchFilters());
        }
    }, [dispatch, locationId, active]);


    const searchedUsers = useMemo(() => {
        return data.filter(item =>
            item.name.toLowerCase().includes(search.toLowerCase()) ||
            item.surname.toLowerCase().includes(search.toLowerCase())
        )
    }, [search, data, active])


    const renderUsers = () => {

        return searchedUsers?.map((item, i) => (
            <tr

            >
                <td>{i + 1}</td>
                <td
                    onClick={() => navigate(`parentSection/${item.id}`)}
                >{item?.name}</td>
                <td>{item?.surname}</td>
                <td>{item?.phone}</td>
                <td>{item?.subjects.map(item => item)}</td>
                <td>{item?.date}</td>
                <td>{item?.location?.name}</td>
                {!active && <td>
                    <i onClick={() => {
                        setActiveModal(true)
                        setActiveUser(item)
                    }} className={classNames(cls.delete, 'fa fa-trash')} />
                </td>}
            </tr>
        ))
    }

    const onDelete = () => {

        request(`${BackUrl}teacher/assistent/crud/${activeUser.id}`, "DELETE", null, headers())
            .then(res => {
                setActiveModal(false)
                setIsConfirm(false)
                dispatch(onDeleteAssistant(activeUser.id))
            })
            .catch(err => {
                console.log(err)
            })

    }

    return (
        <div className={cls.wrapper}>
            <Search search={search} setSearch={setSearch} />
            <Button onClickBtn={() => setActive(!active)} extraClass={classNames(cls.wrapper__button, {
                [cls.wrapper__button_active]: active
            })}>Deleted</Button>


            <Table>
                <thead>
                <tr>
                    <th>No</th>
                    <th>Ismi</th>
                    <th>Familyasi</th>
                    <th>Telefon raqami</th>
                    <th>Fani</th>
                    <th>Tug'ulgan kuni</th>
                    <th>Joylashuvi</th>
                    <th />

                </tr>
                </thead>
                <tbody>
                {renderUsers()}
                </tbody>

            </Table>

            <Modal setActiveModal={setActiveModal} activeModal={activeModal}>
                <Confirm getConfirm={setIsConfirm} setActive={setActiveModal} text={"Rostanham o'chirmoqchimisiz?"} />
            </Modal>
            {
                isConfirm === "yes" ?
                    <Modal
                        setActiveModal={setActiveModal}
                        activeModal={activeModal}
                    >
                        <ConfimReason getConfirm={onDelete} reason={true} />
                    </Modal> : null
            }
        </div>
    );
};

