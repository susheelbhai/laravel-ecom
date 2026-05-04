import { usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/user/app-layout';
import AboutSection from './pages/home/about';
import ClientSection from './pages/home/clients';
import FeatureSection from './pages/home/features';
import HeroSection from './pages/home/hero';
import NewsletterSection from './pages/home/newsletter';
import TeamSection from './pages/home/team';
import TestimonialSection from './pages/home/testimonials';

const Home = () => {
    const data = usePage().props as any;
    return (
        <AppLayout>
            <HeroSection data={data} />
            <AboutSection />
            <FeatureSection />
            <TeamSection data={data.team} />
            <TestimonialSection data={data.testimonials} />
            <NewsletterSection />
            <ClientSection data={data.clients} />
        </AppLayout>
    );
};

export default Home;
