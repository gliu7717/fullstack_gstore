const delay = (ms: number | undefined) =>
  new Promise((resolve) => setTimeout(resolve, ms));
import ProductList from "@/components/shared/product/product-list";
import { getLatestProducts } from "@/lib/actions/product.actions";

export const dynamic = "force-dynamic";
import { Product } from "@/types";

const Homepage = async () => {
  //  await delay(2000);
  const latestProducts = await getLatestProducts() as Product[];
  return (
    <>
      <ProductList data={latestProducts} title='Newest Arrivals' />
    </>
  );
};

export default Homepage;
