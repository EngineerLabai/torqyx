import CategoryPageShell from "@/components/tools/CategoryPageShell";
import { getLocaleFromCookies } from "@/utils/locale-server";
import { buildPageMetadata } from "@/utils/metadata";
import { getCategoryBySlug } from "@/data/tool-categories";

const CATEGORY_SLUG = "fasteners-strength";

export async function generateMetadata() {
  const locale = await getLocaleFromCookies();
  const category = getCategoryBySlug(CATEGORY_SLUG);
  if (!category) return {};

  return buildPageMetadata({
    title: category.seoTitle[locale],
    description: category.seoDescription[locale],
    path: `/tools/${CATEGORY_SLUG}`,
    locale,
  });
}

export default function FastenersStrengthCategoryPage() {
  return <CategoryPageShell categorySlug={CATEGORY_SLUG} />;
}
