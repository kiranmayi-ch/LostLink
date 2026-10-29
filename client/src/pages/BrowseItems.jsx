import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, RotateCcw, SlidersHorizontal, MapPin, Calendar, Tag } from 'lucide-react';
import api from '../services/api.js';
import ItemCard from '../components/ItemCard.jsx';
import Pagination from '../components/Pagination.jsx';
import LoadingSpinner from '../components/LoadingSpinner.jsx';
import { CATEGORIES } from '../utils/constants.js';

export const BrowseItems = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [reports, setReports] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // Filters state initialized from URL query params
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'all');
  const [reportType, setReportType] = useState(searchParams.get('type') || 'all');
  const [status, setStatus] = useState(searchParams.get('status') || 'all');
  const [location, setLocation] = useState(searchParams.get('location') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || 'newest');
  const [page, setPage] = useState(parseInt(searchParams.get('page'), 10) || 1);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: 12,
        sort,
      };

      if (search.trim()) params.search = search.trim();
      if (category !== 'all') params.category = category;
      if (reportType !== 'all') params.reportType = reportType;
      if (status !== 'all') params.status = status;
      if (location.trim()) params.location = location.trim();

      const res = await api.get('/reports', { params });
      if (res.data.success) {
        setReports(res.data.reports || []);
        setTotal(res.data.total || 0);
        setTotalPages(res.data.totalPages || 1);
      }
    } catch (err) {
      console.error('Failed to fetch reports:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [category, reportType, status, sort, page]);

  // Synchronize URL params
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchReports();
  };

  const resetFilters = () => {
    setSearch('');
    setCategory('all');
    setReportType('all');
    setStatus('all');
    setLocation('');
    setSort('newest');
    setPage(1);
    setSearchParams({});
  };

  return (
    <div className="section" style={{ backgroundColor: 'var(--bg-main)' }}>
      <div className="container">
        {/* Page Header */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2.25rem', marginBottom: '0.5rem' }}>Browse Campus Belongings</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}>
            Search and filter registered lost and found reports across campus facilities.
          </p>
        </div>

        {/* Filter Card */}
        <div className="card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
          {/* Top Row: Search and Location Inputs */}
          <form onSubmit={handleSearchSubmit}>
            <div className="grid-3" style={{ gap: '1rem', marginBottom: '1.25rem' }}>
              <div style={{ gridColumn: 'span 2' }}>
                <div style={{ position: 'relative' }}>
                  <Search
                    size={18}
                    style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
                  />
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search by keywords, title, or description..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{ paddingLeft: '2.4rem' }}
                  />
                </div>
              </div>

              <div>
                <div style={{ position: 'relative' }}>
                  <MapPin
                    size={18}
                    style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
                  />
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Filter by location (e.g. Library, Gym)..."
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    style={{ paddingLeft: '2.4rem' }}
                  />
                </div>
              </div>
            </div>

            {/* Filter Dropdowns Row */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                {/* Report Type Selector */}
                <div style={{ display: 'inline-flex', backgroundColor: 'var(--bg-subtle)', padding: '0.25rem', borderRadius: 'var(--radius-md)' }}>
                  {['all', 'lost', 'found'].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => { setReportType(t); setPage(1); }}
                      style={{
                        padding: '0.4rem 0.85rem',
                        fontSize: '0.825rem',
                        fontWeight: 600,
                        border: 'none',
                        borderRadius: 'var(--radius-sm)',
                        cursor: 'pointer',
                        textTransform: 'capitalize',
                        backgroundColor: reportType === t ? '#ffffff' : 'transparent',
                        color: reportType === t ? 'var(--primary-600)' : 'var(--text-muted)',
                        boxShadow: reportType === t ? 'var(--shadow-sm)' : 'none',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {t === 'all' ? 'All Types' : t}
                    </button>
                  ))}
                </div>

                {/* Category Dropdown */}
                <select
                  className="form-select"
                  value={category}
                  onChange={(e) => { setCategory(e.target.value); setPage(1); }}
                  style={{ width: 'auto', minWidth: '170px' }}
                >
                  <option value="all">All Categories</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>

                {/* Status Dropdown */}
                <select
                  className="form-select"
                  value={status}
                  onChange={(e) => { setStatus(e.target.value); setPage(1); }}
                  style={{ width: 'auto', minWidth: '150px' }}
                >
                  <option value="all">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="under_claim">Under Claim</option>
                  <option value="returned">Returned</option>
                </select>

                {/* Sort Dropdown */}
                <select
                  className="form-select"
                  value={sort}
                  onChange={(e) => { setSort(e.target.value); setPage(1); }}
                  style={{ width: 'auto', minWidth: '140px' }}
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="date">Date Occurred</option>
                </select>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <button type="submit" className="btn btn-primary btn-sm">
                  Apply Filters
                </button>
                <button
                  type="button"
                  onClick={resetFilters}
                  className="btn btn-outline btn-sm"
                  title="Reset all filters"
                >
                  <RotateCcw size={14} />
                  Reset
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Results Counter */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Showing <strong>{reports.length}</strong> of <strong>{total}</strong> reports
          </p>
        </div>

        {/* Reports Grid / Loading / Empty */}
        {loading ? (
          <LoadingSpinner text="Loading campus listings..." />
        ) : reports.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">
              <Search size={32} />
            </div>
            <h3 className="empty-state-title">No matching reports found</h3>
            <p className="empty-state-text">
              Try adjusting your search terms, changing the category, or clearing filters.
            </p>
            <button type="button" onClick={resetFilters} className="btn btn-primary btn-sm">
              Clear All Filters
            </button>
          </div>
        ) : (
          <>
            <div className="grid-3" style={{ gap: '1.75rem' }}>
              {reports.map((report) => (
                <ItemCard key={report._id} report={report} />
              ))}
            </div>

            {/* Pagination */}
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={(newPage) => {
                setPage(newPage);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default BrowseItems;
