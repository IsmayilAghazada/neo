/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { Avatar, Box, Button, CircularProgress, Grid, makeStyles, Paper, Typography } from '@material-ui/core';
import { ArrowRightAlt, ImageOutlined } from '@material-ui/icons';
import { useAsyncData } from 'app/hooks';
import { IBookmark } from 'app/models/Bookmark';
import { IJobSeeker } from 'app/models/JobSeeker';
import { ROUTES } from 'app/routes/consts';
import { BookmarkService } from 'app/services/Bookmark';
import { BACKEND_BASE_URL } from 'consts';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { useBtnStyles } from 'ui-kit/Button';
import { isInitial, isPending, isSuccess } from 'utils';
import { makePath } from 'utils/router';

const useStyles = makeStyles((theme) => ({
    subRoot: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        flexGrow: 1,
        backgroundColor: '#fff',
        margin: 0,
    },
    header: {
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        width: '100%',
    },
    paper: {
        border: 'none',
        boxShadow: '0 2px 12px rgba(0,0,0,0.12)',
        justifyContent: 'center',
        display: 'flex',
        flexDirection: 'column',
        transition: '0.35s',
        color: '#2a41e8',
        [theme.breakpoints.up('xs')]: {
            flex: '0 0 90%',
        },
        [theme.breakpoints.up('sm')]: {
            flex: '0 0 49%',
        },
        [theme.breakpoints.up('md')]: {
            flex: '0 0 32.3%',
        },
        '&:hover': {
            '&:hover': {
                '& $applyBtn': { backgroundColor: '#2a41e8', color: '#fff' },
            },
        },
    },
    image: { width: 120, marginTop: 12, marginLeft: 20, paddingTop: 17 },
    largeAvatar: {
        width: theme.spacing(13),
        height: theme.spacing(13),
    },
    freelancerDetail: {
        marginTop: 35,
        padding: '35px!important',
        width: '100%',
        backgroundColor: '#fafafa',
    },
    // raitingVal: {
    //     borderRadius: 4,
    //     backgroundColor: '#febe42',
    //     color: '#fff',
    //     padding: '5px 10px',
    //     marginRight: 10,
    // },
    viewProfileBtn: {
        '& [class*="iconSize"]': {
            display: 'none',
        },
        '&:hover': {
            '& [class*="iconSize"]': {
                display: 'flex',
            },
        },
    },
}));

interface IProps {
    freelancer: IJobSeeker;
    margin?: boolean;
}

export const FreelancerItem: React.FC<IProps> = ({ freelancer, margin = false }) => {
    const classes = useStyles();
    const { push } = useHistory();
    const btnClasses = useBtnStyles();
    const { t } = useTranslation(['Home', 'Common']);
    const [bookmarked, setBookmarked] = React.useState(Boolean(freelancer.bookmark));
    const [saveBookmark, setSave] = useAsyncData<IBookmark>();

    React.useEffect(() => {
        if (isSuccess(saveBookmark)) {
            setBookmarked((x) => !x);
        }
    }, [saveBookmark]);

    return (
        <Paper className={classes.paper} style={margin ? { marginRight: 24 } : {}}>
            <Grid alignItems="center" container className={classes.subRoot}>
                <Grid item alignItems="center" className={classes.header}>
                    {(isInitial(saveBookmark) || isSuccess(saveBookmark)) && (
                        <span
                            className={`bookmark-icon ${bookmarked ? 'bookmarked' : ''}`}
                            onClick={(event) => {
                                event.preventDefault();
                                setSave(() =>
                                    !bookmarked
                                        ? BookmarkService.save({
                                              type: 'JOBSEEKER',
                                              jobseeker: { id: freelancer.id } as IJobSeeker,
                                              post: null,
                                          })
                                        : BookmarkService.delete(
                                              !isInitial(saveBookmark) ? saveBookmark.data.id : freelancer.bookmark.id,
                                          ),
                                );
                            }}
                        />
                    )}
                    {isPending(saveBookmark) && (
                        <CircularProgress
                            style={{
                                position: 'absolute',
                                top: 36,
                                right: 36,
                                color: '#2b41e8',
                            }}
                            size="2.3rem"
                            color="primary"
                        />
                    )}
                    <Grid item className={classes.image}>
                        {freelancer?.user?.imageUrl ? (
                            <Avatar
                                className={classes.largeAvatar}
                                src={`${BACKEND_BASE_URL}/${freelancer?.user.imageUrl}`}
                            />
                        ) : (
                            <Avatar className={classes.largeAvatar}>
                                <ImageOutlined fontSize="large" />
                            </Avatar>
                        )}
                    </Grid>
                    <Grid style={{ marginTop: 12, marginLeft: 12 }} item alignItems="center">
                        <Typography component="div" variant="body1">
                            <Box color="#333" fontWeight="fontWeightBold">
                                {`${freelancer.firstName} ${freelancer.lastName}`}
                            </Box>
                        </Typography>
                    </Grid>

                    <Grid style={{ marginTop: 12, marginLeft: 12, marginRight: 12 }} item alignItems="center">
                        <Typography component="div" variant="body1">
                            <Box style={{ textAlign: 'center' }} fontSize="small" color="#333">
                                {freelancer.category && t<string>(`Common:INDUSTRIES.${freelancer.category}`)}
                            </Box>
                        </Typography>
                    </Grid>

                    {/* <Grid style={{ display: 'flex', marginTop: 12 }} item alignItems="center">
                        <div className={classes.raitingVal}>
                            <Box lineHeight={1.8} color="inherit" fontWeight="fontWeightBold">
                                4
                            </Box>
                        </div>
                        <Rating name="read-only" value={4} readOnly />
                    </Grid> */}
                </Grid>

                <Grid className={classes.freelancerDetail} item>
                    <Grid container justify="space-between" spacing={2}>
                        <Grid spacing={1} alignItems="center" item style={{ color: '#777' }}>
                            <Grid item>
                                <Box marginLeft={1} fontWeight="fontWeightBold">
                                    {t(`Common:GENDER.label`)}
                                </Box>
                            </Grid>
                            <Grid item style={{ color: '#333', display: 'flex' }}>
                                <Box marginLeft={1} fontWeight="fontWeightBold">
                                    {freelancer?.gender ? t(`Common:GENDER.${freelancer?.gender}`) : <>&mdash;</>}
                                </Box>
                            </Grid>
                        </Grid>

                        <Grid spacing={1} alignItems="center" item style={{ color: '#777' }}>
                            <Box marginLeft={1} fontWeight="fontWeightBold">
                                {t('Common:Salary.label')}
                            </Box>
                            <Box color="#333" marginLeft={1} fontWeight="fontWeightBold">
                                {freelancer?.expectedSalary ? (
                                    `${freelancer?.expectedSalary} ${freelancer?.currency ?? ''}`
                                ) : (
                                    <>&mdash;</>
                                )}
                            </Box>
                        </Grid>

                        {/* <Grid spacing={1} alignItems="center" item style={{ color: '#777' }}>
                            <Box marginLeft={1} fontWeight="fontWeightBold">
                                Job Success
                            </Box>
                            <Box color="#333" marginLeft={1} fontWeight="fontWeightBold">
                                100%
                            </Box>
                        </Grid> */}
                    </Grid>
                    <Grid item style={{ marginTop: 24 }}>
                        <Button
                            className={`${btnClasses.root} ${classes.viewProfileBtn}`}
                            fullWidth
                            variant="contained"
                            color="secondary"
                            endIcon={<ArrowRightAlt />}
                            onClick={() => push(makePath(ROUTES.PROFILE.VIEW_OTHER.PATH, { id: freelancer.user.id }))}
                        >
                            {t('RegisteredJobseekers.actions.viewProfile')}
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
        </Paper>
    );
};
