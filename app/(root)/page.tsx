const delay = (ms: number | undefined) =>
  new Promise((resolve) => setTimeout(resolve, ms));

const Homepage = async () => {
  await delay(2000);
  return <>GStore</>;
};

export default Homepage;
