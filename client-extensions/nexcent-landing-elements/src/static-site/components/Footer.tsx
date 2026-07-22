import type {FormEvent} from 'react';

import content from '../../../../../prototypes/nexcent-static/content.json';
import {resolveStaticAsset} from '../assets';

const socialLinks = [
    {asset: 'instagram', label: 'Instagram'},
    {asset: 'ball', label: 'Dribbble'},
    {asset: 'twitter', label: 'Twitter'},
    {asset: 'youtube', label: 'YouTube'},
];

export function StaticFooter() {
    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
    };

    return (
        <footer className="footer">
            <div className="footer__container">
                <div className="footer__box">
                    <a className="footer__logo" href="#home">
                        <img src={resolveStaticAsset('logoDark')} alt="Nexcent" />
                    </a>
                    <p>{content.footer.copyright}</p>
                    <p>{content.footer.rights}</p>

                    <div className="footer__social social">
                        {socialLinks.map((item) => (
                            <a
                                aria-label={item.label}
                                href={`#${item.label.toLowerCase()}`}
                                key={item.label}
                            >
                                <img
                                    src={resolveStaticAsset(item.asset)}
                                    alt=""
                                    aria-hidden="true"
                                />
                            </a>
                        ))}
                    </div>
                </div>

                <div className="footer__items">
                    {content.footer.columns.map((column) => (
                        <div className="footer__item" key={column.title}>
                            <h3>{column.title}</h3>
                            {column.links.map((link) => (
                                <a href={link.href} key={link.label}>
                                    {link.label}
                                </a>
                            ))}
                        </div>
                    ))}

                    <div className="footer__item footer__submit">
                        <h3>{content.footer.newsletterTitle}</h3>
                        <form className="footer__form" onSubmit={handleSubmit}>
                            <div>
                                <label className="sr-only" htmlFor="nexcent-react-email">
                                    {content.footer.newsletterPlaceholder}
                                </label>
                                <input
                                    id="nexcent-react-email"
                                    type="email"
                                    required
                                    placeholder={content.footer.newsletterPlaceholder}
                                />
                                <button aria-label="Subscribe" type="submit">
                                    <span className="footer__form-icon">
                                        <img
                                            src={resolveStaticAsset('email')}
                                            alt=""
                                            aria-hidden="true"
                                        />
                                    </span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </footer>
    );
}
