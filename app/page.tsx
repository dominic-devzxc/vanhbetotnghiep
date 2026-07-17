import { InvitationExperience } from "@/components/invitation-experience";

type HomePageProps = {
  searchParams: Promise<{ to?: string | string[] }>;
};

function normalizeGuestName(value: string | string[] | undefined) {
  const name = Array.isArray(value) ? value[0] : value;
  return name?.trim().slice(0, 80) ?? "";
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;

  return <InvitationExperience initialGuestName={normalizeGuestName(params.to)} />;
}
