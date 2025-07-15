import { Blog } from "@/types/blog";

const blogData: Blog[] = [
  {
    id: 1,
    title: "Explore Luxury Villas with Stunning Views",
    paragraph:
      "Discover premium villas nestled in serene surroundings, offering spacious layouts, modern architecture, and panoramic views perfect for your dream lifestyle.",
    image: "/images/banner/pexels-sebastians-731082.jpg",
    author: {
      name: "Anika Sharma",
      image: "/images/blog/author-01.png",
      designation: "Real Estate Expert",
    },
    tags: ["villa", "luxury"],
    publishDate: "2025",
  },
  {
    id: 2,
    title: "Affordable Apartments in the Heart of the City",
    paragraph:
      "Looking for a compact yet comfortable home? Our city-centered apartments offer convenience, security, and excellent connectivity at unbeatable prices.",
    image: "/images/blogs/13145348.jpg",
    author: {
      name: "Rahul Mehta",
      image: "/images/blog/author-02.png",
      designation: "Property Consultant",
    },
    tags: ["apartment", "budget"],
    publishDate: "2025",
  },
  {
    id: 3,
    title: "Buying Your First House? Here’s What You Need to Know",
    paragraph:
      "From choosing the right location to understanding loan eligibility, our guide simplifies the home-buying process so you can make confident decisions.",
    image: "/images/blogs/pexels-pixabay-261101.jpg",
    author: {
      name: "Pooja Nair",
      image: "/images/blog/author-03.png",
      designation: "Home Advisor",
    },
    tags: ["house", "first-time buyer"],
    publishDate: "2025",
  },
];

export default blogData;
