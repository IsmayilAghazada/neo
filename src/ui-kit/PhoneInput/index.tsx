import React from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/material.css';
import './index.scss';

interface IProps {
    value: string;
    onChange: (phone: string) => void;
}
export const PhoneNumber: React.FC<IProps> = ({ onChange, value }) => {
    return (
        <PhoneInput
            country="az"
            placeholder="+111 (11) 111-11-11"
            inputClass="phone-input"
            masks={{ az: '(..) ...-..-..' }}
            containerClass="phone-container"
            enableSearch
            searchClass="phone-search"
            dropdownClass="phone-dropdown"
            excludeCountries={['am']}
            specialLabel=""
            value={value}
            onChange={onChange}
        />
    );
};
PhoneNumber.displayName = 'PhoneNumber';
