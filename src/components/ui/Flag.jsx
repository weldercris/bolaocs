import { getFlagUrl } from '@/lib/flags'

export default function Flag({ team, fallback, className = "" }) {
  const url = getFlagUrl(team)
  
  if (url) {
    return (
      <img 
        src={url} 
        alt={team} 
        className={`object-cover rounded-sm shadow-sm ${className}`}
      />
    )
  }
  
  return <span className={className}>{fallback || '🏳️'}</span>
}
