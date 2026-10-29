import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Lock, PlusCircle, CheckCircle2 } from 'lucide-react';
import api from '../services/api.js';
import { CATEGORIES } from '../utils/constants.js';

export const ReportLostItem = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Electronics');
  const [description, setDescription] = useState('');
  const [dateOccurred, setDateOccurred] = useState(new Date().toISOString().split('T')[0]);
  const [approximateLocation, setApproximateLocation] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [identifyingDetails, setIdentifyingDetails] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (title.trim().length < 3) {
      setError('Item title must be at least 3 characters long.');
      return;
    }

    if (description.trim().length < 10) {
      setError('Description must be at least 10 characters long.');
      return;
    }

    if (!approximateLocation.trim()) {
      setError('Please provide the approximate location where the item was lost.');
      return;
    }

    try {
      setLoading(true);
      const res = await api.post('/reports', {
        title: title.trim(),
        category,
        description: description.trim(),
        dateOccurred,
        approximateLocation: approximateLocation.trim(),
        imageUrl: imageUrl.trim(),
        identifyingDetails: identifyingDetails.trim(),
        reportType: 'lost',
      });

      if (res.data.success) {
        navigate(`/items/${res.data.report._id}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit lost report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section" style={{ backgroundColor: 'var(--bg-main)' }}>
      <div className="container container-narrow">
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <span className="badge badge-lost" style={{ marginBottom: '0.75rem' }}>
            Missing Belonging
          </span>
          <h1 style={{ fontSize: '2.25rem', marginBottom: '0.5rem' }}>Report a Lost Item</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}>
            Provide clear details so that finders and campus staff can identify and return your belonging.
          </p>
        </div>

        {/* Privacy Callout */}
        <div className="alert alert-info" style={{ marginBottom: '2rem' }}>
          <Lock size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <strong style={{ display: 'block', marginBottom: '0.2rem' }}>Privacy & Security Note</strong>
            <p style={{ margin: 0, fontSize: '0.85rem' }}>
              Do not include private identity card numbers, banking details, or passwords in public descriptions. Use the private identifying details field below for unique marks that only you know.
            </p>
          </div>
        </div>

        {/* Form Card */}
        <div className="card" style={{ padding: '2.5rem' }}>
          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={handleSubmit}>
            {/* Title */}
            <div className="form-group">
              <label className="form-label">
                Item Title <span style={{ color: 'var(--status-danger)' }}>*</span>
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Sony WH-1000XM4 Wireless Headphones, Blue Hydro Flask..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
              <p className="form-hint">Be specific with brand, model, or color.</p>
            </div>

            {/* Category and Date Occurred */}
            <div className="grid-2" style={{ gap: '1.25rem' }}>
              <div className="form-group">
                <label className="form-label">
                  Category <span style={{ color: 'var(--status-danger)' }}>*</span>
                </label>
                <select
                  className="form-select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">
                  Date Lost <span style={{ color: 'var(--status-danger)' }}>*</span>
                </label>
                <input
                  type="date"
                  className="form-control"
                  value={dateOccurred}
                  onChange={(e) => setDateOccurred(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Approximate Location */}
            <div className="form-group">
              <label className="form-label">
                Approximate Location <span style={{ color: 'var(--status-danger)' }}>*</span>
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Central Library 2nd Floor Study Cubicles, Science Block B Lab 3..."
                value={approximateLocation}
                onChange={(e) => setApproximateLocation(e.target.value)}
                required
              />
            </div>

            {/* Detailed Description */}
            <div className="form-group">
              <label className="form-label">
                Detailed Public Description <span style={{ color: 'var(--status-danger)' }}>*</span>
              </label>
              <textarea
                className="form-textarea"
                rows="4"
                placeholder="Provide a general description of the item, condition, color, and circumstances of where it was misplaced..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              ></textarea>
              <p className="form-hint">Minimum 10 characters. This information is visible in search listings.</p>
            </div>

            {/* Image URL */}
            <div className="form-group">
              <label className="form-label">Photograph or Product Image URL (Optional)</label>
              <input
                type="url"
                className="form-control"
                placeholder="https://example.com/item-photo.jpg"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
              />
              <p className="form-hint">
                A clear image significantly improves recovery rate. Default category illustration will be used if omitted.
              </p>
            </div>

            {/* Private Identifying Details */}
            <div className="form-group">
              <label className="form-label">
                Private Identifying Details (Confidential to You)
              </label>
              <textarea
                className="form-textarea"
                rows="2"
                placeholder="Enter unique traits (e.g. engraved initials, stickers, small scratch near port) for verification..."
                value={identifyingDetails}
                onChange={(e) => setIdentifyingDetails(e.target.value)}
              ></textarea>
              <p className="form-hint" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Lock size={12} />
                Hidden from public listings. You can reference this when verifying claims.
              </p>
            </div>

            {/* Submit */}
            <div style={{ marginTop: '2rem' }}>
              <button
                type="submit"
                className="btn btn-primary btn-lg"
                style={{ width: '100%' }}
                disabled={loading}
              >
                {loading ? <span className="spinner"></span> : <><PlusCircle size={18} /> Publish Lost Item Report</>}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReportLostItem;
