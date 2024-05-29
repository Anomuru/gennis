import React, {useCallback, useEffect, useState} from 'react';
import {useHttp} from "hooks/http.hook";
import {BackUrl, headers} from "constants/global";
import Input from "components/platform/platformUI/input";
import Button from "components/platform/platformUI/button";
import Modal from "components/platform/platformUI/modal";
import {useForm} from "react-hook-form";
import InputForm from "components/platform/platformUI/inputForm";

const ChangeConstant = () => {

    const {name} = useHttp()


    const [data,setData] = useState({
        title: null,
        items: []
    })
    const [nameList,setNameList] = useState(null)

    const onTitleSubmit = (e) => {
        e.preventDefault()
        setData({...data,title: nameList})
    }
    // const onItemSubmit = (data,e) => {
    //     e.preventDefault()
    //     console.log(data)
    // }
    //
    //
    // const setItem = (input,name) => {
    //     // setItems({
    //     //     ...items,
    //     //     [name]: input
    //     // })
    // }


    const {request} = useHttp()

    const postData = () => {
        console.log(data)
        request(`${BackUrl}creat_tools`,"POST",JSON.stringify(data),headers())
    }

    return (
        <div className="createItems">

            <h1>Create Items</h1>


            <div className="container">
                <header>
                    { data.title ?
                        <div className="titleBox">
                            <h1>Name of List:</h1>
                            <span>{data.title}</span>
                        </div>
                        :
                        <form action="" onSubmit={onTitleSubmit}>
                            <Input onChange={setNameList} name={"nameOfList"} title={"Name of List"}  required={true} type={"text"}/>
                            <input type="submit" className="input-submit"/>
                        </form>
                    }
                </header>


                <main>
                    {
                        data.title ? <ItemsForm setData={setData} data={data}/> : null
                    }

                </main>
                <footer>
                    <Button onClickBtn={postData} >
                        Submit
                    </Button>
                </footer>

            </div>
        </div>
    );
};

const ItemsForm = ({setData,data}) => {


    const [nameOfInput,setNameOfInput] = useState("")
    const [extraTools,setExtraTools] = useState([])
    const [activeModal,setActiveModal] = useState(false)


    const [items,setItems] = useState([])


    useEffect(()=>{
        setData({...data,items:items})
    },[items])


    const onGetNameSubmit = (e) => {
        e.preventDefault()
        const data = {
            name: nameOfInput
        }
        setExtraTools([...extraTools,data])
        setActiveModal(false)
        setNameOfInput("")
        e.target.reset()
    }


    const renderItems = useCallback(() => {
        // eslint-disable-next-line array-callback-return
        return items.map((item,index) => {
            const keys = Object.keys(item)
            const renderKeys = keys.map(key => {
                return (
                    <div>
                        <span>{key}:</span>
                        <span>{item[key]}</span>
                    </div>
                )
            })
            return (
                <div className="addInput__item">
                    <span className="index">{index+1}</span>
                    {renderKeys}
                    <div className="tools">
                        <i className="fas fa-plus addInput-icon" />
                        <i className="fas fa-edit" />
                        <i onClick={() => deleteItem(index,items,setItems)} className="fas fa-times" />
                    </div>
                </div>
            )
        })
    },[items])

    const deleteItem = (index,list,setFunc) => {
        const newData = list.filter((_,i) => i !== index)
        setFunc(newData)
    }


    return (
        <>
            <Modal activeModal={activeModal} setActiveModal={setActiveModal}>
                <form className="getNameForm" action="" onSubmit={onGetNameSubmit}>

                    <label className="input-label" htmlFor={"name"}>
                        <span className="name-field">Name of Input</span>
                        <input
                            required={true}
                            type={"text"}
                            defaultValue={""}
                            id={"name"}
                            className="input-fields "
                            value={nameOfInput}
                            onChange={e => setNameOfInput(e.target.value)}
                        />
                    </label>
                    <input type="submit" className="input-submit"/>
                </form>
            </Modal>




            <div className="extraTools">
                <div className="extraTools__container column">

                    {renderItems()}
                </div>
                <div className="extraTools__container">
                    <AddInputForm
                        extraTools={extraTools}
                        setActiveModal={setActiveModal}
                        setExtraTools={setExtraTools}
                        setItems={setItems}
                        items={items}
                    />

                    {/*<AddListForm/>*/}
                </div>
            </div>


        </>
    )
}

const AddInputForm = ({extraTools,setActiveModal,setExtraTools,setItems,items}) => {

    const {
        register,
        handleSubmit,
        reset
    } = useForm({
        mode: "onBlur"
    })
    const onItemSubmit = (data,e) => {
        console.log(extraTools)
        e.preventDefault()
        setItems([...items,data])
        e.target.reset()
    }
    const addExtraInfo = useCallback( () => {
        return extraTools.map((item,index) => {
            return (
                <div className="addInput__extraInput">

                    <InputForm
                        name={item.name}
                        title={item.name}
                        type={"text"}
                        required={true}
                        register={register}
                    />
                    <i onClick={() => {
                        deleteItem(index, extraTools, setExtraTools)
                        reset()
                    }} className="fas fa-times" />
                </div>
            )
        })
    },[extraTools])




    const deleteItem = (index,list,setFunc) => {
        const newData = list.filter((_,i) => i !== index)
        setFunc(newData)
    }



    return (
        <div className="addInput">
            <h1>Create Item</h1>
            <form action="" onSubmit={handleSubmit(onItemSubmit)}>
                <InputForm
                    name={"name"}
                    title={"Name Of Item"}
                    type={"text"}
                    required={true}
                    register={register}
                />
                {addExtraInfo()}
                <i
                    onClick={() => {
                        setActiveModal(true)
                    }}
                    className="fas fa-plus addInput-icon" />
                <input type="submit" className="input-submit" />
            </form>

        </div>

    )
}

const AddListForm = () => {

    const [list,setList] = useState(null)

    const [createItem,setCreateItem] = useState(null)


    const onCreateSubmit = () => {
        console.log("hello")
        // setList({[name]: [...list.name,createItem]})
    }

    useEffect(()=> {
        console.log(createItem)
    },[createItem])

    return (
        <div className="addList">
            <h1>List name:</h1>
            <form className="addList__item">
                <Input onChange={setCreateItem} name={"Name"} type={"text"} title={"name"}/>
                <input  type="submit" className="input-submit" value="create"/>
            </form>

        </div>
    )
}
export default ChangeConstant;