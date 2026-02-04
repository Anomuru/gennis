import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchParentsData, onDeleteParent } from 'slices/parentSectionSlice';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchFilters } from 'slices/filtersSlice';
import cls from "./platformParentsList.module.sass";
import Table from "components/platform/platformUI/table";
import Search from "components/platform/platformUI/search";
import Button from "components/platform/platformUI/button";
import classNames from "classnames";
import Confirm from "components/platform/platformModals/confirm/confirm";
import Modal from "components/platform/platformUI/modal";
import ConfimReason from "components/platform/platformModals/confirmReason/confimReason";
import { useHttp } from "hooks/http.hook";
import { BackUrl, headers } from "constants/global";


const PlatformParentsList = () => {
    const { locationId } = useParams();
    const dispatch = useDispatch();
    const { parents, loading, error } = useSelector(state => state.parentSlice);
    const [search, setSearch] = useState("")
    const [active, setActive] = useState(false)
    const navigate = useNavigate()
    const [isConfirm, setIsConfirm] = useState(false)
    const [activeUser, setActiveUser] = useState(null)


    const [activeModal, setActiveModal] = useState(false)

    const { request } = useHttp()

    useEffect(() => {
        if (locationId) {
            dispatch(fetchParentsData({ locationId, type: active }));
            // dispatch(fetchFilters());
        }
    }, [dispatch, locationId, active]);


    const searchedUsers = useMemo(() => {
        return parents.filter(item =>
            item.name.toLowerCase().includes(search.toLowerCase()) ||
            item.surname.toLowerCase().includes(search.toLowerCase())
        )
    }, [search, parents, active])


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
                <td>{item?.address}</td>
                <td>{item?.birth_day}</td>
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
        setActiveModal(false)
        setIsConfirm(false)
        dispatch(onDeleteParent(activeUser.id))
        request(`${BackUrl}parent/crud/${activeUser.id}`, "DELETE", null, headers())
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
                        <th>Manzil</th>
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

export default PlatformParentsList;