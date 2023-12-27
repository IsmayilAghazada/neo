/* eslint-disable no-extra-boolean-cast */
import { Button } from '@material-ui/core';
import { Add } from '@material-ui/icons';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { IPortfolio } from 'app/models/JobSeeker';
import { useSnackbar } from 'notistack';
import { ROUTES } from 'app/routes/consts';
import { useHistory } from 'react-router-dom';
import { PortfolioService } from 'app/services/JobSeeker/Portfolio';
import { useBtnStyles } from 'ui-kit/Button';
import { PortfolioModal } from './Modal';
import { ProfileContext } from '../ProfileContext';
import { PortfolioItem } from './PortfolioItem';

export const Portfolio: React.FC = () => {
    const { t } = useTranslation(['Profile', 'Common']);
    const btnClasses = useBtnStyles();
    const { enqueueSnackbar } = useSnackbar();
    const {
        location: { pathname },
    } = useHistory();
    const [openWithInit, setOpenwithInit] = React.useState<{ opened: boolean; initVal: IPortfolio }>({
        opened: false,
        initVal: null,
    });
    const { clientData } = React.useContext(ProfileContext);
    const { watch, setValue, reset, control } = useForm<{ portfolios: IPortfolio[] }>({
        mode: 'onBlur',
        defaultValues: {
            portfolios: [],
        },
    });
    const portfolios = watch('portfolios');

    const addPortfolio = (portfolio: IPortfolio, id: any = null) => {
        if (id === null) {
            setValue('portfolios', [...portfolios, portfolio]);
            enqueueSnackbar(t('Common:Success.default'), {
                variant: 'success',
                anchorOrigin: { horizontal: 'center', vertical: 'top' },
                autoHideDuration: 3000,
            });
        } else {
            const transformedData = portfolios.map((e) => {
                if (e.id === id) {
                    return portfolio;
                }
                return e;
            });
            setValue('portfolios', transformedData);
            enqueueSnackbar(t('Common:Success.default'), {
                variant: 'success',
                anchorOrigin: { horizontal: 'center', vertical: 'top' },
                autoHideDuration: 3000,
            });
        }
        setOpenwithInit({ initVal: null, opened: false });
    };
    const onEdit = (index: number) => {
        setOpenwithInit({ opened: true, initVal: portfolios?.[index] as any });
    };
    const onRemove = (index: number) => {
        const transformedData = portfolios?.filter((_, i) => i !== index);
        setValue('portfolios', transformedData);
    };

    React.useEffect(() => {
        PortfolioService.getByJobSeekerId(clientData.data.id).then((data) => {
            reset({ portfolios: data });
        });
    }, []);

    return (
        <>
            <Controller control={control} name="portfolios" render={() => null} />
            {portfolios.map((portfolio: IPortfolio, index: number) => (
                <PortfolioItem onEdit={onEdit} onRemove={onRemove} portfolio={portfolio} index={index} key={index} />
            ))}
            {!Boolean(portfolios.length) && (
                <div className="row justify-content-center margin-top-36 margin-bottom-24">{t('Common:noData')}</div>
            )}
            {pathname === ROUTES.PROFILE.PATH && (
                <>
                    <div
                        className={`row ${
                            Boolean(portfolios.length) ? 'padding-left-24' : 'justify-content-center'
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

                    <PortfolioModal
                        onSave={addPortfolio}
                        initialData={openWithInit.initVal}
                        opened={openWithInit.opened}
                        onClose={() => setOpenwithInit({ opened: false, initVal: null })}
                    />
                </>
            )}
        </>
    );
};
Portfolio.displayName = 'Portfolio';
