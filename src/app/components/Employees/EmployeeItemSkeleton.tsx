import { Avatar, Button, makeStyles } from '@material-ui/core';
import { ArrowRightAlt, ImageOutlined } from '@material-ui/icons';
import { Skeleton } from '@material-ui/lab';
import * as React from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useBtnStyles } from 'ui-kit/Button';

const useStyles = makeStyles((theme) => ({
    largeAvatar: {
        width: theme.spacing(13),
        height: theme.spacing(13),
    },
    text: { display: 'inline-block' },
}));
export const EmployeeItemSkeleron: React.FC = () => {
    const { location } = useHistory();
    const btnClasses = useBtnStyles();
    const classes = useStyles();

    return (
        <div className="freelancer">
            <div className="freelancer-overview">
                <div className="freelancer-overview-inner">
                    <span className="bookmark-icon" />

                    <div className="freelancer-avatar">
                        {/* <div className="verified-badge" /> */}
                        <Link to={location.pathname}>
                            <Avatar className={classes.largeAvatar}>
                                <ImageOutlined />
                            </Avatar>
                        </Link>
                    </div>

                    <div className="freelancer-name">
                        <h4>
                            <Link to={location.pathname}>
                                <Skeleton variant="text" className={classes.text} width={100} height={20} />
                            </Link>
                        </h4>
                        <span>
                            <Skeleton variant="text" className={classes.text} width={100} height={20} />
                        </span>
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
                            <Skeleton variant="text" className={classes.text} width={70} height={20} />
                            <strong>
                                <i className="icon-material-outline-business-center" />{' '}
                                <Skeleton variant="text" className={classes.text} width={100} height={20} />
                            </strong>
                        </li>
                        <li>
                            <Skeleton variant="text" className={classes.text} width={50} height={20} />
                            <strong>
                                <i className="icon-material-outline-account-balance-wallet" />{' '}
                                <Skeleton variant="text" className={classes.text} width={100} height={20} />
                            </strong>
                        </li>
                    </ul>
                </div>
                <Button
                    className={`${btnClasses.root}`}
                    fullWidth
                    variant="contained"
                    color="secondary"
                    endIcon={<ArrowRightAlt />}
                >
                    <Skeleton variant="text" className={classes.text} width={100} height={20} />
                </Button>
            </div>
        </div>
    );
};
