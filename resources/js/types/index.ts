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