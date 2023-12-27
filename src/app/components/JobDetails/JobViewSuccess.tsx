/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { Avatar, Button, CircularProgress, makeStyles } from '@material-ui/core';
import { BusinessCenterOutlined } from '@material-ui/icons';
import { useAsyncData, useDependencies } from 'app/hooks';
import { IPost } from 'app/models/Post';
import { PostService } from 'app/services/Post';
import { BACKEND_BASE_URL } from 'consts';
import * as React from 'react';
import { ROUTES } from 'app/routes/consts';
import { Trans, useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { SocialShareButton } from 'ui-kit/SocialShareButton';

import { makePath } from 'utils/router';

import './index.scss';
import { isInitial, isPending, isSuccess } from 'utils';
import moment from 'moment';
import { useBtnStyles } from 'ui-kit/Button';
import { IJobSeeker } from 'app/models/JobSeeker';
import { BookmarkService } from 'app/services/Bookmark';
import { IBookmark } from 'app/models/Bookmark';
import { ERole } from 'enums';

export const useStyles = makeStyles((theme) => ({
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

export const JobViewSuccess: React.FC<{ data: IPost }> = ({ data }) => {
    const { t } = useTranslation(['Company', 'Common']);
    const [apply, setApplied] = useAsyncData<IPost>();
    const { storage } = useDependencies();
    const classes = useStyles();
    const btnClasses = useBtnStyles();
    const { customerInfo, userInfo } = storage;
    const customerData = customerInfo.getValue();
    const userData = userInfo.getValue();

    const [bookmarked, setBookmarked] = React.useState(Boolean(data.bookmark));
    const [saveBookmark, setSave] = useAsyncData<IBookmark>();
    const makeMultiLine = (value: string) =>
        value?.split('\n')?.map((item, idx) => (
            <span key={idx}>
                {item}
                <br />
            </span>
        ));

    React.useEffect(() => {
        if (isSuccess(saveBookmark)) {
            setBookmarked((x) => !x);
        }
    }, [saveBookmark]);

    return (
        <>
            <div className="single-page-header">
                <div className="container">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="single-page-header-inner">
                                <div className="left-side">
                                    <Link
                                        to={makePath(ROUTES.PROFILE.VIEW_OTHER.PATH, {
                                            id: data?.user?.id,
                                        })}
                                    >
                                        {data?.user?.imageUrl ? (
                                            <Avatar
                                                className={classes.largeAvatar}
                                                src={`${BACKEND_BASE_URL}/${data?.user.imageUrl}`}
                                            />
                                        ) : (
                                            <Avatar className={classes.largeAvatar}>
                                                <BusinessCenterOutlined
                                                    style={{ fontSize: '5rem' }}
                                                    color="secondary"
                                                />
                                            </Avatar>
                                        )}
                                    </Link>
                                    <div className="header-details">
                                        <h3>{data?.title}</h3>
                                        <h5>{t(`Common:INDUSTRIES.${data?.category}`)}</h5>
                                        <ul>
                                            <li>
                                                <i className="icon-material-outline-location-on" />{' '}
                                                {data?.location?.country ? (
                                                    `${data?.location?.country}, ${data?.location?.city}`
                                                ) : (
                                                    <>&mdash;</>
                                                )}
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <div className="right-side">
                                    <div className="salary-box">
                                        <div className="salary-type">{t(`Common:SalaryType.${data?.salaryType}`)}</div>
                                        <div className="salary-amount">
                                            {data?.minEstimatedBudget} - {data?.maxEstimatedBudget} {data?.currency}
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
                            <h3 className="margin-bottom-25">{t('ViewJob.description')}</h3>
                            <p>{makeMultiLine(data?.description)}</p>

                            <h3 className="margin-bottom-25">{t('ViewJob.requiredSkills')}</h3>
                            <p>
                                {data?.skills.map((x) => (
                                    <>
                                        {' '}
                                        &mdash; {` ${x.name}`}
                                        <br />
                                    </>
                                ))}
                            </p>

                            {userData && (
                                <>
                                    <h3 className="margin-bottom-25">{t(`ViewJob.contactInformation`)}</h3>
                                    <p>{makeMultiLine(data?.contactInformation)}</p>
                                </>
                            )}
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
                                disabled={
                                    isPending(apply) ||
                                    userData?.data?.role === ERole.COMPANY ||
                                    apply.data?.jobseekers?.some((x) => x.id === customerData?.id) ||
                                    data?.jobseekers?.some((x) => x.id === customerData?.id) ||
                                    data?.user?.id === userData?.data?.id
                                }
                                onClick={() => {
                                    const transformedData = {
                                        jobseekers: [...data.jobseekers, customerData] as IJobSeeker[],
                                    };
                                    setApplied(() => PostService.applyToPost(data.id, transformedData));
                                }}
                                endIcon={<i className="icon-material-outline-arrow-right-alt" />}
                            >
                                {t('Common:Action.REQUEST')}
                            </Button>
                            {/* <!-- Sidebar Widget --> */}
                            <div className="sidebar-widget">
                                <div className="job-overview">
                                    <div className="job-overview-headline">{t('ViewJob.summary')}</div>
                                    <div className="job-overview-inner">
                                        <ul>
                                            <li>
                                                <i className="icon-material-outline-location-on" />
                                                <span>{t(`Common:location`)}</span>
                                                <h5>
                                                    {data?.location?.country ? (
                                                        `${data?.location?.city}, ${data?.location?.country}`
                                                    ) : (
                                                        <>&mdash;</>
                                                    )}
                                                </h5>
                                            </li>
                                            <li>
                                                <i className="icon-material-outline-business-center" />
                                                <span>{t(`Common:JobType.label`)}</span>
                                                <h5>{t(`Common:JobType.${data.type}`)}</h5>
                                            </li>
                                            <li>
                                                <i className="icon-material-outline-local-atm" />
                                                <span>{t(`Common:Salary.label`)}</span>
                                                <h5>
                                                    {data?.minEstimatedBudget} - {data?.maxEstimatedBudget}{' '}
                                                    {data?.currency}
                                                </h5>
                                            </li>
                                            <li>
                                                <i className="icon-material-outline-access-time" />
                                                <span>{t('ViewJob.datePosted')}</span>
                                                <h5>{moment.utc(data.createdAt).local().format('DD.MM.YYYY')}</h5>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div className="sidebar-widget">
                                {/* <Typography component="div" variant="h5">
                                            <Box mb={2} color="#333">
                                                {t('Common:')}
                                            </Box>
                                        </Typography> */}
                                {(isInitial(saveBookmark) || isSuccess(saveBookmark)) && (
                                    <div
                                        onClick={(event) => {
                                            event.preventDefault();
                                            setSave(() =>
                                                !bookmarked
                                                    ? BookmarkService.save({
                                                          type: 'POST',
                                                          post: { id: data.id } as IPost,
                                                          jobseeker: null,
                                                      })
                                                    : BookmarkService.delete(
                                                          !isInitial(saveBookmark)
                                                              ? saveBookmark.data.id
                                                              : data.bookmark.id,
                                                      ),
                                            );
                                        }}
                                        className={`bookmark-button margin-bottom-25 ${bookmarked ? 'bookmarked' : ''}`}
                                    >
                                        <span className="bookmark-icon" />
                                        <span className="bookmark-text"> {t('Common:Action.BOOKMARK')}</span>
                                        <span className="bookmarked-text"> {t('Common:Action.BOOKMARKED')}</span>
                                    </div>
                                )}
                                {isPending(saveBookmark) && (
                                    <div style={{ position: 'relative' }} className="margin-bottom-25">
                                        <CircularProgress
                                            style={{
                                                position: 'absolute',
                                                left: 25,
                                                color: '#2b41e8',
                                            }}
                                            size="2.3rem"
                                            color="primary"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};
