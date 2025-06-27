interface Props {
  params: Promise<{
    //Because it is a dynamic route, the params are not resolved until the page is rendered.
    //It is a server component, so we need to use async await to get the params.
    category: string;
  }>;
}

const Page = async ({ params }: Props) => {
  const { category } = await params;
  return <div>Category: {category}</div>;
};

export default Page;
