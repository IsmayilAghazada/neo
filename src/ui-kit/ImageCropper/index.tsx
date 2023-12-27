import { createStyles, makeStyles, Slider, Theme } from '@material-ui/core';
import * as React from 'react';
import Cropper from 'react-easy-crop';
import { Area, getCroppedImg } from './util';

interface IProps {
    getBlob: (blob: Blob) => void;
    inputImg: string;
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        cropContainer: {
            position: 'relative',
            width: '100%',
            height: 200,
            background: '#333',
            [theme.breakpoints.up('sm')]: {
                height: 400,
            },
        },
        controls: {
            padding: '0 16px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'stretch',
            [theme.breakpoints.up('sm')]: {
                flexDirection: 'row',
                alignItems: 'center',
            },
        },
    }),
);
export const ImageCropper: React.FC<IProps> = ({ getBlob, inputImg }) => {
    const [crop, setCrop] = React.useState({ x: 0, y: 0 });
    const [zoom, setZoom] = React.useState<number>(1);
    const classes = useStyles();

    /* onCropComplete() will occur each time the user modifies the cropped area,
    which isn't ideal. A better implementation would be getting the blob
    only when the user hits the submit button, but this works for now  */
    const onCropComplete = async (_: any, croppedAreaPixels: Area) => {
        const croppedImage = await getCroppedImg(inputImg, croppedAreaPixels);
        getBlob(croppedImage);
    };

    return (
        <>
            <div className={classes.cropContainer}>
                <Cropper
                    image={inputImg}
                    crop={crop}
                    zoom={zoom}
                    aspect={1}
                    cropShape="round"
                    showGrid={false}
                    onCropChange={setCrop}
                    onCropComplete={onCropComplete}
                    onZoomChange={setZoom}
                />
            </div>
            <div className={classes.controls}>
                <Slider
                    value={zoom}
                    min={1}
                    max={3}
                    step={0.1}
                    aria-labelledby="Zoom"
                    onChange={(_, x: number) => setZoom(x)}
                    style={{ paddingTop: '24px 0' }}
                />
            </div>
        </>
    );
};
ImageCropper.displayName = 'ImageCropper';
