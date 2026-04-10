import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GITHUB_USERNAME } from '../data';
import CardSwap, { Card } from './reactbits/CardSwap';

const LANG_COLORS = {
  JavaScript: '#f1e05a', TypeScript: '#3178c6', Python: '#3572A5',
  HTML: '#e34c26', CSS: '#563d7c', Java: '#b07219',
  'C++': '#f34b7d', C: '#555555', Rust: '#dea584',
  Go: '#00ADD8', Shell: '#89e051',
};

const GitHubProjects = () => {
  const [repos,    setRepos]    = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);
  const [frontIdx, setFrontIdx] = useState(0);

  useEffect(() => {
    fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=6&direction=desc`)
      .then(r => { if (!r.ok) throw new Error('GitHub fetch failed'); return r.json(); })
      .then(data => {
        setRepos(data.filter(r => !r.fork).slice(0, 6));
        setLoading(false);
      })
      .catch(err => { setError(err.message); setLoading(false); });
  }, []);

  if (loading) {
    return (
      <div className="font-mono" style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--on-surface-dim)', fontSize: '0.75rem', letterSpacing: '0.2em' }}>
        <motion.span animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.5 }}>
          ▌ FETCHING_REPOS FROM GITHUB_API...
        </motion.span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="font-mono" style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--error)', fontSize: '0.75rem' }}>
        [ERROR] {error}
      </div>
    );
  }

  if (repos.length === 0) return null;

  const selected = repos[frontIdx] || repos[0];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center', minHeight: 420 }}>
      {/* Left — CardSwap */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop: 180 }}>
        <CardSwap
          width={320}
          height={220}
          cardDistance={40}
          verticalDistance={50}
          delay={5000}
          pauseOnHover={true}
          skewAmount={4}
          easing="elastic"
          onFrontChange={(idx) => setFrontIdx(idx)}
          onCardClick={(idx) => setFrontIdx(idx)}
        >
          {repos.map((repo, i) => (
            <Card key={repo.id} customClass="project-card">
              <div style={{
                padding: '1.5rem', height: '100%', display: 'flex', flexDirection: 'column',
                justifyContent: 'space-between', background: 'rgba(20,20,19,0.95)',
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                    {repo.language && (
                      <div style={{
                        width: 8, height: 8, borderRadius: '50%',
                        background: LANG_COLORS[repo.language] || 'var(--on-surface-dim)',
                      }} />
                    )}
                    <h3 className="font-headline" style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--on-surface)' }}>
                      {repo.name}
                    </h3>
                  </div>
                  <p className="font-mono" style={{ fontSize: '0.68rem', color: 'var(--on-surface-dim)', lineHeight: 1.5, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
                    {repo.description || '// No description'}
                  </p>
                </div>
                <div className="font-mono" style={{ fontSize: '0.6rem', color: 'var(--on-surface-dim)', display: 'flex', gap: 12 }}>
                  <span>⭐ {repo.stargazers_count}</span>
                  <span>⑂ {repo.forks_count}</span>
                </div>
              </div>
            </Card>
          ))}
        </CardSwap>
      </div>

      {/* Right — Info Panel */}
      <motion.div
        key={selected.id}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
        className="glass"
        style={{ padding: '2rem', borderRadius: 2 }}
      >
        <div className="font-mono" style={{ fontSize: '0.55rem', color: 'var(--on-surface-dim)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 8 }}>
          Selected_Repository
        </div>

        <h3 className="font-headline" style={{ fontSize: '1.5rem', fontWeight: 900, letterSpacing: '-0.02em', marginBottom: 12, color: 'var(--on-surface)' }}>
          {selected.name}
        </h3>

        <p style={{ fontSize: '0.9rem', color: 'var(--on-surface-dim)', lineHeight: 1.7, marginBottom: 24 }}>
          {selected.description || 'No description provided.'}
        </p>

        {/* Meta */}
        <div style={{ display: 'flex', gap: 20, marginBottom: 24, flexWrap: 'wrap' }}>
          {selected.language && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: LANG_COLORS[selected.language] || 'var(--on-surface-dim)' }} />
              <span className="font-mono" style={{ fontSize: '0.7rem', color: 'var(--on-surface-dim)' }}>{selected.language}</span>
            </div>
          )}
          <span className="font-mono" style={{ fontSize: '0.7rem', color: 'var(--on-surface-dim)' }}>⭐ {selected.stargazers_count} Stars</span>
          <span className="font-mono" style={{ fontSize: '0.7rem', color: 'var(--on-surface-dim)' }}>⑂ {selected.forks_count} Forks</span>
        </div>

        {/* Last update */}
        <div className="font-mono" style={{ fontSize: '0.6rem', color: 'var(--on-surface-dim)', marginBottom: 20 }}>
          Last updated: {new Date(selected.updated_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
        </div>

        {/* CTA */}
        <a
          href={selected.html_url}
          target="_blank"
          rel="noreferrer"
          className="font-mono"
          style={{
            display: 'inline-block', padding: '0.7rem 1.8rem',
            background: 'var(--primary)', color: 'var(--bg)',
            fontWeight: 700, fontSize: '0.6rem', letterSpacing: '0.18em',
            textTransform: 'uppercase', textDecoration: 'none', borderRadius: 2,
            transition: 'background 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'var(--secondary)'}
          onMouseLeave={e => e.currentTarget.style.background = 'var(--primary)'}
        >
          // View on GitHub ↗
        </a>
      </motion.div>
    </div>
  );
};

export default GitHubProjects;
