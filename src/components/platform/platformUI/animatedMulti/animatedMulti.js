import React from 'react';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';

const animatedComponents = makeAnimated();

export const AnimatedMulti = React.memo(({ options, onChange, value, extraClass, fontSize }) => {
    const handleChange = (selectedOptions) => {
        if (onChange) {
            onChange(selectedOptions);
        }
    };

    return (
        <Select
            className={extraClass}
            styles={{
                control: (baseStyles) => ({
                    ...baseStyles,
                    fontSize: fontSize ? `${fontSize}px` : '16px',
                }),
                option: (provided) => ({
                    ...provided,
                    fontSize: fontSize ? `${fontSize}px` : '16px',
                    display: 'block',
                    whiteSpace: 'normal',
                }),
                singleValue: (provided) => ({
                    ...provided,
                    fontSize: fontSize ? `${fontSize}px` : '16px',
                }),
            }}
            isClearable={false}
            backspaceRemovesValue={false}

            closeMenuOnSelect={false}
            components={{
                ...animatedComponents,
                MultiValueRemove: animatedComponents.MultiValueRemove,
            }}
            isMulti
            options={options}
            onChange={handleChange}
            value={value}
        />
    );
});
