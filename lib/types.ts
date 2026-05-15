export interface SecondHandItem {
  id: string
  title: string
  description: string | null
  price: number
  location: string | null
  image_url: string | null
  category: string
  contact_phone: string | null
  contact_name: string | null
  payment_status: string
  payment_amount: number
  created_at: string
  updated_at: string
}

export interface RealEstate {
  id: string
  title: string
  description: string | null
  price: number
  location: string
  image_url: string | null
  property_type: string | null
  rooms: number | null
  size_sqm: number | null
  contact_phone: string | null
  contact_name: string | null
  payment_status: string
  payment_amount: number
  created_at: string
  updated_at: string
}

export interface Taxi {
  id: string
  driver_name: string
  phone: string
  location: string | null
  service_area: string | null
  vehicle_type: string | null
  is_available: boolean
  rating: number | null
  created_at: string
  updated_at: string
}

export interface Teacher {
  id: string
  name: string
  subject: string
  description: string | null
  phone: string | null
  location: string | null
  price_per_hour: number | null
  experience_years: number | null
  rating: number | null
  image_url: string | null
  created_at: string
  updated_at: string
}

export interface WenWenVenture {
  id: string
  title: string
  description: string
  venture_type: string
  investment_required: number | null
  potential_revenue: number | null
  contact_name: string
  contact_phone: string
  contact_email: string | null
  seriousness_fee: number
  success_fee_percent: number
  payment_status: string
  status: string
  created_at: string
  updated_at: string
}

export interface Payment {
  id: string
  item_type: string
  item_id: string
  amount: number
  payment_method: string
  payment_id: string | null
  status: string
  payer_email: string | null
  payer_name: string | null
  created_at: string
}
