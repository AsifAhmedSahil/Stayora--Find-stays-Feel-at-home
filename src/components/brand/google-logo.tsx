import { GoogleLogoBase } from "./google-logo-base";

export function GoogleLogo({ size }: { size?: number }) {
  return (
    <GoogleLogoBase
      size={size}
      colors={{
        blue: "var(--color-google-blue)",
        red: "var(--color-google-red)",
        yellow: "var(--color-google-yellow)",
        green: "var(--color-google-green)",
      }}
    />
  );
}
