/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { Avatar, Button, CircularProgress, makeStyles } from '@material-ui/core';
import { ArrowRightAlt, ImageOutlined } from '@material-ui/icons';
import { useAsyncData } from 'app/hooks';
import { IBookmark } from 'app/models/Bookmark';
import { IJobSeeker } from 'app/models/JobSeeker';
import { ROUTES } from 'app/routes/consts';
import { BookmarkService } from 'app/services/Bookmark';
import { BACKEND_BASE_URL } from 'consts';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useHistory } from 'react-router-dom';
import { useBtnStyles } from 'ui-kit/Button';
import { isInitial, isPending, isSuccess } from 'utils';
import { makePath } from 'utils/router';

const useStyles = makeStyles((theme) => ({
    largeAvatar: {
        width: theme.spacing(13),
        height: theme.spacing(13),
    },
    viewProfileBtn: {
        '& [class*="iconSize"]': {
            display: 'none',
        },
        '&:hover': {
            '& [class*="iconSize"]': {
                display: 'flex',
            },
        },
    },
}));

export const EmployeeItem: React.FC<{ data: Partial<IJobSeeker> }> = ({ data }) => {
    const classes = useStyles();
    const { push } = useHistory();
    const btnClasses = useBtnStyles();
    const { t } = useTranslation(['Common', 'Profile', 'Home']);
    const [bookmarked, setBookmarked] = React.useState(Boolean(data.bookmark));
    const [saveBookmark, setSave] = useAsyncData<IBookmark>();

    React.useEffect(() => {
        if (isSuccess(saveBookmark)) {
            setBookmarked((x) => !x);
        }
    }, [saveBookmark]);

    return (
        <div className="freelancer">
            <div className="freelancer-overview">
                <div className="freelancer-overview-inner">
                    {(isInitial(saveBookmark) || isSuccess(saveBookmark)) && (
                        <span
                            className={`bookmark-icon ${bookmarked ? 'bookmarked' : ''}`}
                            onClick={(event) => {
                                event.preventDefault();
                                setSave(() =>
                                    !bookmarked
                                        ? BookmarkService.save({
                                              type: 'JOBSEEKER',
                                              jobseeker: { id: data.id } as IJobSeeker,
                                              post: null,
                                          })
                                        : BookmarkService.delete(
                                              !isInitial(saveBookmark) ? saveBookmark.data.id : data.bookmark.id,
                                          ),
                                );
                            }}
                        />
                    )}
                    {isPending(saveBookmark) && (
                        <CircularProgress
                            style={{
                                position: 'absolute',
                                top: 35,
                                right: 35,
                                color: '#2b41e8',
                            }}
                            size="2.3rem"
                            color="primary"
                        />
                    )}

                    <div className="freelancer-avatar">
                        {/* <div className="verified-badge" /> */}
                        <Link to={makePath(ROUTES.PROFILE.VIEW_OTHER.PATH, { id: data.user.id })}>
                            {data.user?.imageUrl ? (
                                <Avatar
                                    className={classes.largeAvatar}
                                    src={`${BACKEND_BASE_URL}/${data.user.imageUrl}`}
                                />
                            ) : (
                                <Avatar className={classes.largeAvatar}>
                                    <ImageOutlined />
                                </Avatar>
                            )}
                        </Link>
                    </div>

                    <div className="freelancer-name">
                        <h4>
                            <Link to={makePath(ROUTES.PROFILE.VIEW_OTHER.PATH, { id: data.user.id })}>
                                {`${data.firstName} ${data.lastName}`}
                            </Link>
                        </h4>
                        <span>{data.category ? t(`INDUSTRIES.${data.category}`) : <>&mdash;</>}</span>
                    </div>

                    {/* <div className="freelancer-rating">
                                <div className="star-rating" data-rating="4.9"><span className="star"></span><span className="star"></span><span className="star"></span><span className="star"></span><span className="star"></span></div>
                            </div> */}
                </div>
            </div>

            <div className="freelancer-details">
                <div className="freelancer-details-list">
                    <ul>
                        <li>
                            {t(`SalaryType.label`)}
                            <strong>
                                <i className="icon-material-outline-business-center" />{' '}
                                {data.salaryType ? t(`SalaryType.${data.salaryType}`) : <>&mdash;</>}
                            </strong>
                        </li>
                        <li>
                            {t('Profile:ProfileInfo.expectedSalary')}
                            <strong>
                                <i className="icon-material-outline-account-balance-wallet" />{' '}
                                {data.expectedSalary ?? <>&mdash;</>}
                                {` ${data.currency ?? ''}`}
                            </strong>
                        </li>
                    </ul>
                </div>
                <Button
                    className={`${btnClasses.root} ${classes.viewProfileBtn}`}
                    fullWidth
                    variant="contained"
                    color="secondary"
                    endIcon={<ArrowRightAlt />}
                    onClick={() => push(makePath(ROUTES.PROFILE.VIEW_OTHER.PATH, { id: data.user.id }))}
                >
                    {t('Home:RegisteredJobseekers.actions.viewProfile')}
                </Button>
            </div>
        </div>
    );
};
