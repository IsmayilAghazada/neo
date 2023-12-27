import * as React from 'react';
import { Button, CircularProgress } from '@material-ui/core';
import { ArrowRightAlt } from '@material-ui/icons';
import { Link } from 'react-router-dom';
import { validateEmail } from 'utils/validateAuth';
import { Controller, useForm } from 'react-hook-form';
import { ValidationError } from 'ui-kit/ValidationError';
import { SubscribeService } from 'app/services/Subscribe/Subscribe';
import { isError, isPending, isSuccess } from 'utils';
import { useAsyncData } from 'app/hooks';
import { Trans, useTranslation } from 'react-i18next';
import { useSnackbar } from 'notistack';
import { ROUTES } from 'app/routes/consts';
import { Input } from '../../../../ui-kit/Input';
import { CustomTooltip } from '../../../../ui-kit/ToolTips';
import { LanguageSwitcher } from '../../../../ui-kit/LanguageSwitcher';

import './index.scss';

export const Footer: React.FC = () => {
    const { t } = useTranslation(['Home', 'Common']);
    const { enqueueSnackbar } = useSnackbar();
    const year = new Date().getFullYear();
    const { control, handleSubmit, errors } = useForm<{ email: string }>({
        mode: 'onBlur',
        defaultValues: { email: null },
    });
    const [subscribe, setSubscribe] = useAsyncData<{ email: string }>();

    const handleSubmitForm = handleSubmit((model) => {
        setSubscribe(() => SubscribeService.save(model));
    });

    React.useEffect(() => {
        if (isSuccess(subscribe)) {
            enqueueSnackbar(t('Common:Success.default'), {
                variant: 'success',
                anchorOrigin: { horizontal: 'center', vertical: 'top' },
                autoHideDuration: 3000,
            });
        } else if (isError(subscribe)) {
            enqueueSnackbar(subscribe.error.message, {
                variant: 'error',
                anchorOrigin: { horizontal: 'center', vertical: 'top' },
                autoHideDuration: 3000,
            });
        }
    }, [subscribe]);

    return (
        <div id="footer">
            <div className="footer-top-section">
                <div className="container">
                    <div className="row">
                        <div className="col-xl-12">
                            <div className="footer-rows-container">
                                <div className="footer-rows-left">
                                    <div className="footer-row">
                                        <div className="footer-row-inner footer-logo">
                                            <img src="/assets/images/logo-footer.svg" alt="" />
                                        </div>
                                    </div>
                                </div>

                                <div className="footer-rows-right">
                                    <div className="footer-row">
                                        <div className="footer-row-inner">
                                            <ul className="footer-social-links">
                                                <li>
                                                    <CustomTooltip type="light" placement="bottom" title="Facebook">
                                                        <a
                                                            rel="noreferrer noopener"
                                                            target="_blank"
                                                            href="https://fb.com/doqquz"
                                                        >
                                                            <i className="icon-brand-facebook-f" />
                                                        </a>
                                                    </CustomTooltip>
                                                </li>
                                                <li>
                                                    <CustomTooltip type="light" placement="bottom" title="Twitter">
                                                        <a
                                                            rel="noreferrer noopener"
                                                            target="_blank"
                                                            href="https://twitter.com/9_doqquz"
                                                        >
                                                            <i className="icon-brand-twitter" />
                                                        </a>
                                                    </CustomTooltip>
                                                </li>
                                                <li>
                                                    <CustomTooltip type="light" placement="bottom" title="Telegram">
                                                        <a
                                                            rel="noreferrer noopener"
                                                            target="_blank"
                                                            href="https://t.me/doqquzbaku"
                                                        >
                                                            <i className="icon-brand-telegram" />
                                                        </a>
                                                    </CustomTooltip>
                                                </li>
                                                <li>
                                                    <CustomTooltip type="light" placement="bottom" title="LinkedIn">
                                                        <a
                                                            rel="noreferrer noopener"
                                                            target="_blank"
                                                            href="https://www.linkedin.com/company/doqquz/"
                                                        >
                                                            <i className="icon-brand-linkedin-in" />
                                                        </a>
                                                    </CustomTooltip>
                                                </li>
                                            </ul>
                                            <div className="clearfix" />
                                        </div>
                                    </div>

                                    <div className="footer-row">
                                        <div className="footer-row-inner">
                                            <LanguageSwitcher />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="footer-middle-section">
                <div className="container">
                    <div className="row">
                        <div className="col-xl-2 col-lg-2 col-md-3">
                            <div className="footer-links">
                                <h3>{t('Footer.Nav.forCandidates.label')}</h3>
                                <ul>
                                    <li>
                                        <Link to={ROUTES.JOBS.PATH}>
                                            <span>{t('Common:Nav.browse_jobs')}</span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to={ROUTES.PROFILE.PATH}>
                                            <span>{t('Footer.Nav.forCandidates.addResume')}</span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to={ROUTES.COMPANIES.PATH}>
                                            <span>{t('Common:Nav.browse_companies')}</span>
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className="col-xl-2 col-lg-2 col-md-3">
                            <div className="footer-links">
                                <h3>{t('Footer.Nav.forEmployers.label')}</h3>
                                <ul>
                                    <li>
                                        <Link to={ROUTES.EMPLOYEES.PATH}>
                                            <span>{t('Common:Nav.browse_jobseekers')}</span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to={ROUTES.MANAGE_JOBS.PATH}>
                                            <span>{t('Common:Nav.manage_jobs')}</span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to={ROUTES.POST_JOB.PATH}>
                                            <span>{t('Common:Nav.post_a_job')}</span>
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className="col-xl-2 col-lg-2 col-md-3">
                            <div className="footer-links">
                                <h3>{t('Footer.Nav.helpfulLinks')}</h3>
                                <ul>
                                    <li>
                                        <Link to={ROUTES.ABOUT}>
                                            <span>{t('Common:Nav.about')}</span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to={ROUTES.CONTACT.PATH}>
                                            <span>{t('Common:Nav.contact')}</span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to={ROUTES.PRIVACY_POLICE}>
                                            <span>{t('Footer.Nav.privacyPolice')}</span>
                                        </Link>
                                    </li>
                                    {/* <li>
                                        <Link to="/test">
                                            <span>Terms of Use</span>
                                        </Link>
                                    </li> */}
                                </ul>
                            </div>
                        </div>

                        <div className="col-xl-2 col-lg-2 col-md-3">
                            <div className="footer-links">
                                <h3>{t('Footer.Nav.account')}</h3>
                                <ul>
                                    <li>
                                        <Link to={ROUTES.AUTH.LOGOUT}>
                                            <span>{t('Common:Action.LOGIN')}</span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to={ROUTES.PROFILE.PATH}>
                                            <span>{t('Common:Menu.profile.label')}</span>
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className="col-xl-4 col-lg-4 col-md-12">
                            <h3>
                                <i className="icon-feather-mail" /> {t('Footer.Subscribe.title')}
                            </h3>
                            <p>{t('Footer.Subscribe.description')}</p>
                            <form className="newsletter">
                                <Controller
                                    name="email"
                                    control={control}
                                    rules={{
                                        validate: (value) => validateEmail(value, t),
                                    }}
                                    render={({ value, onChange }) => (
                                        <Input
                                            value={value}
                                            onChange={onChange}
                                            style={{ backgroundColor: '#262626' }}
                                            placeholder={t('Common:FormInputs.email.placeholder')}
                                            inputProps={{ 'aria-label': t('Common:FormInputs.email.placeholder') }}
                                        />
                                    )}
                                />
                                <Button onClick={handleSubmitForm}>
                                    {isPending(subscribe) ? (
                                        <CircularProgress size="1.5rem" color="primary" />
                                    ) : (
                                        <ArrowRightAlt fontSize="large" />
                                    )}
                                </Button>
                            </form>
                            <ValidationError error={errors?.email?.message} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="footer-bottom-section">
                <div className="container">
                    <div className="row">
                        <div className="col-xl-12">
                            <Trans values={{ year }} i18nKey="Copyrights" components={[<strong />]} ns="Common" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
