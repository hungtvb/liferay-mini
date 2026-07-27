import {resolveStaticAsset} from '../../assets';
import {
    type HeadlessStructuredContent,
    readContentImage,
    readContentText,
} from '../../headless/headlessContentClient';
import {useStructuredContentCollection} from '../../headless/useStructuredContentCollection';
import {
    readNumberSetting,
    readStringSetting,
} from '../../runtime/fragmentSettings';

type CommunityProps = {
    host?: HTMLElement;
};

type CommunityItem = {
    description: string;
    imageAlt: string;
    imageURL: string;
    title: string;
};

const DEFAULT_TITLE = 'Manage your entire community in a single system';
const DEFAULT_DESCRIPTION = 'Who is Nextcent suitable for?';
const PREVIEW_ITEMS: CommunityItem[] = [
    {
        description:
            'Our membership management software provides full automation of membership renewals and payments',
        imageAlt: 'Membership organisations',
        imageURL: resolveStaticAsset('people1'),
        title: 'Membership Organisations',
    },
    {
        description:
            'Our membership management software provides full automation of membership renewals and payments',
        imageAlt: 'National associations',
        imageURL: resolveStaticAsset('building'),
        title: 'National Associations',
    },
    {
        description:
            'Our membership management software provides full automation of membership renewals and payments',
        imageAlt: 'Clubs and groups',
        imageURL: resolveStaticAsset('hands'),
        title: 'Clubs And Groups',
    },
];

export function mapCommunityContent(
    structuredContent: HeadlessStructuredContent
): CommunityItem {
    const title = readContentText(
        structuredContent,
        ['title', 'heading'],
        structuredContent.title
    );
    const image = readContentImage(
        structuredContent,
        ['icon', 'image', 'iconFile'],
        {alt: title, url: ''}
    );

    return {
        description: readContentText(structuredContent, [
            'description',
            'summary',
        ]),
        imageAlt: readContentText(
            structuredContent,
            ['iconAlt', 'imageAlt'],
            image.alt || title
        ),
        imageURL: image.url,
        title,
    };
}

export function Community({host}: CommunityProps) {
    const structureIdentifier = readStringSetting(
        host,
        'structure-identifier',
        'NXC Service Item'
    );
    const maxItems = readNumberSetting(host, 'max-items', 3, {
        max: 12,
        min: 1,
    });
    const title = readStringSetting(host, 'title', DEFAULT_TITLE);
    const description = readStringSetting(
        host,
        'description',
        DEFAULT_DESCRIPTION
    );
    const {error, items, status} = useStructuredContentCollection({
        host,
        mapContent: mapCommunityContent,
        maxItems,
        previewItems: PREVIEW_ITEMS,
        structureIdentifier,
    });

    if (host && (status === 'loading' || status === 'empty')) {
        return null;
    }

    return (
        <section className="community" data-runtime-state={status} id="services">
            <div className="community__container">
                <div className="community__title title">
                    <h2>{title}</h2>
                    <p>{description}</p>
                </div>

                <div className="community__items mt">
                    {items.map((item, index) => (
                        <article className="community__item" key={`${item.title}-${index}`}>
                            {item.imageURL ? (
                                <div className="community__icon">
                                    <img src={item.imageURL} alt={item.imageAlt} />
                                </div>
                            ) : null}
                            <h3>{item.title}</h3>
                            <p>{item.description}</p>
                        </article>
                    ))}
                </div>

                {error ? (
                    <span className="sr-only" role="status">
                        Unable to load services: {error.message}
                    </span>
                ) : null}
            </div>
        </section>
    );
}
