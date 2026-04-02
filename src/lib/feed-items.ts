export type FeedItemType = "announcement" | "blog" | "deal";

export interface FeedItem {
  type: FeedItemType;
  label: string;
  href: string;
}

export const feedItems: FeedItem[] = [
  {
    type: "announcement",
    label: "Guardium Group expands with new technology division.",
    href: "/news",
  },
  {
    type: "blog",
    label: "How Guardium Group is building success across multiple industries.",
    href: "/about",
  },
  {
    type: "deal",
    label: "Join our team — explore career opportunities across all companies.",
    href: "/careers",
  },
  {
    type: "announcement",
    label: "Guardium Towing acquires Cliffs Towing in Edmonton.",
    href: "https://guardiumtowing.com/blog/guardium-acquires-cliffs-towing",
  },
  {
    type: "blog",
    label: "Building a diversified conglomerate in Western Canada.",
    href: "/about",
  },
  {
    type: "deal",
    label: "Contact us for partnership opportunities — call +1 780-809-7860.",
    href: "tel:+17808097860",
  },
];
