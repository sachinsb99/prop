"use client";

import { BackgroundGradient } from "@/components/ui/background-gradient";
import { Feature } from "@/types/feature";

/**
 * One feature card with optional background image.
 * The image fades in & the card lifts slightly on hover.
 */
export default function SingleFeature({ feature }: { feature: Feature }) {
  const { icon, title, paragraph, bg } = feature;

  return (
    <BackgroundGradient
      containerClassName="w-full group"               /* enable group-hover */
      className="relative flex flex-col h-full rounded-3xl
                 bg-white p-6 dark:bg-zinc-900
                 transition-transform duration-300
                 group-hover:-translate-y-2"          /* lift on hover */
    >
      {/* 🔥 Image layer (only if bg provided) */}
      {bg && (
        <>
          {/* actual image */}
          <img
            src={bg}
            alt=""
            className="absolute inset-0 h-full w-full rounded-3xl
                       object-cover opacity-0
                       group-hover:opacity-100
                       transition-opacity duration-300"
          />
          {/* subtle dark overlay for readability */}
          <div className="absolute inset-0 rounded-3xl
                          bg-black/40 opacity-0
                          group-hover:opacity-100
                          transition-opacity duration-300" />
        </>
      )}

      {/* content  */}
      <div className="relative z-10">
        <div className="mb-6 flex h-[70px] w-[70px] items-center 
                        justify-center rounded-md bg-primary/10 text-primary">
          {icon}
        </div>

        <h3 className="mb-4 text-xl font-bold text-black sm:text-2xl dark:text-white">
          {title}
        </h3>

        <p className="text-base font-medium leading-relaxed text-body-color 
                      pr-2 dark:text-neutral-300">
          {paragraph}
        </p>
      </div>
    </BackgroundGradient>
  );
}


// "use client";
// import { BackgroundGradient } from "@/components/ui/background-gradient";
// import { Feature } from "@/types/feature";

// export default function SingleFeature({ feature }: { feature: Feature }) {
//   const { icon, title, paragraph } = feature;

//   return (
//     <BackgroundGradient
//       /* outer frame & glow */
//       containerClassName="w-full"
//       /* inner card styles */
//       className="flex flex-col h-full rounded-3xl bg-white p-6 dark:bg-zinc-900"
//     >
//       {/* icon */}
//       <div className="mb-6 flex h-[70px] w-[70px] items-center justify-center rounded-md bg-primary/10 text-primary">
//         {icon}
//       </div>

//       {/* title */}
//       <h3 className="mb-4 text-xl font-bold text-black sm:text-2xl dark:text-white">
//         {title}
//       </h3>

//       {/* paragraph */}
//       <p className="text-base font-medium leading-relaxed text-body-color pr-2 dark:text-neutral-300">
//         {paragraph}
//       </p>
//     </BackgroundGradient>
//   );
// }


// import { Feature } from "@/types/feature";

// const SingleFeature = ({ feature }: { feature: Feature }) => {
//   const { icon, title, paragraph } = feature;
//   return (
//     <div className="w-full">
//       <div className="wow fadeInUp" data-wow-delay=".15s">
//         <div className="bg-primary/10 text-primary mb-10 flex h-[70px] w-[70px] items-center justify-center rounded-md">
//           {icon}
//         </div>
//         <h3 className="mb-5 text-xl font-bold text-black sm:text-2xl lg:text-xl xl:text-2xl dark:text-white">
//           {title}
//         </h3>
//         <p className="text-body-color pr-[10px] text-base leading-relaxed font-medium">
//           {paragraph}
//         </p>
//       </div>
//     </div>
//   );
// };

// export default SingleFeature;
