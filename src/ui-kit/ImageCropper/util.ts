export type Area = {
    width: number;
    height: number;
    x: number;
    y: number;
};

const createImage = (url: string): Promise<CanvasImageSource> =>
    new Promise((resolve, reject) => {
        const image = new Image();
        image.addEventListener('load', () => resolve(image));
        image.addEventListener('error', (error) => reject(error));
        image.setAttribute('crossOrigin', 'anonymous');
        image.src = url;
    });

export const getCroppedImg = async (imageSrc: string, crop: Area): Promise<Blob> => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    /* setting canvas width & height allows us to
        resize from the original image resolution */
    canvas.width = 250;
    canvas.height = 250;

    ctx.drawImage(image, crop.x, crop.y, crop.width, crop.height, 0, 0, canvas.width, canvas.height);

    return new Promise((resolve) => {
        canvas.toBlob((blob) => {
            resolve(blob);
        }, 'image/jpeg');
    });
};
