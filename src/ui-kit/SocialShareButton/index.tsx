import './index.scss';

import * as React from 'react';

const MESSENGER_APP_ID = 'FB_APP_ID';

interface IButtonProps {
    type: 'whatsapp' | 'telegram' | 'messenger' | 'mail' | 'facebook' | 'linkedin' | 'twitter';
    onClick?: () => void;
    message?: string;
    subject?: string;
    link?: string;
}

export const SocialShareButton: React.FC<IButtonProps> = ({ type, onClick, message = '', link = '', subject = '' }) => {
    const encodedLink = encodeURIComponent(link);
    const links = {
        facebook: { url: `http://www.facebook.com/sharer.php?u=${encodedLink}`, className: 'icon-brand-facebook-f' },
        whatsapp: {
            url: `https://web.whatsapp.com/send?text=${message}%0a${encodedLink}`,
            className: 'icon-brand-whatsapp',
        },
        telegram: {
            url: `https://t.me/share/url?text=${message}&url=${encodedLink}`,
            className: 'icon-brand-telegram',
        },
        messenger: {
            url: `https://www.facebook.com/dialog/send?link=${encodedLink}&redirect_uri=https://www.facebook.com&app_id=${MESSENGER_APP_ID}`,
            className: 'icon-brand-facebook-messenger',
        },
        mail: {
            url: `mailto:?subject=${subject}&body=${message}%0D%0A%0D%0A${encodedLink}`,
            className: 'icon-brand-facebook-f',
        },
        linkedin: {
            url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedLink}`,
            className: 'icon-brand-linkedin-in',
        },
        twitter: {
            url: `https://twitter.com/intent/tweet?url=${encodedLink}&text=${message}&hashtags=${subject}`,
            className: 'icon-brand-twitter',
        },
    };

    return (
        <a
            className={`social-share__btn social-share__btn--${type}`}
            onClick={onClick}
            target="_blank"
            rel="noreferrer noopener"
            href={links[type].url}
        >
            <i className={links[type].className} />
        </a>
    );
};

SocialShareButton.displayName = 'SocialShareButton';
