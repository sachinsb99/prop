"use client";
import { ThreeDMarquee } from "@/components/ui/3d-marquee";

export function ThreeDMarqueeDemoSecond() {
  const images = [
    "https://assets.aceternity.com/cloudinary_bkp/3d-card.png",
    "https://assets.aceternity.com/animated-modal.png",
    "https://assets.aceternity.com/animated-testimonials.webp",
    "/images/banner/pexels-expect-best-79873-323780.jpg",
    "/images/banner/pexels-heyho-7031407.jpg",
    "/images/banner/pexels-pixabay-261101.jpg",
    "/images/banner/pexels-sebastians-731082.jpg",
    "https://assets.aceternity.com/flip-text.png",
    "https://assets.aceternity.com/hero-highlight.png",
    "https://assets.aceternity.com/carousel.webp",
    "https://assets.aceternity.com/placeholders-and-vanish-input.png",
    "/images/banner/pexels-capture-crew-2153262766-32666435.jpg",
    "/images/banner/pexels-jvdm-1457842.jpg",
    "/images/banner/pexels-fotios-photos-1090638.jpg",
    "/images/banner/pexels-fotoaibe-1571460.jpg",
    "/images/banner/pexels-medhat-ayad-122846-439227.jpg",
    "https://assets.aceternity.com/cloudinary_bkp/Parallax_Scroll_pzlatw_anfkh7.png",
    "https://assets.aceternity.com/tabs.png",
    "https://assets.aceternity.com/cloudinary_bkp/Tracing_Beam_npujte.png",
    "/images/banner/13145348.jpg",
    "/images/banner/pexels-minan1398-1042594.jpg",
    "/images/banner/pexels-vividcafe-681331.jpg",
    "/images/banner/13145376.jpg",
    "/images/banner/13145520.png",
    "/images/banner/pexels-vividcafe-681331.jpg",
    "https://assets.aceternity.com/cloudinary_bkp/Meteors_fye3ys.png",
    "https://assets.aceternity.com/cloudinary_bkp/Moving_Border_yn78lv.png",
    "/images/banner/pexels-binyaminmellish-186077.jpg",
    "/images/banner/pexels-binyaminmellish-186077.jpg",
    "/images/banner/pexels-binyaminmellish-186077.jpg",
    "/images/banner/pexels-expect-best-79873-323780.jpg",
  ];
  return (
    <div className="mx-auto my-0 flex h-screen w-full flex-col items-center justify-center overflow-hidden rounded-3xl">
      <h2 className="relative z-20 mx-auto max-w-4xl text-center text-2xl font-bold text-balance text-white md:text-4xl lg:text-6xl">
        Find your perfect home where every{" "}
        <span className="relative z-20 inline-block rounded-xl bg-blue-500/40 px-4 py-1 text-white underline decoration-sky-500 decoration-[6px] underline-offset-[16px] backdrop-blur-sm">
          moment
        </span>{" "}
        becomes a cherished memory.
      </h2>
      <p className="relative z-20 mx-auto max-w-2xl py-8 text-center text-sm text-neutral-200 md:text-base">
        Your dream home is more than just walls and windows. It&apos;s where your story unfolds, 
        where comfort meets luxury, and where every corner reflects your unique lifestyle and aspirations.
      </p>

      {/* overlay */}
      <div className="absolute inset-0 z-10 h-full w-full bg-black/30 dark:bg-black/40" />
      <ThreeDMarquee
        className="pointer-events-none absolute inset-0 h-full w-full"
        images={images}
      />
    </div>
  );
}