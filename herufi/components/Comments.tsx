'use client'

import { useEffect, useRef } from 'react'

export default function Comments() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current || ref.current.hasChildNodes()) return

    const script = document.createElement('script')
    script.src = 'https://giscus.app/client.js'
    script.setAttribute('data-repo', 'herufi-org/herufi')
    script.setAttribute('data-repo-id', 'REPO_ID_PLACEHOLDER')
    script.setAttribute('data-category', 'Research Comments')
    script.setAttribute('data-category-id', 'CATEGORY_ID_PLACEHOLDER')
    script.setAttribute('data-mapping', 'pathname')
    script.setAttribute('data-strict', '0')
    script.setAttribute('data-reactions-enabled', '1')
    script.setAttribute('data-emit-metadata', '0')
    script.setAttribute('data-input-position', 'top')
    script.setAttribute('data-theme', 'light')
    script.setAttribute('data-lang', 'en')
    script.setAttribute('crossorigin', 'anonymous')
    script.async = true

    ref.current.appendChild(script)
  }, [])

  return (
    <div className="border-t border-border-soft pt-10">
      <h3 className="text-lg font-semibold text-charcoal mb-6">Discussion</h3>
      <div className="text-sm text-charcoal/50 mb-4 bg-gray-soft rounded-lg px-4 py-3 border border-border-soft">
        Comments are powered by GitHub Discussions. Sign in with your GitHub account to participate.
      </div>
      <div ref={ref} />
    </div>
  )
}
