// Type definitions
// This file will contain shared TypeScript types across the application

export interface User {
  id: number
  name: string
  email: string
}

export interface Owner {
  id: number
  name: string
  email?: string
  phone?: string
  address?: string
}

export interface Dog {
  id: number
  owner_id: number
  name: string
  breed?: string
  age?: string
  weight?: string
  notes?: string
  photo_url?: string | null
}

export interface Booking {
  id: number
  owner_id: number
  dog_id: number
  service: string
  date: string
  time: string
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  notes?: string
}

export interface Testimonial {
  id: number
  author: string
  content: string
  rating: number
}

export interface Contact {
  id: number
  name: string
  email?: string
  phone?: string
  message: string
}

export interface BusinessHours {
  id: number
  day_of_week: string
  is_open: boolean
  open_time: string | null
  close_time: string | null
  slot_duration: number
}

export interface BlockedTime {
  id: number
  start_datetime: string
  end_datetime: string
  reason?: string
}

export interface Service {
  id: number
  name: string
  description?: string
  emoji?: string
  base_price: number
  duration_minutes: number
}

export interface Customer {
  id: number
  name: string
  email: string
  phone?: string
}

export interface Appointment {
  id: number
  dog_id: number
  service_id: number
  appointment_date: string
  appointment_time: string
  status: 'pending' | 'confirmed' | 'waiting_on_client' | 'completed' | 'cancelled'
  notes?: string
  dog?: Dog & { customer?: Customer }
  service?: Service
}