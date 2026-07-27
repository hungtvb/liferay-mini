import {resolveStaticAsset} from '../../assets';
import {
    readBooleanSetting,
    readStringSetting,
} from '../../runtime/fragmentSettings';

type ClientsProps = {
    host?: HTMLElement;
};

type ClientLogo = {
    alt: string;
    imageURL: string;
};

const DEFAULT_TITLE = 'Our Clients';
const DEFAULT_DESCRIPTION = 'We have been working with some Fortune 500+ clients';
const DEFAULT_LOGOS: ClientLogo[] = [
    {alt: 'Client 1', imageURL: resolveStaticAsset('client1')},
    {alt: 'Client 2', imageURL: resolveStaticAsset('client2')},
    {alt: 'Client 3', imageURL: resolveStaticAsset('client3')},
    {alt: 'Client 4', imageURL: resolveStaticAsset('client4')},
    {alt: 'Client 5', imageURL: resolveStaticAsset('client5')},
    {alt: 'Client 6', imageURL: resolveStaticAsset('client6')},
];

function ClientLogos({
    duplicate = false,
    logos,
}: {
    duplicate?: boolean;
    logos: ClientLogo[];
}) {
    return (
        <div
            aria-hidden={duplicate || undefined}
            className="ticker__items ticker__marquee"
        >
            {logos.map((logo, index) => (
                <div className="ticker__item" key={`${logo.imageURL}-${index}-${duplicate}`}>
                    <img src={logo.imageURL} alt={duplicate ? '' : logo.alt} />
                </div>
            ))}
        </div>
    );
}

function readClientLogos(host: HTMLElement | undefined): ClientLogo[] {
    return DEFAULT_LOGOS.map((fallback, index) => ({
        alt: readStringSetting(host, `logo-${index + 1}-alt`, fallback.alt),
        imageURL: readStringSetting(
            host,
            `logo-${index + 1}-url`,
            fallback.imageURL
        ),
    }));
}

export function Clients({host}: ClientsProps) {
    const logos = readClientLogos(host);
    const title = readStringSetting(host, 'title', DEFAULT_TITLE);
    const description = readStringSetting(
        host,
        'description',
        DEFAULT_DESCRIPTION
    );
    const showTicker = readBooleanSetting(host, 'show-ticker', true);

    return (
        <section className="clients">
            <div className="clients__container">
                <div className="title">
                    <h2>{title}</h2>
                    <p>{description}</p>
                </div>

                <div className="clients__wrapper mt">
                    <div className="clients__ticker ticker">
                        <div className="clients__box ticker__wrapper">
                            <ClientLogos logos={logos} />
                            {showTicker ? <ClientLogos duplicate logos={logos} /> : null}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
