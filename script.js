import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'
import { initErrorBoundary, checkEnvironmentHealth } from './error-boundary.js'
import { VERSION, logEnvironmentInfo, checkConfigurationHealth } from './version.js'

// Log version and environment information
logEnvironmentInfo()

// Check configuration health
const configHealth = checkConfigurationHealth()
if (!configHealth.healthy) {
    console.warn('Configuration Issues:', configHealth.issues)
}

// Initialize error boundary
initErrorBoundary()

// Check environment health before proceeding
const envHealth = checkEnvironmentHealth()
console.debug('Environment Health Check:', {
    ...envHealth,
    version: VERSION.version,
    buildDate: VERSION.buildDate
})

// Environment variable handling with multiple fallbacks
const getEnvVar = (name) => {
    // Try Vite environment variables
    const viteVar = import.meta.env[`VITE_${name}`];
    if (viteVar) return viteVar;

    // Try Vercel environment variables
    const vercelVar = import.meta.env[`NEXT_PUBLIC_${name}`];
    if (vercelVar) return vercelVar;

    // Try window object (for environments that inject variables)
    const windowVar = window[`ENV_${name}`];
    if (windowVar) return windowVar;

    return null;
};

// Get Supabase configuration
const supabaseUrl = getEnvVar('SUPABASE_URL');
const supabaseKey = getEnvVar('SUPABASE_ANON_KEY');

// Debug information (safe version - no sensitive data)
console.debug('Environment Status:', {
    hasUrl: !!supabaseUrl,
    hasKey: !!supabaseKey,
    mode: import.meta.env.MODE,
    isDev: import.meta.env.DEV,
    isProd: import.meta.env.PROD
});

// Validate configuration
if (!supabaseUrl || !supabaseKey) {
    const error = new Error('Missing Supabase configuration');
    error.details = {
        url: !supabaseUrl ? 'Missing SUPABASE_URL' : 'OK',
        key: !supabaseKey ? 'Missing SUPABASE_ANON_KEY' : 'OK'
    };
    console.error('Configuration Error:', error.details);
    throw error;
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

            // Create user in Supabase
            const { error } = await supabase
                .from('waitlist_users')
                .insert([
                    {
                        full_name: name,
                        email: email,
                        signed_up_at: new Date().toISOString()
                    }
                ])

            if (error) {
                if (error.code === '23505') { // Unique violation
                    throw new Error('This email is already registered.')
                }
                throw error
            }

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
