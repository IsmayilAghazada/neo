import * as React from 'react';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import 'moment/locale/az';
import 'moment/locale/ru';
import moment from 'moment';
import { Input } from 'ui-kit/Input';
import { ParsableDate } from '@material-ui/pickers/constants/prop-types';

interface IProps {
    value: ParsableDate;
    onChange: (val: moment.Moment) => void;
    locale?: string;
    variant?: 'dialog' | 'inline' | 'static';
}

const TextFieldComponent = (fieldProps: any) => (
    <Input
        onChange={fieldProps.onChange}
        inputRef={fieldProps.inputRef}
        value={fieldProps.value}
        placeholder="DD.MM.YYYY"
        endAdornment={fieldProps.InputProps?.endAdornment}
        fullWidth
    />
);

export const DateInput: React.FC<IProps> = ({ value, onChange, locale = 'az', variant = 'dialog' }) => (
    <MuiPickersUtilsProvider libInstance={moment} locale={locale} utils={MomentUtils}>
        <KeyboardDatePicker
            disableFuture
            autoOk
            minDate={new Date('1950-01-01')}
            maxDate={new Date()}
            format="DD.MM.YYYY"
            margin="normal"
            value={value}
            helperText={undefined}
            variant={variant}
            onChange={onChange}
            TextFieldComponent={TextFieldComponent}
        />
    </MuiPickersUtilsProvider>
);
DateInput.displayName = 'DateInput';
