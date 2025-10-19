import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { cn } from "@/lib/utils";

export const ParallaxScroll = ({ images, className }) => {
  const gridRef = useRef(null);

  const { scrollYProgress } = useScroll({
    container: gridRef,
    offset: ["start start", "end start"],
  });

  const translateFirst = useTransform(scrollYProgress, [0, 1], [0, -300]);
  const translateSecond = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const translateThird = useTransform(scrollYProgress, [0, 1], [0, -300]);

  const limitedImages = images.slice(0, 12);
  const firstColumn = limitedImages.slice(0, 3);
  const secondColumn = limitedImages.slice(3, 6);
  const thirdColumn = limitedImages.slice(6, 9);

  return (
    <div className="relative">
      <div
        className={cn(
          "h-[40rem] items-start overflow-y-auto w-full",
          className
        )}
        ref={gridRef}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-start max-w-5xl mx-auto gap-10 pb-40 px-10">
          {/* First column */}
          <div className="grid gap-10">
            {firstColumn.map((el, idx) => (
              <motion.div style={{ y: translateFirst }} key={`grid-1-${idx}`}>
                <img
                  src={el}
                  alt="thumbnail"
                  className="h-80 w-full object-cover object-left-top rounded-lg !m-0 !p-0"
                  height="400"
                  width="400"
                />
              </motion.div>
            ))}
          </div>

          {/* Second column */}
          <div className="grid gap-10">
            {secondColumn.map((el, idx) => (
              <motion.div style={{ y: translateSecond }} key={`grid-2-${idx}`}>
                <img
                  src={el}
                  alt="thumbnail"
                  className="h-80 w-full object-cover object-left-top rounded-lg !m-0 !p-0"
                  height="400"
                  width="400"
                />
              </motion.div>
            ))}
          </div>

          {/* Third column */}
          <div className="grid gap-10">
            {thirdColumn.map((el, idx) => (
              <motion.div style={{ y: translateThird }} key={`grid-3-${idx}`}>
                <img
                  src={el}
                  alt="thumbnail"
                  className="h-80 w-full object-cover object-left-top rounded-lg !m-0 !p-0"
                  height="400"
                  width="400"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Top gradient overlay */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-background to-transparent z-20" />

      {/* Bottom gradient overlay */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent z-20" />
    </div>
  );
};
