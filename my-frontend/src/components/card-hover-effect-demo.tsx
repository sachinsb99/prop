import { HoverEffect } from "@/components/ui/card-hover-effect";

export default function CardHoverEffectDemo() {
  return (
    <div className="max-w-5xl mx-auto px-8">
      <HoverEffect items={projects} />
    </div>
  );
}

export const projects = [
  {
    title: "Stripe",
    description:
      "A technology company that builds economic infrastructure for the internet.",
    link: "https://stripe.com",
  },
  {
    title: "Netflix",
    description:
      "A streaming service with award-winning TV, movies, and anime.",
    link: "https://netflix.com",
  },
  {
    title: "Google",
    description:
      "A multinational tech company specializing in internet-related services.",
    link: "https://google.com",
  },
  {
    title: "Meta",
    description:
      "A company building products that connect the world.",
    link: "https://meta.com",
  },
  {
    title: "Amazon",
    description:
      "Focused on e-commerce, cloud, and AI technologies.",
    link: "https://amazon.com",
  },
  {
    title: "Microsoft",
    description:
      "A company building software, cloud services, and devices.",
    link: "https://microsoft.com",
  },
];
