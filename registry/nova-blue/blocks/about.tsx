import Items from "../ui/items";
import Container from "../components/container";
import ProfileCard from "../ui/profile-card";
import SectionHeading from "../ui/section-heading";
import { frameworksAndTools,clouds,marketingAndAds } from "../lib/skills-data";
import SkillCard from "../components/cards/skill-card";

const About = async ({ isPage = false }: { isPage?: boolean }) => {

  return (
    <Container
      id="about"
      className="w-full p-5"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Items
        Number="02"
        title="About Me"
        headingTag={isPage ? "h1" : "h2"}
        des="Full-stack developer specializing in high-performance web applications built with clean, scalable code to drive user growth and digital transformation."
      />
      <ProfileCard />
      <SectionHeading className="mt-12">
        Tech Stack.
      </SectionHeading>
      <div className="grid grid-cols-2 gap-px bg-border md:grid-cols-4">
        {[...clouds, ...frameworksAndTools].map((skill) => (
          <SkillCard key={skill.label} skill={skill} />
        ))}
      </div>

    </Container>
  );
};

export default About;
