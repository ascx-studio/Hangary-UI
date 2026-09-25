
import LocationCard from "../../../components/portfolio/cards/location-card";
import SectionHeading from "../../../ui/portfolio/section-heading";

export default function TimeZone() {

  return (
    <>
      <SectionHeading className="text-3xl font-bold text-white">
        Availability & Location
      </SectionHeading>


      <div className="grid grid-cols-1 md:grid-cols-3 mt-4 gap-6">
        <LocationCard
          label="01"
          title="United Kingdom"
          subtitle="OnSite / Remote"
          address={["156 Wooster Street", "SoHo, NY 10012"]}
          status="Open Now"
          statusDotClass="bg-[#e55b44]"
        />

        <LocationCard
          label="02"
          title="Nepal"
          subtitle="OnSite / Remote"
          address={["33 Shoreditch High St", "London E1 6PG"]}
          status="Open Now"
        />

        <LocationCard
          label="03 — Global"
          title="Remote"
          subtitle="Worldwide Network"
          address={["Digital nomads & collaborators", "across 12 timezones."]}
          status="Online Always"
        />
      </div>
    </>
  );
}
