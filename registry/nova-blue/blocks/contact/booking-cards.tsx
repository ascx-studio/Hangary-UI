"use client";

import * as motion from "motion/react-client";
import { Clock, ArrowRight } from "lucide-react";
import { useEffect } from "react";
import SectionHeading from "../../../ui/portfolio/section-heading";
import { getCalApi } from "@calcom/embed-react";

interface CalBookerProps {
  duration?: string;
}

const bookingOptions = [
  {
    duration: "15min",
    durationDisplay: "15 Min Discovery Call",
    title: "Free Expert Consultation & Intro",
    description:
      "Book a brief discovery call to evaluate your project needs, discuss technical goals, and see how professional software engineering can scale your business.",
  },
  {
    duration: "30min",
    durationDisplay: "30 Min Strategy Session",
    title: "1-on-1 Technical Strategy & Planning",
    description:
      "Schedule an in-depth session for expert technical guidance, architectural planning, and deep-dive problem solving tailored to your specific software requirements.",
  },
];

export default function BookingCards({ duration = "30min" }: Readonly<CalBookerProps>) {
  useEffect(() => {
    // Initialize Cal API for each booking option
    Promise.all(
      bookingOptions.map(async (option) => {
        const cal = await getCalApi({ namespace: option.duration });
        cal("ui", {
          hideEventTypeDetails: false,
          layout: "month_view",
        });
      })
    ).catch(console.error);
  }, []);

  return (
    <>
      <SectionHeading className="text-3xl font-bold text-white mt-10">
        Schedule Your Project Call{" "}
      </SectionHeading>
      <p className="text-zinc-400 text-base max-w-2xl ">
        Book a time that works best for you to discuss your web development
        goals. All sessions are held online and provide a risk-free opportunity
        to explore technical solutions for your business.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 mt-4 gap-6">
        {bookingOptions.map((option, idx) => (
          <motion.div
            key={option.duration}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: idx * 0.2 }}
            viewport={{ once: true }}
            className={`relative group p-8 transition-all duration-300 overflow-hidden border border-zinc-800  cursor-pointer  hover:border-primary`}
          >
            {/* Content */}
            <div className="relative z-10 space-y-6">
              {/* Duration badge */}
              <div className="flex items-center gap-2 w-fit">
                <Clock className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-mono text-blue-400 uppercase tracking-widest">
                  {option.durationDisplay}
                </span>
              </div>

              {/* Title and description */}
              <div className="space-y-3">
                <h4 className="text-2xl font-bold text-white">
                  {option.title}
                </h4>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  {option.description}
                </p>
              </div>

              {/* Price and CTA */}
              <div className="flex items-center justify-between pt-4 border-t border-white/10">
                <button
                  data-cal-namespace={option.duration}
                  data-cal-link={`razeev/${option.duration}`}
                  data-cal-config='{"layout":"month_view","useSlotsViewOnSmallScreen":"true"}'
                  className="inline-flex items-center gap-2 px-6 py-3    transition-all duration-300 group/btn cursor-pointer bg-white text-black font-black text-xs uppercase tracking-[0.2em]  transform hover:-translate-y-1 active:scale-95 border-2 border-white "
                >
                  Book Now
                  <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </>
  );
}
