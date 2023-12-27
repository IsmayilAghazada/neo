/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable consistent-return */
import './index.scss';

import * as React from 'react';
import { useFormContext } from 'react-hook-form';
import { CameraAlt } from '@material-ui/icons';
import { IMessage } from 'app/deps/messageBus';
import { useDependencies } from 'app/hooks';
import { IUser } from 'app/deps/userService/model';
import { IAsyncData } from 'model';
import { BACKEND_BASE_URL } from 'consts';
import { ImageCropper } from 'ui-kit/ImageCropper';
import { Button } from '@material-ui/core';
import { useTranslation } from 'react-i18next';
import { useBtnStyles } from 'ui-kit/Button';

interface IProps {
    mode?: 'creat' | 'view';
}

export const ProfilePhoto: React.FC<IProps> = ({ mode = 'creat' }) => {
    const { messageBus, modalService } = useDependencies();
    const { register, setValue, watch } = useFormContext();
    const { t } = useTranslation(['Common']);
    const btnClasses = useBtnStyles();
    const logo = watch('logo');
    const imageUploadRef = React.useRef<HTMLInputElement>();
    const [selectedFile, setSelectedFile] = React.useState();
    const blobRef = React.useRef(null);
    const [preview, setPreview] = React.useState(logo ?? '/assets/images/placeholder/128x128.png');

    React.useEffect(() => {
        const userSbsR = messageBus.subscribe<IMessage<'GET_USER_SUCCESS', IAsyncData<IUser>>>(({ payload }) => {
            if (payload.data.imageUrl) {
                setPreview(`${BACKEND_BASE_URL}/${payload.data.imageUrl}`);
            }
        }, 'GET_USER_SUCCESS');

        return userSbsR;
    }, []);

    React.useEffect(() => {
        register({ name: 'logo' });
    }, [register]);

    React.useEffect(() => {
        if (logo !== null && logo instanceof File) {
            const objectUrl = URL.createObjectURL(blobRef.current);
            setPreview(objectUrl);
            return () => URL.revokeObjectURL(objectUrl);
        }
    }, [logo]);

    const handleChangePhotoClick = () => {
        imageUploadRef.current.click();
    };

    const handleChangePhoto = (e: any) => {
        const files = e.target?.files;
        if (!files || files?.length === 0) {
            setSelectedFile(undefined);
            return;
        }
        setSelectedFile(files[0]);
    };

    const handleSubmit = React.useCallback(() => {
        setValue(
            'logo',
            new File([blobRef.current], (selectedFile as File)?.name, {
                type: (selectedFile as File)?.type,
            }),
        );
        modalService.requestModal({ opened: false, body: null });
    }, [selectedFile]);

    React.useEffect(() => {
        if (!selectedFile) {
            return;
        }
        const objectUrl = URL.createObjectURL(selectedFile);

        modalService.requestModal({
            size: 'lg',
            divider: false,
            body: (
                <>
                    <div>
                        <ImageCropper
                            inputImg={objectUrl}
                            getBlob={(x: Blob) => {
                                blobRef.current = x;
                            }}
                        />
                    </div>
                    <div className="d-flex justify-content-end margin-top-24 margin-bottom-24 margin-right-24 margin-left-24">
                        <div className="margin-right-24">
                            <Button
                                onClick={() => modalService.requestModal({ opened: false, body: null })}
                                className={btnClasses.root}
                                variant="contained"
                                color="default"
                                component="span"
                            >
                                {t('Common:Action.CANCEL')}
                            </Button>
                        </div>
                        <Button
                            onClick={handleSubmit}
                            className={btnClasses.root}
                            variant="contained"
                            color="secondary"
                            component="span"
                        >
                            {t('Common:Action.SAVE')}
                        </Button>
                    </div>
                </>
            ),
        });

        return () => URL.revokeObjectURL(objectUrl);
    }, [selectedFile]);

    return (
        <div className="profile-photo-upload">
            <div className="profile-photo-upload__preview">
                <img alt="" className="profile-photo-upload__preview__img" src={preview} />
                {mode === 'creat' && (
                    <div className="profile-photo-upload__preview__change" onClick={handleChangePhotoClick}>
                        <CameraAlt fontSize="large" />
                        <input
                            accept="image/x-png,image/jpg,image/jpeg"
                            onChange={handleChangePhoto}
                            ref={imageUploadRef}
                            type="file"
                            name="logo"
                            style={{ display: 'none' }}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};
ProfilePhoto.displayName = 'ProfilePhoto';
