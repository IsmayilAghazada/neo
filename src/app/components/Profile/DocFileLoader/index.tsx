/* eslint-disable no-extra-boolean-cast */
/* eslint-disable react/button-has-type */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import './index.scss';

import * as React from 'react';
import { CloudDownload, DeleteOutlined } from '@material-ui/icons';
import { useTranslation } from 'react-i18next';

interface IProps {
    mode?: 'creat' | 'view';
    value: any;
    onChange?: (value: string) => void;
    deleteBtnShown?: boolean;
    onDelete?: () => void;
    onViewClick?: () => void;
}

export const DocFileLoader: React.FC<IProps> = ({
    mode = 'creat',
    value,
    onChange,
    deleteBtnShown = false,
    onDelete,
    onViewClick,
}) => {
    const { t } = useTranslation(['Common']);
    const attachmentRef = React.useRef<HTMLInputElement>();
    const [preview, setPreview] = React.useState(value ?? t('Common:FormInputs.file.max', { size: '10 MB' }));

    React.useEffect(() => {
        if (value) {
            setPreview(value?.name);
        }
    }, [value]);

    const handleChangeFileClick = () => {
        attachmentRef.current.click();
    };

    const handleChangeFile = (e: any) => {
        if (!e.target.files || e.target.files.length === 0) {
            return;
        }
        onChange(e.target.files[0]);
    };

    return (
        <div className="attachment-box" style={mode === 'view' ? { paddingBottom: 15 } : {}}>
            {Boolean(preview) && mode === 'creat' && (
                <div style={{ cursor: 'pointer' }} onClick={handleChangeFileClick}>
                    <span>{preview}</span>
                    <i>{t('Common:FormInputs.file.types', { types: '.pdf,.doc,.docx,.png,.jpg,.jpeg' })} </i>
                </div>
            )}
            {Boolean(value) && mode === 'view' && (
                <div style={{ cursor: 'pointer', justifyContent: 'center', display: 'flex' }} onClick={onViewClick}>
                    <CloudDownload style={{ fontSize: '3rem' }} />
                </div>
            )}
            {!Boolean(value) && mode === 'view' && <>&mdash;</>}
            <input
                accept="application/msword,application/pdf,image/x-png,image/jpg,image/jpeg"
                onChange={handleChangeFile}
                ref={attachmentRef}
                type="file"
                name="attachment"
                style={{ display: 'none' }}
            />
            {Boolean(value) && deleteBtnShown && (
                <div className="remove-attachment" onClick={onDelete}>
                    <DeleteOutlined />
                </div>
            )}
        </div>
    );
};
DocFileLoader.displayName = 'DocFileLoader';
