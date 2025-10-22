import React from "react";
import { Timeline } from "./ui/Timeline";
import s1 from "../assets/s1.png";
import s2 from "../assets/s2.png";
import s3 from "../assets/s3.png";
import s4 from "../assets/s4.png";

function TimelineDemo() {
  const data = [
    {
      title: "2018",
      content: (
        <div>
          <p className="mb-8 text-lg font-normal text-neutral-800 md:text-sm lg:text-lg ">
            During the cold season of 2018, my mother, Meskele Negeri, surprised
            my sisters and me with hand-knitted scarves. We initially thought
            she had purchased them from a store — until we saw the leftover yarn
            and realized she had made them herself. Intrigued and inspired, we
            asked her to teach us how to knit.
          </p>
          <div>
            <img
              src={s1}
              alt="startup template"
              className="h-40 w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-44 lg:h-120"
            />
          </div>
        </div>
      ),
    },
    {
      title: "2019",
      content: (
        <div>
          <p className="mb-8 text-lg font-normal text-neutral-800 md:text-sm lg:text-lg">
            After learning the basics from my mother, my sisters and I began
            practicing every day. Our first big challenge was to knit sweaters.
            Although my sister eventually moved on, I continued to develop my
            skills and discovered how much I loved creating with my hands.
          </p>
          <p className="mb-8 text-lg font-normal text-neutral-800 md:text-sm lg:text-lg">
            Knitting became more than just a hobby — it became an expression of
            patience, creativity, and dedication.
          </p>
          <div>
            <img
              src={s2}
              alt="startup template"
              className="h-40 w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-44 lg:h-120"
            />
          </div>
        </div>
      ),
    },
    {
      title: "2020",
      content: (
        <div>
          <p className="mb-8 text-lg font-normal text-neutral-800 md:text-sm lg:text-lg">
            One Sunday, I wore my handmade sweater to church. There, Aster
            Gudina — daughter of Reverend Gudina Tumsa and Tsehay Tolessa —
            noticed it. She was impressed by the craftsmanship and encouraged me
            to think of knitting not just as a passion but as a business
            opportunity.
          </p>
          <p className="mb-8 text-lg font-normal text-neutral-800 md:text-sm lg:text-lg">
            Her encouragement opened my eyes to the possibility of turning this
            craft into something impactful.
          </p>

          <div>
            <img
              src={s3}
              alt="startup template"
              className="h-40 w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-44 lg:h-120"
            />
          </div>
        </div>
      ),
    },
    {
      title: "2021 – Present",
      content: (
        <div>
          <p className="mb-8 text-lg font-normal text-neutral-800 md:text-sm lg:text-lg">
            With Aster’s guidance, I founded Oli’s, a fashion brand that
            empowers women in need by providing them with meaningful work and
            income through knitting.
          </p>
          <p className="mb-8 text-lg font-normal text-neutral-800 md:text-sm lg:text-lg">
            Inspired by Tsehay Tolessa’s legacy of service, Oli’s is built on
            the belief that creativity can change lives. The name “Oli’s,”
            meaning from God to God, represents our gratitude, devotion, and
            purpose — a reminder that every blessing and success comes from a
            higher power.
          </p>
          <p className="mb-8 text-lg font-normal text-neutral-800 md:text-sm lg:text-lg">
            Today, Oli’s continues to grow as a community of talented women
            transforming yarn into stories of hope, resilience, and beauty.
          </p>

          <div>
            <img
              src={s4}
              alt="startup template"
              className="h-40 w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset] md:h-44 lg:h-120"
            />
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="relative w-full overflow-clip ">
      <Timeline data={data} />
    </div>
  );
}

export default TimelineDemo;
