import React from "react";
import { Timeline } from "./Timeline";
import s1 from "../../assets/s1.webp";
import s2 from "../../assets/s2.webp";
import s3 from "../../assets/s3.webp";
import s4 from "../../assets/s4.webp";
import office from "../../assets/office.jpeg";

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
              className="h-40 w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,42,53,0.06),0_1px_1px_rgba(0,0,0,0.05),0_0_0_1px_rgba(34,42,53,0.04),0_0_4px_rgba(34,42,53,0.08),0_16px_68px_rgba(47,48,55,0.05),0_1px_0_rgba(255,255,255,0.1)_inset] md:h-44 lg:h-120"
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
              className="h-40 w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,42,53,0.06),0_1px_1px_rgba(0,0,0,0.05),0_0_0_1px_rgba(34,42,53,0.04),0_0_4px_rgba(34,42,53,0.08),0_16px_68px_rgba(47,48,55,0.05),0_1px_0_rgba(255,255,255,0.1)_inset] md:h-44 lg:h-120"
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
              className="h-40 w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,42,53,0.06),0_1px_1px_rgba(0,0,0,0.05),0_0_0_1px_rgba(34,42,53,0.04),0_0_4px_rgba(34,42,53,0.08),0_16px_68px_rgba(47,48,55,0.05),0_1px_0_rgba(255,255,255,0.1)_inset] md:h-44 lg:h-120"
            />
          </div>
        </div>
      ),
    },
    {
      title: "2021 ",
      content: (
        <div>
          <p className="mb-8 text-lg font-normal text-neutral-800 md:text-sm lg:text-lg">
            After graduating with a Bachelor’s degree in Economics, I found
            myself drawn back to a long-held passion—knitting. Determined to
            turn this love into something tangible, I began developing Oli’s
            Collection, the brand that would soon define my creative journey. I
            dove headfirst into experimentation—testing different yarns,
            creating swatches, mastering colors, and exploring intricate
            knitting patterns. I even imported yarns from abroad to craft truly
            unique pieces. One of my most rewarding challenges was learning to
            operate a knitting machine dating back to 1952—an experience that
            demanded patience, curiosity, and perseverance. By the end of the
            year, this extensive training had transformed my hobby into a craft
            with potential for the market.
          </p>

          <div>
            <img
              src={s4}
              alt="startup template"
              className="h-40 w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,42,53,0.06),0_1px_1px_rgba(0,0,0,0.05),0_0_0_1px_rgba(34,42,53,0.04),0_0_4px_rgba(34,42,53,0.08),0_16px_68px_rgba(47,48,55,0.05),0_1px_0_rgba(255,255,255,0.1)_inset] md:h-44 lg:h-120"
            />
          </div>
        </div>
      ),
    },
    {
      title: "2022",
      content: (
        <div>
          <p className="mb-8 text-lg font-normal text-neutral-800 md:text-sm lg:text-lg ">
            On November 19, 2022, Oli’s officially launched on Instagram. The
            journey wasn’t easy—every new post, every promotion, every sale
            required relentless effort—but encouragement from my family and
            friends kept me moving forward. I held onto a favorite saying:
            “Choose a job you love, and you will never have to work a day in
            your life.” Each stitch I shared felt like a step closer to turning
            passion into purpose.
          </p>
        </div>
      ),
    },
    {
      title: "2023",
      content: (
        <div>
          <p className="mb-8 text-lg font-normal text-neutral-800 md:text-sm lg:text-lg ">
            This was the year Oli’s began to make its mark. We participated in
            our first bazaar at Friendship Park, collaborating with the
            prominent NGO Gudina Tumsa Foundation. There, I had the honor of
            meeting Ethiopia’s Prime Minister, Dr. Abiy Ahmed, whose words of
            encouragement fueled my determination. That same year, Oli’s staged
            its first and second runway shows, bringing our creations to life on
            the stage. I also hired my first employee—a remarkably talented
            woman who had never touched yarn before. With guidance, she grew
            into our most skilled knitter, setting the tone for the incredible
            team we would continue to build.
          </p>
        </div>
      ),
    },
    {
      title: "2024",
      content: (
        <div>
          <p className="mb-8 text-lg font-normal text-neutral-800 md:text-sm lg:text-lg ">
            Our presence grew stronger, particularly on social media platforms
            like Instagram and TikTok, where we connected directly with our
            audience. Oli’s participated in numerous bazaars, including Yenegew
            Bazaar, ICS Farmers Market, Shop Local, African Celebrate at
            Skylight Hotel, and an event at the Sweden Embassy. Each opportunity
            allowed us to introduce our unique knitwear to new customers and
            expand our community of supporters.
          </p>
        </div>
      ),
    },
    {
      title: "2025",
      content: (
        <div>
          <p className="mb-8 text-lg font-normal text-neutral-800 md:text-sm lg:text-lg ">
            By this year, the demand for Oli’s knitwear had skyrocketed. Clients
            and customers alike expressed a desire for a physical space to
            experience our collections in person. In response, we proudly opened
            our first boutique at Gerji Alfoz Plaza, 2nd floor, Shop #207—a
            space where our journey, creativity, and passion could be fully
            shared with the world.
          </p>
          <div>
            <img
              src={office}
              alt="startup template"
              className="h-40 w-full rounded-lg object-cover shadow-[0_0_24px_rgba(34,42,53,0.06),0_1px_1px_rgba(0,0,0,0.05),0_0_0_1px_rgba(34,42,53,0.04),0_0_4px_rgba(34,42,53,0.08),0_16px_68px_rgba(47,48,55,0.05),0_1px_0_rgba(255,255,255,0.1)_inset] md:h-44 lg:h-120"
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
