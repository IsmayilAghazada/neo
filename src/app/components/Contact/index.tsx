import * as React from 'react';
import { Container, Grid, makeStyles } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { ContactForm } from './ContactForm';

import './index.scss';

const useStyles = makeStyles(() => ({
    grow: {
        flexGrow: 1,
    },
    root: {
        flexGrow: 1,
        backgroundColor: '#f9f9f9',
        margin: 0,
        paddingBottom: 64,
    },
}));
const Contact: React.FC = () => {
    const classes = useStyles();
    const { t } = useTranslation(['Common']);

    return (
        <Grid container className={classes.root}>
            <Container>
                <div className="row">
                    <div className="col-xl-12">
                        <div className="dashboard-box">
                            <div className="headline">
                                <h3>{t('Common:Questions.contact')}</h3>
                            </div>
                            <div className="content with-padding">
                                <ContactForm />
                            </div>
                        </div>
                    </div>
                </div>
            </Container>
        </Grid>
    );
};
Contact.displayName = 'Contact';
export default Contact;
