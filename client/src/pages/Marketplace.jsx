import { ArrowLeftIcon, FilterIcon } from 'lucide-react'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, useSearchParams } from 'react-router-dom'
import ListingCard from '../components/ListingCard'
import FilterSidebar from '../components/FilterSidebar'

const Marketplace = () => {

  const [searchParams] = useSearchParams()
  const search = searchParams.get("search")

  const navigate = useNavigate()

  const [showFilterPhone, setShowFilterPhone] = useState(false)

  const [filters, setFilters] = useState({
    platform: null,
    maxPrice: 100000,
    minFollowers: 0,
    niche: null,
    verified: false,
    monetized: false,
  })

  const { listings } = useSelector(state => state.listing)

  const filteredListings = listings.filter((listing) => {

    // Platform filter
    if (filters.platform && filters.platform.length > 0) {
      if (!filters.platform.includes(listing.platform)) return false
    }

    // Maximum price filter
    if (filters.maxPrice) {
      if (listing.price > filters.maxPrice) return false
    }

    // Minimum followers filter
    if (filters.minFollowers) {
      if (listing.followers_count < filters.minFollowers) return false
    }

    // Niche filter
    if (filters.niche && filters.niche.length > 0) {
      if (!filters.niche.includes(listing.niche)) return false
    }

    // Verified filter
    if (filters.verified && listing.verified !== filters.verified) {
      return false
    }

    // Monetized filter
    if (filters.monetized && listing.monetized !== filters.monetized) {
      return false
    }

    // Search filter
    if (search?.trim()) {
      const term = search.trim().toLowerCase()

      if (
        !listing.title.toLowerCase().includes(term) &&
        !listing.username.toLowerCase().includes(term) &&
        !listing.description.toLowerCase().includes(term) &&
        !listing.platform.toLowerCase().includes(term) &&
        !listing.niche.toLowerCase().includes(term)
      ) {
        return false
      }
    }

    return true
  })

  return (
    <div className='px-6 md:px-16 lg:px-24 xl:px-32'>

      <div className='flex items-center justify-between text-slate-500'>
        <button
          onClick={() => {
            navigate('/')
            scrollTo(0, 0)
          }}
          className='flex items-center gap-2 py-5'
        >
          <ArrowLeftIcon className='size-4' />
          Back to Home
        </button>

        <button
          onClick={() => setShowFilterPhone(true)}
          className='flex sm:hidden items-center gap-2 py-5'
        >
          <FilterIcon className='size-4' />
          Filters
        </button>
      </div>

      <div className='relative flex items-start justify-between gap-8 pb-8'>

        <FilterSidebar
          filters={filters}
          setFilters={setFilters}
          showFilterPhone={showFilterPhone}
          setShowFilterPhone={setShowFilterPhone}
        />

        <div className='flex-1 grid xl:grid-cols-2 gap-4'>
          {filteredListings
            .sort((a, b) =>
              a.featured ? -1 : b.featured ? 1 : 0
            )
            .map((listing, index) => (
              <ListingCard
                key={index}
                listing={listing}
              />
            ))}
        </div>

      </div>
    </div>
  )
}

export default Marketplace