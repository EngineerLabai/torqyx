import GenericToolPage from "@/components/tools/GenericToolPage";
import { torquePowerTool } from "@/tools/registry";

export default function TorquePowerPage() {
  return <GenericToolPage tool={torquePowerTool} />;
}
