const delay = (ms: number | undefined) =>
  new Promise((resolve) => setTimeout(resolve, ms));
import ProductCarousel from "@/components/shared/product/product-carousel";
import ProductList from "@/components/shared/product/product-list";
import { getLatestProducts, getFeaturedProducts } from "@/lib/actions/product.actions";

export const dynamic = "force-dynamic";
import { Product } from "@/types";

const Homepage = async () => {
  //  await delay(2000);
  const latestProducts = await getLatestProducts() as unknown as Product[];
  const featuredProducts =
    (await getFeaturedProducts()) as unknown as Product[];

  return (
    <>
      {featuredProducts.length > 0 && (
        <ProductCarousel data={featuredProducts} />
      )}
      <ProductList data={latestProducts} title='Newest Arrivals' />
    </>
  );
};

export default Homepage;
