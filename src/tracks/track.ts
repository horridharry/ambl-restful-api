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

export function availabilityLabel(from: string, to: string): string {
  const fromDate = new Date(from);
  const toDate = new Date(to);
  const time = toDate.getTime() - fromDate.getTime();
  const days = Math.floor(time / (1000 * 60 * 60 * 24));
  return `Available for ${days} day${days === 1 ? "" : "s"}`;
}
