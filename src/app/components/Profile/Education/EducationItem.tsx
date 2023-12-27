import {
    Avatar,
    Box,
    createMuiTheme,
    Grid,
    IconButton,
    List,
    makeStyles,
    MuiThemeProvider,
    Paper,
    Typography,
    useMediaQuery,
    useTheme,
} from '@material-ui/core';
import { DeleteOutline, Edit, NotesOutlined, QueryBuilderOutlined, SchoolOutlined } from '@material-ui/icons';
import { IEducation } from 'app/models/JobSeeker';
import { ROUTES } from 'app/routes/consts';
import React from 'react';
import { useHistory } from 'react-router-dom';
import { red } from '@material-ui/core/colors';
import { useAsyncData } from 'app/hooks';
import { isPending, isSuccess } from 'utils';
import { EducationService } from 'app/services/JobSeeker/Education';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import { ProfileContext } from '../ProfileContext';

const redTheme = createMuiTheme({ palette: { primary: red } });
const useStyles = makeStyles((theme) => ({
    subRoot: {
        flexGrow: 1,
        backgroundColor: '#fff',
        margin: 0,
    },
    paper: {
        border: 'none',
        boxShadow: 'none',
        justifyContent: 'center',
        display: 'flex',
        flexDirection: 'column',
        margin: 0,
        padding: '30px 12px 30px 20px',
        color: '#2a41e8',
        flex: '0 0 100%',
        borderLeft: '3px solid transparent',
        '&:hover': {
            borderLeft: '3px solid #2a41e8',
            borderRadius: '3px 3px 0 0',
        },
    },
    action: {
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: 160,
        },
    },
    description: { flexGrow: 1 },
    image: { width: 100, maxHeight: 128 },
    largeAvatar: {
        width: theme.spacing(7),
        height: theme.spacing(7),
    },
}));

interface IProps {
    education: IEducation;
    index: number;
    onRemove: (index: number) => void;
    onEdit: (index: number) => void;
}

export const EducationItem: React.FC<IProps> = ({ education, onRemove, index, onEdit }) => {
    const classes = useStyles();
    const theme = useTheme();
    const { t } = useTranslation(['Common']);
    const {
        location: { pathname },
    } = useHistory();
    const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
    const { clientData } = React.useContext(ProfileContext);
    const [deleteEducation, setDeleted] = useAsyncData<void>();
    const handleDelete = () => {
        setDeleted(() => EducationService.delete(clientData.data.id, education.id));
    };
    React.useEffect(() => {
        if (isSuccess(deleteEducation)) {
            onRemove(index);
        }
    }, [deleteEducation]);
    return (
        <Paper className={classes.paper}>
            <Grid container className={classes.subRoot} spacing={1}>
                {isDesktop && (
                    <Grid item className={classes.image}>
                        <Avatar className={classes.largeAvatar}>
                            <SchoolOutlined />
                        </Avatar>
                    </Grid>
                )}
                <Grid item className={classes.description}>
                    <div className="job-listing-description">
                        <Typography component="div" variant="body1">
                            <Box color="#333" fontWeight="fontWeightBold">
                                {`${education.universityName} `}
                                <>&mdash;</>
                                {` ${education.major}`}
                            </Box>
                        </Typography>
                        <div>
                            <List>
                                <Grid item xs={12}>
                                    <Grid container justify="flex-start" spacing={2}>
                                        <Grid spacing={1} item style={{ color: '#777', display: 'inline-flex' }}>
                                            <NotesOutlined />
                                            <Box marginLeft={1} fontWeight="fontWeightBold">
                                                {education.certificateDegreeName}
                                            </Box>
                                        </Grid>
                                        <Grid spacing={1} item style={{ color: '#777', display: 'inline-flex' }}>
                                            <QueryBuilderOutlined />
                                            <Box marginLeft={1} fontWeight="fontWeightBold">
                                                {`${
                                                    education.startingDate
                                                        ? moment(education.startingDate, 'YYYY-MM-DD').format(
                                                              'DD.MM.YYYY',
                                                          )
                                                        : ''
                                                } `}
                                                <>&mdash;</>
                                                {` ${
                                                    education.completionDate
                                                        ? moment(education.completionDate, 'YYYY-MM-DD').format(
                                                              'DD.MM.YYYY',
                                                          )
                                                        : t('Common:present')
                                                }`}
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </List>
                        </div>
                    </div>
                </Grid>
                <Grid item className={classes.action}>
                    {pathname === ROUTES.PROFILE.PATH && (
                        <>
                            <IconButton
                                disabled={isPending(deleteEducation)}
                                onClick={() => onEdit(index)}
                                color="secondary"
                                aria-label="edit"
                            >
                                <Edit />
                            </IconButton>
                            <MuiThemeProvider theme={redTheme}>
                                <IconButton
                                    disabled={isPending(deleteEducation)}
                                    onClick={handleDelete}
                                    color="secondary"
                                    aria-label="edit"
                                >
                                    <DeleteOutline />
                                </IconButton>
                            </MuiThemeProvider>
                        </>
                    )}
                </Grid>
            </Grid>
        </Paper>
    );
};
EducationItem.displayName = 'EducationItem';
