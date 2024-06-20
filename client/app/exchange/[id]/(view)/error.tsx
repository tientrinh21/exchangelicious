'use client'

import { UniInfoError } from '@/components/uni-info'

export default function UniErrorPage({ error }: { error: Error }) {
  return <UniInfoError error={error} />
}
