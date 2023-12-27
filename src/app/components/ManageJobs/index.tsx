import { Box, Button, Container, Fab, Grid, makeStyles, Typography } from '@material-ui/core';
import { Add, DeleteOutlined, EditOutlined } from '@material-ui/icons';
import { useAsyncData, useDependencies } from 'app/hooks';
import { IPost } from 'app/models/Post';
import { ROUTES } from 'app/routes/consts';
import { PostService } from 'app/services/Post';
import { EPostStatus } from 'enums';
import moment from 'moment';
import { useSnackbar } from 'notistack';
import * as React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { NavLink, useHistory } from 'react-router-dom';
import { useBtnStyles } from 'ui-kit/Button';
import { Loading } from 'ui-kit/Loading';
import { isPending, isSuccess, isError } from 'utils';
import { makePath } from 'utils/router';
import { CandidatesModal } from './CandidatesModal';
import './index.scss';

const useStyles = makeStyles(() => ({
    root: {
        flexGrow: 1,
        backgroundColor: '#f9f9f9',
        margin: 0,
        paddingBottom: 64,
    },
}));

const ManageJobs: React.FC = () => {
    const classes = useStyles();
    const { t } = useTranslation(['Company']);
    const btnClasses = useBtnStyles();
    const [jobList, setJobList] = useAsyncData<IPost[]>();
    const [deleteJob, setDeletedJob] = useAsyncData<string>();
    const [candidateState, setCandidateState] = React.useState({ opened: false, candidates: [] });
    const { push } = useHistory();
    const {
        storage: { userInfo },
    } = useDependencies();
    const { enqueueSnackbar } = useSnackbar();
    const getStatusClass = (status: string) => {
        if (status === EPostStatus.ACTIVE) {
            return 'green';
        }
        if (status === EPostStatus.INREVIEW) {
            return 'yellow';
        }
        return 'red';
    };
    const { control, reset, watch } = useForm<{ jobs: IPost[] }>({
        mode: 'onBlur',
        defaultValues: {
            jobs: [],
        },
    });
    const jobs = watch('jobs');

    React.useEffect(() => {
        if (userInfo.getValue()?.data?.id !== undefined) {
            setJobList(() => PostService.getByUserId(userInfo.getValue()?.data?.id));
        } else {
            push(ROUTES.PATH);
        }
    }, []);

    React.useEffect(() => {
        if (isSuccess(jobList)) {
            reset({ jobs: jobList.data });
        }
    }, [jobList]);

    React.useEffect(() => {
        if (isSuccess(deleteJob)) {
            const transformedData = jobs.filter((e) => Number(e.id) !== Number(deleteJob.data));
            reset({ jobs: transformedData });
        } else if (isError(deleteJob)) {
            enqueueSnackbar(deleteJob.error, {
                variant: 'error',
                anchorOrigin: {
                    horizontal: 'center',
                    vertical: 'top',
                },
                autoHideDuration: 3000,
            });
        }
    }, [deleteJob]);

    return (
        <Loading visible={isPending(jobList) || isPending(deleteJob)} fullPage={false}>
            <Controller control={control} name="educations" render={() => null} />
            <Grid container className={classes.root}>
                <Container>
                    <div className="row">
                        <div className="col-xl-12">
                            <div className="dashboard-headline padding-bottom-0">
                                <h3>{t('ManageJobs.title')}</h3>
                            </div>
                            <div className="dashboard-box">
                                <div className="headline">
                                    <h3>
                                        <i className="icon-material-outline-library-add" /> {t('ManageJobs.subTitle')}
                                    </h3>
                                </div>

                                <div className="content">
                                    {isSuccess(jobList) && !jobs.length && (
                                        <div className="container padding-top-35  padding-bottom-35">
                                            <div className="row justify-content-center margin-bottom-24">
                                                <div className="">{t('ManageJobs.empty')}</div>
                                            </div>
                                            <div className="row justify-content-center">
                                                <Button
                                                    className={`${btnClasses.root}`}
                                                    variant="contained"
                                                    color="secondary"
                                                    onClick={() => push(ROUTES.POST_JOB.PATH)}
                                                    endIcon={<Add />}
                                                >
                                                    {t('ManageJobs.actions.postAJob')}
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                    {isSuccess(jobList) && Boolean(jobs.length) && (
                                        <ul className="dashboard-box-list">
                                            {jobs.map((jobItem) => (
                                                <li key={jobItem.id}>
                                                    <div className="job-listing">
                                                        <div className="job-listing-details job-listing-details-manage">
                                                            <h3 className="job-listing-title">
                                                                <NavLink
                                                                    to={makePath(ROUTES.VIEW_JOB.PATH, {
                                                                        id: jobItem?.id,
                                                                    })}
                                                                >
                                                                    <Typography component="span" color="inherit">
                                                                        <Box
                                                                            style={{ marginRight: 8 }}
                                                                            fontWeight="bold"
                                                                            component="span"
                                                                            fontSize="18px"
                                                                        >
                                                                            {jobItem.title}
                                                                        </Box>
                                                                    </Typography>
                                                                </NavLink>
                                                                <span
                                                                    className={`dashboard-status-button ${getStatusClass(
                                                                        jobItem.status,
                                                                    )}`}
                                                                >
                                                                    {t(`Common:PostStatus.${jobItem.status}`)}
                                                                </span>
                                                            </h3>
                                                            <div className="job-listing-footer">
                                                                <ul>
                                                                    <li>
                                                                        <i className="icon-material-outline-date-range" />
                                                                        {t('ManageJobs.postedOn', {
                                                                            date: moment
                                                                                .utc(jobItem.createdAt)
                                                                                .format('DD.MM.YYYY'),
                                                                        })}
                                                                    </li>
                                                                </ul>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="buttons-to-right always-visible">
                                                        <Button
                                                            startIcon={
                                                                <i className="icon-material-outline-supervisor-account" />
                                                            }
                                                            endIcon={
                                                                <span className="button-info">
                                                                    {jobItem.jobseekers.length}
                                                                </span>
                                                            }
                                                            onClick={() =>
                                                                setCandidateState({
                                                                    opened: Boolean(jobItem.jobseekers.length),
                                                                    candidates: jobItem.jobseekers,
                                                                })
                                                            }
                                                            variant="contained"
                                                            color="secondary"
                                                        >
                                                            {t('ManageJobs.actions.candidates')}
                                                        </Button>
                                                        <Fab
                                                            onClick={() => {
                                                                push(
                                                                    makePath(ROUTES.EDIT_JOB.PATH, { id: jobItem.id }),
                                                                );
                                                            }}
                                                            size="small"
                                                            color="primary"
                                                            aria-label="add"
                                                        >
                                                            <EditOutlined />
                                                        </Fab>
                                                        <Fab
                                                            onClick={() => {
                                                                setDeletedJob(() =>
                                                                    PostService.deletePost(jobItem?.id),
                                                                );
                                                            }}
                                                            size="small"
                                                            color="primary"
                                                            aria-label="add"
                                                        >
                                                            <DeleteOutlined />
                                                        </Fab>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </Container>
            </Grid>
            <CandidatesModal
                opened={candidateState.opened}
                onClose={() => setCandidateState({ opened: false, candidates: [] })}
                jobseekers={candidateState.candidates}
            />
        </Loading>
    );
};
export default ManageJobs;
