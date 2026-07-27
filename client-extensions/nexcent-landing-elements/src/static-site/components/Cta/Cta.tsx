import {
    readBooleanSetting,
    readStringSetting,
} from '../../runtime/fragmentSettings';

type CtaProps = {
    host?: HTMLElement;
};

export function Cta({host}: CtaProps) {
    const title = readStringSetting(
        host,
        'title',
        'Pellentesque suscipit fringilla libero eu.'
    );
    const buttonLabel = readStringSetting(host, 'button-label', 'Get a Demo');
    const buttonHref = readStringSetting(host, 'button-url', '#demo');
    const buttonTarget = readStringSetting(host, 'button-target', '_self');
    const showButton = readBooleanSetting(host, 'show-button', true);

    return (
        <section className="suscipit" id="faq">
            <div className="suscipit__container block">
                <div className="suscipit__info block__item">
                    <h2 className="block__title big-fs">{title}</h2>
                    {showButton ? (
                        <a
                            className="suscipit__btn btn block__box"
                            href={buttonHref}
                            target={buttonTarget || undefined}
                        >
                            {buttonLabel} &nbsp; →
                        </a>
                    ) : null}
                </div>
            </div>
        </section>
    );
}
