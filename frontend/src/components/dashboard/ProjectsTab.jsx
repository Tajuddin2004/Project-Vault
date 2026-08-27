import React, { useState, useEffect } from 'react';
import { getMyProjects } from '../../api/projects';

export function ProjectsTab({ projects, onDeleteProject, onViewProject, token, onAddProject }) {
  const [userProjects, setUserProjects] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [loading, setLoading] = useState(false);

  // Pagination state (6 projects per page)
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const ITEMS_PER_PAGE = 6;

  // Reset page to 1 on filter changes
  useEffect(() => {
    setPage(1);
  }, [searchQuery, selectedCategory, selectedStatus]);

  useEffect(() => {
    let isMounted = true;

    const fetchUserProjects = async () => {
      if (!token) {
        filterLocalProjects();
        return;
      }

      setLoading(true);
      try {
        const res = await getMyProjects(token, {
          q: searchQuery,
          category: selectedCategory,
          status: selectedStatus,
          page,
          limit: ITEMS_PER_PAGE,
        });

        if (isMounted) {
          if (res.projects) {
            setUserProjects(res.projects);
            setTotalCount(res.total || res.projects.length);
            setTotalPages(res.totalPages || Math.ceil((res.total || res.projects.length) / ITEMS_PER_PAGE) || 1);
          } else {
            filterLocalProjects();
          }
        }
      } catch (err) {
        if (isMounted) {
          filterLocalProjects();
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    const filterLocalProjects = () => {
      const filtered = projects.filter((proj) => {
        const matchesSearch =
          !searchQuery ||
          proj.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          proj.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (proj.subCategory && proj.subCategory.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesCat = selectedCategory === 'All' || proj.category === selectedCategory;
        const matchesStat = selectedStatus === 'All' || proj.status === selectedStatus;
        return matchesSearch && matchesCat && matchesStat;
      });

      const totalItems = filtered.length;
      const computedPages = Math.ceil(totalItems / ITEMS_PER_PAGE) || 1;
      const startIndex = (page - 1) * ITEMS_PER_PAGE;
      const sliced = filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE);

      setUserProjects(sliced);
      setTotalCount(totalItems);
      setTotalPages(computedPages);
    };

    const timer = setTimeout(fetchUserProjects, 300);
    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [projects, token, searchQuery, selectedCategory, selectedStatus, page]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedStatus('All');
    setPage(1);
  };

  return (
    <div className="dash-content-stack">
      <div className="dash-card">
        <div className="dash-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div className="dash-eyebrow">USER PROJECTS ARCHIVE</div>
            <h2>Your Uploaded Projects ({totalCount} Total)</h2>
          </div>
          {onAddProject && (
            <button className="dash-btn-primary" onClick={onAddProject}>
              <span>+ Add New Project</span>
            </button>
          )}
        </div>

        {/* Search & Filter Bar */}
        <div className="dash-filter-bar">
          <div className="dash-search-input-wrap">
            <svg className="dash-search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              type="text"
              placeholder="Search your associated projects by title, stack..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="dash-search-input"
            />
          </div>

          <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="dash-filter-select">
            <option value="All">All Categories</option>
            <option value="Technology">Technology</option>
            <option value="Medical">Medical</option>
            <option value="Real Estate">Real Estate</option>
          </select>

          <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} className="dash-filter-select">
            <option value="All">All Statuses</option>
            <option value="Published">Published</option>
            <option value="In Review">In Review</option>
            <option value="Pending Verification">Pending Verification</option>
          </select>

          {(searchQuery || selectedCategory !== 'All' || selectedStatus !== 'All') && (
            <button className="dash-btn-ghost btn-sm" onClick={clearFilters}>
              Clear Filters ✕
            </button>
          )}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: '#64748b' }}>
            <div style={{ fontSize: 24, marginBottom: 8 }}>⚡</div>
            <p style={{ margin: 0, fontWeight: 600 }}>Filtering your project records...</p>
          </div>
        ) : userProjects.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: '#64748b' }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>🔍</div>
            <p style={{ margin: 0, fontWeight: 600 }}>No associated projects found matching your search.</p>
          </div>
        ) : (
          <>
            <div className="dash-projects-grid">
              {userProjects.map((proj) => (
                <div key={proj.id || proj._id} className="dash-project-card">
                  <div
                    className="dash-proj-thumb"
                    style={{ backgroundImage: `url(${proj.thumbnail || proj.thumbnailUrl || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=600&q=80'})` }}
                  >
                    <span className="dash-proj-cat">{proj.category}</span>
                    <span className={`dash-proj-status ${proj.status === 'Published' || proj.status === 'published' ? 'published' : 'review'}`}>
                      {proj.status}
                    </span>
                  </div>

                  <div className="dash-proj-body">
                    <h4 className="dash-proj-title">{proj.title}</h4>
                    <p className="dash-proj-desc">{proj.description}</p>
                    {proj.zipFileName && (
                      <div style={{ fontSize: '0.75rem', color: '#2563eb', fontWeight: 600, marginTop: 4 }}>
                        📦 Attached Code: {proj.zipFileName}
                      </div>
                    )}

                    <div className="dash-proj-footer">
                      <span className="dash-proj-score">✓ Score: {proj.score || proj.healthScore || 95}/100</span>
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                        <button className="dash-btn-view" onClick={() => onViewProject(proj)}>
                          View Showcase →
                        </button>
                        <button
                          style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 700 }}
                          onClick={() => onDeleteProject(proj.id || proj._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
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
