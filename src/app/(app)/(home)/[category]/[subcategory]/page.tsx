interface Props {
  params: Promise<{
    //Because it is a dynamic route, the params are not resolved until the page is rendered.
    //It is a server component, so we need to use async await to get the params.
    category: string;
    subcategory: string;
  }>;
}

const Page = async ({ params }: Props) => {
  const { category, subcategory } = await params;
  return (
    <div>
      Category: {category} Subcategory: {subcategory}
    </div>
  );
};

export default Page;
