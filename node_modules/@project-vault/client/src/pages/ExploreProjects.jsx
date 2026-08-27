import React, { useState, useEffect, useMemo } from 'react';
import { PublicHeader } from '../components/navigation/PublicHeader';
import { PublicFooter } from '../components/navigation/PublicFooter';
import { listGlobalProjects } from '../api/projects';
import { CATEGORIES_CONFIG } from '../utils/constants';
import { ViewProjectModal } from '../components/dashboard/ViewProjectModal';

export function ExploreProjects({ onNavigate, user }) {
  const [projects, setProjects] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSubCategory, setSelectedSubCategory] = useState('All');
  const [loading, setLoading] = useState(false);
  const [selectedViewProject, setSelectedViewProject] = useState(null);

  // Pagination state (6 projects per page)
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const ITEMS_PER_PAGE = 6;

  const availableSubCategories = useMemo(() => {
    if (selectedCategory !== 'All' && CATEGORIES_CONFIG[selectedCategory]) {
      return CATEGORIES_CONFIG[selectedCategory];
    }
    const allSubs = new Set();
    Object.values(CATEGORIES_CONFIG).forEach((subs) => subs.forEach((s) => allSubs.add(s)));
    return Array.from(allSubs);
  }, [selectedCategory]);

  useEffect(() => {
    setPage(1);
  }, [searchQuery, selectedCategory, selectedSubCategory]);

  useEffect(() => {
    let isMounted = true;
    const fetchGlobal = async () => {
      setLoading(true);
      try {
        const res = await listGlobalProjects({
          q: searchQuery,
          category: selectedCategory,
          subCategory: selectedSubCategory,
          page,
          limit: ITEMS_PER_PAGE,
        });

        if (isMounted && res.projects) {
          setProjects(res.projects);
          setTotalCount(res.total || res.projects.length);
          setTotalPages(res.totalPages || Math.ceil((res.total || res.projects.length) / ITEMS_PER_PAGE) || 1);
        }
      } catch (err) {
        if (isMounted) setProjects([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    const timer = setTimeout(fetchGlobal, 300);
    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [searchQuery, selectedCategory, selectedSubCategory, page]);

  return (
    <div className="app-root">
      <PublicHeader onNavigate={onNavigate} user={user} />

      <section className="shell section" style={{ paddingTop: 40, paddingBottom: 60 }}>
        <div style={{ marginBottom: 24 }}>
          <span className="pv-badge pv-badge--emerald" style={{ marginBottom: 8 }}>
            <span className="pv-indicator-dot pv-indicator-dot--active" /> GLOBAL DIRECTORY
          </span>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 900, margin: '4px 0 8px' }}>
            Explore Verified Engineering Work
          </h1>
          <p style={{ color: '#64748b', fontSize: '1.0625rem', margin: 0 }}>
            Browse verified containerized repositories and student research projects from university labs ({totalCount} Projects Total, 6 per page).
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="dash-filter-bar" style={{ marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
          <div className="dash-search-input-wrap" style={{ flex: 1, minWidth: 260 }}>
            <svg className="dash-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              type="text"
              placeholder="Search by project name, tech stack, author name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="dash-search-input"
            />
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setSelectedSubCategory('All');
            }}
            className="dash-filter-select"
          >
            <option value="All">All Categories</option>
            <option value="Technology">Technology</option>
            <option value="Medical">Medical</option>
            <option value="Real Estate">Real Estate</option>
          </select>

          <select
            value={selectedSubCategory}
            onChange={(e) => setSelectedSubCategory(e.target.value)}
            className="dash-filter-select"
          >
            <option value="All">All Sub-Categories</option>
            {availableSubCategories.map((sub) => (
              <option key={sub} value={sub}>{sub}</option>
            ))}
          </select>

          {(searchQuery || selectedCategory !== 'All' || selectedSubCategory !== 'All') && (
            <button
              className="dash-btn-ghost btn-sm"
              onClick={() => { setSearchQuery(''); setSelectedCategory('All'); setSelectedSubCategory('All'); setPage(1); }}
            >
              Clear ✕
            </button>
          )}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#64748b' }}>
            <div style={{ fontSize: 28, marginBottom: 12 }}>⚡</div>
            <p style={{ margin: 0, fontWeight: 700 }}>Querying Project Vault Database...</p>
          </div>
        ) : projects.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#64748b', background: '#f8fafc', borderRadius: 14 }}>
            <div style={{ fontSize: 36, marginBottom: 10 }}>🔍</div>
            <h3 style={{ margin: '0 0 6px', color: '#0f172a' }}>No Projects Found</h3>
            <p style={{ margin: 0 }}>Try adjusting your search criteria or category filter.</p>
          </div>
        ) : (
          <>
            <div className="dash-projects-grid">
              {projects.map((proj) => {
                const authorName = proj.ownerName || proj.author || 'Verified Builder';
                const initial = authorName.charAt(0).toUpperCase();

                return (
                  <div key={proj.id || proj._id} className="dash-project-card">
                    <div
                      className="dash-proj-thumb"
                      style={{ backgroundImage: `url(${proj.thumbnail || proj.thumbnailUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&q=80'})` }}
                    >
                      <span className="dash-proj-cat">{proj.category}</span>
                    </div>

                    <div className="dash-proj-body">
                      <h4 className="dash-proj-title">{proj.title}</h4>
                      <p className="dash-proj-desc">{proj.shortDesc || proj.description}</p>
                      {proj.subCategory && (
                        <div style={{ fontSize: '0.75rem', color: '#2563eb', fontWeight: 600, marginTop: 4 }}>
                          Tag: {proj.subCategory}
                        </div>
                      )}

                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 10, paddingTop: 10, borderTop: '1px solid #f1f5f9' }}>
                        <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.8125rem' }}>
                          {initial}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
                          <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {authorName}
                          </span>
                          <span style={{ fontSize: '0.6875rem', color: '#64748b' }}>
                            {proj.faculty || 'Verified Student Engineer'}
                          </span>
                        </div>
                      </div>

                      <div className="dash-proj-footer" style={{ marginTop: 12 }}>
                        <span className="dash-proj-score">★ {proj.score || proj.healthScore || 96}/100</span>
                        <button className="dash-btn-view" onClick={() => setSelectedViewProject(proj)}>
                          View Project →
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination Bar (6 projects per page) */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 32, paddingTop: 20, borderTop: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: 600 }}>
                Showing Page {page} of {totalPages} ({totalCount} Projects)
              </span>

              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <button
                  className="dash-btn-ghost btn-sm"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  style={{ opacity: page <= 1 ? 0.5 : 1, cursor: page <= 1 ? 'not-allowed' : 'pointer' }}
                >
                  ← Previous
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    className={`dash-btn-ghost btn-sm ${page === pageNum ? 'active' : ''}`}
                    style={{
                      minWidth: 36,
                      fontWeight: page === pageNum ? 800 : 500,
                      background: page === pageNum ? '#2563eb' : '#ffffff',
                      color: page === pageNum ? '#ffffff' : '#0f172a',
                      borderColor: page === pageNum ? '#2563eb' : '#cbd5e1',
                    }}
                    onClick={() => setPage(pageNum)}
                  >
                    {pageNum}
                  </button>
                ))}

                <button
                  className="dash-btn-ghost btn-sm"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  style={{ opacity: page >= totalPages ? 0.5 : 1, cursor: page >= totalPages ? 'not-allowed' : 'pointer' }}
                >
                  Next →
                </button>
              </div>
            </div>
          </>
        )}
      </section>

      {selectedViewProject && (
        <ViewProjectModal project={selectedViewProject} onClose={() => setSelectedViewProject(null)} />
      )}

      <PublicFooter onNavigate={onNavigate} />
    </div>
  );
}
