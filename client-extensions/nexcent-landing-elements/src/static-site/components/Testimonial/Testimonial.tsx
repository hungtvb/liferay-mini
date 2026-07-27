import {resolveStaticAsset} from '../../assets';
import {
    readBooleanSetting,
    readStringSetting,
} from '../../runtime/fragmentSettings';

type TestimonialProps = {
    host?: HTMLElement;
};

const PARTNER_LOGOS = [
    {alt: 'Client 1', imageURL: resolveStaticAsset('client1')},
    {alt: 'Client 2', imageURL: resolveStaticAsset('client2')},
    {alt: 'Client 3', imageURL: resolveStaticAsset('client3')},
    {alt: 'Client 4', imageURL: resolveStaticAsset('client4')},
    {alt: 'Client 5', imageURL: resolveStaticAsset('client5')},
    {alt: 'Client 6', imageURL: resolveStaticAsset('client6')},
];

export function Testimonial({host}: TestimonialProps) {
    const quote = readStringSetting(
        host,
        'quote',
        'Maecenas dignissim justo eget nulla rutrum molestie. Maecenas lobortis sem dui, vel rutrum risus tincidunt ullamcorper. Proin eu enim metus. Vivamus sed libero ornare, tristique quam in, gravida enim. Nullam ut molestie arcu, at hendrerit elit. Morbi laoreet elit at ligula molestie, nec molestie mi blandit. Suspendisse cursus tellus sed augue ultrices, quis tristique nulla sodales. Suspendisse eget lorem eu turpis vestibulum pretium. Suspendisse potenti. Quisque malesuada enim sapien, vitae placerat ante feugiat eget. Quisque vulputate odio neque, eget efficitur libero condimentum id. Curabitur id nibh id sem dignissim finibus ac sit amet magna.'
    );
    const author = readStringSetting(host, 'author', 'Tim Smith');
    const organization = readStringSetting(
        host,
        'organization',
        'British Dragon Boat Racing Association'
    );
    const imageURL = readStringSetting(
        host,
        'image-url',
        resolveStaticAsset('testimonial')
    );
    const imageAlt = readStringSetting(host, 'image-alt', 'Tim Smith');
    const linkLabel = readStringSetting(
        host,
        'link-label',
        'Meet all customers'
    );
    const linkHref = readStringSetting(host, 'link-url', '#customers');
    const linkTarget = readStringSetting(host, 'link-target', '_self');
    const showPartnerLogos = readBooleanSetting(host, 'show-partner-logos', true);

    return (
        <section className="customers" id="testimonial">
            <div className="customers__container block">
                <div className="customers__item block__item">
                    <p className="customers__info block__info">{quote}</p>
                    <p className="customers__box block__box mt">{author}</p>
                    <p className="customers__text">{organization}</p>

                    <div className="customers__partner ticker">
                        <div className="customers__wrapper">
                            {showPartnerLogos ? (
                                <div className="customers__items ticker__items">
                                    {PARTNER_LOGOS.map((logo, index) => (
                                        <div
                                            className="customers__icon ticker__item"
                                            key={`${logo.imageURL}-${index}`}
                                        >
                                            <img src={logo.imageURL} alt={logo.alt} />
                                        </div>
                                    ))}
                                </div>
                            ) : null}
                            <div className="customers__btn">
                                <a
                                    className="btn__wrapper"
                                    href={linkHref}
                                    target={linkTarget || undefined}
                                >
                                    {linkLabel} &nbsp; →
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="customers__img img">
                    <img src={imageURL} alt={imageAlt} />
                </div>
            </div>
        </section>
    );
}
