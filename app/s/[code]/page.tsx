import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

interface SharePageProps {
  params: Promise<{
    code: string;
  }>;
}

export default async function SharePage({ params }: SharePageProps) {
  const { code } = await params;

  try {
    const sharedCalculation = await prisma.sharedCalculation.findUnique({
      where: { code },
      select: {
        toolSlug: true,
        inputs: true,
        expiresAt: true,
        isPublic: true,
      },
    });

    if (!sharedCalculation) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-2">Paylaşım Bulunamadı</h1>
            <p className="text-gray-600">Bu paylaşım linki geçersiz veya silinmiş.</p>
          </div>
        </div>
      );
    }

    // Süre kontrolü
    if (sharedCalculation.expiresAt && sharedCalculation.expiresAt < new Date()) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-orange-600 mb-2">Paylaşım Süresi Doldu</h1>
            <p className="text-gray-600">Bu paylaşım linkinin süresi dolmuş.</p>
          </div>
        </div>
      );
    }

    // Araç sayfasına yönlendir (parametrelerle birlikte)
    const toolPath = `/tr/araclar/${sharedCalculation.toolSlug}`;
    const inputs = encodeURIComponent(JSON.stringify(sharedCalculation.inputs));

    redirect(`${toolPath}?shared=${inputs}`);
  } catch (error) {
    console.error("Share page error:", error);
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-2">Hata</h1>
          <p className="text-gray-600">Bir hata oluştu. Lütfen tekrar deneyin.</p>
        </div>
      </div>
    );
  }
}

// SEO için metadata
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
    const summary = createCalculationSummary(sharedCalculation.toolSlug, sharedCalculation.inputs as Record<string, any>);

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

// Yardımcı fonksiyonlar
function getToolDisplayName(toolSlug: string): string {
  const toolNames: Record<string, string> = {
    "bolt-calculator": "Cıvata Hesaplayıcı",
    "shaft-torsion": "Şaft Burulma Hesabı",
    "pipe-pressure-loss": "Boru Basınç Kaybı",
    // Diğer araçlar eklenebilir
  };
  return toolNames[toolSlug] || "Mühendislik Hesaplayıcı";
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function createCalculationSummary(toolSlug: string, inputs: Record<string, any>): string {
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