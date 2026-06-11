import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GITHUB_USERNAME } from '../data';
import CardSwap, { Card } from './reactbits/CardSwap';
import RepoDetail from './RepoDetail';

const CACHE_KEY = 'gh_repos_cache';
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

const LANG_COLORS = {
  JavaScript: '#f1e05a', TypeScript: '#3178c6', Python: '#3572A5',
  HTML: '#e34c26', CSS: '#563d7c', Java: '#b07219',
  'C++': '#f34b7d', C: '#555555', Rust: '#dea584',
  Go: '#00ADD8', Shell: '#89e051',
};

const GitHubProjects = () => {
  const [repos,       setRepos]       = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState(null);
  const [fromCache,   setFromCache]   = useState(false);
  const [rateLimited, setRateLimited] = useState(false);
  const [frontIdx,    setFrontIdx]    = useState(0);
  const [selectedRepo, setSelectedRepo] = useState(null); // for RepoDetail modal

  useEffect(() => {
    /* ── 1. Check sessionStorage cache first ── */
    try {
      const raw = sessionStorage.getItem(CACHE_KEY);
      if (raw) {
        const { data, timestamp } = JSON.parse(raw);
        if (Date.now() - timestamp < CACHE_TTL && data.length > 0) {
          setRepos(data);
          setFromCache(true);
          setLoading(false);
          return; // skip API call
        }
      }
    } catch (_) { /* ignore parse errors */ }

    /* ── 2. Fetch from GitHub API ── */
    fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=6&direction=desc`)
      .then(r => {
        if (r.status === 403 || r.status === 429) {
          setRateLimited(true);
          throw new Error('rate_limit');
        }
        if (!r.ok) throw new Error('GitHub fetch failed');
        return r.json();
      })
      .then(data => {
        const filtered = data.filter(r => !r.fork).slice(0, 6);
        setRepos(filtered);
        /* ── 3. Save to sessionStorage ── */
        try {
          sessionStorage.setItem(CACHE_KEY, JSON.stringify({ data: filtered, timestamp: Date.now() }));
        } catch (_) { /* storage may be full — ignore */ }
        setLoading(false);
      })
      .catch(err => {
        if (err.message === 'rate_limit') {
          /* Try cache fallback even if expired */
          try {
            const raw = sessionStorage.getItem(CACHE_KEY);
            if (raw) {
              const { data } = JSON.parse(raw);
              if (data.length > 0) {
                setRepos(data);
                setFromCache(true);
                setLoading(false);
                return;
              }
            }
          } catch (_) { /* ignore */ }
          setError('GitHub API rate limit reached. Try again in an hour.');
        } else {
          setError(err.message);
        }
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="github-grid">
        {/* Left — Skeleton cards stacked */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', paddingTop: 180 }}>
          <div style={{ width: 320, height: 220, position: 'relative' }}>
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="skeleton-shimmer"
                style={{
                  position: 'absolute',
                  width: '100%', height: '100%',
                  top: -i * 50, left: i * 40,
                  borderRadius: 4,
                  border: '1px solid rgba(72,72,71,0.15)',
                  zIndex: 3 - i,
                  opacity: 1 - i * 0.2,
                }}
              />
            ))}
          </div>
        </div>
        {/* Right — Skeleton info panel */}
        <div style={{ padding: '2rem' }}>
          <div className="skeleton-shimmer" style={{ width: 140, height: 10, marginBottom: 16 }} />
          <div className="skeleton-shimmer" style={{ width: '70%', height: 22, marginBottom: 16 }} />
          <div className="skeleton-shimmer" style={{ width: '100%', height: 12, marginBottom: 8 }} />
          <div className="skeleton-shimmer" style={{ width: '85%', height: 12, marginBottom: 8 }} />
          <div className="skeleton-shimmer" style={{ width: '60%', height: 12, marginBottom: 24 }} />
          <div style={{ display: 'flex', gap: 12 }}>
            <div className="skeleton-shimmer" style={{ width: 80, height: 10 }} />
            <div className="skeleton-shimmer" style={{ width: 60, height: 10 }} />
            <div className="skeleton-shimmer" style={{ width: 70, height: 10 }} />
          </div>
          <div className="skeleton-shimmer" style={{ width: 160, height: 10, marginTop: 20 }} />
          <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
            <div className="skeleton-shimmer" style={{ width: 100, height: 34, borderRadius: 2 }} />
            <div className="skeleton-shimmer" style={{ width: 140, height: 34, borderRadius: 2 }} />
          </div>
        </div>
      </div>
    );
  }

  if (error && repos.length === 0) {
    return (
      <div className="font-mono" style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--error)', fontSize: '0.75rem' }}>
        [ERROR] {error}
      </div>
    );
  }

  if (repos.length === 0) return null;

  const selected = repos[frontIdx] || repos[0];

  return (
    <>
      {/* Rate limit / cache notice */}
      {(rateLimited || fromCache) && repos.length > 0 && (
        <div className="font-mono" style={{
          fontSize: '0.55rem', color: 'var(--tertiary)', letterSpacing: '0.12em',
          marginBottom: 16, opacity: 0.8,
        }}>
          {rateLimited
            ? '⚠ GitHub API rate limit reached — showing cached data'
            : '◈ Loaded from cache'}
        </div>
      )}

      <div className="github-grid">
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
            onCardClick={(idx) => { setFrontIdx(idx); setSelectedRepo(repos[idx]); }}
          >
            {repos.map((repo, i) => (
              <Card key={repo.id} customClass="project-card">
                <div style={{
                  padding: '1.5rem', height: '100%', display: 'flex', flexDirection: 'column',
                  justifyContent: 'space-between', background: 'rgba(20,20,19,0.95)',
                  cursor: 'pointer',
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

          {/* CTAs */}
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button
              onClick={() => setSelectedRepo(selected)}
              className="font-mono btn-secondary-outline"
              style={{
                padding: '0.7rem 1.4rem',
                fontSize: '0.6rem', letterSpacing: '0.18em',
                textTransform: 'uppercase', borderRadius: 2,
                cursor: 'pointer',
              }}
            >
              // Details
            </button>
            <a
              href={selected.html_url}
              target="_blank"
              rel="noreferrer"
              className="font-mono btn-primary"
              style={{
                display: 'inline-block', padding: '0.7rem 1.8rem',
                fontWeight: 700, fontSize: '0.6rem', letterSpacing: '0.18em',
                textTransform: 'uppercase', textDecoration: 'none', borderRadius: 2,
              }}
            >
              // View on GitHub ↗
            </a>
          </div>
        </motion.div>
      </div>

      {/* RepoDetail Modal */}
      {selectedRepo && (
        <RepoDetail repo={selectedRepo} onClose={() => setSelectedRepo(null)} />
      )}
    </>
  );
};

export default GitHubProjects;
