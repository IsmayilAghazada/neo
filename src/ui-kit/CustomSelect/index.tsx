/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable react/jsx-no-duplicate-props */
/* eslint-disable no-use-before-define */
import React from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { makeStyles, withStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
    root: {
        minHeight: 48,
        outline: 'none',
        fontSize: '16px',
        color: '#808080',
        maxWidth: '100%',
        width: '100%',
        backgroundColor: '#fff',
        fontWeight: 500,
        borderRadius: 4,
        border: 'none',
        boxShadow: 'none',
    },
    input: { padding: '0 0 0 16px !important' },
    focused: {
        boxShadow: '0 0 1px 1px #7b87e2',
    },
    option: {
        fontSize: 15,
        '& > span': {
            marginRight: 10,
            fontSize: 18,
        },
    },
});

const CssTextField = withStyles({
    root: {
        minHeight: 48,
        outline: 'none',
        fontSize: '16px',
        color: '#808080',
        maxWidth: '100%',
        width: '100%',
        backgroundColor: '#fff',
        padding: 0,
        fontWeight: 500,
        borderRadius: 4,
        border: 'none !important',
        boxShadow: '0 0px 1px 1px rgb(0 0 0 / 12%)',
        content: 'none',
        '& .MuiOutlinedInput-root': {
            '& fieldset': {
                border: 'none !important',
            },
            '&:hover fieldset': {
                border: 'none !important',
            },
            '&.Mui-focused fieldset': {
                border: 'none !important',
            },
        },
    },
})(TextField);

interface IProps<T = any> {
    freeSolo?: boolean;
    placeholder?: string;
    multiple?: boolean;
    renderTags?: (value: string[]) => React.ReactNode;
    options: T[];
    renderOption: (option: T) => React.ReactNode;
    endAdornment?: React.ReactNode;
    startAdornment?: React.ReactNode;
    getOptionLabel: (option: T) => string;
    value: any;
    inputValue?: any;
    onChange: (event: any, newValue: any) => void;
    onInputChange?: (event: any, newValue: any) => void;
    loading?: boolean;
    showCloseBtn?: boolean;
    withoutBorder?: boolean;
}
export const CustomSelect: React.FC<IProps> = ({
    multiple = false,
    placeholder = '',
    renderTags,
    options,
    renderOption,
    getOptionLabel,
    freeSolo = false,
    endAdornment = null,
    startAdornment = null,
    value,
    onChange,
    onInputChange,
    loading = false,
    inputValue,
    showCloseBtn = true,
    withoutBorder = false,
}) => {
    const classes = useStyles();
    const { option, ...rest } = classes;

    return (
        <Autocomplete
            multiple={multiple}
            options={options}
            value={value}
            filterSelectedOptions
            inputValue={inputValue}
            loading={loading}
            onChange={onChange}
            onInputChange={onInputChange}
            classes={{
                root: classes.root,
                option,
            }}
            renderTags={renderTags}
            autoHighlight
            freeSolo={freeSolo}
            getOptionLabel={getOptionLabel}
            renderOption={renderOption}
            disableClearable={!showCloseBtn}
            renderInput={(params) => {
                const { inputProps, InputProps, ...others } = params;
                return (
                    <CssTextField
                        {...others}
                        style={withoutBorder ? { boxShadow: 'none' } : {}}
                        placeholder={placeholder}
                        variant="outlined"
                        inputProps={{
                            ...inputProps,
                            autoComplete: 'new-password', // disable autocomplete and autofill
                        }}
                        InputProps={{
                            ...InputProps,
                            endAdornment: (
                                <>
                                    {InputProps.endAdornment}
                                    {endAdornment}
                                </>
                            ),
                            startAdornment: (
                                <>
                                    {InputProps.startAdornment}
                                    {startAdornment}
                                </>
                            ),
                            classes: rest,
                            style: withoutBorder ? { boxShadow: 'none' } : {},
                        }}
                    />
                );
            }}
        />
    );
};
