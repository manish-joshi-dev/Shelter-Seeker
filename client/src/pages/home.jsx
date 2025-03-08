import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import SwiperCore from 'swiper';
import 'swiper/css/bundle';
import Card from '../components/card';



function home() {
  const [offerListings, setOfferListings] = useState([]);
  const [saleListings, setSaleListings] = useState([]);
  const [rentListings, setRentListings] = useState([]);
  SwiperCore.use([Navigation]);
  console.log(offerListings);
  useEffect(() => {
    const fetchOfferListings = async () => {
      try {
        console.log('Fetching offer listings...');
        console.log('Current origin:', window.location.origin);
        const url = '/api/listing/get?offer=true&limit=4';
        console.log('Request URL:', url);
        const res = await fetch(url, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          }
        });
        console.log('Response status:', res.status);
        console.log('Response headers:', Object.fromEntries(res.headers.entries()));
        if (!res.ok) {
          const errorText = await res.text();
          console.error('Error response body:', errorText);
          throw new Error(`HTTP error! status: ${res.status}, body: ${errorText}`);
        }
        const data = await res.json();
        console.log('Offer listings data:', data);
        setOfferListings(data);
        fetchRentListings();
      } catch (error) {
        console.error('Error fetching offer listings:', error);
      }
    };
    const fetchRentListings = async () => {
      try {
        console.log('Fetching rent listings...');
        const res = await fetch('/api/listing/get?type=rent&limit=4');
        console.log('Rent response status:', res.status);
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        console.log('Rent listings data:', data);
        setRentListings(data);
        fetchSaleListings();
      } catch (error) {
        console.error('Error fetching rent listings:', error);
      }
    };

    const fetchSaleListings = async () => {
      try {
        console.log('Fetching sale listings...');
        const res = await fetch('/api/listing/get?type=sale&limit=4');
        console.log('Sale response status:', res.status);
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        const data = await res.json();
        console.log('Sale listings data:', data);
        setSaleListings(data);
      } catch (error) {
        console.error('Error fetching sale listings:', error);
      }
    };
    fetchOfferListings();
  }, []);
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-primary-50 via-white to-secondary-50 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%230ea5e9%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-display font-bold text-neutral-900 leading-tight">
              Find your next{' '}
              <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                perfect
              </span>
              <br />
              place with ease
            </h1>
            
            <p className="mt-6 text-lg sm:text-xl text-neutral-600 max-w-3xl mx-auto leading-relaxed">
              Discover your dream home with our comprehensive property listings. 
              From cozy apartments to luxury estates, we have the perfect place for every lifestyle.
            </p>
            
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/search"
                className="btn-primary text-lg px-8 py-4 rounded-full inline-flex items-center justify-center space-x-2"
              >
                <span>Explore Properties</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              
              <Link
                to="/about"
                className="btn-outline text-lg px-8 py-4 rounded-full"
              >
                Learn More
              </Link>
            </div>
            
            {/* Stats */}
            <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary-600">500+</div>
                <div className="text-neutral-600 mt-1">Properties Listed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-secondary-600">1000+</div>
                <div className="text-neutral-600 mt-1">Happy Customers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-accent-600">50+</div>
                <div className="text-neutral-600 mt-1">Cities Covered</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Properties Carousel */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-neutral-900 mb-4">
              Featured Properties
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              Discover our handpicked selection of premium properties that offer exceptional value and lifestyle.
            </p>
          </div>
          
          <Swiper 
            navigation 
            className="rounded-2xl overflow-hidden shadow-large"
            spaceBetween={0}
            slidesPerView={1}
            loop={true}
            autoplay={{
              delay: 5000,
              disableOnInteraction: false,
            }}
          >
            {offerListings &&
              offerListings.length > 0 &&
              offerListings.map((listing) => (
                <SwiperSlide key={listing._id}>
                  <div className="relative h-[500px] lg:h-[600px]">
                    <div
                      style={{
                        background: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(${listing.imageUrls[0]}) center no-repeat`,
                        backgroundSize: 'cover',
                      }}
                      className="h-full w-full"
                    >
                      <div className="absolute inset-0 flex items-end">
                        <div className="p-8 lg:p-12 text-white">
                          <h3 className="text-2xl lg:text-4xl font-display font-bold mb-4">
                            {listing.name}
                          </h3>
                          <p className="text-lg lg:text-xl mb-4 opacity-90">
                            {listing.address}
                          </p>
                          <div className="flex items-center space-x-4">
                            <span className="text-2xl lg:text-3xl font-bold">
                              ${listing.offer
                                ? listing.discountPrice.toLocaleString('en-US')
                                : listing.regularPrice.toLocaleString('en-US')}
                              {listing.type === 'rent' && ' / month'}
                            </span>
                            <span className="bg-primary-600 px-3 py-1 rounded-full text-sm font-medium">
                              {listing.type === 'rent' ? 'For Rent' : 'For Sale'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
          </Swiper>
        </div>
      </div>

      {/* Property Categories */}
      <div className="py-16 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {offerListings && offerListings.length > 0 && (
            <div className="mb-16">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-display font-bold text-neutral-900 mb-2">
                    Special Offers
                  </h2>
                  <p className="text-neutral-600">
                    Don't miss out on these limited-time deals
                  </p>
                </div>
                <Link 
                  to="/search?offer=true"
                  className="btn-outline mt-4 sm:mt-0"
                >
                  View All Offers
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {offerListings.map((listing) => (
                  <Card listing={listing} key={listing._id} />
                ))}
              </div>
            </div>
          )}
          
          {rentListings && rentListings.length > 0 && (
            <div className="mb-16">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-display font-bold text-neutral-900 mb-2">
                    Properties for Rent
                  </h2>
                  <p className="text-neutral-600">
                    Find your perfect rental home
                  </p>
                </div>
                <Link 
                  to="/search?type=rent"
                  className="btn-outline mt-4 sm:mt-0"
                >
                  View All Rentals
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {rentListings.map((listing) => (
                  <Card listing={listing} key={listing._id} />
                ))}
              </div>
            </div>
          )}
          
          {saleListings && saleListings.length > 0 && (
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-display font-bold text-neutral-900 mb-2">
                    Properties for Sale
                  </h2>
                  <p className="text-neutral-600">
                    Own your dream home today
                  </p>
                </div>
                <Link 
                  to="/search?type=sale"
                  className="btn-outline mt-4 sm:mt-0"
                >
                  View All Sales
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {saleListings.map((listing) => (
                  <Card listing={listing} key={listing._id} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
  

export default home
