import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, PlusCircle, Lock, HelpCircle } from 'lucide-react';
import api from '../services/api.js';
import { CATEGORIES } from '../utils/constants.js';

export const ReportFoundItem = () => {
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
      setError('Please provide where you found this item.');
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
        reportType: 'found',
      });

      if (res.data.success) {
        navigate(`/items/${res.data.report._id}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit found report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="section" style={{ backgroundColor: 'var(--bg-main)' }}>
      <div className="container container-narrow">
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <span className="badge badge-found" style={{ marginBottom: '0.75rem' }}>
            Found Belonging
          </span>
          <h1 style={{ fontSize: '2.25rem', marginBottom: '0.5rem' }}>Report a Found Item</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem' }}>
            Thank you for helping reconnect a fellow student or staff member with their belongings.
          </p>
        </div>

        {/* Responsible Listing Guidance */}
        <div className="alert alert-info" style={{ marginBottom: '2rem' }}>
          <ShieldCheck size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <strong style={{ display: 'block', marginBottom: '0.2rem' }}>Responsible Listing Tips</strong>
            <p style={{ margin: 0, fontSize: '0.85rem' }}>
              Keep distinctive identifying details (such as engraved initials, lock screens, or ID card numbers) private. When owners submit claims, ask them to identify these marks to verify authentic ownership.
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
                placeholder="e.g. Black Over-Ear Headphones, Student ID Card with Blue Lanyard..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
              <p className="form-hint">Describe the object concisely.</p>
            </div>

            {/* Category and Date Found */}
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
                  Date Found <span style={{ color: 'var(--status-danger)' }}>*</span>
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
                Where Was It Found? <span style={{ color: 'var(--status-danger)' }}>*</span>
              </label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Campus Cafeteria Tray Return Table, Gym Court B Bleachers..."
                value={approximateLocation}
                onChange={(e) => setApproximateLocation(e.target.value)}
                required
              />
            </div>

            {/* Public Description */}
            <div className="form-group">
              <label className="form-label">
                Public Description <span style={{ color: 'var(--status-danger)' }}>*</span>
              </label>
              <textarea
                className="form-textarea"
                rows="4"
                placeholder="Describe color, size, and general appearance. Do NOT include private sensitive serial numbers or IDs..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              ></textarea>
              <p className="form-hint">Minimum 10 characters. This will be publicly visible to claimants.</p>
            </div>

            {/* Image URL */}
            <div className="form-group">
              <label className="form-label">Item Photograph URL (Optional)</label>
              <input
                type="url"
                className="form-control"
                placeholder="https://example.com/photo.jpg"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
              />
              <p className="form-hint">
                Important: Do not upload photos exposing sensitive ID numbers, addresses, or private photos.
              </p>
            </div>

            {/* Private Verification Notes (what finder knows and asks claimant for) */}
            <div className="form-group">
              <label className="form-label">
                Secret Ownership Verification Notes (Private to You)
              </label>
              <textarea
                className="form-textarea"
                rows="2"
                placeholder="Notes on hidden details only the true owner can verify (e.g. initials AR on headband, specific stickers)..."
                value={identifyingDetails}
                onChange={(e) => setIdentifyingDetails(e.target.value)}
              ></textarea>
              <p className="form-hint" style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Lock size={12} />
                Hidden from public listings. You will compare this against incoming claim messages.
              </p>
            </div>

            {/* Submit Button */}
            <div style={{ marginTop: '2rem' }}>
              <button
                type="submit"
                className="btn btn-primary btn-lg"
                style={{ width: '100%' }}
                disabled={loading}
              >
                {loading ? <span className="spinner"></span> : <><PlusCircle size={18} /> Publish Found Item Report</>}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReportFoundItem;
