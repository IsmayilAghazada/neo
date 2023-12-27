import * as React from 'react';
import {
    Grid,
    makeStyles,
    Paper,
    Box,
    Typography,
    List,
    Button,
    useTheme,
    useMediaQuery,
    Avatar,
} from '@material-ui/core';
import { RoomOutlined, BusinessCenterOutlined, QueryBuilderOutlined } from '@material-ui/icons';
import { BACKEND_BASE_URL } from 'consts';
import moment from 'moment';
import { IPost } from 'app/models/Post';
import { makePath } from 'utils/router';
import { ROUTES } from 'app/routes/consts';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useBtnStyles } from 'ui-kit/Button';

const useStyles = makeStyles((theme) => ({
    subRoot: {
        flexGrow: 1,
        backgroundColor: '#fff',
        margin: 0,
    },
    paper: {
        border: 'none',
        boxShadow: 'none',
        justifyContent: 'center',
        display: 'flex',
        flexDirection: 'column',
        margin: 0,
        padding: '30px 35px',
        color: '#2a41e8',
        flex: '0 0 100%',
        borderLeft: '3px solid transparent',
        '&:hover': {
            borderLeft: '3px solid #2a41e8',
            borderRadius: '3px 3px 0 0',
            '&:hover': {
                '& $applyBtn': { backgroundColor: '#2a41e8', color: '#fff' },
            },
        },
    },
    gridListTile: {
        height: 'auto',
        textAlign: 'left',
        listStyle: 'none',
        width: '100%',
    },
    control: { padding: theme.spacing(2) },
    action: {
        display: 'flex',
        justifyContent: 'flex-end',
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: 160,
        },
    },
    description: { flexGrow: 1 },
    image: { width: 100, maxHeight: 128 },
    applyBtn: {
        backgroundColor: '#f0f0f0',
    },
    largeAvatar: {
        width: theme.spacing(7),
        height: theme.spacing(7),
    },
}));

export const FeatureJobItem: React.FC<{ data: Partial<IPost> }> = ({ data }) => {
    const classes = useStyles();
    const btnClasses = useBtnStyles();
    const theme = useTheme();
    const { t } = useTranslation(['Home', 'Common']);
    const { push } = useHistory();
    const isDesktop = useMediaQuery(theme.breakpoints.up('md'));

    return (
        <Paper className={classes.paper}>
            <Grid alignItems="center" container className={classes.subRoot} spacing={1}>
                {isDesktop && (
                    <Grid item className={classes.image}>
                        {data.user?.imageUrl ? (
                            <Avatar className={classes.largeAvatar} src={`${BACKEND_BASE_URL}/${data.user.imageUrl}`} />
                        ) : (
                            <Avatar className={classes.largeAvatar}>
                                <BusinessCenterOutlined />
                            </Avatar>
                        )}
                    </Grid>
                )}
                <Grid item className={classes.description}>
                    <div className="job-listing-description">
                        <Typography component="div" variant="body1">
                            <Box color="#333" fontWeight="fontWeightBold">
                                {data.title}
                            </Box>
                        </Typography>
                        <div>
                            <List>
                                <Grid item xs={12}>
                                    <Grid container justify="flex-start" spacing={2}>
                                        <Grid
                                            alignItems="center"
                                            item
                                            style={{
                                                color: '#777',
                                                display: 'inline-flex',
                                                padding: 0,
                                            }}
                                        >
                                            <RoomOutlined />
                                            <Box marginLeft={1} fontWeight="fontWeightBold">
                                                {data.location?.city ? (
                                                    `${data.location?.city}, ${data.location?.country}`
                                                ) : (
                                                    <>&mdash;</>
                                                )}
                                            </Box>
                                        </Grid>
                                        <Grid
                                            spacing={1}
                                            alignItems="center"
                                            item
                                            style={{ color: '#777', display: 'inline-flex' }}
                                        >
                                            <BusinessCenterOutlined />
                                            <Box marginLeft={1} fontWeight="fontWeightBold">
                                                {t(`Common:JobType.${data.type}`)}
                                            </Box>
                                        </Grid>
                                        <Grid
                                            spacing={1}
                                            alignItems="center"
                                            item
                                            style={{ color: '#777', display: 'inline-flex' }}
                                        >
                                            <QueryBuilderOutlined />
                                            <Box marginLeft={1} fontWeight="fontWeightBold">
                                                {moment.utc(data.createdAt).local().format('DD.MM.YYYY')}
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </List>
                        </div>
                    </div>
                </Grid>
                <Grid item className={classes.action}>
                    <Button
                        fullWidth={!isDesktop}
                        className={`${btnClasses.root} ${classes.applyBtn}`}
                        variant="contained"
                        size="large"
                        onClick={() => push(makePath(ROUTES.VIEW_JOB.PATH, { id: data.id }))}
                    >
                        {t('Common:Action.REQUEST')}
                    </Button>
                </Grid>
            </Grid>
        </Paper>
    );
};
