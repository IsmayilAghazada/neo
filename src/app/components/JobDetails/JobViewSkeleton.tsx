import { Avatar, Button, makeStyles } from '@material-ui/core';
import { BusinessCenterOutlined } from '@material-ui/icons';
import { Skeleton } from '@material-ui/lab';
import { range } from 'lodash';
import * as React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { useBtnStyles } from 'ui-kit/Button';
import { SocialShareButton } from 'ui-kit/SocialShareButton';

const useStyles = makeStyles((theme) => ({
    largeAvatar: {
        width: theme.spacing(17),
        height: theme.spacing(17),
        backgroundColor: 'white',
        boxShadow: '0 3px 12px rgba(0, 0, 0, 0.1)',
        marginRight: '35px',
    },
    text: { display: 'inline-block !important' },
    serverError: {
        width: '70%',
        height: '80vh',
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
    },
}));

export const JobViewSkeleton: React.FC = () => {
    const { t } = useTranslation(['Company', 'Common']);
    const classes = useStyles();
    const btnClasses = useBtnStyles();
    return (
        <>
            <div className="single-page-header">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="single-page-header-inner">
                                <div className="left-side">
                                    <Avatar className={classes.largeAvatar}>
                                        <BusinessCenterOutlined style={{ fontSize: '5rem' }} color="secondary" />
                                    </Avatar>
                                    <div className="header-details">
                                        <h3>
                                            <Skeleton variant="text" className={classes.text} width={250} height={20} />
                                        </h3>
                                        <h5>
                                            <Skeleton variant="text" className={classes.text} width={150} height={20} />
                                        </h5>
                                        <ul>
                                            <li>
                                                <i className="icon-material-outline-location-on" />{' '}
                                                <Skeleton
                                                    variant="text"
                                                    className={classes.text}
                                                    width={70}
                                                    height={20}
                                                />
                                                ,{' '}
                                                <Skeleton
                                                    variant="text"
                                                    className={classes.text}
                                                    width={50}
                                                    height={20}
                                                />
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="right-side">
                                    <div className="salary-box">
                                        <div className="salary-type">
                                            <Skeleton variant="text" className={classes.text} width={150} height={40} />
                                        </div>
                                        <div className="salary-amount">
                                            <Skeleton variant="text" className={classes.text} width={50} height={40} />{' '}
                                            -{' '}
                                            <Skeleton variant="text" className={classes.text} width={50} height={40} />{' '}
                                            <Skeleton variant="text" className={classes.text} width={30} height={40} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div
                    className="background-image-container"
                    style={{ backgroundImage: "url('/assets/images/single-job.jpg')" }}
                />
            </div>

            <div className="container">
                <div className="row">
                    <div className="col-xl-8 col-lg-8 content-right-offset">
                        <div className="single-page-section">
                            <h3 className="margin-bottom-25">{t(`ViewJob.description`)}</h3>
                            <p>
                                {range(1, 10).map((i) => (
                                    <>
                                        <Skeleton
                                            variant="text"
                                            className={classes.text}
                                            width={i / 2 === 0 ? '100%' : '90%'}
                                            height={20}
                                        />
                                        <br />
                                    </>
                                ))}
                            </p>

                            <h3 className="margin-bottom-25">{t(`ViewJob.requiredSkills`)}</h3>
                            <p>
                                {range(1, 10).map(() => (
                                    <>
                                        {' '}
                                        &mdash;{' '}
                                        <Skeleton variant="text" className={classes.text} width={150} height={20} />
                                        <br />
                                    </>
                                ))}
                            </p>

                            <h3 className="margin-bottom-25">{t(`ViewJob.contactInformation`)}</h3>
                            <p>
                                {range(1, 10).map(() => (
                                    <>
                                        {' '}
                                        &mdash;{' '}
                                        <Skeleton variant="text" className={classes.text} width={150} height={20} />
                                        <br />
                                    </>
                                ))}
                            </p>

                            <div className="share-buttons margin-top-25 margin-bottom-25">
                                <div className="share-buttons-content">
                                    <span>
                                        <Trans ns="Company" i18nKey="ViewJob.share" components={[<strong />]} />
                                    </span>
                                    <div className="share-buttons-icons">
                                        <SocialShareButton
                                            link={window.location.href}
                                            type="whatsapp"
                                            message="#doqquz #ishvar"
                                            subject="#doqquz #ishvar"
                                        />
                                        <SocialShareButton
                                            link={window.location.href}
                                            type="twitter"
                                            message="#doqquz #ishvar"
                                        />
                                        <SocialShareButton
                                            link={window.location.href}
                                            type="telegram"
                                            message="#doqquz,#ishvar"
                                            subject="#doqquz #ishvar"
                                        />
                                        <SocialShareButton
                                            link={window.location.href}
                                            type="facebook"
                                            message="#doqquz #ishvar"
                                            subject="#doqquz #ishvar"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* <!-- Sidebar --> */}
                    <div className="col-xl-4 col-lg-4">
                        <div className="sidebar-container">
                            <Button
                                fullWidth
                                className={`${btnClasses.root} apply-now-button popup-with-zoom-anim`}
                                variant="contained"
                                color="secondary"
                                endIcon={<i className="icon-material-outline-arrow-right-alt" />}
                            >
                                {t('Common:Action.REQUEST')}
                            </Button>
                            {/* <!-- Sidebar Widget --> */}
                            <div className="sidebar-widget">
                                <div className="job-overview">
                                    <div className="job-overview-headline">{t(`ViewJob.summary`)}</div>
                                    <div className="job-overview-inner">
                                        <ul>
                                            <li>
                                                <i className="icon-material-outline-location-on" />
                                                <span>{t('Common:location')}</span>
                                                <h5>
                                                    <Skeleton
                                                        variant="text"
                                                        className={classes.text}
                                                        width={30}
                                                        height={20}
                                                    />
                                                    ,{' '}
                                                    <Skeleton
                                                        variant="text"
                                                        className={classes.text}
                                                        width={50}
                                                        height={20}
                                                    />
                                                </h5>
                                            </li>
                                            <li>
                                                <i className="icon-material-outline-business-center" />
                                                <span>{t(`Common:JobType.label`)}</span>
                                                <h5>
                                                    <Skeleton
                                                        variant="text"
                                                        className={classes.text}
                                                        width={50}
                                                        height={20}
                                                    />
                                                </h5>
                                            </li>
                                            <li>
                                                <i className="icon-material-outline-local-atm" />
                                                <span>{t(`Common:Salary.label`)}</span>
                                                <h5>
                                                    <Skeleton
                                                        variant="text"
                                                        className={classes.text}
                                                        width={50}
                                                        height={20}
                                                    />{' '}
                                                    -{' '}
                                                    <Skeleton
                                                        variant="text"
                                                        className={classes.text}
                                                        width={50}
                                                        height={20}
                                                    />{' '}
                                                    <Skeleton
                                                        variant="text"
                                                        className={classes.text}
                                                        width={30}
                                                        height={20}
                                                    />
                                                </h5>
                                            </li>
                                            <li>
                                                <i className="icon-material-outline-access-time" />
                                                <span>{t(`ViewJob.datePosted`)}</span>
                                                <h5>
                                                    <Skeleton
                                                        variant="text"
                                                        className={classes.text}
                                                        width={50}
                                                        height={20}
                                                    />
                                                </h5>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
JobViewSkeleton.displayName = 'JobViewSkeleton';
