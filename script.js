import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Validate environment variables
if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase environment variables')
    throw new Error('Missing required environment variables. Please check your .env file.')
}

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseKey)

// Email validation function
function isValidEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    return emailRegex.test(email)
}

// Name validation function
function isValidName(name) {
    // Allow letters, spaces, hyphens, and apostrophes, 2-100 chars
    const nameRegex = /^[a-zA-Z\s'-]{2,100}$/
    return nameRegex.test(name)
}

// Sanitize input function
function sanitizeInput(str) {
    return str.replace(/[<>]/g, '') // Remove potential HTML/script tags
        .trim()
        .slice(0, 100) // Limit length
}

// Get client IP for rate limiting
async function getClientIP() {
    try {
        const response = await fetch('https://api.ipify.org?format=json')
        const data = await response.json()
        return data.ip
    } catch (error) {
        console.error('Error getting client IP:', error)
        return 'unknown'
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('waitlist-form')
    const submitButton = form.querySelector('.submit-button')
    const buttonText = submitButton.querySelector('.button-text')
    const loadingText = submitButton.querySelector('.loading-text')

    form.addEventListener('submit', async (e) => {
        e.preventDefault()
        
        try {
            // Show loading state
            submitButton.disabled = true
            buttonText.style.display = 'none'
            loadingText.style.display = 'inline'

            // Get and sanitize form data
            const formData = new FormData(form)
            const name = sanitizeInput(formData.get('name') || '')
            const email = (formData.get('email') || '').trim().toLowerCase()

            // Validate inputs
            if (!isValidName(name)) {
                throw new Error('Invalid name format. Please use only letters, spaces, hyphens, and apostrophes.')
            }

            if (!isValidEmail(email)) {
                throw new Error('Invalid email format. Please enter a valid email address.')
            }

            // Check rate limiting
            const clientIP = await getClientIP()
            const { data: rateLimitData } = await supabase
                .from('rate_limits')
                .select('attempts, last_attempt')
                .eq('ip_address', clientIP)
                .single()

            if (rateLimitData) {
                const timeSinceLastAttempt = Date.now() - new Date(rateLimitData.last_attempt).getTime()
                if (timeSinceLastAttempt < 60000 && rateLimitData.attempts >= 5) { // 1 minute cooldown
                    throw new Error('Too many attempts. Please try again later.')
                }
            }

            // Create user in Supabase
            const { data, error } = await supabase
                .from('waitlist_users')
                .insert([
                    {
                        full_name: name,
                        email: email,
                        signed_up_at: new Date().toISOString(),
                        ip_address: clientIP // Store for rate limiting
                    }
                ])
                .select()

            if (error) {
                if (error.code === '23505') { // Unique violation
                    throw new Error('This email is already registered.')
                }
                throw error
            }

            // Update rate limiting
            await supabase.from('rate_limits').upsert({
                ip_address: clientIP,
                attempts: (rateLimitData?.attempts || 0) + 1,
                last_attempt: new Date().toISOString()
            })

            // Show success message
            form.innerHTML = `
                <div class="success-message">
                    <i class="fas fa-check-circle"></i>
                    <h3>Thank you for joining!</h3>
                    <p>We'll notify you when GemVoyage launches.</p>
                </div>
            `

            // Track successful signup
            if (typeof gtag === 'function') {
                gtag('event', 'signup', {
                    'event_category': 'waitlist',
                    'event_label': 'signup_successful'
                })
            }

        } catch (error) {
            console.error('Error:', error)
            
            // Remove any existing error messages
            const existingError = form.querySelector('.error-message')
            if (existingError) existingError.remove()
            
            // Show error message
            const errorDiv = document.createElement('div')
            errorDiv.className = 'error-message'
            errorDiv.textContent = error.message || 'Something went wrong. Please try again.'
            form.insertBefore(errorDiv, submitButton)
            
            // Reset button state
            submitButton.disabled = false
            buttonText.style.display = 'inline'
            loadingText.style.display = 'none'

            // Track error
            if (typeof gtag === 'function') {
                gtag('event', 'signup_error', {
                    'event_category': 'waitlist',
                    'event_label': error.message
                })
            }
        }
    })
})
