import * as motion from "motion/react-client";
import Items from "../ui/items";
import { socialLinks } from "../lib/constants";
import Container from "../components/container";
import { Mail } from "lucide-react";
import Service from "./service";

function Contact({ isPage = false }: { isPage?: boolean }) {
  const email = "contact@rajeevpuri.com.np";
  const emailCode = `{
    name: "Rajeev Puri",
    email: "${email}",
    title: "BSc Student && Software Engineer",
    gitHub: "https://github.com/razeevascx",
    website: "https://rajeevpuri.com.np",
}`;

  return (
    <>
      <Container
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        id="contact"
        className=" p-5"
      >
        <div className=" mx-auto">
          <Items
            Number="03"
            title="Contact Me"
            headingTag={isPage ? "h1" : "h2"}
            des="Let’s bring your vision to life. Whether you're looking for UI/UX design or scalable web engineering, I’m here to help. Reach out through any of these channels to start our conversation."
          />
          <div className="relative">
            <div className="border-dashed border-2  p-6 font-mono text-sm  border-slate-700/50   hover:border-primary transition-all duration-300 group">
              <span className="text-slate-400 ">{`// Contact Information`}</span>
              <pre className="text-primary justify-normal text-lg font-serif font-bold tracking-wider whitespace-pre-wrap wrap-break-word">
                <code>{emailCode}</code>
              </pre>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2  mt-8">
              <motion.a
                href={`mailto:${email}`}
                className={`flex flex-col justify-between p-6 md:p-8 border border-zinc-900 hover:border-primary transition-all duration-300 rounded-none group shadow-[0_0_20px_rgba(0,0,0,0.4)] hover:shadow-[0_0_30px_rgba(40,131,255,0.03)] select-none cursor-pointer `}
              >
                <div className="flex items-center gap-5">
                  <div className="size-10 flex items-center justify-center border border-zinc-900 group-hover:border-primary  transition-all duration-300 shrink-0">
                    <div className="text-white group-hover:text-primary transition-colors">
                      <Mail className="text-2xl " />
                    </div>
                  </div>
                  <div>
                    <div className="font-bold text-lg text-zinc-100 group-hover:text-primary tracking-wide transition-colors flex items-center gap-2">
                      <span> Send Email</span>
                    </div>
                    <div className="text-xs text-zinc-500 font-sans mt-0.5">
                      {email}
                    </div>
                  </div>
                </div>
              </motion.a>
              {socialLinks
                .filter((link) => link.name !== "Mail")
                .map((link, index) => (
                  <motion.a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex flex-col justify-between p-6 md:p-8 border border-zinc-900 hover:border-primary transition-all duration-300 rounded-none group shadow-[0_0_20px_rgba(0,0,0,0.4)] hover:shadow-[0_0_30px_rgba(40,131,255,0.03)] select-none cursor-pointer ${link.hoverColor}`}
                  >
                    <div className="flex items-center gap-5">
                      <div className="size-10 flex items-center justify-center border border-zinc-900 group-hover:border-primary  transition-all duration-300 shrink-0">
                        <div className="text-white group-hover:text-primary transition-colors">
                          {link.icon}
                        </div>
                      </div>
                      <div>
                        <div className="font-bold text-lg text-zinc-100 group-hover:text-primary tracking-wide transition-colors flex items-center gap-2">
                          <span>{link.name}</span>
                        </div>
                        <div className="text-xs text-zinc-500 font-sans mt-0.5">
                          {link.description}
                        </div>
                      </div>
                    </div>
                  </motion.a>
                ))}
            </div>
          </div>
        </div>
      </Container>
      <Service  />
    </>
  );
}

export default Contact;
