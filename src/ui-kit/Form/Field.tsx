/* eslint-disable jsx-a11y/label-has-associated-control */
import { createStyles, FormControl, FormGroup, makeStyles, useMediaQuery } from '@material-ui/core';
import * as React from 'react';

import { StyledFormLabel } from './StyledFormLabel';

const useStyles = makeStyles(() =>
    createStyles({
        formControl: { width: '100%' },
    }),
);

interface IProps {
    label?: string | React.ReactNode;
    row?: boolean;
    component: React.ReactNode;
}

export const Field: React.FC<IProps> = ({ component, label, row = true }) => {
    const classes = useStyles();
    const isMobDevice = useMediaQuery('(max-width: 767px)');
    return (
        <FormControl
            color="secondary"
            component="fieldset"
            className={classes.formControl}
            style={{ marginTop: label || isMobDevice ? 0 : 36 }}
        >
            {label && <StyledFormLabel>{label}</StyledFormLabel>}
            <FormGroup row={row}>{component}</FormGroup>
        </FormControl>
    );
};
Field.displayName = 'Field';
