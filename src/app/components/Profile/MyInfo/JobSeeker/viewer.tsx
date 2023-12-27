import { Box, Chip, createStyles, makeStyles, Typography } from '@material-ui/core';
import * as React from 'react';
import { Field } from 'ui-kit/Form/Field';
import { useTranslation } from 'react-i18next';
import { IAsyncData } from 'model';
import { IJobSeeker } from 'app/models/JobSeeker';
import { isError, isLoading, isSuccess } from 'utils';
import { Alert, Skeleton } from '@material-ui/lab';
import { range } from 'lodash';
import { useAsyncData, useDependencies } from 'app/hooks';
import { JobSeekerService } from 'app/services/JobSeeker';
import { BACKEND_BASE_URL } from 'consts';
import { saveAs } from 'file-saver';
import moment from 'moment';
import { DocFileLoader } from '../../DocFileLoader';

const useStyles = makeStyles((theme) =>
    createStyles({
        chipWrapper: {
            display: 'flex',
            justifyContent: 'flex-start',
            flexWrap: 'wrap',
            marginBottom: theme.spacing(3),
            marginTop: theme.spacing(1),
            '& > *': {
                margin: theme.spacing(0.5),
            },
        },
    }),
);

export const JobSeekerInfoViewer: React.FC<{ jobSeeker: IAsyncData<IJobSeeker> }> = ({ jobSeeker }) => {
    const { t } = useTranslation(['Profile', 'Common']);
    const classes = useStyles();
    const { messageBus } = useDependencies();
    const [deleteResume, setDeletedResume] = useAsyncData();

    React.useEffect(() => {
        if (isSuccess(deleteResume)) {
            messageBus.publish({ type: 'MY_INFO_MODAL', payload: false });
        }
    }, [deleteResume]);

    return (
        <div className="row">
            {isError(jobSeeker) && (
                <div className="col-xs-12 col-md-12 col-xl-12">
                    <div className="submit-field">
                        <Alert severity="error">{jobSeeker.error.message}</Alert>
                    </div>
                </div>
            )}
            {isLoading(jobSeeker) &&
                range(10).map((_, i) => (
                    <div key={i} className="col-xs-12 col-md-6 col-xl-4">
                        <div className="submit-field">
                            <Field
                                label={<Skeleton width={150} height={25} variant="text" />}
                                component={<Skeleton width={200} height={25} variant="text" />}
                            />
                        </div>
                    </div>
                ))}
            {isSuccess(jobSeeker) && (
                <>
                    <div className="col-xs-12 col-md-6 col-xl-4">
                        <div className="submit-field">
                            <Field
                                label={t('Common:FormInputs.firstName.label')}
                                component={
                                    <Typography component="div">
                                        <Box color="#808080" fontSize="1rem" fontWeight="fontWeightLight">
                                            {jobSeeker.data.firstName ?? <>&mdash;</>}
                                        </Box>
                                    </Typography>
                                }
                            />
                        </div>
                    </div>
                    <div className="col-xs-12 col-md-6  col-xl-4">
                        <div className="submit-field">
                            <Field
                                label={t('Common:FormInputs.lastName.label')}
                                component={
                                    <Typography component="div">
                                        <Box color="#808080" fontSize="1rem" fontWeight="fontWeightLight">
                                            {jobSeeker.data.lastName ?? <>&mdash;</>}
                                        </Box>
                                    </Typography>
                                }
                            />
                        </div>
                    </div>
                    <div className="col-xs-12 col-md-6 col-xl-4">
                        <div className="submit-field">
                            <Field
                                label={t('ProfileInfo.birthday')}
                                component={
                                    <Typography component="div">
                                        <Box color="#808080" fontSize="1rem" fontWeight="fontWeightLight">
                                            {jobSeeker.data.birthDay ? (
                                                moment(jobSeeker.data.birthDay, 'YYYY-MM-DD').format('DD.MM.YYYY')
                                            ) : (
                                                <>&mdash;</>
                                            )}
                                        </Box>
                                    </Typography>
                                }
                            />
                        </div>
                    </div>
                    <div className="col-xs-12 col-md-6 col-xl-4">
                        <div className="submit-field">
                            <Field
                                label={t('Common:GENDER.label')}
                                component={
                                    <Typography component="div">
                                        <Box color="#808080" fontSize="1rem" fontWeight="fontWeightLight">
                                            {jobSeeker.data.gender ? (
                                                t(`Common:GENDER.${jobSeeker.data.gender}`)
                                            ) : (
                                                <>&mdash;</>
                                            )}
                                        </Box>
                                    </Typography>
                                }
                            />
                        </div>
                    </div>
                    <div className="col-xs-12 col-md-6 col-xl-4">
                        <div className="submit-field">
                            <Field
                                label={t('Common:SalaryType.label')}
                                component={
                                    <Typography component="div">
                                        <Box color="#808080" fontSize="1rem" fontWeight="fontWeightLight">
                                            {jobSeeker.data.salaryType ? (
                                                t(`Common:SalaryType.${jobSeeker.data.salaryType}`)
                                            ) : (
                                                <>&mdash;</>
                                            )}
                                        </Box>
                                    </Typography>
                                }
                            />
                        </div>
                    </div>
                    <div className="col-xs-12 col-md-6 col-xl-4">
                        <div className="submit-field">
                            <Field
                                label={t('ProfileInfo.expectedSalary')}
                                component={
                                    <Typography component="div">
                                        <Box color="#808080" fontSize="1rem" fontWeight="fontWeightLight">
                                            {jobSeeker.data.expectedSalary ?? <>&mdash;</>}
                                        </Box>
                                    </Typography>
                                }
                            />
                        </div>
                    </div>
                    <div className="col-xs-12 col-md-6 col-xl-4">
                        <div className="submit-field">
                            <Field
                                label={t('Common:Currency.label')}
                                component={
                                    <Typography component="div">
                                        <Box color="#808080" fontSize="1rem" fontWeight="fontWeightLight">
                                            {jobSeeker.data.currency ?? <>&mdash;</>}
                                        </Box>
                                    </Typography>
                                }
                            />
                        </div>
                    </div>
                    <div className="col-xs-12 col-md-6 col-xl-4">
                        <div className="submit-field">
                            <Field
                                label={t('Common:INDUSTRIES.label')}
                                component={
                                    <Typography component="div">
                                        <Box color="#808080" fontSize="1rem" fontWeight="fontWeightLight">
                                            {jobSeeker.data.category ? (
                                                t(`Common:INDUSTRIES.${jobSeeker.data.category}`)
                                            ) : (
                                                <>&mdash;</>
                                            )}
                                        </Box>
                                    </Typography>
                                }
                            />
                        </div>
                    </div>
                    <div className="col-xs-12 col-md-6 col-xl-4">
                        <div className="submit-field">
                            <Field
                                label={t('ProfileInfo.resume')}
                                component={
                                    jobSeeker.data.resumeUrl ? (
                                        <DocFileLoader
                                            deleteBtnShown
                                            onDelete={() => {
                                                setDeletedResume(() =>
                                                    JobSeekerService.deleteResume(jobSeeker.data.id),
                                                );
                                            }}
                                            onViewClick={() => {
                                                JobSeekerService.downloadResume(
                                                    `${BACKEND_BASE_URL}/${jobSeeker.data.resumeUrl}`,
                                                ).then((data) => {
                                                    saveAs(
                                                        data,
                                                        `${jobSeeker.data.id}.${
                                                            jobSeeker.data.resumeUrl.split('.')[1]
                                                        }`,
                                                    );
                                                });
                                            }}
                                            mode="view"
                                            value={jobSeeker.data.resumeUrl}
                                        />
                                    ) : (
                                        <Typography component="div">
                                            <Box color="#808080" fontSize="1rem" fontWeight="fontWeightLight">
                                                <>&mdash;</>
                                            </Box>
                                        </Typography>
                                    )
                                }
                            />
                        </div>
                    </div>
                    <div className="col-xs-12 col-md-6 col-xl-4">
                        <div className="submit-field">
                            <Field
                                label={t('Common:Skills.label')}
                                component={
                                    <div className={classes.chipWrapper}>
                                        {jobSeeker.data.skills?.map(({ id, name }) => (
                                            <Chip clickable key={id} label={name} color="secondary" />
                                        )) ?? <>&mdash;</>}
                                    </div>
                                }
                            />
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};
JobSeekerInfoViewer.displayName = 'JobSeekerInfoViewer';
