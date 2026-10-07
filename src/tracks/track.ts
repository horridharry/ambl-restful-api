export type Track = {
  type: "track";
  id: string;
  urn: string;
  titles: {
    primary: string;
    secondary: string | null;
    tertiary: string | null;
  };
  availability: {
    from: string;
    to: string;
    label: string;
  };
};

export function trackUrn(id: string): string {
  return `urn:bbc:sounds:track:${id}`;
}
