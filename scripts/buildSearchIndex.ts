import { buildSearchIndexFiles } from "../lib/search/buildIndex";

buildSearchIndexFiles().catch((error) => {
  console.error(error);
  process.exit(1);
});
