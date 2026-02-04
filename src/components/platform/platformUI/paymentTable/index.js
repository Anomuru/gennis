import cls from "./paymentTable.module.sass";

const PaymentTable = ({ extraClass, children }) => {

    // const renderTable = () => {
    //     return data?.map((item, i) => (
    //         <>
    //             {item.students.length >= 1 ? (
    //                 <h2 className={extraClass}>
    //                     {item.class_number} {item.class_color}
    //                 </h2>
    //             ) : null}

    //             {item?.students.map((itemIn, idx) => (
    //                 <tbody key={itemIn.id || idx}>
    //                     <tr>
    //                         <td>{idx + 1}</td>
    //                         <td>{itemIn.name} {itemIn.surname}</td>
    //                         <td>{itemIn.phone}</td>
    //                         <td>{format(itemIn.total_debt)}</td>
    //                         <td>{format(itemIn.remaining_debt)}</td>
    //                         <td>{format(itemIn.total_dis)}</td>
    //                         <td>{format(itemIn.total_discount)}</td>
    //                         <td>{format(itemIn.cash)}</td>
    //                         <td>{format(itemIn.bank)}</td>
    //                         <td>{format(itemIn.click)}</td>
    //                     </tr>
    //                 </tbody>
    //             ))}
    //         </>
    //     ))
    // }

    return (
        <div className={extraClass}>
            <div className={cls.tableWrapper}>
                <table className={cls.table}>
                    {/* <thead>
                        <tr>
                            <th>No</th>
                            <th>Ism Familiya</th>
                            <th>Tel raqami</th>
                            <th>Oylik qarz</th>
                            <th>Qolgan qarz</th>
                            <th>Chegirma (1-yillik)</th>
                            <th>Chegirma (1-martalik)</th>
                            <th>Cash</th>
                            <th>Bank</th>
                            <th>Click</th>
                        </tr>
                    </thead>
                    {renderTable()} */}
                    {children}
                </table>
            </div>
        </div>
    );
};

export default PaymentTable;
