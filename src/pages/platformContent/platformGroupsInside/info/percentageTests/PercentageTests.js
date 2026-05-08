import React from 'react';
import classNames from "classnames";
import cls from "./percentageTests.module.sass";


const PercentageTests = ({ data, assisData }) => {

    return (
        <div className={cls.wrapper}>
            <div className={classNames(cls.item, cls.information)}>
                <div className={cls.information__header}>
                    <h1>Test Foizi</h1>
                </div>
                <div className={cls.information__container}>
                    {
                        data.map(item => {
                            return (
                                <div className={cls.information__item}>
                                    <span>{item.level}: </span>
                                    <span>{item.percentage}</span>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
            {
                assisData.assistantName && (
                    <div className={classNames(cls.item, cls.information)}>
                        <div className={cls.information__header}>
                            <h1>Asistent ma'lumotlari</h1>
                        </div>
                        <div className={cls.information__container}>

                            <div className={cls.information__item}>
                                <span>{assisData.assistantName.name}: </span>
                                <span>{assisData.assistantName.value} </span>
                            </div>
                            <div className={cls.information__item}>
                                <span>{assisData.assistantSurname.name}: </span>
                                <span>{assisData.assistantSurname.value} </span>
                            </div>
                            <div className={cls.information__item}>
                                <span>{assisData.assistentSalary.name}: </span>
                                <span>{assisData.assistentSalary.value} </span>
                            </div>
                        </div>
                    </div>
                )
            }
        </div>
    )
};

export default PercentageTests;