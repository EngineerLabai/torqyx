import { notFound } from "next/navigation";
import GenericToolPage from "@/components/tools/GenericToolPage";
import { getToolDocsResponse } from "@/lib/toolDocs/loadToolDoc";
import { getToolById } from "@/tools/registry";
import { getLocaleFromCookies } from "@/utils/locale-server";

export default async function TorquePowerPage() {
  const toolId = "torque-power";
  if (!getToolById(toolId)) {
    notFound();
  }
  const locale = await getLocaleFromCookies();
  const initialDocs = await getToolDocsResponse(toolId, locale);
  return <GenericToolPage toolId={toolId} initialDocs={initialDocs} />;
}
