interface StatusBadgeProps {
  status: 'active' | 'pending' | 'rejected' | 'verified'
  label: string
}

export function StatusBadge({ status, label }: StatusBadgeProps) {
  const styles = {
    active: 'bg-green-100 text-green-700',
    pending: 'bg-yellow-100 text-yellow-700',
    rejected: 'bg-red-100 text-red-700',
    verified: 'bg-green-100 text-green-700',
  }

  return (
    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${styles[status]}`}>
      {label}
    </span>
  )
}
