import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, Tag, ArrowRight } from 'lucide-react';
import StatusBadge from './StatusBadge.jsx';

const DEFAULT_IMAGES = {
  Electronics: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80',
  'ID Cards and Documents': 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=500&auto=format&fit=crop&q=80',
  'Bags and Backpacks': 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&auto=format&fit=crop&q=80',
  'Wallets and Purses': 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=500&auto=format&fit=crop&q=80',
  Keys: 'https://images.unsplash.com/photo-1582139329536-e7284fece509?w=500&auto=format&fit=crop&q=80',
  'Books and Stationery': 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&auto=format&fit=crop&q=80',
  Clothing: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=500&auto=format&fit=crop&q=80',
  'Water Bottles': 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&auto=format&fit=crop&q=80',
  'Jewellery and Accessories': 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&auto=format&fit=crop&q=80',
  Other: 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=500&auto=format&fit=crop&q=80',
};

export const ItemCard = ({ report }) => {
  const imageSource = report.imageUrl || DEFAULT_IMAGES[report.category] || DEFAULT_IMAGES.Other;
  const formattedDate = new Date(report.dateOccurred).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="card card-hover" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Thumbnail with overlay badges */}
      <div style={{ position: 'relative', height: '200px', backgroundColor: '#e2e8f0', overflow: 'hidden' }}>
        <img
          src={imageSource}
          alt={report.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          loading="lazy"
          onError={(e) => {
            e.target.src = DEFAULT_IMAGES[report.category] || DEFAULT_IMAGES.Other;
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '0.75rem',
            left: '0.75rem',
            display: 'flex',
            gap: '0.4rem',
            flexWrap: 'wrap',
          }}
        >
          <StatusBadge type="reportType" status={report.reportType} />
          <StatusBadge type="itemStatus" status={report.status} />
        </div>
      </div>

      {/* Card Content */}
      <div className="card-body" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem' }}>
          <span className="badge badge-category" style={{ fontSize: '0.7rem' }}>
            <Tag size={10} />
            {report.category}
          </span>
        </div>

        <h3
          style={{
            fontSize: '1.15rem',
            marginBottom: '0.5rem',
            color: 'var(--primary-900)',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {report.title}
        </h3>

        <p
          style={{
            fontSize: '0.875rem',
            color: 'var(--text-muted)',
            marginBottom: '1rem',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            flex: 1,
          }}
        >
          {report.description}
        </p>

        {/* Location & Date Metadata */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', marginBottom: '1.25rem', fontSize: '0.825rem', color: 'var(--text-muted)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <MapPin size={14} style={{ color: 'var(--primary-500)', flexShrink: 0 }} />
            <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {report.approximateLocation}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Calendar size={14} style={{ color: 'var(--primary-500)', flexShrink: 0 }} />
            <span>{report.reportType === 'lost' ? 'Lost on' : 'Found on'} {formattedDate}</span>
          </div>
        </div>

        {/* Action Button */}
        <Link
          to={`/items/${report._id}`}
          className="btn btn-outline btn-sm"
          style={{ width: '100%', justifyContent: 'space-between', marginTop: 'auto' }}
        >
          <span>View Details</span>
          <ArrowRight size={14} />
        </Link>
      </div>
    </div>
  );
};

export default ItemCard;
