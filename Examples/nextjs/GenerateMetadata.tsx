// Examples/nextjs/GenerateMetadata.tsx
// مستندات: Nextjs/Metadata-And-SEO.md

import type { Metadata } from "next";

type Props = { params: Promise<{ cabinId: string }> };

async function getCabin(id: string) {
  return { id, name: `Cabin ${id}`, description: "A cozy cabin" };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { cabinId } = await params;
  const cabin = await getCabin(cabinId);

  return {
    title: cabin.name,
    description: cabin.description,
    openGraph: {
      title: cabin.name,
      description: cabin.description,
    },
  };
}

export default async function CabinPage({ params }: Props) {
  const { cabinId } = await params;
  const cabin = await getCabin(cabinId);
  return <h1>{cabin.name}</h1>;
}
