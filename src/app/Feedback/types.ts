export type FeedbackProps = {
  kind: 'loading' | 'empty' | 'error'
  query: string
  error: string | null
  onRetry: () => void
}
