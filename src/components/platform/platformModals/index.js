import AddGroupModal from "components/platform/platformModals/addGroup/AddGroupModal";
import CreateGroupModal from "components/platform/platformModals/createGroup/CreateGroupModal";
import React, {useCallback, useEffect, useState} from "react";




const Modals = React.memo(({btns,setMsg,setTypeMsg,setActiveMessage,locationId}) => {

    const [modalBtn,setModalBtns] = useState([])


    useEffect(()=> {
        setModalBtns(btns)
    },[btns])


    const renderModals = useCallback(() => {
        // eslint-disable-next-line array-callback-return
        return modalBtn.map((item,index) => {
            if (item.typeModal) {
                if (item.name === "createGroup") {
                    return <CreateGroupModal
                        key={index}
                        setMsg={setMsg}
                        setTypeMsg={setTypeMsg}
                        btnName={item.name}
                        activeModal={item.activeModal}
                        setActiveMessage={setActiveMessage}
                    />
                }
                if (item.name === "addGroup") {
                    return <AddGroupModal
                        key={index}
                        locationId={locationId}
                        setActiveMessage={setActiveMessage}
                        setTypeMsg={setTypeMsg}
                        btnName={item.name}
                        activeModal={item.activeModal}
                        setMsg={setMsg}
                    />
                }
            }
        })
    },[modalBtn, setMsg,setTypeMsg,setActiveMessage])


    const rendered = renderModals()

    return (
        rendered
    );
})


export default Modals
