import {Articles} from './components/Articles/Articles';
import {Clients} from './components/Clients/Clients';
import {Community} from './components/Community/Community';
import {Cta} from './components/Cta/Cta';
import {Feature} from './components/Feature/Feature';
import {StaticFooter} from './components/Footer';
import {StaticHeader} from './components/Header';
import {StaticHero} from './components/Hero';
import {Statistics} from './components/Statistics/Statistics';
import {Testimonial} from './components/Testimonial/Testimonial';

export function StaticPage() {
    return (
        <div className="wrapper">
            <StaticHeader />
            <main className="page">
                <StaticHero />
                <Clients />
                <Community />
                <Feature featureKey="primary" />
                <Statistics />
                <Feature featureKey="secondary" />
                <Testimonial />
                <Articles />
                <Cta />
            </main>
            <StaticFooter />
        </div>
    );
}
