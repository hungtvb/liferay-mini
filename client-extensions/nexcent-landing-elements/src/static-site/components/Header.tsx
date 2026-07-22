import {type MouseEvent, useState} from 'react';

import content from '../../../../../prototypes/nexcent-static/content.json';
import {resolveStaticAsset} from '../assets';

export function StaticHeader() {
    const [open, setOpen] = useState(false);

    const handleNavigation = (
        event: MouseEvent<HTMLAnchorElement>,
        href: string
    ) => {
        setOpen(false);

        if (!href.startsWith('#')) {
            return;
        }

        const rootNode = event.currentTarget.getRootNode();
        const target =
            rootNode instanceof ShadowRoot
                ? rootNode.querySelector<HTMLElement>(href)
                : null;

        if (!target) {
            return;
        }

        event.preventDefault();
        target.scrollIntoView({behavior: 'smooth', block: 'start'});
        window.history.replaceState(null, '', href);
    };

    return (
        <header className="header">
            <div className="header__container">
                <a
                    className="header__logo"
                    href="#home"
                    onClick={(event) => handleNavigation(event, '#home')}
                >
                    <img src={resolveStaticAsset('logo')} alt="Nexcent" />
                </a>

                <button
                    aria-controls="nexcent-react-navigation"
                    aria-expanded={open}
                    aria-label={open ? 'Close navigation' : 'Open navigation'}
                    className={`header__burger-menu${open ? ' active' : ''}`}
                    onClick={() => setOpen((value) => !value)}
                    type="button"
                >
                    <span />
                    <span />
                    <span />
                </button>

                <div
                    className={`header__menu${open ? ' active' : ''}`}
                    id="nexcent-react-navigation"
                >
                    <nav aria-label="Primary navigation">
                        <ul>
                            {content.navigation.map((item) => (
                                <li key={item.label}>
                                    <a
                                        href={item.href}
                                        onClick={(event) =>
                                            handleNavigation(event, item.href)
                                        }
                                    >
                                        {item.label}
                                    </a>
                                    <span className="decor-line" />
                                </li>
                            ))}
                        </ul>
                    </nav>

                    <div className="header__btns">
                        {content.headerActions.map((action) => (
                            <a
                                className={`btn${
                                    action.variant === 'light' ? ' btn-light' : ''
                                }`}
                                href={action.href}
                                key={action.label}
                                onClick={() => setOpen(false)}
                            >
                                {action.label}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </header>
    );
}
