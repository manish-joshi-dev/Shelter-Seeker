import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import {Swiper,SwiperSlide} from 'swiper/react'
import { useSelector} from "react-redux"

import {Navigation} from 'swiper/modules'
import 'swiper/css/bundle'
import {
  FaBath,
  FaBed,
  FaChair,
  FaMapMarkedAlt,
  FaMapMarkerAlt,
  FaParking,
  FaShare,
} from 'react-icons/fa';
import ReportListing from '../components/ReportListing';
import FraudDetectionBadge from '../components/FraudDetectionBadge';
import FraudDetectionDetails from '../components/FraudDetectionDetails';
// Chat moved to My Chats page


function Listing() {
  const {curUser} = useSelector((state)=>state.user);
  const [listing,setListing] = useState(null);
  const [loading,setLoading] = useState(false);
  const [error,setError] = useState(false);
  const navigate = useNavigate();
  const [contact, setContact] = useState(false); 
  const [copied, setCopied] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [isRetestingFraud, setIsRetestingFraud] = useState(false);
  const params = useParams();

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        console.log(params.id);
        const res = await fetch(`/api/listing/get/${params.id}`);
        const data = await res.json();
        if (data.success === false) {
          setError(true);
          console.log(data.message);
          setLoading(false);
          return;
        }
        setListing(data);

        console.log(data);
        
        setLoading(false);
        setError(false);
      } catch (error) {
        setError(true);
        setLoading(false);
        console.log(error);
      }
    };
    fetchListing();
  }, []);

  const handleRetestFraudDetection = async (listingId) => {
    try {
      setIsRetestingFraud(true);
      const res = await fetch(`/api/listing/detect-fraud/${listingId}`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (res.ok) {
        const data = await res.json();
        setListing(data.listing); // Update the listing with new fraud detection results
      } else {
        console.error('Failed to retest fraud detection');
      }
    } catch (error) {
      console.error('Error retesting fraud detection:', error);
    } finally {
      setIsRetestingFraud(false);
    }
  };

  return (
    <div>
      <main>
      {loading && <p className='text-center my-7 text-2xl'>Loading...</p>}
      {error && (
        <p className='text-center my-7 text-2xl'>Something went wrong!</p>
      )}
      {listing && !loading && !error && (
        <div>
          <div className='relative'>
            <Swiper modules={[Navigation]} navigation>
              {listing.imageUrls.map((url) => (
                <SwiperSlide key={url}>
                  <div
                    className='h-[420px] sm:h-[520px]'
                    style={{
                      background: `url(${url}) center no-repeat`,
                      backgroundSize: 'cover',
                    }}
                  >
                    <div className='h-full w-full bg-gradient-to-t from-black/40 to-transparent'></div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
            <button
              onClick={async ()=>{
                try {
                  await navigator.clipboard.writeText(window.location.href);
                  setCopied(true);
                  setTimeout(()=>setCopied(false), 1500);
                } catch (e) {}
              }}
              className='absolute right-4 bottom-4 z-10 flex items-center gap-2 bg-white/90 hover:bg-white text-neutral-800 px-4 py-2 rounded-lg shadow-md'
            >
              <FaShare /> {copied ? 'Link copied' : 'Share'}
            </button>
          </div>

          <div className='max-w-6xl mx-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-3 gap-6'>
            <div className='lg:col-span-2'>
              <div className='flex flex-col gap-2'>
                <h1 className='font-semibold text-3xl text-neutral-900'>{listing.name}</h1>
                <div className='flex items-center text-neutral-600'>
                  <FaMapMarkedAlt className='mr-2' />
                  <span className='text-base'>{listing.address}</span>
                </div>
                <div className='flex flex-wrap gap-3 mt-2'>
                  {listing.type==='rent' && (
                    <span className='px-4 py-1 rounded-full text-sm bg-blue-100 text-blue-700'>For Rent</span>
                  )}
                  {listing.type==='sale' && (
                    <span className='px-4 py-1 rounded-full text-sm bg-emerald-100 text-emerald-700'>For Sale</span>
                  )}
                  {listing.offer && (
                    <span className='px-4 py-1 rounded-full text-sm bg-green-100 text-green-700'>
                      ${+listing.regularPrice - +listing.discountPrice} off
                    </span>
                  )}
                  {/* Fraud Detection Badge */}
                  <FraudDetectionBadge fraudDetection={listing.fraudDetection} />
                </div>
                <div className='mt-3'>
                  <p className='text-3xl font-bold text-neutral-900'>
                    ${listing.offer ?
                      listing.discountPrice.toLocaleString('en-US') : listing.regularPrice.toLocaleString('en-US')}
                    {listing.type==='rent' && <span className='text-lg font-medium text-neutral-600'> / month</span>}
                  </p>
                  {listing.offer && (
                    <p className='text-sm text-neutral-500 line-through'>
                      ${listing.regularPrice.toLocaleString('en-US')}
                    </p>
                  )}
                </div>
              </div>

              {listing.description && (
                <div className='mt-6'>
                  <h2 className='text-xl font-semibold mb-2'>About this property</h2>
                  <p className='text-neutral-700 leading-relaxed'>{listing.description}</p>
                </div>
              )}

              <ul className='grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 text-base'>
                <li className='flex items-center gap-2 bg-yellow-50 p-3 rounded-lg'>
                  <FaBed />
                  {listing.bedRooms > 1 ? `${listing.bedRooms} beds` : `${listing.bedRooms} bed`}
                </li>
                <li className='flex items-center gap-2 bg-yellow-50 p-3 rounded-lg'>
                  <FaBath />
                  {listing.washrooms > 1 ? `${listing.washrooms} baths` : `${listing.washrooms} bath`}
                </li>
                <li className='flex items-center gap-2 bg-yellow-50 p-3 rounded-lg'>
                  <FaChair />
                  {listing.furnished ? `Fully Furnished` : `Not Furnished`}
                </li>
                <li className='flex items-center gap-2 bg-yellow-50 p-3 rounded-lg'>
                  <FaParking />
                  {listing.parking ? `Car Parking` : `No Parking`}
                </li>
              </ul>

        <div className="flex flex-col sm:flex-row gap-3 mt-6">
            <button
                onClick={() => navigate(`/listing/${listing._id}/insights`)}
                className='bg-blue-600 hover:bg-blue-700 text-white text-base rounded-lg py-3 px-6 flex items-center justify-center space-x-2'
            >
                <FaMapMarkedAlt />
                <span>Know the Local Insights</span>
            </button>

            {curUser && (
                <button onClick={async ()=>{
                    try {
                        await fetch(`/api/chat/start-by-listing?listingId=${listing._id}`, { credentials: 'include' })
                    } catch (_) {}
                    navigate(`/mychats?openUser=${listing.userRef}`)
                }} className='bg-slate-900 hover:bg-slate-800 text-white text-base rounded-lg py-3 px-6'>
                    Contact landlord
                </button>
            )}

            {curUser && curUser._id !== listing.userRef && (
                <ReportListing 
                    listingId={listing._id} 
                    onClose={() => setShowReport(false)}
                />
            )}
        </div>
            </div>

            <aside className='lg:col-span-1'>
              <div className='sticky top-6 space-y-4'>
                <div className='p-5 rounded-xl border border-neutral-200 bg-white shadow-sm'>
                  <h3 className='text-lg font-semibold mb-3'>Quick info</h3>
                  <div className='space-y-2 text-sm text-neutral-700'>
                    <div className='flex justify-between'><span>Type</span><span className='font-medium capitalize'>{listing.type}</span></div>
                    <div className='flex justify-between'><span>Furnished</span><span className='font-medium'>{listing.furnished ? 'Yes' : 'No'}</span></div>
                    <div className='flex justify-between'><span>Parking</span><span className='font-medium'>{listing.parking ? 'Available' : 'None'}</span></div>
                  </div>
                </div>

                {/* Fraud Detection Details */}
                <FraudDetectionDetails 
                  fraudDetection={listing.fraudDetection}
                  listingId={listing._id}
                  onRetest={handleRetestFraudDetection}
                />
              </div>
            </aside>
          </div>
        </div>
      )}
    </main>

    </div>
  )
}

export default Listing
