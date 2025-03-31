import React, { useEffect } from "react";
import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import Card from "../components/card";

function search() {
  const [listings, setListings] = useState([]);
  const [showMore, setShowMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [sideBarData, setSideBarData] = useState({
    searchTerm: "",
    type: "all",
    parking: false,
    furnished: false,
    offer: false,
    sort: "createdAt",
    order: "desc",
  });

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    const typeFromUrl = urlParams.get("type");
    const parkingFromUrl = urlParams.get("parking");
    const furnishedFromUrl = urlParams.get("furnished");
    const offerFromUrl = urlParams.get("offer");
    const sortFromUrl = urlParams.get("sort");
    const orderFromUrl = urlParams.get("order");

    if (
      searchTermFromUrl ||
      typeFromUrl ||
      parkingFromUrl ||
      furnishedFromUrl ||
      offerFromUrl ||
      sortFromUrl ||
      orderFromUrl
    ) {
      setSideBarData({
        searchTerm: searchTermFromUrl || "",
        type: typeFromUrl || "all",
        parking: parkingFromUrl === "true" ? true : false,
        furnished: furnishedFromUrl === "true" ? true : false,
        offer: offerFromUrl === "true" ? true : false,
        sort: sortFromUrl || "createdAt",
        order: orderFromUrl || "desc",
      });
    }
    const fetchListings = async () => {
      setLoading(true);
      setShowMore(false);
      try {
        const searchQuery = urlParams.toString();
        console.log(searchQuery);
        const res = await fetch(`/api/listing/get?${searchQuery}`);
        const data = await res.json();
        setListings(data);
        console.log(data);
        if (data.length > 8) {
            setShowMore(true);
          } else {
            setShowMore(false);
          }
        setLoading(false);
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchListings();
  }, [location.search]);

  const handleChange = async (e) => {
    if (
      e.target.id == "parking" ||
      e.target.id == "furnished" ||
      e.target.id == "offer"
    ) {
      setSideBarData({
        ...sideBarData,
        [e.target.id]: e.target.checked === true ? true : false,
      });
    }
    if (e.target.id === "searchTerm") {
      setSideBarData({
        ...sideBarData,
        [e.target.id]: e.target.value,
      });
    }
    if (
      e.target.id === "rent" ||
      e.target.id === "all" ||
      e.target.id === "sell"
    ) {
      setSideBarData({
        ...sideBarData,
        type: e.target.id,
      });
    }
    if (e.target.id == "sort_order") {
      const sort = e.target.value.split("_")[0] || "createdAt";

      const order = e.target.value.split("_")[1] || "desc";
      setSideBarData({
        ...sideBarData,
        sort,
        order,
      });
    }
    console.log(sideBarData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.set(
      "searchTerm",
      sideBarData.searchTerm
    );
    const typeFromUrl = urlParams.set("type", sideBarData.type);
    const parkingFromUrl = urlParams.set("parking", sideBarData.parking);
    const furnishedFromUrl = urlParams.set("furnished", sideBarData.furnished);
    const offerFromUrl = urlParams.set("offer", sideBarData.offer);
    const sortFromUrl = urlParams.set("sort", sideBarData.sort);
    const orderFromUrl = urlParams.set("order", sideBarData.order);
    const searchQuery = urlParams.toString();
    navigate(`/search/?${searchQuery}`);
  };

  const onShowMoreClick = async () => {
    const numberOfListings = listings.length;
    const startIndex = numberOfListings;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('startIndex', startIndex);
    const searchQuery = urlParams.toString();
    const res = await fetch(`/api/listing/get?${searchQuery}`);
    const data = await res.json();
    if (data.length < 9) {
      setShowMore(false);
    }
    setListings([...listings, ...data]);
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Search Filters Sidebar */}
          <div className="lg:w-80 flex-shrink-0">
            <div className="card p-6 sticky top-24">
              <h2 className="text-xl font-semibold text-neutral-900 mb-6">Search Filters</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Search Term */}
                <div>
                  <label htmlFor="searchTerm" className="block text-sm font-medium text-neutral-700 mb-2">
                    Search Term
                  </label>
                  <input
                    id="searchTerm"
                    onChange={handleChange}
                    value={sideBarData.searchTerm}
                    type="text"
                    placeholder="Enter location, property name..."
                    className="input-field"
                  />
                </div>

                {/* Property Type */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-3">
                    Property Type
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        onChange={handleChange}
                        checked={sideBarData.type === "all"}
                        type="radio"
                        name="type"
                        id="all"
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300"
                      />
                      <span className="ml-2 text-sm text-neutral-700">All Properties</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        onChange={handleChange}
                        checked={sideBarData.type === "rent"}
                        type="radio"
                        name="type"
                        id="rent"
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300"
                      />
                      <span className="ml-2 text-sm text-neutral-700">For Rent</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        onChange={handleChange}
                        checked={sideBarData.type === "sell"}
                        type="radio"
                        name="type"
                        id="sell"
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300"
                      />
                      <span className="ml-2 text-sm text-neutral-700">For Sale</span>
                    </label>
                  </div>
                </div>

                {/* Special Offers */}
                <div>
                  <label className="flex items-center">
                    <input
                      onChange={handleChange}
                      checked={sideBarData.offer}
                      type="checkbox"
                      id="offer"
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
                    />
                    <span className="ml-2 text-sm font-medium text-neutral-700">Special Offers</span>
                  </label>
                </div>

                {/* Amenities */}
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-3">
                    Amenities
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        onChange={handleChange}
                        checked={sideBarData.parking}
                        type="checkbox"
                        id="parking"
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
                      />
                      <span className="ml-2 text-sm text-neutral-700">Parking</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        onChange={handleChange}
                        checked={sideBarData.furnished}
                        type="checkbox"
                        id="furnished"
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-neutral-300 rounded"
                      />
                      <span className="ml-2 text-sm text-neutral-700">Furnished</span>
                    </label>
                  </div>
                </div>

                {/* Sort */}
                <div>
                  <label htmlFor="sort_order" className="block text-sm font-medium text-neutral-700 mb-2">
                    Sort By
                  </label>
                  <select
                    onChange={handleChange}
                    defaultValue="createdAt_desc"
                    id="sort_order"
                    className="input-field"
                  >
                    <option value="regularPrice_desc">Price: High to Low</option>
                    <option value="regularPrice_asc">Price: Low to High</option>
                    <option value="createdAt_desc">Newest First</option>
                    <option value="createdAt_asc">Oldest First</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full btn-primary py-3"
                >
                  Apply Filters
                </button>
              </form>
            </div>
          </div>

          {/* Results */}
          <div className="flex-1">
            <div className="mb-6">
              <h1 className="text-2xl font-display font-bold text-neutral-900 mb-2">
                Property Search Results
              </h1>
              <p className="text-neutral-600">
                {loading ? 'Searching...' : `${listings.length} properties found`}
              </p>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="flex items-center justify-center py-12">
                <div className="flex items-center space-x-2">
                  <svg className="animate-spin h-6 w-6 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span className="text-neutral-600">Loading properties...</span>
                </div>
              </div>
            )}

            {/* No Results */}
            {!loading && listings.length === 0 && (
              <div className="text-center py-12">
                <div className="mx-auto h-24 w-24 bg-neutral-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="h-12 w-12 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-neutral-900 mb-2">No properties found</h3>
                <p className="text-neutral-600 mb-4">Try adjusting your search criteria</p>
                <button
                  onClick={() => {
                    setSideBarData({
                      searchTerm: "",
                      type: "all",
                      parking: false,
                      furnished: false,
                      offer: false,
                      sort: "createdAt",
                      order: "desc",
                    });
                  }}
                  className="btn-outline"
                >
                  Clear Filters
                </button>
              </div>
            )}

            {/* Results Grid */}
            {!loading && listings.length > 0 && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {listings.map((listing) => (
                    <Card key={listing._id} listing={listing} />
                  ))}
                </div>

                {/* Show More Button */}
                {showMore && (
                  <div className="mt-8 text-center">
                    <button
                      onClick={onShowMoreClick}
                      className="btn-outline px-8 py-3"
                    >
                      Load More Properties
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default search;
