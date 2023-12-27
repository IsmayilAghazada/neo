import * as React from 'react';
import { MenuItem as MiuMenuItem, ListItemIcon, ListItemText, Badge, Typography } from '@material-ui/core';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { INotification } from 'app/models/Notification';
import { useHistory } from 'react-router-dom';
import { Trans } from 'react-i18next';
import { ROUTES } from 'app/routes/consts';
import { UsersIcon } from './icons/UsersIcon';

const useStyles = makeStyles(() =>
    createStyles({
        listItemTxt: {
            marginLeft: 16,
            width: 280,
            whiteSpace: 'break-spaces',
        },
        menuItem: {
            paddingLeft: 20,
            borderLeft: '4px solid transparent',
            '&:hover': {
                borderLeft: '4px solid #2A41E8',
                backgroundColor: '#F0F2FD',
                color: '#2A41E8',
                '& .dropdown-icon path': {
                    stroke: '#2A41E8',
                    strokeOpacity: 1,
                },
            },
        },
        notificationDot: {
            top: 5,
            right: 6,
            backgroundColor: '#FF6359',
        },
    }),
);
interface IProps {
    onClick: (id: number, status: string) => void;
    item: INotification;
}

export const NotificationItem: React.FC<IProps> = ({ onClick, item }) => {
    const classes = useStyles();
    const { push } = useHistory();

    return (
        <MiuMenuItem
            className={classes.menuItem}
            onClick={() => {
                onClick(item.id, item.status);
                push(ROUTES.MANAGE_JOBS.PATH);
            }}
        >
            <ListItemIcon style={{ minWidth: 48 }}>
                <Badge
                    classes={{ badge: classes.notificationDot }}
                    color="error"
                    overlap="circle"
                    badgeContent=" "
                    variant="dot"
                    invisible={item.status === 'READ'}
                >
                    <UsersIcon />
                </Badge>
            </ListItemIcon>
            <ListItemText
                className={classes.listItemTxt}
                primary=""
                secondary={
                    <Trans
                        ns="Notification"
                        values={{ title: item.meta.post.title, fullName: item.meta.from.fullName }}
                        i18nKey={item.type}
                        components={[
                            <Typography
                                style={{ color: 'rgba(0, 0, 0, 0.87)' }}
                                component="span"
                                variant="subtitle1"
                            />,
                            <Typography style={{ color: '#2A41E8' }} component="span" variant="subtitle1" />,
                        ]}
                    />
                }
            />
        </MiuMenuItem>
    );
};
