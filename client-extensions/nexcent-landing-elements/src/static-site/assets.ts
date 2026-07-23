import ball from '../../../../prototypes/nexcent-static/icons/Social/ball.svg';
import email from '../../../../prototypes/nexcent-static/icons/Social/email.svg';
import instagram from '../../../../prototypes/nexcent-static/icons/Social/instagram.svg';
import twitter from '../../../../prototypes/nexcent-static/icons/Social/twitter.svg';
import youtube from '../../../../prototypes/nexcent-static/icons/Social/youtube.svg';
import building from '../../../../prototypes/nexcent-static/icons/building.svg';
import client1 from '../../../../prototypes/nexcent-static/icons/Clients/client-1.svg';
import client2 from '../../../../prototypes/nexcent-static/icons/Clients/client-2.svg';
import client3 from '../../../../prototypes/nexcent-static/icons/Clients/client-3.svg';
import client4 from '../../../../prototypes/nexcent-static/icons/Clients/client-4.svg';
import client5 from '../../../../prototypes/nexcent-static/icons/Clients/client-5.svg';
import client6 from '../../../../prototypes/nexcent-static/icons/Clients/client-6.svg';
import event from '../../../../prototypes/nexcent-static/icons/event.svg';
import hands2 from '../../../../prototypes/nexcent-static/icons/hands-2.png';
import hands from '../../../../prototypes/nexcent-static/icons/hands.svg';
import logoDark from '../../../../prototypes/nexcent-static/icons/logo-2.svg';
import logo from '../../../../prototypes/nexcent-static/icons/logo.svg';
import payment from '../../../../prototypes/nexcent-static/icons/payment.svg';
import people1 from '../../../../prototypes/nexcent-static/icons/people-1.svg';
import people2 from '../../../../prototypes/nexcent-static/icons/people-2.png';
import hero from '../../../../prototypes/nexcent-static/img/image-1.png';
import featurePrimary from '../../../../prototypes/nexcent-static/img/image-2.png';
import featureSecondary from '../../../../prototypes/nexcent-static/img/image-3.png';
import testimonial from '../../../../prototypes/nexcent-static/img/image-4.jpg';
import article1 from '../../../../prototypes/nexcent-static/img/image-5.jpg';
import article2 from '../../../../prototypes/nexcent-static/img/image-6.jpg';
import article3 from '../../../../prototypes/nexcent-static/img/image-7.jpg';

export const staticAssets = {
    article1,
    article2,
    article3,
    ball,
    building,
    client1,
    client2,
    client3,
    client4,
    client5,
    client6,
    email,
    event,
    featurePrimary,
    featureSecondary,
    hands,
    hands2,
    hero,
    instagram,
    logo,
    logoDark,
    payment,
    people1,
    people2,
    testimonial,
    twitter,
    youtube,
} as const;

export type StaticAssetKey = keyof typeof staticAssets;

export function resolveStaticAsset(key: string): string {
    const asset = staticAssets[key as StaticAssetKey];

    if (!asset) {
        throw new Error(`Unknown Nexcent static asset: ${key}`);
    }

    return asset;
}
