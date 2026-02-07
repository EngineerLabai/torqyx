import { notFound } from "next/navigation";
import GenericToolPage from "@/components/tools/GenericToolPage";
import { getToolById } from "@/tools/registry";

export default function TorquePowerPage() {
  const toolId = "torque-power";
  if (!getToolById(toolId)) {
    notFound();
  }
  return <GenericToolPage toolId={toolId} />;
}
