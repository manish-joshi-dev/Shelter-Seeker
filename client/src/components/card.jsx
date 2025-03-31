import React from 'react'
import { Link } from 'react-router-dom'
import { MdLocationOn, MdBed, MdBathroom, MdSquareFoot } from 'react-icons/md'
import { FaHeart, FaShare } from 'react-icons/fa'
import FraudDetectionBadge from './FraudDetectionBadge'

export default function card({listing}) {
  return (
    <div className="group">
      <Link to={`/listing/${listing._id}`}>
        <div className="card card-hover w-full max-w-sm mx-auto">
          {/* Image Container */}
          <div className="relative overflow-hidden">
            <img 
              className="w-full h-48 sm:h-56 object-cover transition-transform duration-300 group-hover:scale-105" 
              src={listing.imageUrls[0] || "https://marketplace.canva.com/EAF6nmbUlhg/1/0/1600w/canva-black-and-gold-flat-illustrative-real-estate-logo-Jj0rP4nw9ug.jpg"} 
              alt={listing.name}
            />
            
            {/* Overlay with actions */}
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-start justify-end p-3">
              <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button className="p-2 bg-white rounded-full shadow-soft hover:bg-neutral-100 transition-colors duration-200">
                  <FaHeart className="w-4 h-4 text-neutral-600" />
                </button>
                <button className="p-2 bg-white rounded-full shadow-soft hover:bg-neutral-100 transition-colors duration-200">
                  <FaShare className="w-4 h-4 text-neutral-600" />
                </button>
              </div>
            </div>
            
            {/* Property type badge */}
            <div className="absolute top-3 left-3">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                listing.type === 'rent' 
                  ? 'bg-primary-100 text-primary-700' 
                  : 'bg-secondary-100 text-secondary-700'
              }`}>
                {listing.type === 'rent' ? 'For Rent' : 'For Sale'}
              </span>
            </div>
            
            {/* Offer badge */}
            {listing.offer && (
              <div className="absolute top-3 right-3">
                <span className="px-3 py-1 rounded-full text-xs font-medium bg-accent-100 text-accent-700">
                  Special Offer
                </span>
              </div>
            )}
            
            {/* Fraud Detection Badge */}
            <div className="absolute bottom-3 left-3">
              <FraudDetectionBadge fraudDetection={listing.fraudDetection} />
            </div>
          </div>
          
          {/* Content */}
          <div className="p-4">
            {/* Price */}
            <div className="mb-3">
              <p className="text-2xl font-bold text-neutral-900">
                ${listing.offer
                  ? listing.discountPrice.toLocaleString('en-US')
                  : listing.regularPrice.toLocaleString('en-US')}
                {listing.type === 'rent' && (
                  <span className="text-sm font-normal text-neutral-600"> / month</span>
                )}
              </p>
              {listing.offer && (
                <p className="text-sm text-neutral-500 line-through">
                  ${listing.regularPrice.toLocaleString('en-US')}
                </p>
              )}
            </div>
            
            {/* Title */}
            <h3 className="text-lg font-semibold text-neutral-900 mb-2 line-clamp-1">
              {listing.name}
            </h3>
            
            {/* Location */}
            <div className="flex items-center text-neutral-600 mb-3">
              <MdLocationOn className="w-4 h-4 mr-1 flex-shrink-0" />
              <p className="text-sm truncate">{listing.address}</p>
            </div>
            
            {/* Description */}
            <p className="text-sm text-neutral-600 mb-4 line-clamp-2">
              {listing.description}
            </p>
            
            {/* Property details */}
            <div className="flex items-center justify-between pt-3 border-t border-neutral-200">
              <div className="flex items-center space-x-4 text-sm text-neutral-600">
                <div className="flex items-center">
                  <MdBed className="w-4 h-4 mr-1" />
                  <span>{listing.bedRooms} {listing.bedRooms > 1 ? 'beds' : 'bed'}</span>
                </div>
                <div className="flex items-center">
                  <MdBathroom className="w-4 h-4 mr-1" />
                  <span>{listing.washrooms} {listing.washrooms > 1 ? 'baths' : 'bath'}</span>
                </div>
              </div>
              
              <div className="text-sm text-primary-600 font-medium">
                View Details →
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  )
}
