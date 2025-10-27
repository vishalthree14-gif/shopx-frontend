import ProductsList from "../products/ProductList"
import Headers from "../components/Header"
import Footer from "../components/Footer"
import SearchBar from "../components/SearchBar"

const Home = () => {
  return (
    <>
      <Headers />
      <SearchBar />
      <ProductsList />
      <Footer />
    </>
  )
}
export default Home;

