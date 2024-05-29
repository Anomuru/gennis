import React, {useCallback} from 'react';
import "../tables.sass"

const StudentInfosHistoryTable = React.memo(({data,studentAtt,activeRowsInTable}) => {

    const renderBalls = useCallback(() => {
        return data?.map((item,index) => {
            return (
                <tr>
                    <td>{ index + 1 }</td>

                    {activeRowsInTable?.groupName ? <td>{item.group_name}</td> : null}
                    {activeRowsInTable?.joinedDay ? <td>{item.joined_day}</td> : null}
                    {activeRowsInTable?.leftDay ?  <td>{item.left_day}</td> : null}
                    {activeRowsInTable?.reason ? <td>{item.reason}</td> : null}
                    {activeRowsInTable?.teacherName ? <td>{item.teacher_name}</td> : null}
                    {activeRowsInTable?.teacherSurname ? <td>{item.teacher_surname}</td> : null}

                    {activeRowsInTable?.degree ? <td >{item.degree}</td> : null}
                    {activeRowsInTable?.month ? <td>{item.month}</td> : null}
                    {activeRowsInTable?.subject ?  <td>{item.subject}</td> : null}

                </tr>
            )
        })
    },[data, studentAtt])

    const renderedBalls = renderBalls()

    return (
        <div className="tableBox">
            <table>
                <thead>
                    <tr className="tbody_th">
                        <th />

                        {activeRowsInTable?.groupName ? <th>Gruppa nomi</th> : null}
                        {activeRowsInTable?.joinedDay ? <th>Qoshilgan kuni</th> : null}
                        {activeRowsInTable?.leftDay ? <th>Chiqib ketgan kuni </th> : null}
                        {activeRowsInTable?.reason ? <th>Sabab</th> : null}
                        {activeRowsInTable?.teacherName ? <th>O'qituvchi ismi</th> : null}
                        {activeRowsInTable?.teacherSurname ? <th>O'qituvchi familyasi</th> : null}


                        {activeRowsInTable?.degree ? <th>Baho</th> : null}
                        {activeRowsInTable?.month ? <th>Oy</th> : null}
                        {activeRowsInTable?.subject ? <th>Fan</th> : null}

                    </tr>
                </thead>
                <tbody>
                    {renderedBalls}
                </tbody>
            </table>
        </div>
    );
})

export default StudentInfosHistoryTable;