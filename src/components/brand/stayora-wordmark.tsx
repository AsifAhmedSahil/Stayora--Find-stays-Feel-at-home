import { StayoraWordmarkBase, type WordmarkSize } from "./stayora-wordmark-base";

export function StayoraWordmark({ size }: { size?: WordmarkSize }) {
  return <StayoraWordmarkBase yellow="var(--color-brand-yellow)" size={size} />;
}
