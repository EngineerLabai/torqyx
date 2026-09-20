import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getLocaleFromCookies } from "@/utils/locale-server";
import { withLocalePrefix } from "@/utils/locale-path";
import { shouldHideSharedCalculation } from "@/utils/share-access";
import { buildSharedCalculationMetadata } from "@/utils/share-seo";

export const dynamic = "force-dynamic";

interface SharePageProps {
  params: Promise<{
    code: string;
  }>;
}

export default async function SharePage({ params }: SharePageProps) {
  const { code } = await params;

  let sharedCalculation: Awaited<ReturnType<typeof getSharedCalculation>>;
  try {
    sharedCalculation = await getSharedCalculation(code);
  } catch {
    notFound();
  }

  if (!sharedCalculation || (sharedCalculation.expiresAt && sharedCalculation.expiresAt < new Date())) {
    notFound();
  }

  if (!sharedCalculation.isPublic) {
    const session = await auth();
    if (shouldHideSharedCalculation(sharedCalculation, { currentUserId: session?.user?.id })) {
      notFound();
    }
  }

  const locale = await getLocaleFromCookies();
  const toolPath = withLocalePrefix(`/tools/${sharedCalculation.toolSlug}`, locale);
  const inputs = encodeURIComponent(JSON.stringify(sharedCalculation.inputs));

  redirect(`${toolPath}?shared=${inputs}`);
}

export async function generateMetadata({ params }: SharePageProps) {
  const { code } = await params;
  const locale = await getLocaleFromCookies();
  return buildSharedCalculationMetadata(code, locale);
}

function getSharedCalculation(code: string) {
  return prisma.sharedCalculation.findUnique({
    where: { code },
    select: {
      toolSlug: true,
      inputs: true,
      expiresAt: true,
      isPublic: true,
      userId: true,
    },
  });
}
