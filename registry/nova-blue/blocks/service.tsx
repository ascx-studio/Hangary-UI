import * as motion from "motion/react-client";
import Items from "../ui/items";
import ServiceCard from "../components/cards/service-card";
import { services } from "../lib/constants";
import Container from "../components/container";

const Service = ({ isPage = false }: { isPage?: boolean }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  return (
    <Container className="w-full p-5 mx-auto" id="services">
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
        Here&apos;s How I Can Help You
      </h2>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-max"
      >
        {services.slice(0, 5).map((service, index) => (
          <ServiceCard
            key={`core-${(service as any).id ?? index}`}
            service={service}
            index={index}
            className={service.gridClass}
          />
        ))}
      </motion.div>
    </Container>
  );
};

export default Service;
