/* eslint-disable no-nested-ternary */
import { Box, Button, CircularProgress, Typography } from '@material-ui/core';
import { DateInput } from 'ui-kit/DatePicker';
import { Input } from 'ui-kit/Input';
import * as React from 'react';
import { Field } from 'ui-kit/Form/Field';
import { useTranslation } from 'react-i18next';
import { MuiModal } from 'ui-kit/Modal';
import { IAsyncData } from 'model';
import { Controller, useForm } from 'react-hook-form';
import { useAsyncData, useDependencies, useLang } from 'app/hooks';
import { isLoading, isPending, isError, isSuccess } from 'utils';
import { range } from 'lodash';
import { Alert, Skeleton } from '@material-ui/lab';
import { ICompany } from 'app/models/Company';
import { CompanyService } from 'app/services/Company';
import { TextArea } from 'ui-kit/Textarea';
import { useBtnStyles } from 'ui-kit/Button';
import moment from 'moment';
import { validateMandatory, validateWebSiteUrl } from 'utils/validateAuth';
import { ValidationError } from 'ui-kit/ValidationError';

interface IProps {
    opened: boolean;
    onClose: () => void;
    initialData: IAsyncData<ICompany>;
}
export const CompanyInfoModal: React.FC<IProps> = ({ opened, onClose, initialData }) => {
    const { t } = useTranslation(['Profile', 'Common']);
    const btnClasses = useBtnStyles();
    const { messageBus } = useDependencies();
    const { currentLang } = useLang();
    const [companyInfo, setCompanyInfo] = useAsyncData<ICompany>();
    const { control, reset, handleSubmit, errors } = useForm<ICompany>({
        defaultValues: {
            id: null,
            name: null,
            description: null,
            establishmentDate: null,
            websiteUrl: null,
        },
    });
    const handleSubmitForm = handleSubmit((model) => {
        const establishmentDate = model.establishmentDate
            ? moment(model.establishmentDate, 'DD.MM.YYYY').format('YYYY-MM-DD')
            : null;
        setCompanyInfo(() => CompanyService.save(initialData.data.id, { ...model, establishmentDate }));
    });

    React.useEffect(() => {
        if (isSuccess(companyInfo)) {
            messageBus.publish({ type: 'MY_INFO_MODAL', payload: false });
        }
    }, [companyInfo]);

    React.useEffect(() => {
        if (isSuccess(initialData)) {
            reset({
                name: initialData.data?.name ?? null,
                websiteUrl: initialData.data?.websiteUrl ?? null,
                establishmentDate: initialData.data?.establishmentDate
                    ? moment(initialData.data?.establishmentDate, 'YYYY-MM-DD').format('DD.MM.YYYY')
                    : null,
                description: initialData.data?.description ?? null,
            });
        }
    }, [initialData]);

    return (
        <MuiModal
            mode="overlay"
            opened={opened}
            onClose={onClose}
            divider
            headerPadding
            header={
                <>
                    <div>
                        <Typography component="div">
                            <Box color="#333" fontSize="1.7rem" fontWeight="fontWeightBold" m={1}>
                                {t('titles.profileInfo')}
                            </Box>
                        </Typography>
                    </div>
                </>
            }
            body={
                <>
                    {isLoading(initialData) ||
                        (isPending(companyInfo) && (
                            <div className="row">
                                {range(10).map((_, i) => (
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
                        ))}
                    {!isLoading(initialData) && !isPending(companyInfo) && (
                        <>
                            {isError(companyInfo) && (
                                <div className="row">
                                    <div className="col-xs-12 col-md-12 col-xl-12">
                                        <div className="submit-field">
                                            <Alert severity="error">{companyInfo.error.message}</Alert>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div className="row">
                                <div className="col-xs-12 col-md-6 col-xl-6">
                                    <div className="submit-field">
                                        <Controller
                                            name="name"
                                            control={control}
                                            rules={{
                                                validate: (value) => validateMandatory(value, t),
                                            }}
                                            render={({ value, onChange }) => (
                                                <Field
                                                    label={t('ProfileInfo.name')}
                                                    component={
                                                        <Input
                                                            value={value}
                                                            onChange={onChange}
                                                            placeholder={t('ProfileInfo.name')}
                                                            fullWidth
                                                        />
                                                    }
                                                />
                                            )}
                                        />
                                        <ValidationError error={errors?.name?.message} />
                                    </div>
                                </div>

                                <div className="col-xs-12 col-md-6 col-xl-6">
                                    <div className="submit-field">
                                        <Controller
                                            name="websiteUrl"
                                            control={control}
                                            rules={{
                                                validate: (value) => validateWebSiteUrl(value, t),
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

                                <div className="col-xs-12 col-md-6 col-xl-6">
                                    <div className="submit-field">
                                        <Controller
                                            name="establishmentDate"
                                            control={control}
                                            rules={{
                                                validate: (value) =>
                                                    validateMandatory(
                                                        value
                                                            ? moment(value, 'DD.MM.YYYY').format('YYYY-MM-DD')
                                                            : value,
                                                        t,
                                                    ),
                                            }}
                                            render={({ value, onChange }) => (
                                                <Field
                                                    label={t('ProfileInfo.establishmentDate')}
                                                    component={
                                                        <DateInput
                                                            value={value}
                                                            onChange={onChange}
                                                            locale={currentLang.toLocaleLowerCase()}
                                                        />
                                                    }
                                                />
                                            )}
                                        />
                                        <ValidationError error={errors?.establishmentDate?.message} />
                                    </div>
                                </div>

                                <div className="col-xs-12 col-md-6 col-xl-6">
                                    <div className="submit-field">
                                        <Controller
                                            name="description"
                                            control={control}
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
                </>
            }
            footer={
                <div>
                    <Button
                        onClick={(isLoading(initialData) || !isPending(companyInfo)) && handleSubmitForm}
                        className={btnClasses.root}
                        variant="contained"
                        color="secondary"
                    >
                        {isLoading(initialData) || isPending(companyInfo) ? (
                            <CircularProgress size="1.5rem" color="primary" />
                        ) : (
                            t('Common:Action.SAVE')
                        )}
                    </Button>
                </div>
            }
        />
    );
};
CompanyInfoModal.displayName = 'CompanyInfoModal';
