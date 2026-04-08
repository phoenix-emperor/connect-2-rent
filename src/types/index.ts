export type UserRole = 'renter' | 'landlord'
export type ListingStatus = 'active' | 'inactive' | 'rented'

export interface Profile {
  id: string
  role: UserRole
  first_name: string
  last_name: string
  phone?: string | null
  avatar_url?: string | null
  created_at: string
  updated_at: string
}

export interface ListingImage {
  id: string
  listing_id: string
  url: string
  order: number
  created_at: string
}

export interface Listing {
  id: string
  landlord_id: string
  title: string
  description: string
  price: number
  rules?: string | null
  location?: string | null
  bedrooms?: number | null
  bathrooms?: number | null
  status: ListingStatus
  created_at: string
  updated_at: string
  landlord?: Profile
  listing_images?: ListingImage[]
}

export interface Message {
  id: string
  listing_id?: string | null
  sender_id: string
  receiver_id: string
  content: string
  is_read: boolean
  created_at: string
  sender?: Profile
  receiver?: Profile
  listing?: Listing | null
}

export interface MessageThread {
  partner: Profile
  listing: Listing | null
  messages: Message[]
  lastMessage: Message
  unreadCount: number
}
