import { Metadata } from "next";

const DEFAULT_DESCRIPTION = "PT. BestGroup Indonesia";

export function constructMetadata({
  title,
  description = DEFAULT_DESCRIPTION,
  image = "/images/bg.png",
  noIndex = false,
}: {
  title?: string;
  description?: string;
  image?: string;
  noIndex?: boolean;
} = {}): Metadata {
  return {
    title: `${title}`,
    description,
    keywords: "Best Group",
    icons: {
      icon: image,
    },
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
  };
};

export default function contructViewport() {
  return {
    viewport: {
      width: "device-width",
      initialScale: 1,
      maximumScale: 1,
    },
  };
}