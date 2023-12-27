/* eslint-disable no-nested-ternary */
/* eslint-disable no-extra-boolean-cast */
import * as React from 'react';
import Carousel from 'react-material-ui-carousel';
import { chunk } from 'lodash';
import { Grid, makeStyles, Container, useTheme, useMediaQuery, Box } from '@material-ui/core';
import { ArrowRightAlt } from '@material-ui/icons';
import { useAsyncData } from 'app/hooks';
import { IPaginatedData } from 'model';
import { IJobSeeker } from 'app/models/JobSeeker';
import { JobSeekerService } from 'app/services/JobSeeker';
import { isSuccess } from 'utils';
import { useTranslation } from 'react-i18next';
import { MenuItem } from '../../Layout/Menu/MenuItem';
import { FreelancerItem } from './FreelancerItem';

import './index.scss';

const useStyles = makeStyles((theme) => ({
    grow: {
        flexGrow: 1,
    },
    root: {
        flexGrow: 1,
        backgroundColor: '#fff',
        margin: 0,
        paddingBottom: 64,
    },
    carousel: {
        overflow: 'visible',
        '& div[class*="Carousel-prev"]': { left: '-16px' },
        '& div[class*="Carousel-next"]': { right: '-16px' },
        '& [class*="Carousel-buttonVisible"]': {
            margin: '0!important',
            '&:hover': {
                backgroundColor: '#2a41e8',
                opacity: '1!important',
            },
        },
        '& [class*="Carousel-indicators"]': { marginTop: 24 },
    },
    carouselGrid: {
        [theme.breakpoints.up('xs')]: {
            margin: 0,
        },
        [theme.breakpoints.up('md')]: {
            margin: '0 64px',
        },
    },
    title: { margin: '65px 0 40px 0', display: 'flex', flexWrap: 'wrap' },
}));

interface IProps {
    item: Array<IJobSeeker> | IJobSeeker;
}

export const Freelancer: React.FC<IProps> = ({ item }) => {
    const classes = useStyles();
    const theme = useTheme();
    const isLg = useMediaQuery(theme.breakpoints.up('md'));
    const isMd = useMediaQuery(theme.breakpoints.up('sm'));
    const justifyCenter = 'center';
    const justify = isLg || isMd ? 'space-between' : justifyCenter;

    return (
        <Grid className={classes.carouselGrid}>
            <Grid
                container
                justify={Array.isArray(item) && item.length === 2 ? (isLg ? justifyCenter : justify) : justify}
                spacing={2}
            >
                {Array.isArray(item) ? (
                    item.map((e, i) => (
                        <FreelancerItem freelancer={e} key={i} margin={item.length === 2 && (!isMd || isLg)} />
                    ))
                ) : (
                    <FreelancerItem freelancer={item} key={`${item.id}single`} />
                )}
            </Grid>
        </Grid>
    );
};

export const Freelancers: React.FC = () => {
    const classes = useStyles();
    const { t } = useTranslation(['Home']);
    const theme = useTheme();
    const isLg = useMediaQuery(theme.breakpoints.up('md'));
    const isMd = useMediaQuery(theme.breakpoints.up('sm'));
    const navButtonsAlwaysVisible = useMediaQuery(theme.breakpoints.up('md'));
    const [employeesList, setEmployeesList] = useAsyncData<IPaginatedData<IJobSeeker>>();

    const getMatrixedData = (items: IJobSeeker[]) => {
        let matrix = [];
        if (isLg) {
            matrix = chunk(items, 3);
        } else if (isMd) {
            matrix = chunk(items, 2);
        } else {
            matrix = chunk(items, 1);
        }
        return matrix;
    };

    React.useEffect(() => {
        setEmployeesList(() => JobSeekerService.getListAll({ skip: 0, take: isMd ? 10 : 9 }));
    }, []);

    return (
        isSuccess(employeesList) &&
        Boolean(employeesList.data.list.length) && (
            <Grid className={classes.root} spacing={2}>
                <Container>
                    <div className={classes.title}>
                        <Box display="inline-block" color="#333" fontSize="1.6rem">
                            {t('RegisteredJobseekers.title')}
                        </Box>
                        <div className={classes.grow} />
                        <MenuItem to="/employees" name={t('RegisteredJobseekers.actions.shortLink')}>
                            <ArrowRightAlt />
                        </MenuItem>
                    </div>
                    <Carousel
                        className={classes.carousel}
                        animation="fade"
                        key={getMatrixedData(employeesList.data.list).length}
                        timeout={100}
                        autoPlay={false}
                        indicators={!navButtonsAlwaysVisible}
                        navButtonsAlwaysInvisible={!navButtonsAlwaysVisible}
                        navButtonsAlwaysVisible={navButtonsAlwaysVisible}
                    >
                        {getMatrixedData(employeesList.data.list).map((e, i) => (
                            <Freelancer item={e} key={i} />
                        ))}
                    </Carousel>
                </Container>
            </Grid>
        )
    );
};
