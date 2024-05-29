import React from 'react'
import {ComponentPreview, Previews} from '@react-buddy/ide-toolbox'
import {PaletteTree} from './palette'
import PlatformBooks from "pages/platformContent/platformBooks/platformBooks";
import LocationMoneys from "pages/platformContent/platformAccounting/locationMoneys/locationMoneys";

const ComponentPreviews = () => {
    return (
        <Previews palette={<PaletteTree/>}>
            <ComponentPreview path="/PlatformBooks">
                <PlatformBooks/>
            </ComponentPreview>
            <ComponentPreview path="/LocationMoneys">
                <LocationMoneys/>
            </ComponentPreview>
        </Previews>
    )
}

export default ComponentPreviews