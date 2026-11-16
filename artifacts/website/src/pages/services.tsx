import { Layout } from '@/components/site/layout';
import { ImportExportSection, CarsSection, LogisticsSection, TrackingSection, CommerceSection, EcosystemStatus } from '@/components/site/sections';

/** Detailed service journeys, kept off the homepage so the homepage stays short and editorial. */
export default function Services() {
  return (
    <Layout>
      <div className="pt-28 md:pt-32">
        <ImportExportSection />
        <CarsSection />
        <LogisticsSection />
        <TrackingSection />
        <CommerceSection />
        <div className="pt-20"><EcosystemStatus /></div>
      </div>
    </Layout>
  );
}
