import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { cn } from "@/lib/utils";

export const ParallaxScroll = ({ images, className }) => {
  const gridRef = useRef(null);
  const [columns, setColumns] = useState({ first: [], second: [], third: [] });

  const { scrollYProgress } = useScroll({
    container: gridRef,
    offset: ["start start", "end start"],
  });

  const translateFirst = useTransform(scrollYProgress, [0, 1], [0, -350]);
  const translateSecond = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const translateThird = useTransform(scrollYProgress, [0, 1], [0, -350]);

  useEffect(() => {
    const updateColumns = () => {
      const limitedImages = images.slice(0, 17);

      if (window.innerWidth < 768) {
        // Small screens: 1 column, 6 images
        setColumns({
          first: limitedImages.slice(0, 6),
          second: [],
          third: [],
        });
      } else if (window.innerWidth < 1024) {
        // Medium screens: 2 columns, 5 images each
        setColumns({
          first: limitedImages.slice(0, 5),
          second: limitedImages.slice(5, 10),
          third: [],
        });
      } else {
        // Large screens: 3 columns
        setColumns({
          first: limitedImages.slice(0, 5),
          second: limitedImages.slice(5, 9),
          third: limitedImages.slice(10, 15),
        });
      }
    };

    updateColumns();
    window.addEventListener("resize", updateColumns);

    return () => window.removeEventListener("resize", updateColumns);
  }, [images]);

  return (
    <div className="relative">
      <div
        className={cn(
          "h-[40rem] items-start overflow-y-auto w-full",
          className
        )}
        ref={gridRef}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-start max-w-5xl mx-auto gap-10 pb-40 px-10 h-20">
          {/* First column */}
          <div className="grid gap-10">
            {columns.first.map((el, idx) => (
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
          {columns.second.length > 0 && (
            <div className="hidden md:grid gap-10">
              {columns.second.map((el, idx) => (
                <motion.div
                  style={{ y: translateSecond }}
                  key={`grid-2-${idx}`}
                >
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
          )}

          {/* Third column */}
          {columns.third.length > 0 && (
            <div className="hidden lg:grid gap-10">
              {columns.third.map((el, idx) => (
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
          )}
        </div>
      </div>

      {/* Top gradient overlay */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-5 bg-gradient-to-b from-background to-transparent z-20" />

      {/* Bottom gradient overlay */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-5 bg-gradient-to-t from-background to-transparent z-20" />
    </div>
  );
};
