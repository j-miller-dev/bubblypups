import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import Booking from '@/Pages/Booking'

// Mock Inertia components
vi.mock('@inertiajs/react', () => ({
  Head: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  usePage: () => ({
    props: {},
    url: '/booking'
  })
}))

// Mock MainLayout
vi.mock('@/Layouts/MainLayout', () => ({
  default: ({ children }: { children: React.ReactNode }) => <div data-testid="main-layout">{children}</div>
}))

// Mock Container component
vi.mock('@/Components/Container', () => ({
  Container: ({ children }: { children: React.ReactNode }) => <div data-testid="container">{children}</div>
}))

// Mock Button component
vi.mock('@/Components/Button', () => ({
  Button: ({ children, onClick, disabled, variant, href }: any) => (
    <button 
      onClick={onClick} 
      disabled={disabled} 
      data-variant={variant}
      data-href={href}
      data-testid="button"
    >
      {children}
    </button>
  )
}))

describe('Booking Form Flow', () => {
  let user: ReturnType<typeof userEvent.setup>

  beforeEach(() => {
    vi.clearAllMocks()
    global.fetch = vi.fn()
    user = userEvent.setup()
  })

  it('renders service selection step initially', () => {
    render(<Booking />)
    
    expect(screen.getByText('Select a Service')).toBeInTheDocument()
    expect(screen.getByText('Full Grooming Package')).toBeInTheDocument()
    expect(screen.getByText('Bath & Brush')).toBeInTheDocument()
    expect(screen.getByText('Nail Trimming')).toBeInTheDocument()
  })

  it('shows progress indicator with correct steps', () => {
    render(<Booking />)
    
    expect(screen.getByText('Service')).toBeInTheDocument()
    expect(screen.getByText('Dog Info')).toBeInTheDocument()
    expect(screen.getByText('Schedule')).toBeInTheDocument()
    expect(screen.getByText('Contact')).toBeInTheDocument()
  })

  it('disables continue button when no service is selected', () => {
    render(<Booking />)
    
    const continueButton = screen.getByRole('button', { name: /continue/i })
    expect(continueButton).toBeDisabled()
  })

  it('enables continue button when service is selected', async () => {
    render(<Booking />)
    
    const fullGroomingOption = screen.getByText('Full Grooming Package')
    await user.click(fullGroomingOption)
    
    const continueButton = screen.getByRole('button', { name: /continue/i })
    expect(continueButton).not.toBeDisabled()
  })

  it('progresses to dog information step after service selection', async () => {
    render(<Booking />)
    
    // Select a service
    const fullGroomingOption = screen.getByText('Full Grooming Package')
    await user.click(fullGroomingOption)
    
    // Click continue
    const continueButton = screen.getByRole('button', { name: /continue/i })
    await user.click(continueButton)
    
    // Should now be on dog info step
    expect(screen.getByText('Tell Us About Your Dog')).toBeInTheDocument()
    expect(screen.getByLabelText(/dog\'s name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/breed/i)).toBeInTheDocument()
  })

  it('validates required fields in dog information step', async () => {
    render(<Booking />)
    
    // Navigate to dog info step
    await user.click(screen.getByText('Full Grooming Package'))
    await user.click(screen.getByRole('button', { name: /continue/i }))
    
    // Try to continue without filling required fields
    const continueButton = screen.getByRole('button', { name: /continue/i })
    expect(continueButton).toBeDisabled()
    
    // Fill required fields
    await user.type(screen.getByLabelText(/dog\'s name/i), 'Buddy')
    await user.type(screen.getByLabelText(/breed/i), 'Golden Retriever')
    await user.type(screen.getByLabelText(/age/i), '3 years')
    await user.type(screen.getByLabelText(/weight/i), '65')
    
    // Wait for form validation to update
    await waitFor(() => {
      expect(continueButton).not.toBeDisabled()
    })
  })

  it('allows back navigation from dog information step', async () => {
    render(<Booking />)
    
    // Navigate to dog info step
    await user.click(screen.getByText('Full Grooming Package'))
    await user.click(screen.getByRole('button', { name: /continue/i }))
    
    // Click back button
    const backButton = screen.getByRole('button', { name: /back/i })
    await user.click(backButton)
    
    // Should be back to service selection
    expect(screen.getByText('Select a Service')).toBeInTheDocument()
  })

  it('progresses through all steps to appointment scheduling', async () => {
    render(<Booking />)
    
    // Step 1: Service Selection
    await user.click(screen.getByText('Full Grooming Package'))
    await user.click(screen.getByRole('button', { name: /continue/i }))
    
    // Step 2: Dog Information
    await user.type(screen.getByLabelText(/dog\'s name/i), 'Buddy')
    await user.type(screen.getByLabelText(/breed/i), 'Golden Retriever')
    await user.type(screen.getByLabelText(/age/i), '3 years')
    await user.type(screen.getByLabelText(/weight/i), '65')
    await user.click(screen.getByRole('button', { name: /continue/i }))
    
    // Step 3: Appointment Scheduling
    expect(screen.getByText('Schedule Your Appointment')).toBeInTheDocument()
    expect(screen.getByLabelText(/preferred date/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/preferred time/i)).toBeInTheDocument()
  })

  it('generates correct time slots for appointment scheduling', async () => {
    render(<Booking />)
    
    // Navigate to appointment step
    await user.click(screen.getByText('Full Grooming Package'))
    await user.click(screen.getByRole('button', { name: /continue/i }))
    
    await user.type(screen.getByLabelText(/dog\'s name/i), 'Buddy')
    await user.type(screen.getByLabelText(/breed/i), 'Golden Retriever')
    await user.type(screen.getByLabelText(/age/i), '3 years')
    await user.type(screen.getByLabelText(/weight/i), '65')
    await user.click(screen.getByRole('button', { name: /continue/i }))
    
    // Check that time options are available
    const timeSelect = screen.getByLabelText(/preferred time/i)
    expect(timeSelect).toBeInTheDocument()
    
    // Click to open dropdown and check for time options
    await user.click(timeSelect)
    expect(screen.getByDisplayValue('Select a time')).toBeInTheDocument()
  })

  it('validates date is in the future for appointment scheduling', async () => {
    render(<Booking />)
    
    // Navigate to appointment step
    await user.click(screen.getByText('Full Grooming Package'))
    await user.click(screen.getByRole('button', { name: /continue/i }))
    
    await user.type(screen.getByLabelText(/dog\'s name/i), 'Buddy')
    await user.type(screen.getByLabelText(/breed/i), 'Golden Retriever')
    await user.type(screen.getByLabelText(/age/i), '3 years')
    await user.type(screen.getByLabelText(/weight/i), '65')
    await user.click(screen.getByRole('button', { name: /continue/i }))
    
    // Check that date input has min attribute set to today
    const dateInput = screen.getByLabelText(/preferred date/i)
    const today = new Date().toISOString().split('T')[0]
    expect(dateInput).toHaveAttribute('min', today)
  })

  it('completes full booking flow and submits data', async () => {
    render(<Booking />)
    
    // Mock successful API response
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ ok: true, booking_id: 123 })
    })
    
    // Step 1: Service Selection
    await user.click(screen.getByText('Full Grooming Package'))
    await user.click(screen.getByRole('button', { name: /continue/i }))
    
    // Step 2: Dog Information
    await user.type(screen.getByLabelText(/dog\'s name/i), 'Buddy')
    await user.type(screen.getByLabelText(/breed/i), 'Golden Retriever')
    await user.type(screen.getByLabelText(/age/i), '3 years')
    await user.type(screen.getByLabelText(/weight/i), '65')
    await user.type(screen.getByLabelText(/special notes/i), 'Very friendly dog')
    await user.click(screen.getByRole('button', { name: /continue/i }))
    
    // Step 3: Appointment Scheduling
    await user.type(screen.getByLabelText(/preferred date/i), '2025-08-20')
    await user.selectOptions(screen.getByLabelText(/preferred time/i), '10:00 AM')
    await user.click(screen.getByRole('button', { name: /continue/i }))
    
    // Step 4: Contact Information
    expect(screen.getByText('Your Contact Information')).toBeInTheDocument()
    await user.type(screen.getByLabelText(/full name/i), 'John Doe')
    await user.type(screen.getByLabelText(/email address/i), 'john@example.com')
    await user.type(screen.getByLabelText(/phone number/i), '555-123-4567')
    
    // Submit booking
    await user.click(screen.getByRole('button', { name: /book appointment/i }))
    
    // Wait for API call
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': 'test-token',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          service: 'full-grooming',
          dog: {
            name: 'Buddy',
            breed: 'Golden Retriever',
            age: '3 years',
            weight: '65',
            notes: 'Very friendly dog'
          },
          appointment: {
            date: '2025-08-20',
            time: '10:00 AM'
          },
          contact: {
            name: 'John Doe',
            email: 'john@example.com',
            phone: '555-123-4567'
          }
        })
      })
    })
    
    // Should show confirmation step
    await waitFor(() => {
      expect(screen.getByText('Booking Confirmed!')).toBeInTheDocument()
    })
  })

  it('handles API errors gracefully', async () => {
    render(<Booking />)
    
    // Mock API error
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: 'Server error' })
    })
    
    // Navigate through all steps
    await user.click(screen.getByText('Full Grooming Package'))
    await user.click(screen.getByRole('button', { name: /continue/i }))
    
    await user.type(screen.getByLabelText(/dog\'s name/i), 'Buddy')
    await user.type(screen.getByLabelText(/breed/i), 'Golden Retriever')
    await user.type(screen.getByLabelText(/age/i), '3 years')
    await user.type(screen.getByLabelText(/weight/i), '65')
    await user.click(screen.getByRole('button', { name: /continue/i }))
    
    await user.type(screen.getByLabelText(/preferred date/i), '2025-08-20')
    await user.selectOptions(screen.getByLabelText(/preferred time/i), '10:00 AM')
    await user.click(screen.getByRole('button', { name: /continue/i }))
    
    await user.type(screen.getByLabelText(/full name/i), 'John Doe')
    await user.type(screen.getByLabelText(/email address/i), 'john@example.com')
    await user.type(screen.getByLabelText(/phone number/i), '555-123-4567')
    
    // Mock alert
    global.alert = vi.fn()
    
    // Submit booking
    await user.click(screen.getByRole('button', { name: /book appointment/i }))
    
    // Should show error message
    await waitFor(() => {
      expect(global.alert).toHaveBeenCalledWith(
        'Sorry, something went wrong submitting your booking. Please try again.'
      )
    })
  })

  it('displays booking confirmation with correct details', async () => {
    render(<Booking />)
    
    // Mock successful API response
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({ ok: true, booking_id: 123 })
    })
    
    // Complete booking flow
    await user.click(screen.getByText('Bath & Brush'))
    await user.click(screen.getByRole('button', { name: /continue/i }))
    
    await user.type(screen.getByLabelText(/dog\'s name/i), 'Luna')
    await user.type(screen.getByLabelText(/breed/i), 'Poodle')
    await user.type(screen.getByLabelText(/age/i), '2 years')
    await user.type(screen.getByLabelText(/weight/i), '30')
    await user.click(screen.getByRole('button', { name: /continue/i }))
    
    await user.type(screen.getByLabelText(/preferred date/i), '2025-08-25')
    await user.selectOptions(screen.getByLabelText(/preferred time/i), '2:00 PM')
    await user.click(screen.getByRole('button', { name: /continue/i }))
    
    await user.type(screen.getByLabelText(/full name/i), 'Jane Smith')
    await user.type(screen.getByLabelText(/email address/i), 'jane@example.com')
    await user.type(screen.getByLabelText(/phone number/i), '555-987-6543')
    
    await user.click(screen.getByRole('button', { name: /book appointment/i }))
    
    // Check confirmation details
    await waitFor(() => {
      expect(screen.getByText('Booking Confirmed!')).toBeInTheDocument()
      expect(screen.getByText('Bath & Brush')).toBeInTheDocument()
      expect(screen.getByText('Luna (Poodle)')).toBeInTheDocument()
      expect(screen.getByText('Age: 2 years | Weight: 30 lbs')).toBeInTheDocument()
      expect(screen.getByText('Jane Smith')).toBeInTheDocument()
      expect(screen.getByText('jane@example.com')).toBeInTheDocument()
      expect(screen.getByText('555-987-6543')).toBeInTheDocument()
    })
  })
})