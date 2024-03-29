import React, { useEffect, useState, useRef } from "react";
import { TbShoppingCartHeart } from "react-icons/tb";
import { HiFilter } from "react-icons/hi";
import apiService from "../api/apiService";
import { ListComponent } from "./index";
import { useDispatch, useSelector } from "react-redux";
import {
  addFilter,
  clearFilters,
  removeFilter,
  changeRange,
  changeText,
} from "../store/filterSlice";
import RangeSlider from "rsuite/RangeSlider";
import "rsuite/dist/rsuite.css";
import FilterComponent from "./FilterComponent";

function TagsList({ children }) {
  const [tags, setTags] = useState([]);
  const dispatch = useDispatch();

  const [showWishlist, setShowWishlist] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const toggleWishlist = () => {
    setShowWishlist(!showWishlist);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };
  const tagListRef = useRef(null);
  const productListRef = useRef(null);

  const handleSearch = (text) => {
    dispatch(changeText(text));
  };

  const handleClear = () => {
    dispatch(clearFilters());
  };

  const filterTags = useSelector((state) => state.filter.tags);
  const filterMinPrice = useSelector((state) => state.filter.minPrice);
  const filterMaxPrice = useSelector((state) => state.filter.maxPrice);

  const handleTag = (tag) => {
    if (filterTags.includes(tag.id)) {
      dispatch(removeFilter({ tagId: tag.id }));
    } else {
      dispatch(addFilter({ tagId: tag.id }));
    }
  };

  const handlePriceRange = (values) => {
    dispatch(changeRange({ minPrice: values[0], maxPrice: values[1] }));
  };

  useEffect(() => {
    const fetchTags = async () => {
      const tags = await apiService.fetchTags();
      console.log(tags);
      setTags(tags);
    };
    fetchTags();
  }, []);

  useEffect(() => {
    // Check if the height of tag list is greater than product list
    const tagListHeight = tagListRef.current.clientHeight;
    const productListHeight = productListRef.current.clientHeight;
    if (tagListHeight > productListHeight) {
      // Add scroll to tag list
      tagListRef.current.style.overflowY = "auto";
    } else {
      // Remove scroll from tag list
      tagListRef.current.style.overflowY = "unset";
    }
  }, [tags]);

  return (
    <>
      <div className="flex items-baseline justify-between border-b border-gray-200 pb-6 pt-6">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900">
          New Arrivals
        </h1>

        <div className="flex items-center">
          <div className="flex text-left">
            <button
              type="button"
              className=" p-2 text-gray-400 hover:text-gray-500 "
              onClick={toggleWishlist}
            >
              <span className="sr-only">View WishList</span>
              <TbShoppingCartHeart size={25} />
            </button>
            <button
              type="button"
              className=" p-2 text-gray-400 hover:text-gray-500 lg:hidden"
              onClick={toggleFilters}
            >
              <span className="sr-only">Tags</span>
              <HiFilter size={25} />
            </button>
          </div>
        </div>
      </div>

      <section className="py-6">
        <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-4">
          {/* tags */}
          <div
            ref={tagListRef}
            className="hidden h-max lg:flex flex-col w-full items-center justify-between bg-white text-sm text-gray-400"
          >
            <h2 className="flex items-center border-b border-gray-200 py-3 w-full font-medium text-lg justify-between">
              Tags
              <button
                className="text-sm font-normal text-black hover:underline"
                onClick={handleClear}
              >
                Clear
              </button>
            </h2>
            <div className="flex items-center border-b border-gray-200 py-3 w-full">
              <input
                type="text"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 pl-2"
                placeholder="Search"
                onChange={(e) => {
                  handleSearch(e.target.value);
                }}
              />
            </div>
            {tags.map((tag) => (
              <div
                key={tag.id}
                className="flex items-center border-b border-gray-200 py-3 w-full"
              >
                <input
                  id={tag.id}
                  name="color[]"
                  value={tag.name}
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  checked={filterTags.includes(tag.id)}
                  onChange={() => handleTag(tag)}
                />
                <label
                  htmlFor="filter-color-0"
                  className="ml-3 text-sm text-gray-600"
                >
                  {tag.name}
                </label>
              </div>
            ))}

            <div className="flex flex-col justify-start items-center border-b border-gray-200 py-3 w-full">
              <div>
                <label
                  htmlFor="filter-color-0"
                  className="mr-3 text-sm text-gray-600"
                >
                  Price Range
                </label>
              </div>
              <div className="flex justify-between gap-2 items-center w-full">
                <input
                  type="number"
                  min={0}
                  max={5000}
                  value={filterMinPrice}
                  onChange={(e) =>
                    dispatch(
                      changeRange({
                        minPrice: parseInt(e.target.value),
                        maxPrice: filterMaxPrice,
                      })
                    )
                  }
                  className="block w-1/2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 pl-2"
                />{" "}
                <div style={{ width: "80%" }}>
                  <RangeSlider
                    min={0}
                    max={5000}
                    defaultValue={[filterMinPrice, filterMaxPrice]}
                    onChange={handlePriceRange}
                  />
                </div>
                <input
                  type="number"
                  min={0}
                  max={5000}
                  value={filterMaxPrice}
                  onChange={(e) =>
                    dispatch(
                      changeRange({
                        minPrice: filterMinPrice,
                        maxPrice: parseInt(e.target.value),
                      })
                    )
                  }
                  className="block w-1/2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 pl-2"
                />
              </div>
            </div>
          </div>
          <div
            ref={productListRef}
            className="lg:col-span-3 border-dashed border-2 rounded-lg"
          >
            {children}
          </div>
        </div>
      </section>
      {showWishlist && <ListComponent onClose={toggleWishlist} />}
      {showFilters && <FilterComponent tags={tags} onClose={toggleFilters} />}
    </>
  );
}

export default TagsList;
