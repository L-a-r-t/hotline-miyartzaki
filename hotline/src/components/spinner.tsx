export default function Spinner({
  big,
  className,
}: {
  big?: boolean
  className?: string
}) {
  return (
    <div
      className={`inline border-t-transparent animate-spin rounded-full ${
        big ? "h-12 w-12 border-4" : "h-4 w-4 border-2"
      } ${className ?? ""}`}
    />
  )
}
