import { createStyles, makeStyles, Typography } from '@material-ui/core';
import * as React from 'react';
import { Trans } from 'react-i18next';

const useStyles = makeStyles((theme) =>
    createStyles({
        noRecords: {
            width: '100%',
            marginTop: '100px',
            marginBottom: '12px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            [theme.breakpoints.down('md')]: {
                marginTop: 0,
            },
        },
    }),
);
export const NoRecordsPanel: React.FC = () => {
    const classes = useStyles();
    return (
        <div className={classes.noRecords}>
            <img src="/assets/images/noRecord.svg" alt="" />
            <br />
            <Trans
                i18nKey="noRecord"
                ns="Common"
                components={[
                    <Typography component="div" variant="h5" />,
                    <br />,
                    <Typography component="div" variant="h6" />,
                ]}
            />
        </div>
    );
};
