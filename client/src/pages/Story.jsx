import TimelineDemo from "@/components/TimelineDemo";
import React from "react";

function Story() {
  return (
    <div>
      <section className="py-20 px-4 border-b border-border">
        <div className="max-w-4xl mx-auto text-center border-b-2 border-border pb-10">
          <h1 className="font-bungee text-5xl md:text-6xl text-foreground mb-6">
            Our Story
          </h1>
          <p className="text-lg text-muted-foreground">
            A journey of passion, craftsmanship, and women empowerment through
            luxury fashion.
          </p>
        </div>
        <TimelineDemo />
      </section>
    </div>
  );
}

export default Story;
