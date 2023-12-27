/* eslint-disable jsx-a11y/label-has-associated-control */
import { Button, InputAdornment } from '@material-ui/core';
import { ROUTES } from 'app/routes/consts';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { useBtnStyles } from 'ui-kit/Button';
import * as queryString from 'query-string';
import './HeaderSearch.scss';
import { Input } from 'ui-kit/Input';
import { LocationOnOutlined } from '@material-ui/icons';
import { CustomSelect } from 'ui-kit/CustomSelect';
import { useAsyncData } from 'app/hooks';
import { ILocation } from 'app/models/Location';
import { LocationService } from 'app/services/Location';
import { IPaginatedData } from 'model';
import { debounce } from 'lodash';
import { isPending } from 'utils';
import { Controller, useForm } from 'react-hook-form';

export const HeaderSearch: React.FC = () => {
    const classes = useBtnStyles();
    const { t } = useTranslation(['Home', 'Common']);
    const { push } = useHistory();
    const [inputLocVal, setInputLocVal] = React.useState('');
    const [locationList, setLocationList] = useAsyncData<IPaginatedData<ILocation>>();
    const { control, handleSubmit, reset } = useForm<{
        location: ILocation;
        keyword: string[];
    }>({
        defaultValues: {
            location: null,
            keyword: [],
        },
    });
    const fetchLocation = React.useMemo(
        () =>
            debounce(
                (input: string) => {
                    setLocationList(() => LocationService.getLocation(input));
                },
                300,
                {
                    leading: false,
                    trailing: true,
                },
            ),
        [],
    );

    React.useEffect(() => {
        reset({ location: null, keyword: [] });
    }, []);

    React.useEffect(() => {
        if (inputLocVal?.length) {
            fetchLocation(inputLocVal);
        }
    }, [inputLocVal]);

    const handleSubmitForm = handleSubmit((model) => {
        const { keyword, location } = model;
        const locationStr = location?.id;
        const locObj = location?.id
            ? JSON.stringify({ id: location.id, city: location.city, country: location.country })
            : null;

        push({
            pathname: ROUTES.JOBS.PATH,
            search: queryString.stringify({ keyword, location: locationStr, locObj } as Record<string, any>),
        });
    });

    return (
        <div className="row">
            <div className="col-md-12">
                <div className="intro-banner-search-form margin-top-95">
                    <div className="intro-search-field with-autocomplete with-label">
                        <label className="field-title ripple-effect">{t('Header.questions.where')}</label>
                        <Controller
                            name="location"
                            control={control}
                            render={({ value, onChange }) => (
                                <CustomSelect
                                    freeSolo
                                    withoutBorder
                                    showCloseBtn={false}
                                    loading={isPending(locationList)}
                                    value={value}
                                    onChange={(_, newVal) => {
                                        onChange(newVal);
                                    }}
                                    onInputChange={(_, newVal) => {
                                        setInputLocVal(newVal);
                                    }}
                                    renderTags={() => null}
                                    placeholder={t('Common:location')}
                                    options={locationList.data?.list ?? []}
                                    getOptionLabel={(e) => {
                                        return `${e.city} (${e.country})`;
                                    }}
                                    renderOption={(e) => {
                                        return `${e.city} (${e.country})`;
                                    }}
                                    startAdornment={
                                        <InputAdornment position="start">
                                            <LocationOnOutlined />
                                        </InputAdornment>
                                    }
                                />
                            )}
                        />
                    </div>

                    <div className="intro-search-field with-label">
                        <label className="field-title ripple-effect">{t('Header.questions.jobType')}</label>
                        <Controller
                            name="keyword"
                            control={control}
                            render={({ value, onChange }) => (
                                <Input
                                    onKeyDown={(event) => {
                                        if (event.key === 'Enter') {
                                            handleSubmitForm();
                                        }
                                    }}
                                    style={{ boxShadow: 'none' }}
                                    fullWidth
                                    value={value}
                                    onChange={(e) => onChange(e.target.value)}
                                    placeholder={t('Header.placeholders.jobType')}
                                />
                            )}
                        />
                    </div>

                    <div className="intro-search-button">
                        <Button
                            onClick={handleSubmitForm}
                            className={classes.root}
                            variant="contained"
                            color="secondary"
                            component="span"
                        >
                            {t('Common:Action.SEARCH')}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};
HeaderSearch.displayName = 'HeaderSearch';
