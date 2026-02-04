import React, { useCallback, useEffect, useState } from 'react';
import classNames from "classnames";

import "./select.sass"

const Select = React.memo(({
    id,
    name,
    options,
    title,
    onChangeOption,
    teachers,
    defaultValue,
    number,
    group,
    all,
    extra,
    keyValue,
    autoSelect,
    value,
    required,
    allFromOptions,
    keyName,
    clazzLabel
}) => {

    const [optionsData, setOptionsData] = useState(null)
    const [selectOption, setSelectOption] = useState("")
    const [isChanged, setIsChanged] = useState(false)


    useEffect(() => {

        setOptionsData(options)
    }, [options])

    useEffect(() => {
        if (value) {
            setSelectOption(value)
        }
    }, [value])

    useEffect(() => {
        if (defaultValue) {
            setSelectOption(defaultValue)
        }
    }, [defaultValue, setSelectOption])

    useEffect(() => {
        if (isChanged) {
            if (!selectOption) return
            if (id) {
                onChangeOption(id, selectOption)
                setIsChanged(false)
            } else {
                onChangeOption(selectOption)
                setIsChanged(false)
            }
        }
    }, [selectOption, onChangeOption, id])


    useEffect(() => {
        if (autoSelect)
            for (let i = 0; i < options?.length; i++) {
                if (options[i].disabled && !defaultValue) {
                    const value = options[i][keyValue] || options[i].value || options[i].id || options[i].name || options[i]
                    setSelectOption(value)
                }
            }
    }, [options, keyValue])


    const renderOptionsOfSelect = useCallback(() => {
        return optionsData?.map((item, index) => {

            const value = item[keyValue] || item.value || item.id || item.name || item
            const key = item[keyName] || item.name || item.value || item.year || item
            const color = item.color ? { color: item.color } : null

            if (!item.length)
                if (item.name?.includes('Hamma') && allFromOptions) {
                    return <option
                        style={color}
                        disabled={item.disabled}
                        {...extra}
                        key={index}
                        value={[]}
                    >
                        {item.name}
                    </option>
                }
            if (teachers) {
                return <option
                    style={color}
                    disabled={item.disabled}
                    {...extra}
                    key={index}
                    value={value}
                >
                    {`${item.name}  ${item.surname}`}
                </option>
            }
            return <option
                style={color}
                disabled={item.disabled}
                {...extra}
                key={index}
                value={value}
            >
                {key}
            </option>

            // if (number) {
            //     return <option {...extra} disabled={item.disabled} key={index} value={item}>{item}</option>
            // }
            // if (group) {
            //     return <option {...extra}  disabled={item.disabled} key={index} value={item.id}>{item.name}</option>
            // }
            // return <option {...extra}  disabled={item.disabled} key={index} value={item.value ? item.value : item.name}>{item.name}</option>
        })
    }, [number, optionsData, teachers])


    const renderedOptions = renderOptionsOfSelect()


    return (
        <label className={classNames(`select-label`, clazzLabel)} htmlFor={name ? `select_field-${name}` : null}>
            <span className="name-field">{title}</span>
            <select
                required={required}
                id={`select_field-${name}`}
                className="input-fields"
                onChange={e => {
                    setSelectOption(e.target.value)
                    setIsChanged(true)
                }}
                value={selectOption}

            >
                {all ? <option value={"all"}>Hammasi</option> : <option value={""} disabled>Tanlang</option>}
                {renderedOptions}
            </select>
        </label>
    );
});

export default Select;



export const SelectForm = ({ title, options = [], value, onChangeOption, clazzLabel }) => {
    return (
        <label className={classNames(`select-label`, clazzLabel)}>

            <span className="name-field">{title}</span>
            <select
                value={value}
                onChange={(e) => onChangeOption(e.target.value)}
            >
                {options.map((item) => (
                    <option disabled={item?.disabled} key={item.id} value={item.id}>
                        {item.name}
                    </option>
                ))}
            </select>

        </label>
    );
};