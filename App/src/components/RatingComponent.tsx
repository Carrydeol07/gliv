import React from 'react';

interface RatingComponentProps {
  rating: number | null;
  onEditRating: (newRating: number | null) => void;
}

export const RatingComponent: React.FC<RatingComponentProps> = ({ rating, onEditRating }) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    if (val === '') {
      onEditRating(null);
    } else {
      onEditRating(parseFloat(val));
    }
  };

  const options = [];
  for (let i = 1; i <= 10; i += 0.5) {
    options.push(i);
  }

  return (
    <div className="rating-component">
      <label htmlFor="rating-select">Rating: </label>
      <select id="rating-select" value={rating === null ? '' : rating} onChange={handleChange}>
        <option value="">None</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt.toFixed(1)}
          </option>
        ))}
      </select>
    </div>
  );
};
