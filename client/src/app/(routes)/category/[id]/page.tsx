import { CategoryPageComponent } from "@wsp/app/components/pages";

export default function Category({ params }: { params: { id: string } }) {
  return <CategoryPageComponent categoryId={params.id} />;
}
