import { useSelector } from "react-redux";
import SearchInput from "../components/SearchInput";

const SearchPage = () => {
  const selectedProduct = useSelector((state) => state.search.selectedProduct);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-800">
      <h1 className="mb-6 text-4xl font-semibold text-gray-900 dark:text-white">
        Search Products
      </h1>
      <SearchInput />

      {selectedProduct && (
        <div className="mt-6 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full text-center">
          <img
            src={selectedProduct.image}
            alt={selectedProduct.title}
            className="mx-auto w-40 h-40 object-contain"
          />
          <h2 className="mt-4 text-xl font-bold">{selectedProduct.title}</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Category: {selectedProduct.category}
          </p>
        </div>
      )}
    </div>
  );
};

export default SearchPage;
