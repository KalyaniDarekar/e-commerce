import { FiStar } from 'react-icons/fi'

export default function StarRating({ rating = 0, numReviews = 0, size = 'md' }) {
  const w = size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <FiStar
          key={s}
          className={`${w} ${s <= Math.round(rating) ? 'star-filled fill-yellow-400' : 'star-empty'}`}
        />
      ))}
      {numReviews > 0 && (
        <span className="text-xs text-slate-500 ml-1">({numReviews})</span>
      )}
    </div>
  )
}
