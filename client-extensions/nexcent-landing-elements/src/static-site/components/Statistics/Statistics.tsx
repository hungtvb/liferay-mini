import {resolveStaticAsset} from '../../assets';
import {readStringSetting} from '../../runtime/fragmentSettings';

type StatisticsProps = {
    host?: HTMLElement;
};

const DEFAULT_ITEMS = [
    {
        imageAlt: 'Members',
        imageURL: resolveStaticAsset('people2'),
        label: 'Members',
        value: '2,245,341',
    },
    {
        imageAlt: 'Clubs',
        imageURL: resolveStaticAsset('hands2'),
        label: 'Clubs',
        value: '46,328',
    },
    {
        imageAlt: 'Event bookings',
        imageURL: resolveStaticAsset('event'),
        label: 'Event Bookings',
        value: '828,867',
    },
    {
        imageAlt: 'Payments',
        imageURL: resolveStaticAsset('payment'),
        label: 'Payments',
        value: '1,926,436',
    },
];

export function Statistics({host}: StatisticsProps) {
    const title = readStringSetting(host, 'title', 'Helping a local');
    const highlight = readStringSetting(
        host,
        'highlight',
        'business reinvent itself'
    );
    const description = readStringSetting(
        host,
        'description',
        'We reached here with our hard work and dedication'
    );
    const items = DEFAULT_ITEMS.map((fallback, index) => ({
        imageAlt: readStringSetting(
            host,
            `metric-${index + 1}-icon-alt`,
            fallback.imageAlt
        ),
        imageURL: readStringSetting(
            host,
            `metric-${index + 1}-icon-url`,
            fallback.imageURL
        ),
        label: readStringSetting(
            host,
            `metric-${index + 1}-label`,
            fallback.label
        ),
        value: readStringSetting(
            host,
            `metric-${index + 1}-value`,
            fallback.value
        ),
    }));

    return (
        <section className="business" id="product">
            <div className="business__container">
                <div className="business__block block">
                    <div className="block__item">
                        <h2 className="block__title">
                            {title}{' '}
                            <span className="bright-headline">{highlight}</span>
                        </h2>
                        <p className="block__info">{description}</p>
                    </div>
                </div>

                <div className="business__items">
                    {items.map((item, index) => (
                        <div className="business__item" key={`${item.label}-${index}`}>
                            <div className="business__icon">
                                <img src={item.imageURL} alt={item.imageAlt} />
                            </div>
                            <div className="business__info">
                                <p>{item.value}</p>
                                <p>{item.label}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
