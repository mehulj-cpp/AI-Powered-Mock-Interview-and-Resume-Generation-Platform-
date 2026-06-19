import React from 'react'
import { Link, useNavigate } from 'react-router'
import { useAuth } from '../../auth/hooks/useAuth'
import '../landing.css'

const Landing = () => {
    const { user } = useAuth()
    const navigate = useNavigate()

    const handleStart = () => {
        navigate(user ? '/dashboard' : '/register')
    }

    return (
        <main className='landing'>
            <section className='landing__hero'>
                <span className='landing__eyebrow'>Welcome to PrepWise</span>

                <h1 className='landing__title'>
                    Turn any job description into your{' '}
                    <span className='highlight'>interview edge</span>.
                </h1>

                <p className='landing__subtitle'>
                    AI-crafted questions, an honest skill-gap analysis, and a prep
                    roadmap tailored to the exact role you want — in about 30 seconds.
                </p>

                {/* Huge interactive start button */}
                <button
                    type='button'
                    className='start-btn'
                    onClick={handleStart}
                    aria-label={user ? 'Go to your dashboard' : 'Get started with PrepWise'}
                >
                    <span className='start-btn__label'>
                        {user ? 'Go to Dashboard' : 'Start Now'}
                        <svg
                            className='start-btn__arrow'
                            xmlns='http://www.w3.org/2000/svg'
                            width='28' height='28' viewBox='0 0 24 24'
                            fill='none' stroke='currentColor' strokeWidth='2.5'
                            strokeLinecap='round' strokeLinejoin='round'
                        >
                            <line x1='5' y1='12' x2='19' y2='12' />
                            <polyline points='12 5 19 12 12 19' />
                        </svg>
                    </span>
                </button>

                {!user && (
                    <p className='landing__signin'>
                        Already have an account? <Link to='/login'>Log in</Link>
                    </p>
                )}

                {/* Feature strip */}
                <ul className='landing__features'>
                    <li className='landing__feature'>
                        <span className='landing__feature-icon'>
                            <svg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'><path d='M9 11l3 3L22 4' /><path d='M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11' /></svg>
                        </span>
                        <div>
                            <h3>Targeted questions</h3>
                            <p>10 likely questions drawn from the real job spec.</p>
                        </div>
                    </li>
                    <li className='landing__feature'>
                        <span className='landing__feature-icon'>
                            <svg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'><line x1='12' y1='20' x2='12' y2='10' /><line x1='18' y1='20' x2='18' y2='4' /><line x1='6' y1='20' x2='6' y2='16' /></svg>
                        </span>
                        <div>
                            <h3>Skill-gap analysis</h3>
                            <p>See exactly where you match — and where to focus.</p>
                        </div>
                    </li>
                    <li className='landing__feature'>
                        <span className='landing__feature-icon'>
                            <svg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'><path d='M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z' /><polyline points='14 2 14 8 20 8' /></svg>
                        </span>
                        <div>
                            <h3>Tailored resume</h3>
                            <p>Export a role-matched resume as a polished PDF.</p>
                        </div>
                    </li>
                </ul>
            </section>
        </main>
    )
}

export default Landing
