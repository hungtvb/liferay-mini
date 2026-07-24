import {
    StaticClients,
    StaticCommunity,
    StaticCta,
    StaticFeature,
    StaticMarketing,
    StaticStatistics,
    StaticTestimonial,
} from './components/ContentSections';
import {StaticFooter} from './components/Footer';
import {StaticHeader} from './components/Header';
import {StaticHero} from './components/Hero';

export function StaticPage() {
    return (
        <div className="wrapper">
            <StaticHeader />
            <main className="page">
                <StaticHero />
                <StaticClients />
                <StaticCommunity />
                <StaticFeature featureKey="primary" />
                <StaticStatistics />
                <StaticFeature featureKey="secondary" />
                <StaticTestimonial />
                <StaticMarketing />
                <StaticCta />
            </main>
            <StaticFooter />
        </div>
    );
}
