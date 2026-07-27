import {resolveStaticAsset} from '../../assets';
import {
    readBooleanSetting,
    readStringSetting,
} from '../../runtime/fragmentSettings';

type FeatureKey = 'primary' | 'secondary';

type FeatureProps = {
    featureKey: FeatureKey;
    host?: HTMLElement;
};

type FeatureDefaults = {
    buttonHref: string;
    buttonLabel: string;
    description: string;
    imageAlt: string;
    imageURL: string;
    title: string;
};

const DEFAULTS: Record<FeatureKey, FeatureDefaults> = {
    primary: {
        buttonHref: '#learn-more',
        buttonLabel: 'Learn More',
        description:
            'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit amet justo ipsum. Sed accumsan quam vitae est varius fringilla. Pellentesque placerat vestibulum lorem sed porta. Nullam mattis tristique iaculis. Nullam pulvinar sit amet risus pretium auctor. Etiam quis massa pulvinar, aliquam quam vitae, tempus sem. Donec elementum pulvinar odio.',
        imageAlt: 'Mobile login illustration',
        imageURL: resolveStaticAsset('featurePrimary'),
        title: 'The unseen of spending three years at Pixelgrade',
    },
    secondary: {
        buttonHref: '#learn-more',
        buttonLabel: 'Learn More',
        description:
            'Donec a eros justo. Fusce egestas tristique ultrices. Nam tempor, augue nec tincidunt molestie, massa nunc varius arcu, at scelerisque elit erat a magna. Donec quis erat at libero ultrices mollis. In hac habitasse platea dictumst. Vivamus vehicula leo dui, at porta nisi facilisis finibus. In euismod augue vitae nisi ultricies, non aliquet urna tincidunt. Integer in nisi eget nulla commodo faucibus efficitur quis massa. Praesent felis est, finibus et nisi ac, hendrerit venenatis libero. Donec consectetur faucibus ipsum id gravida.',
        imageAlt: 'Mobile authentication illustration',
        imageURL: resolveStaticAsset('featureSecondary'),
        title: 'How to design your site footer like we did',
    },
};

export function Feature({featureKey, host}: FeatureProps) {
    const defaults = DEFAULTS[featureKey];
    const title = readStringSetting(host, 'title', defaults.title);
    const description = readStringSetting(
        host,
        'description',
        defaults.description
    );
    const buttonLabel = readStringSetting(
        host,
        'button-label',
        defaults.buttonLabel
    );
    const buttonHref = readStringSetting(
        host,
        'button-url',
        defaults.buttonHref
    );
    const buttonTarget = readStringSetting(host, 'button-target', '_self');
    const imageURL = readStringSetting(host, 'image-url', defaults.imageURL);
    const imageAlt = readStringSetting(host, 'image-alt', defaults.imageAlt);
    const showButton = readBooleanSetting(host, 'show-button', true);

    return (
        <section
            className="pixelgrade section"
            id={featureKey === 'primary' ? 'features' : undefined}
        >
            <div className="pixelgrade__container section__container block">
                <div className="pixelgrade__item section__item block__item">
                    <h2 className="pixelgrade__title block__title">{title}</h2>
                    <p className="block__info">{description}</p>
                    {showButton ? (
                        <a
                            className="pixelgrade__btn btn block__box"
                            href={buttonHref}
                            target={buttonTarget || undefined}
                        >
                            {buttonLabel}
                        </a>
                    ) : null}
                </div>

                <div className="pixelgrade__img section__img">
                    <img src={imageURL} alt={imageAlt} />
                </div>
            </div>
        </section>
    );
}
