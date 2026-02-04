import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import {
    newAccountingSelectOption,
    newAccountingSelectOptionName, newAccountingSelectOptionValue
} from "../model/accountingSelector";
import Select from "components/platform/platformUI/select";
import { onChangeAccountingPage } from "../model/accountingSlice";
import PlatformSearch from "components/platform/platformUI/search";
import Button from "components/platform/platformUI/button";

import cls from "./accountingHeader.module.sass"

export const AccountingHeader = ({ search, setSearch }) => {

    const navigate = useNavigate()
    const { locationId } = useParams()
    const selectOption = useSelector(newAccountingSelectOption)
    const selectOptionName = useSelector(newAccountingSelectOptionName)
    const selectOptionValue = useSelector(newAccountingSelectOptionValue)

    const dispatch = useDispatch()
    const onChangePage = useCallback((e) => {
        dispatch(onChangeAccountingPage(e));
    }, [dispatch]);

    return (
        <div className={cls.header}>

            <PlatformSearch setSearch={setSearch} search={search} />
            {/*<h1>{selectOptionName}</h1>*/}
            <div className={cls.header__btn}>
                <Button onClickBtn={() => navigate("otchot")}>Buxgalteriya</Button>
                <Select defaultValue={selectOptionValue} options={selectOption} onChangeOption={onChangePage} />
            </div>

        </div>
    );
};

