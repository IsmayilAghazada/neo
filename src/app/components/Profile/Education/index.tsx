/* eslint-disable no-extra-boolean-cast */
import { Button } from '@material-ui/core';
import { Add } from '@material-ui/icons';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { IEducation } from 'app/models/JobSeeker';
import { useSnackbar } from 'notistack';
import { ROUTES } from 'app/routes/consts';
import { useHistory } from 'react-router-dom';
import { EducationService } from 'app/services/JobSeeker/Education';
import { useBtnStyles } from 'ui-kit/Button';
import { EducationModal } from './Modal';
import { ProfileContext } from '../ProfileContext';
import { EducationItem } from './EducationItem';

export const Education: React.FC = () => {
    const { t } = useTranslation(['Common']);
    const btnClasses = useBtnStyles();
    const { enqueueSnackbar } = useSnackbar();
    const {
        location: { pathname },
    } = useHistory();
    const [openWithInit, setOpenwithInit] = React.useState<{ opened: boolean; initVal: IEducation }>({
        opened: false,
        initVal: null,
    });
    const { clientData } = React.useContext(ProfileContext);
    const { control, setValue, reset, watch } = useForm<{ educations: IEducation[] }>({
        mode: 'onBlur',
        defaultValues: {
            educations: [],
        },
    });
    const educations = watch('educations');
    const addEducation = (education: IEducation, id: any = null) => {
        if (id === null) {
            setValue('educations', [...educations, education]);
            enqueueSnackbar(t('Common:Success.default'), {
                variant: 'success',
                anchorOrigin: { horizontal: 'center', vertical: 'top' },
                autoHideDuration: 3000,
            });
        } else {
            const transformedData = educations.map((e) => {
                if (e.id === id) {
                    return education;
                }
                return e;
            });
            setValue(`educations`, transformedData);
            enqueueSnackbar(t('Common:Success.default'), {
                variant: 'success',
                anchorOrigin: { horizontal: 'center', vertical: 'top' },
                autoHideDuration: 3000,
            });
        }
        setOpenwithInit({ initVal: null, opened: false });
    };
    const onEdit = (index: number) => {
        setOpenwithInit({ opened: true, initVal: educations?.[index] as any });
    };
    const onRemove = (index: number) => {
        const transformedData = educations?.filter((_, i) => i !== index);
        setValue('educations', transformedData);
    };

    React.useEffect(() => {
        EducationService.getByJobSeekerId(clientData.data.id).then((data) => {
            reset({ educations: data });
        });
    }, []);

    return (
        <>
            <Controller control={control} name="educations" render={() => null} />
            {educations.map((education: IEducation, index: number) => (
                <EducationItem onEdit={onEdit} onRemove={onRemove} education={education} index={index} key={index} />
            ))}
            {!Boolean(educations.length) && (
                <div className="row justify-content-center margin-top-36 margin-bottom-24">{t('Common:noData')}</div>
            )}
            {pathname === ROUTES.PROFILE.PATH && (
                <>
                    <div
                        className={`row ${
                            Boolean(educations.length) ? 'padding-left-24' : 'justify-content-center'
                        } margin-top-12 margin-bottom-24`}
                    >
                        <div className="col-auto">
                            <Button
                                fullWidth
                                className={btnClasses.root}
                                startIcon={<Add />}
                                variant="contained"
                                color="secondary"
                                component="span"
                                onClick={() => setOpenwithInit({ opened: true, initVal: null })}
                            >
                                {t('Common:Action.ADD')}
                            </Button>
                        </div>
                    </div>

                    <EducationModal
                        onSave={addEducation}
                        initialData={openWithInit.initVal}
                        opened={openWithInit.opened}
                        onClose={() => setOpenwithInit({ opened: false, initVal: null })}
                    />
                </>
            )}
        </>
    );
};
Education.displayName = 'Education';
