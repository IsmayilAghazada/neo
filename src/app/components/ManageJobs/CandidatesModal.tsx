import { Avatar, Box, Button, createStyles, makeStyles, Theme, Typography } from '@material-ui/core';
import { ImageOutlined } from '@material-ui/icons';
import { IJobSeeker } from 'app/models/JobSeeker';
import { ROUTES } from 'app/routes/consts';
import { JobSeekerService } from 'app/services/JobSeeker';
import { BACKEND_BASE_URL } from 'consts';
import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import { MuiModal } from 'ui-kit/Modal';
import { saveAs } from 'file-saver';
import { useBtnStyles } from 'ui-kit/Button';

interface IProps {
    opened: boolean;
    onClose: () => void;
    jobseekers: IJobSeeker[];
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        large: {
            width: theme.spacing(10),
            height: theme.spacing(10),
        },
    }),
);

export const CandidatesModal: React.FC<IProps> = ({ opened, onClose, jobseekers }) => {
    const { t } = useTranslation(['Company', 'Common']);
    const classes = useStyles();
    const btnClasses = useBtnStyles();
    return (
        <MuiModal
            size="lg"
            opened={opened}
            onClose={onClose}
            divider
            header={
                <>
                    <div>
                        <Typography style={{ display: 'flex' }} component="div">
                            <Box color="#333" fontSize="1.5rem" fontWeight="fontWeightBold" ml={2}>
                                <Box
                                    component="span"
                                    color="#2a41e8"
                                    fontSize="1.5rem"
                                    fontWeight="fontWeightBold"
                                    m={1}
                                >
                                    <i className="icon-material-outline-supervisor-account" />
                                </Box>{' '}
                                {t('candidates')}
                            </Box>
                        </Typography>
                    </div>
                </>
            }
            body={
                <div className="dashboard-box">
                    {jobseekers.length ? (
                        <ul className="dashboard-box-list">
                            {jobseekers.map((e) => (
                                <li key={e.id}>
                                    <div className="freelancer-overview manage-candidates">
                                        <div className="freelancer-overview-inner">
                                            <div className="freelancer-avatar">
                                                <div className="verified-badge" />
                                                <NavLink to={`${ROUTES.PROFILE.PATH}/${e?.user?.id}`}>
                                                    {e.user?.imageUrl ? (
                                                        <Avatar
                                                            className={classes.large}
                                                            src={`${BACKEND_BASE_URL}/${e.user?.imageUrl}`}
                                                        />
                                                    ) : (
                                                        <Avatar className={classes.large}>
                                                            <ImageOutlined />
                                                        </Avatar>
                                                    )}
                                                </NavLink>
                                            </div>

                                            <div className="freelancer-name">
                                                <h4>
                                                    <NavLink to="/">
                                                        <Typography component="div">
                                                            <Box
                                                                color="#333"
                                                                fontSize="1.2rem"
                                                                fontWeight="fontWeightBold"
                                                                m={1}
                                                            >
                                                                {`${e.lastName} ${e.firstName}`}
                                                            </Box>
                                                        </Typography>
                                                    </NavLink>
                                                </h4>

                                                <span style={{ marginRight: 8 }} className="freelancer-detail-item">
                                                    <a href={`mailto:${e.user?.email}`}>
                                                        <i className="icon-feather-mail" /> {e.user?.email}
                                                    </a>
                                                </span>
                                                {e.user?.contactNumber && (
                                                    <span className="freelancer-detail-item">
                                                        <i className="icon-feather-phone" />
                                                        {`+${e.user?.contactNumber}`}
                                                    </span>
                                                )}
                                                {e.resumeUrl && (
                                                    <div className="buttons-to-right always-visible margin-top-25 margin-bottom-5">
                                                        <Button
                                                            startIcon={<i className="icon-feather-file-text" />}
                                                            onClick={() =>
                                                                JobSeekerService.downloadResume(
                                                                    `${BACKEND_BASE_URL}/${e.resumeUrl}`,
                                                                ).then((data) => {
                                                                    saveAs(
                                                                        data,
                                                                        `${e.id}.${e.resumeUrl.split('.')[1]}`,
                                                                    );
                                                                })
                                                            }
                                                            variant="contained"
                                                            color="secondary"
                                                        >
                                                            Download CV
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <h3>No one has applied for the job post</h3>
                    )}
                </div>
            }
            footer={
                <div className="margin-top-24 margin-bottom-24 margin-right-24 margin-left-24">
                    <Button className={btnClasses.root} variant="contained" color="secondary" onClick={onClose}>
                        {t('Common:Action.CLOSE')}
                    </Button>
                </div>
            }
        />
    );
};
