import { Input } from 'ui-kit/Input';
import React from 'react';
import { Field } from 'ui-kit/Form/Field';
import { Controller, useForm } from 'react-hook-form';
import { IPortfolio } from 'app/models/JobSeeker';
import { MuiModal } from 'ui-kit/Modal';
import { Box, Button, Typography } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { useAsyncData } from 'app/hooks';
import { isError, isPending, isSuccess } from 'utils';
import { Alert, Skeleton } from '@material-ui/lab';
import { range } from 'lodash';
import { PortfolioService } from 'app/services/JobSeeker/Portfolio';
import { TextArea } from 'ui-kit/Textarea';
import { useBtnStyles } from 'ui-kit/Button';
import { validateMandatory, validateWebSiteUrl } from 'utils/validateAuth';
import { ValidationError } from 'ui-kit/ValidationError';
import { ProfileContext } from '../ProfileContext';

interface IProps {
    opened: boolean;
    initialData?: Partial<IPortfolio>;
    onClose: () => void;
    onSave: (data: IPortfolio, index?: number) => void;
}

export const PortfolioModal: React.FC<IProps> = ({ opened, onClose, initialData, onSave }) => {
    const { t } = useTranslation(['Profile', 'Common']);
    const { clientData } = React.useContext(ProfileContext);
    const btnClasses = useBtnStyles();
    const { control, handleSubmit, reset, errors } = useForm<IPortfolio>({
        defaultValues: {
            id: null,
            title: null,
            websiteUrl: null,
            description: null,
            jobSeeker: null,
        },
    });
    const [portfolio, setPortfolio] = useAsyncData<IPortfolio>();
    const handleSubmitForm = handleSubmit((model) => {
        setPortfolio(() => PortfolioService.save(clientData?.data?.id, { ...model, jobSeeker: clientData?.data?.id }));
    });

    React.useEffect(() => {
        if (isSuccess(portfolio)) {
            onSave(portfolio.data, initialData?.id || null);
        }
    }, [portfolio]);

    React.useEffect(() => {
        if (initialData !== null) {
            reset({ ...initialData });
        } else {
            reset({
                id: null,
                title: null,
                websiteUrl: null,
                description: null,
                jobSeeker: null,
            });
        }
    }, [initialData]);

    return (
        <MuiModal
            size="lg"
            opened={opened}
            onClose={() => onClose()}
            divider
            header={
                <Typography component="div">
                    <Box color="#333" fontSize="1.7em" fontWeight="fontWeightBold" mt={1} ml={2} mr={1} mb={1}>
                        {initialData == null ? t('Portfolio.header.add') : t('Portfolio.header.update')}
                    </Box>
                </Typography>
            }
            body={
                <div className="margin-top-24 margin-right-24 margin-bottom-24 margin-left-24">
                    {isPending(portfolio) && (
                        <div className="row">
                            {range(6).map((_, i) => (
                                <div key={i} className="col-xs-12 col-md-6 col-xl-6">
                                    <div className="submit-field">
                                        <Field
                                            label={<Skeleton width={150} height={30} variant="text" />}
                                            component={<Skeleton width={200} height={40} variant="text" />}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    {!isPending(portfolio) && (
                        <>
                            {isError(portfolio) && (
                                <div className="row">
                                    <div className="col-xs-12 col-md-12 col-xl-12">
                                        <div className="submit-field">
                                            <Alert severity="error">{portfolio.error.message}</Alert>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div className="row padding-24">
                                <div className="col-xs-12 col-md-12 col-xl-6">
                                    <div className="submit-field">
                                        <Controller control={control} name="id" render={() => null} />
                                        <Controller
                                            name="title"
                                            rules={{
                                                validate: (value) => validateMandatory(value, t),
                                            }}
                                            control={control}
                                            render={({ value, onChange }) => (
                                                <Field
                                                    label={t('Portfolio.title')}
                                                    component={
                                                        <Input
                                                            value={value}
                                                            onChange={onChange}
                                                            placeholder={t('Portfolio.title')}
                                                            fullWidth
                                                        />
                                                    }
                                                />
                                            )}
                                        />
                                        <ValidationError error={errors?.title?.message} />
                                    </div>
                                </div>

                                <div className="col-xs-12 col-md-12 col-xl-6">
                                    <div className="submit-field">
                                        <Controller
                                            name="websiteUrl"
                                            control={control}
                                            rules={{
                                                validate: (value) => validateWebSiteUrl(value, t, true),
                                            }}
                                            render={({ value, onChange }) => (
                                                <Field
                                                    label={t('Common:FormInputs.websiteUrl.label')}
                                                    component={
                                                        <Input
                                                            type="url"
                                                            value={value}
                                                            onChange={onChange}
                                                            placeholder="www.example.com"
                                                            fullWidth
                                                        />
                                                    }
                                                />
                                            )}
                                        />
                                        <ValidationError error={errors?.websiteUrl?.message} />
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-xs-12 col-md-12 col-xl-12">
                                    <div className="submit-field">
                                        <Controller
                                            name="description"
                                            control={control}
                                            rules={{
                                                validate: (value) => validateMandatory(value, t),
                                            }}
                                            render={({ value, onChange }) => (
                                                <Field
                                                    label={t('Common:FormInputs.description.label')}
                                                    component={
                                                        <TextArea
                                                            value={value}
                                                            onChange={onChange}
                                                            variant="outlined"
                                                            placeholder={t('Common:FormInputs.description.label')}
                                                            multiline
                                                            rows={2}
                                                            rowsMax={4}
                                                        />
                                                    }
                                                />
                                            )}
                                        />
                                        <ValidationError error={errors?.description?.message} />
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            }
            footer={
                <div className="margin-top-24 margin-bottom-24 margin-right-24 margin-left-24">
                    <Button
                        onClick={handleSubmitForm}
                        className={btnClasses.root}
                        variant="contained"
                        color="secondary"
                        component="span"
                    >
                        {t('Common:Action.SAVE')}
                    </Button>
                </div>
            }
        />
    );
};
PortfolioModal.displayName = 'PortfolioModal';
