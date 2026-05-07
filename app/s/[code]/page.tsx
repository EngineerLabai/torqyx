import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

interface SharePageProps {
  params: Promise<{
    code: string;
  }>;
}

type ShareStatusProps = {
  title: string;
  description: string;
  tone?: "red" | "orange";
};

function ShareStatus({ title, description, tone = "red" }: ShareStatusProps) {
  const titleColor = tone === "orange" ? "text-orange-600" : "text-red-600";

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className={`mb-2 text-2xl font-bold ${titleColor}`}>{title}</h1>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  );
}

export default async function SharePage({ params }: SharePageProps) {
  const { code } = await params;
  const session = await auth();

  let sharedCalculation: Awaited<ReturnType<typeof getSharedCalculation>>;
  try {
    sharedCalculation = await getSharedCalculation(code);
  } catch (error) {
    console.error("Share page error:", error);
    return <ShareStatus title="Hata" description="Bir hata oluştu. Lütfen tekrar deneyin." />;
  }

  if (!sharedCalculation) {
    return <ShareStatus title="Paylaşım Bulunamadı" description="Bu paylaşım linki geçersiz veya silinmiş." />;
  }

  if (sharedCalculation.expiresAt && sharedCalculation.expiresAt < new Date()) {
    return (
      <ShareStatus title="Paylaşım Süresi Doldu" description="Bu paylaşım linkinin süresi dolmuş." tone="orange" />
    );
  }

  const isOwner = session?.user?.id === sharedCalculation.userId;
  if (!sharedCalculation.isPublic && !isOwner) {
    return <ShareStatus title="Erişim Reddedildi" description="Bu paylaşım herkese açık değil." />;
  }

  const toolPath = `/tr/tools/${sharedCalculation.toolSlug}`;
  const inputs = encodeURIComponent(JSON.stringify(sharedCalculation.inputs));

  redirect(`${toolPath}?shared=${inputs}`);
}

export async function generateMetadata({ params }: SharePageProps) {
  const { code } = await params;

  try {
    const sharedCalculation = await prisma.sharedCalculation.findUnique({
      where: { code },
      select: {
        toolSlug: true,
        inputs: true,
        user: {
          select: { name: true },
        },
      },
    });

    if (!sharedCalculation) {
      return {
        title: "Paylaşım Bulunamadı",
      };
    }

    // Araç adını al
    const toolName = getToolDisplayName(sharedCalculation.toolSlug);

    // Parametre özetini oluştur
    const summary = createCalculationSummary(sharedCalculation.toolSlug, sharedCalculation.inputs as Record<string, unknown>);

    return {
      title: `${toolName} - Paylaşılan Hesaplama`,
      description: `${sharedCalculation.user?.name || "Bir kullanıcı"} tarafından paylaşılan ${toolName} hesaplama: ${summary}`,
      openGraph: {
        title: `${toolName} - Paylaşılan Hesaplama`,
        description: `${sharedCalculation.user?.name || "Bir kullanıcı"} tarafından paylaşılan ${toolName} hesaplama: ${summary}`,
        type: "website",
      },
    };
  } catch {
    return {
      title: "Paylaşılan Hesaplama",
    };
  }
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

function getToolDisplayName(toolSlug: string): string {
  const toolNames: Record<string, string> = {
    "bolt-calculator": "Cıvata Hesaplayıcı",
    "shaft-torsion": "Şaft Burulma Hesabı",
    "pipe-pressure-loss": "Boru Basınç Kaybı",
    // Diğer araçlar eklenebilir
  };
  return toolNames[toolSlug] || "Mühendislik Hesaplayıcı";
}

function createCalculationSummary(toolSlug: string, inputs: Record<string, unknown>): string {
  try {
    switch (toolSlug) {
      case "bolt-calculator":
        return `Çap: ${inputs.d}mm, Kalite: ${inputs.grade}`;
      case "shaft-torsion":
        return `Çap: ${inputs.diameter}mm, Tork: ${inputs.torque}Nm`;
      case "pipe-pressure-loss":
        return `Çap: ${inputs.pipeDiameter}mm, Akış: ${inputs.flowRate}L/min`;
      default:
        return "Detaylar için tıklayın";
    }
  } catch {
    return "Detaylar için tıklayın";
  }
}
