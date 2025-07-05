import Content from "./Content";

export async function generateStaticParams() {
  // رجع مصفوفة من القيم الممكنة لـ detTech
  return [
    { detTech: "value1" },
    { detTech: "value2" },
    // ... أضف كل القيم اللي عايز تصدر صفحات لها
  ];
}

export default async function Page({ params }) {
  const id = await params;
  return <Content id={id.detTech} />;
}
