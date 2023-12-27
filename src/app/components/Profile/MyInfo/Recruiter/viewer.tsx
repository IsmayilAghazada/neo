import { Box, Typography } from '@material-ui/core';
import * as React from 'react';
import { Field } from 'ui-kit/Form/Field';
// import { useTranslation } from 'react-i18next';
import { IAsyncData } from 'model';
import { isError, isLoading, isSuccess } from 'utils';
import { Alert, Skeleton } from '@material-ui/lab';
import { range } from 'lodash';
import { IRecruiter } from 'app/models/Recruiter';
import moment from 'moment';

export const RecruiterInfoViewer: React.FC<{ recruiter: IAsyncData<IRecruiter> }> = ({ recruiter }) => {
    // const { t } = useTranslation('Common');

    return (
        <div className="row">
            {isError(recruiter) && (
                <div className="col-xs-12 col-md-12 col-xl-12">
                    <div className="submit-field">
                        <Alert severity="error">{recruiter.error.message}</Alert>
                    </div>
                </div>
            )}
            {isLoading(recruiter) &&
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
            {isSuccess(recruiter) && (
                <>
                    <div className="col-xs-12 col-md-6 col-xl-6">
                        <div className="submit-field">
                            <Field
                                label="First Name"
                                component={
                                    <Typography component="div">
                                        <Box color="#808080" fontSize="1rem" fontWeight="fontWeightLight">
                                            {recruiter.data.firstName ?? <>&mdash;</>}
                                        </Box>
                                    </Typography>
                                }
                            />
                        </div>
                    </div>
                    <div className="col-xs-12 col-md-6  col-xl-6">
                        <div className="submit-field">
                            <Field
                                label="Last Name"
                                component={
                                    <Typography component="div">
                                        <Box color="#808080" fontSize="1rem" fontWeight="fontWeightLight">
                                            {recruiter.data.lastName ?? <>&mdash;</>}
                                        </Box>
                                    </Typography>
                                }
                            />
                        </div>
                    </div>
                    <div className="col-xs-12 col-md-6 col-xl-6">
                        <div className="submit-field">
                            <Field
                                label="Birthday"
                                component={
                                    <Typography component="div">
                                        <Box color="#808080" fontSize="1rem" fontWeight="fontWeightLight">
                                            {recruiter.data.birthDay ? (
                                                moment(recruiter.data.birthDay, 'YYYY-MM-DD').format('DD.MM.YYYY')
                                            ) : (
                                                <>&mdash;</>
                                            )}
                                        </Box>
                                    </Typography>
                                }
                            />
                        </div>
                    </div>
                    <div className="col-xs-12 col-md-6 col-xl-6">
                        <div className="submit-field">
                            <Field
                                label="Gender"
                                component={
                                    <Typography component="div">
                                        <Box color="#808080" fontSize="1rem" fontWeight="fontWeightLight">
                                            {recruiter.data.gender ?? <>&mdash;</>}
                                        </Box>
                                    </Typography>
                                }
                            />
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};
RecruiterInfoViewer.displayName = 'RecruiterInfoViewer';
