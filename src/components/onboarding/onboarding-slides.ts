export type OnboardingSlide = {
  key: string;
  image: string;
  location: string;
  title: string;
  body: string;
};

// Sample photos from Unsplash.
export const onboardingSlides: OnboardingSlide[] = [
  {
    key: "find",
    image:
      "https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=1200&q=80&auto=format&fit=crop",
    location: "Whistler, BC",
    title: "Find a stay that fits your story",
    body: "From mountain cabins to oceanfront villas, Stayora helps you find unforgettable stays for every kind of trip.",
  },
  {
    key: "describe",
    image:
      "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200&q=80&auto=format&fit=crop",
    location: "Krabi, Thailand",
    title: "Describe it, we'll find it",
    body: "Tell Stayora what you're dreaming of in one sentence, like a quiet cabin with a hot tub, and get stays ranked for you.",
  },
  {
    key: "ask",
    image:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200&q=80&auto=format&fit=crop",
    location: "Tulum, Mexico",
    title: "Answers before you book",
    body: "Ask about check-in, pets or cancellations and get the exact policy text, straight from the stay.",
  },
];
