import React, { useState, useEffect, useMemo } from 'react';
import { listGlobalProjects } from '../../api/projects';
import { PROJECTS_DATA, CATEGORIES_CONFIG } from '../../utils/constants';

export function ShowcaseTab({ onViewProject, onNavigate }) {
  const [globalProjects, setGlobalProjects] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSubCategory, setSelectedSubCategory] = useState('All');
  const [loading, setLoading] = useState(false);

  // Pagination state (6 projects per page)
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const ITEMS_PER_PAGE = 6;

  // Dynamically compute sub-categories options based on selectedCategory
  const availableSubCategories = useMemo(() => {
    if (selectedCategory !== 'All' && CATEGORIES_CONFIG[selectedCategory]) {
      return CATEGORIES_CONFIG[selectedCategory];
    }
    const allSubs = new Set();
    Object.values(CATEGORIES_CONFIG).forEach((subs) => subs.forEach((s) => allSubs.add(s)));
    return Array.from(allSubs);
  }, [selectedCategory]);

  // Reset page to 1 when filters or search query change
  useEffect(() => {
    setPage(1);
  }, [searchQuery, selectedCategory, selectedSubCategory]);

  // Fetch from backend global database with pagination (4 per page)
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

        if (isMounted) {
          if (res.projects) {
            setGlobalProjects(res.projects);
            setTotalCount(res.total || res.projects.length);
            setTotalPages(res.totalPages || Math.ceil((res.total || res.projects.length) / ITEMS_PER_PAGE) || 1);
          } else {
            // Local fallback
            filterLocalData();
          }
        }
      } catch (err) {
        if (isMounted) {
          filterLocalData();
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    const filterLocalData = () => {
      const filtered = PROJECTS_DATA.filter((proj) => {
        const matchesCat = selectedCategory === 'All' || proj.category === selectedCategory;
        const matchesSub = selectedSubCategory === 'All' || proj.subCategory === selectedSubCategory;
        const qLower = searchQuery.toLowerCase();
        const matchesQ =
          !qLower ||
          proj.title.toLowerCase().includes(qLower) ||
          proj.shortDesc?.toLowerCase().includes(qLower) ||
          proj.tech?.some((t) => t.toLowerCase().includes(qLower));
        return matchesCat && matchesSub && matchesQ;
      });

      const totalItems = filtered.length;
      const computedPages = Math.ceil(totalItems / ITEMS_PER_PAGE) || 1;
      const startIndex = (page - 1) * ITEMS_PER_PAGE;
      const sliced = filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE);

      setGlobalProjects(sliced);
      setTotalCount(totalItems);
      setTotalPages(computedPages);
    };

    const timer = setTimeout(fetchGlobal, 300);
    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [searchQuery, selectedCategory, selectedSubCategory, page]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedSubCategory('All');
    setPage(1);
  };

  return (
    <div className="dash-content-stack">
      <div className="dash-card">
        <div className="dash-card-header" style={{ flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div className="dash-eyebrow">GLOBAL DATABASE EXPLORER</div>
            <h2>Public Showcase Gallery ({totalCount} Total)</h2>
          </div>
        </div>
        <p style={{ color: '#64748b', margin: '0 0 16px' }}>
          Search all verified student engineering projects published across the entire Project Vault database (4 projects per page).
        </p>

        {/* Search Bar & Filter with Sub-Category */}
        <div className="dash-filter-bar" style={{ marginBottom: 20, flexWrap: 'wrap', gap: 10 }}>
          <div className="dash-search-input-wrap" style={{ flex: 1, minWidth: 220 }}>
            <svg className="dash-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              type="text"
              placeholder="Search global database by project name, tech stack, author..."
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
            <option value="AI/ML">AI / Machine Learning</option>
            <option value="Security">Security</option>
            <option value="Fullstack">Fullstack</option>
            <option value="DevTools">DevTools</option>
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
            <button className="dash-btn-ghost btn-sm" onClick={clearFilters}>
              Clear ✕
            </button>
          )}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: '#64748b' }}>
            <div style={{ fontSize: 24, marginBottom: 8 }}>⚡</div>
            <p style={{ margin: 0, fontWeight: 600 }}>Searching global database...</p>
          </div>
        ) : globalProjects.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: '#64748b' }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>🔍</div>
            <p style={{ margin: 0, fontWeight: 600 }}>No global projects found matching your search term or filters.</p>
          </div>
        ) : (
          <>
            <div className="dash-projects-grid">
              {globalProjects.map((proj) => {
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
                        <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.8125rem', boxShadow: '0 2px 4px rgba(37,99,235,0.2)' }}>
                          {initial}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
                          <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {authorName}
                          </span>
                          <span style={{ fontSize: '0.6875rem', color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {proj.faculty || 'Verified Student Engineer'}
                          </span>
                        </div>
                      </div>

                      <div className="dash-proj-footer" style={{ marginTop: 12 }}>
                        <span className="dash-proj-score">★ {proj.score || proj.healthScore || 96}/100</span>
                        <button className="dash-btn-view" onClick={() => onViewProject(proj)}>
                          View Project →
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination Controls Bar (4 items per page) */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 24, paddingTop: 16, borderTop: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: 600 }}>
                Showing Page {page} of {totalPages} ({totalCount} Projects Total)
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

                {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                  let pageNum = i + 1;
                  if (totalPages > 7 && page > 4) {
                    pageNum = page - 3 + i;
                    if (pageNum > totalPages) pageNum = totalPages - (6 - i);
                  }
                  if (pageNum <= 0) return null;

                  return (
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
                  );
                })}

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
      </div>
    </div>
  );
}
