import Items from "../ui/items";
import ProjectCard from "../components/cards/project-card";
import Container from "../components/container";
import { Suspense } from "react";
import { DotmSquare11 } from "../ui/dotm-square-11";
import { getProjectData } from "../lib/projectdata";

interface ProjectsProps {
  list?: number;
  isPage?: boolean;
}

const Projects = async ({ list = 4, isPage = false }: ProjectsProps) => {
  const projects = await getProjectData();

  return (
    <Container
      animate={{ opacity: 1, y: 0 }}
      id="projects"
      className="w-full p-5 mx-auto overflow-hidden"
    >
      <Items
        Number="01"
        title="Projects"
        headingTag={isPage ? "h1" : "h2"}
        des="Explore a curated gallery of  projects designed to solve complex business challenges. Each case study demonstrates my expertise in building scalable web applications, optimizing for Core Web Vitals, and delivering high-performance digital solutions that drive user engagement."
      />
      <Suspense
        fallback={
          <div className="size-60 mx-auto">
            <DotmSquare11 size={100} />
          </div>
        }
      >
        <div className="grid grid-cols-1 gap-1 md:grid-cols-2 ">
          {projects.slice(0, list).map((project) => (
            <ProjectCard key={project.title} {...project} />
          ))}
        </div>
      </Suspense>
    </Container>
  );
};

export default Projects;
