import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { fetchProducts } from "../api/products";
import { setQuery, setSelectedProduct } from "../redux/searchSlice";
import useDebounce from "../hooks/useDebounce";
import { Search, X } from "lucide-react";

const SearchInput = () => {
  const dispatch = useDispatch();
  const query = useSelector((state) => state.search.query);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const dropdownRef = useRef(null);

  const debouncedQuery = useDebounce(query, 300);

  const { data, isLoading, error } = useQuery({
    queryKey: ["products", debouncedQuery],
    queryFn: () => fetchProducts(debouncedQuery),
    enabled: !!debouncedQuery,
  });

  const products = data?.products || [];

  const handleSelect = (product) => {
    dispatch(setSelectedProduct(product));
    dispatch(setQuery(product.title));
    setDropdownOpen(false);
    setHighlightIndex(-1);
  };

  const handleKeyDown = (e) => {
    if (!dropdownOpen) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightIndex((prev) =>
          prev < products.length - 1 ? prev + 1 : prev
        );
        break;

      case "ArrowUp":
        e.preventDefault();
        setHighlightIndex((prev) => (prev > 0 ? prev - 1 : prev));
        break;

      case "Enter":
        if (highlightIndex >= 0) {
          handleSelect(products[highlightIndex]);
        }
        break;

      case "Escape":
        setDropdownOpen(false);
        setHighlightIndex(-1);
        break;

      case "Tab":
        setDropdownOpen(false);
        break;

      default:
        break;
    }
  };

  useEffect(() => {
    if (highlightIndex >= 0 && dropdownRef.current) {
      const activeItem = dropdownRef.current.children[highlightIndex];
      if (activeItem) {
        activeItem.scrollIntoView({ block: "nearest", behavior: "smooth" });
      }
    }
  }, [highlightIndex]);

  return (
    <div className="relative w-full max-w-xl mx-auto">
      <div className="relative flex items-center bg-white dark:bg-gray-800 rounded-full shadow-md p-2">
        <Search className="w-5 h-5 text-gray-500 ml-3" />
        <input
          type="text"
          value={query}
          onChange={(e) => dispatch(setQuery(e.target.value))}
          onFocus={() => setDropdownOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search products..."
          className="w-full bg-transparent px-4 py-2 text-gray-900 dark:text-white focus:outline-none"
        />
        {query && (
          <X
            className="w-5 h-5 text-gray-500 cursor-pointer mr-3"
            onClick={() => {
              dispatch(setQuery(""));
              setDropdownOpen(false);
              setHighlightIndex(-1);
            }}
          />
        )}
      </div>

      {dropdownOpen && (
        <ul
          ref={dropdownRef}
          className="absolute z-50 w-full mt-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg max-h-60 overflow-auto"
        >
          {isLoading && <li className="p-3 text-center">Loading...</li>}
          {error && (
            <li className="p-3 text-center text-red-500">
              Error fetching products
            </li>
          )}
          {products.length === 0 && (
            <li className="p-3 text-center">No results found</li>
          )}
          {products.map((product, index) => (
            <li
              key={product.id}
              className={`flex items-center p-3 cursor-pointer ${
                highlightIndex === index
                  ? "bg-gray-200 dark:bg-gray-700"
                  : "hover:bg-gray-100 dark:hover:bg-gray-700 transition"
              }`}
              onClick={() => handleSelect(product)}
            >
              <img
                src={product.image}
                alt={product.title}
                className="w-10 h-10 object-contain mr-3"
              />
              <span className="truncate">{product.title}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchInput;
