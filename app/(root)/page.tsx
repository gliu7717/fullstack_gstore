const delay = (ms: number | undefined) =>
  new Promise((resolve) => setTimeout(resolve, ms));
import ProductList from "@/components/shared/product/product-list";
import sampleData from "@/db/sample-data";

const Homepage = async () => {
  //  await delay(2000);
  return (
    <>
      <ProductList
        data={sampleData.products}
        title='Newest Arrivals'
        limit={4}
      />
    </>
  );
};

export default Homepage;
