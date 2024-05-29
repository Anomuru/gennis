import React, {useCallback, useEffect, useState} from 'react';


import "./select.sass"

const Select = React.memo(({id,name,options,title,onChangeOption,teachers,defaultValue,number,group,all,extra,keyValue,autoSelect}) => {

    const [optionsData,setOptionsData] = useState(null)
    const [selectOption,setSelectOption] = useState("")
    const [isChanged,setIsChanged] = useState(false)


    useEffect(()=> {
        setOptionsData(options)
    },[options])


    useEffect(()=> {
        if (defaultValue) {
            setSelectOption(defaultValue)
        }
    },[defaultValue,setSelectOption])

    useEffect(() => {
        if (isChanged) {
            if (!selectOption) return
            if (id) {
                onChangeOption(id,selectOption)
                setIsChanged(false)
            } else {
                onChangeOption(selectOption)
                setIsChanged(false)
            }
        }
    },[selectOption, onChangeOption, id])


    useEffect(() => {
        if (autoSelect)
        for (let i = 0; i < options?.length;i++) {
            if (options[i].disabled && !defaultValue) {
                const value = options[i][keyValue] || options[i].value || options[i].id || options[i].name || options[i]
                setSelectOption(value)
            }
        }
    },[options,keyValue])


    const renderOptionsOfSelect = useCallback(() => {
        return optionsData?.map((item,index) => {

            const value =  item[keyValue] || item.value || item.id || item.name || item
            const key =  item.name || item

            if (!item.length)
            if (item.name?.includes('Hamma')) {
                return <option
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
                    disabled={item.disabled}
                    {...extra}
                    key={index}
                    value={item.id}
                >
                    {`${item.name}  ${item.surname}`}
                </option>
            }
            return <option
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
    },[number, optionsData, teachers])



    const renderedOptions = renderOptionsOfSelect()


    return (
        <label className={`select-label`} htmlFor={`select_field-${name}`}>
            <span className="name-field">{title}</span>
            <select
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
}) ;

export default Select;