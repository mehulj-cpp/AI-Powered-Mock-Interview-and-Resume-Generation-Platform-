import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import '../profile.css'
import { useAuth } from '../hooks/useAuth'
import { useInterview } from '../../interview/hooks/useInterview.js'

const getInitials = (name = "") => {
    const parts = name.trim().split(/\s+/).filter(Boolean)
    if (parts.length === 0) return "?"
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
    return (parts[0][0] + parts[1][0]).toUpperCase()
}

const scoreClass = (score) =>
    score >= 80 ? 'score--high' : score >= 60 ? 'score--mid' : 'score--low'

const Profile = () => {
    const { user, handleLogout } = useAuth()
    const { loading, reports, getReports } = useInterview()
    const navigate = useNavigate()
    const [ fetched, setFetched ] = useState(false)

    useEffect(() => {
        getReports().finally(() => setFetched(true))
    }, [ getReports ])

    const onLogout = async () => {
        await handleLogout()
        navigate('/login')
    }

    const avgScore = reports.length
        ? Math.round(reports.reduce((sum, r) => sum + (r.matchScore || 0), 0) / reports.length)
        : 0

    if (loading || !fetched) {
        return (
            <main className='loading-screen'>
                <h1>Loading your profile...</h1>
            </main>
        )
    }

    return (
        <div className='profile-page'>

            {/* Account header */}
            <header className='profile-header'>
                <div className='profile-id'>
                    <div className='profile-avatar'>{getInitials(user?.name || user?.username)}</div>
                    <div className='profile-id__text'>
                        <h1>Welcome, {user?.name || user?.username || 'there'}</h1>
                        <p className='profile-username'>@{user?.username}</p>
                        <p className='profile-email'>{user?.email}</p>
                    </div>
                </div>
                <div className='profile-actions'>
                    <button className='button ghost-button' onClick={() => navigate('/')}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>
                        New plan
                    </button>
                    <button className='button danger-button' onClick={onLogout}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><polyline points="16 17 21 12 16 7" /><line x1="21" y1="12" x2="9" y2="12" /></svg>
                        Log out
                    </button>
                </div>
            </header>

            {/* Stats */}
            <div className='profile-stats'>
                <div className='stat-card'>
                    <span className='stat-value'>{reports.length}</span>
                    <span className='stat-label'>Plans generated</span>
                </div>
                <div className='stat-card'>
                    <span className='stat-value'>{avgScore}%</span>
                    <span className='stat-label'>Average match score</span>
                </div>
            </div>

            {/* All reports */}
            <section className='recent-reports'>
                <h2>All interview plans</h2>
                {reports.length === 0 ? (
                    <div className='profile-empty'>
                        <p>You haven't generated any interview plans yet.</p>
                        <button className='button primary-button' onClick={() => navigate('/')}>
                            Create your first plan
                        </button>
                    </div>
                ) : (
                    <ul className='reports-list'>
                        {reports.map(report => (
                            <li key={report._id} className='report-item' onClick={() => navigate(`/interview/${report._id}`)}>
                                <h3>{report.title || 'Untitled Position'}</h3>
                                <p className='report-meta'>Generated on {new Date(report.createdAt).toLocaleDateString()}</p>
                                <p className={`match-score ${scoreClass(report.matchScore)}`}>Match Score: {report.matchScore}%</p>
                            </li>
                        ))}
                    </ul>
                )}
            </section>
        </div>
    )
}

export default Profile
