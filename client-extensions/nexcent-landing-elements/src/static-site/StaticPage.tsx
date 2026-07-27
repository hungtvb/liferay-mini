import {Articles} from './components/Articles/Articles';
import {Clients} from './components/Clients/Clients';
import {Community} from './components/Community/Community';
import {Cta} from './components/Cta/Cta';
import {Feature} from './components/Feature/Feature';
import {Footer} from './components/Footer/Footer';
import {Header} from './components/Header/Header';
import {StaticHero} from './components/Hero';
import {Statistics} from './components/Statistics/Statistics';
import {Testimonial} from './components/Testimonial/Testimonial';

export function StaticPage() {
    return (
        <div className="wrapper">
            <Header />
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
            <Footer />
        </div>
    );
}
