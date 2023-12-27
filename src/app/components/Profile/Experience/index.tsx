import { Button } from '@material-ui/core';
import { Add } from '@material-ui/icons';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { IExperience } from 'app/models/JobSeeker';
import { ExperienceService } from 'app/services/JobSeeker/Experience';
import { useSnackbar } from 'notistack';
import { ROUTES } from 'app/routes/consts';
import { useHistory } from 'react-router-dom';
import { useBtnStyles } from 'ui-kit/Button';
import { ExperienceModal } from './Modal';
import { ProfileContext } from '../ProfileContext';
import { ExperienceItem } from './ExperienceItem';

export const Experience: React.FC = () => {
    const { t } = useTranslation('Common');
    const { enqueueSnackbar } = useSnackbar();
    const btnClasses = useBtnStyles();
    const {
        location: { pathname },
    } = useHistory();
    const [openWithInit, setOpenwithInit] = React.useState<{ opened: boolean; initVal: IExperience }>({
        opened: false,
        initVal: null,
    });
    const { clientData } = React.useContext(ProfileContext);
    const { control, setValue, watch, reset } = useForm<{ experiences: IExperience[] }>({
        mode: 'onBlur',
        defaultValues: {
            experiences: [],
        },
    });
    const experiences = watch('experiences');
    const addExperience = (experience: IExperience, id: any = null) => {
        if (id === null) {
            setValue('experiences', [...experiences, experience]);
            enqueueSnackbar(t('Common:Success.default'), {
                variant: 'success',
                anchorOrigin: { horizontal: 'center', vertical: 'top' },
                autoHideDuration: 3000,
            });
        } else {
            const transformedData = experiences.map((e) => {
                if (e.id === id) {
                    return experience;
                }
                return e;
            });
            setValue('experiences', transformedData);
            enqueueSnackbar(t('Common:Success.default'), {
                variant: 'success',
                anchorOrigin: { horizontal: 'center', vertical: 'top' },
                autoHideDuration: 3000,
            });
        }
        setOpenwithInit({ initVal: null, opened: false });
    };
    const onEdit = (index: number) => {
        setOpenwithInit({ opened: true, initVal: experiences?.[index] as any });
    };
    const onRemove = (index: number) => {
        const transformedData = experiences?.filter((_, i) => i !== index);
        setValue('experiences', transformedData);
    };

    React.useEffect(() => {
        ExperienceService.getByJobSeekerId(clientData.data.id).then((data) => {
            reset({ experiences: data });
        });
    }, []);

    return (
        <>
            <Controller control={control} name="experiences" render={() => null} />
            {experiences.map((experience: IExperience, index: number) => (
                <ExperienceItem onEdit={onEdit} onRemove={onRemove} experience={experience} index={index} key={index} />
            ))}

            {!experiences.length && (
                <div className="row justify-content-center margin-top-36 margin-bottom-24">{t('Common:noData')}</div>
            )}
            {pathname === ROUTES.PROFILE.PATH && (
                <>
                    <div
                        className={`row ${
                            experiences.length ? 'padding-left-24' : 'justify-content-center'
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
                                {t('Action.ADD')}
                            </Button>
                        </div>
                    </div>

                    <ExperienceModal
                        onSave={addExperience}
                        initialData={openWithInit.initVal}
                        opened={openWithInit.opened}
                        onClose={() => setOpenwithInit({ opened: false, initVal: null })}
                    />
                </>
            )}
        </>
    );
};
Experience.displayName = 'Experience';
