import { Box, Typography } from '@material-ui/core';
import * as React from 'react';
import { Field } from 'ui-kit/Form/Field';
import { useTranslation } from 'react-i18next';
import { IAsyncData } from 'model';
import { isError, isLoading, isSuccess } from 'utils';
import { Alert, Skeleton } from '@material-ui/lab';
import { range } from 'lodash';
import { ICompany } from 'app/models/Company';
import moment from 'moment';

export const CompanyInfoViewer: React.FC<{ company: IAsyncData<ICompany> }> = ({ company }) => {
    const { t } = useTranslation(['Profile', 'Common']);

    return (
        <div className="row">
            {isError(company) && (
                <div className="col-xs-12 col-md-12 col-xl-12">
                    <div className="submit-field">
                        <Alert severity="error">{company.error.message}</Alert>
                    </div>
                </div>
            )}
            {isLoading(company) &&
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
            {isSuccess(company) && (
                <>
                    <div className="col-xs-12 col-md-6 col-xl-4">
                        <div className="submit-field">
                            <Field
                                label={t('ProfileInfo.name')}
                                component={
                                    <Typography component="div">
                                        <Box color="#808080" fontSize="1rem" fontWeight="fontWeightLight">
                                            {company.data?.name ?? <>&mdash;</>}
                                        </Box>
                                    </Typography>
                                }
                            />
                        </div>
                    </div>
                    <div className="col-xs-12 col-md-6  col-xl-4">
                        <div className="submit-field">
                            <Field
                                label={t('Common:FormInputs.websiteUrl.label')}
                                component={
                                    <Typography component="div">
                                        <Box color="#808080" fontSize="1rem" fontWeight="fontWeightLight">
                                            {company.data?.websiteUrl ?? <>&mdash;</>}
                                        </Box>
                                    </Typography>
                                }
                            />
                        </div>
                    </div>
                    <div className="col-xs-12 col-md-6 col-xl-4">
                        <div className="submit-field">
                            <Field
                                label={t('ProfileInfo.establishmentDate')}
                                component={
                                    <Typography component="div">
                                        <Box color="#808080" fontSize="1rem" fontWeight="fontWeightLight">
                                            {company.data?.establishmentDate ? (
                                                moment(company.data?.establishmentDate, 'YYYY-MM-DD').format(
                                                    'DD.MM.YYYY',
                                                )
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
                                label={t('Common:FormInputs.description.label')}
                                component={
                                    <Typography component="div">
                                        <Box color="#808080" fontSize="1rem" fontWeight="fontWeightLight">
                                            {company.data?.description ?? <>&mdash;</>}
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
CompanyInfoViewer.displayName = 'CompanyInfoViewer';
