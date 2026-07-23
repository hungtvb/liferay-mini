import ball from './fallback/assets/icons/Social/ball.svg';
import email from './fallback/assets/icons/Social/email.svg';
import instagram from './fallback/assets/icons/Social/instagram.svg';
import twitter from './fallback/assets/icons/Social/twitter.svg';
import youtube from './fallback/assets/icons/Social/youtube.svg';
import building from './fallback/assets/icons/building.svg';
import client1 from './fallback/assets/icons/Clients/client-1.svg';
import client2 from './fallback/assets/icons/Clients/client-2.svg';
import client3 from './fallback/assets/icons/Clients/client-3.svg';
import client4 from './fallback/assets/icons/Clients/client-4.svg';
import client5 from './fallback/assets/icons/Clients/client-5.svg';
import client6 from './fallback/assets/icons/Clients/client-6.svg';
import event from './fallback/assets/icons/event.svg';
import hands2 from './fallback/assets/icons/hands-2.png';
import hands from './fallback/assets/icons/hands.svg';
import logoDark from './fallback/assets/icons/logo-2.svg';
import logo from './fallback/assets/icons/logo.svg';
import payment from './fallback/assets/icons/payment.svg';
import people1 from './fallback/assets/icons/people-1.svg';
import people2 from './fallback/assets/icons/people-2.png';
import hero from './fallback/assets/img/image-1.png';
import featurePrimary from './fallback/assets/img/image-2.png';
import featureSecondary from './fallback/assets/img/image-3.png';
import testimonial from './fallback/assets/img/image-4.jpg';
import article1 from './fallback/assets/img/image-5.jpg';
import article2 from './fallback/assets/img/image-6.jpg';
import article3 from './fallback/assets/img/image-7.jpg';

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
