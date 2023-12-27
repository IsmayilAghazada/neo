import './index.scss';

import * as React from 'react';

interface IProps {
    size: number;
    progress: number;
    strokeWidthMain: number;
    strokeWidthBg: number;
    circleOneStroke: string;
    circleTwoStroke: string;
    showText?: boolean;
}

export const ProgressBar: React.FC<IProps> = ({
    size,
    progress,
    strokeWidthMain,
    strokeWidthBg,
    circleOneStroke,
    circleTwoStroke,
    showText = true,
}): JSX.Element => {
    const [offset, setOffset] = React.useState(0);
    const center = size / 2;
    const radius = size / 2 - strokeWidthMain / 2;
    const circumference = 2 * Math.PI * radius;

    React.useEffect(() => {
        const progressOffset = ((100 - progress) / 100) * circumference;
        setOffset(progressOffset);
    }, [setOffset, progress, circumference, offset]);

    return (
        <svg className="svg" width={size} height={size}>
            <circle
                className="svg-circle--bg"
                stroke={circleOneStroke}
                cx={center}
                cy={center}
                r={radius + strokeWidthBg}
                strokeWidth={strokeWidthBg}
            />
            <circle
                className="svg-circle"
                stroke={circleTwoStroke}
                strokeLinecap="round"
                cx={center}
                cy={center}
                r={radius}
                strokeWidth={strokeWidthMain}
                strokeDasharray={circumference}
                strokeDashoffset={offset}
            />
            {showText && (
                <text x={center} y={center + 7} className="svg-circle__text">
                    {progress}%
                </text>
            )}
        </svg>
    );
};
ProgressBar.displayName = 'ProgressBar';
