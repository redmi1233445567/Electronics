import Content from "./Content";
export default async function Page({ params }) {
  const id = await params;
  return <Content id={id.detTech} />;
}
