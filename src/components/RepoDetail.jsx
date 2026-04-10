import React from 'react';
import { motion } from 'framer-motion';

/**
 * RepoDetail — modal for GitHub repos fetched live.
 * Accepts a raw GitHub repo object as `repo` prop.
 */
const RepoDetail = ({ repo, onClose }) => {
  if (!repo) return null;

  const lastPushed = repo.pushed_at
    ? new Date(repo.pushed_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })
    : 'Unknown';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        background: 'rgba(14,14,14,0.95)',
        backdropFilter: 'blur(8px)',
        overflowY: 'auto',
        padding: '6rem 3rem 4rem',
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
        style={{ maxWidth: 860, margin: '0 auto' }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="font-mono"
          style={{
            position: 'fixed', top: '2rem', right: '3rem',
            background: 'none', border: '1px solid var(--outline)',
            color: 'var(--on-surface-dim)', fontSize: '0.65rem',
            letterSpacing: '0.15em', padding: '0.5rem 1rem',
            cursor: 'pointer', textTransform: 'uppercase', transition: 'all 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.color = 'var(--primary)'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--outline)'; e.currentTarget.style.color = 'var(--on-surface-dim)'; }}
        >
          ✕ Close
        </button>

        {/* Breadcrumb */}
        <div className="font-mono" style={{ fontSize: '0.6rem', color: 'var(--on-surface-dim)', letterSpacing: '0.15em', marginBottom: 36 }}>
          // REPO: {repo.full_name}
        </div>

        {/* Title + Buttons */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 48, flexWrap: 'wrap', gap: 20 }}>
          <h1 className="font-headline glow-primary"
            style={{ fontSize: 'clamp(2.5rem,6vw,4.5rem)', fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 0.95, color: 'var(--primary)' }}>
            {repo.name}
          </h1>
          <div style={{ display: 'flex', gap: 12 }}>
            <a
              href={repo.html_url}
              target="_blank"
              rel="noreferrer"
              className="font-mono"
              style={{
                padding: '0.75rem 1.5rem', background: 'var(--primary)', color: 'var(--bg)',
                fontWeight: 700, fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase',
                textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 8,
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '0.9rem' }}>code</span>
              View on GitHub
            </a>
            {repo.homepage && (
              <a
                href={repo.homepage}
                target="_blank"
                rel="noreferrer"
                className="font-mono"
                style={{
                  padding: '0.75rem 1.5rem', border: '1px solid var(--outline)',
                  color: 'var(--on-surface-dim)', fontSize: '0.65rem', letterSpacing: '0.15em',
                  textTransform: 'uppercase', textDecoration: 'none',
                  display: 'inline-flex', alignItems: 'center', gap: 8,
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '0.9rem' }}>open_in_new</span>
                Live Demo
              </a>
            )}
          </div>
        </div>

        {/* Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 40, alignItems: 'start' }}>
          {/* Left */}
          <div>
            <h2 className="font-mono" style={{ fontSize: '0.65rem', color: 'var(--secondary)', letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: 16 }}>
              Description
            </h2>
            <p style={{ color: 'var(--on-surface-dim)', lineHeight: 1.8, fontSize: '0.95rem', marginBottom: 32 }}>
              {repo.description || 'No description provided for this repository.'}
            </p>

            {/* Topics */}
            {repo.topics && repo.topics.length > 0 && (
              <>
                <h2 className="font-mono" style={{ fontSize: '0.65rem', color: 'var(--secondary)', letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: 12 }}>
                  Topics
                </h2>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {repo.topics.map(t => (
                    <span key={t} className="font-mono"
                      style={{ padding: '0.3rem 0.75rem', border: '1px solid var(--outline)', fontSize: '0.65rem', color: 'var(--on-surface-dim)', borderRadius: 2 }}>
                      {t}
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Right — Stats */}
          <div className="glass" style={{ padding: '1.75rem', borderRadius: 2 }}>
            <div className="font-mono" style={{ fontSize: '0.6rem', color: 'var(--on-surface-dim)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 16 }}>
              Stats
            </div>
            {[
              { label: 'Language',    value: repo.language || 'N/A'     },
              { label: 'Stars',       value: `⭐ ${repo.stargazers_count}`  },
              { label: 'Forks',       value: `⑂ ${repo.forks_count}`       },
              { label: 'Open Issues', value: repo.open_issues_count        },
              { label: 'Last Push',   value: lastPushed                   },
              { label: 'Visibility',  value: repo.visibility?.toUpperCase() || 'PUBLIC' },
            ].map(({ label, value }) => (
              <div key={label} style={{ marginBottom: 14 }}>
                <div style={{ fontSize: '0.65rem', color: 'var(--on-surface-dim)' }}>{label}</div>
                <div className="font-mono" style={{ fontSize: '0.8rem', color: 'var(--primary)', marginTop: 2 }}>{value}</div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default RepoDetail;
