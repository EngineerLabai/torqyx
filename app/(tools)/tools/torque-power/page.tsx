import { notFound } from "next/navigation";
import GenericToolPage from "@/components/tools/GenericToolPage";
import { getToolDocsResponse } from "@/lib/toolDocs/loadToolDoc";
import { getToolById } from "@/tools/registry";
import { getLocaleFromCookies } from "@/utils/locale-server";
import ToolSeo from "@/components/tools/ToolSeo";
import { buildToolMetadata } from "@/utils/tool-seo";

export async function generateMetadata() {
  const locale = await getLocaleFromCookies();
  return buildToolMetadata("torque-power", locale);
}

export default async function TorquePowerPage() {
  const toolId = "torque-power";
  if (!getToolById(toolId)) {
    notFound();
  }
  const locale = await getLocaleFromCookies();
  const initialDocs = await getToolDocsResponse(toolId, locale);
  return (
    <>
      <h1 className="text-3xl font-bold tracking-tight">
        Power - Torque - RPM
      </h1>

      <ToolSeo toolId="torque-power" locale={locale} />
      <GenericToolPage toolId={toolId} initialDocs={initialDocs} />
    </>
  );
}


