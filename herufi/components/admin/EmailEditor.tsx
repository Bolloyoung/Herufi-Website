'use client'

import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useEffect, useState } from 'react'
import { MERGE_FIELDS, MERGE_FIELD_LABELS } from '@/lib/integrations/email/merge-fields'

type Props = {
  value: string
  onChange: (html: string) => void
  /** Change this when a different document is loaded, so the editor resets its content. */
  docKey: string
  disabled?: boolean
}

const SAFE_URL = /^(https?:\/\/|mailto:)/i

function Btn({ label, active, onClick, disabled }: { label: string; active?: boolean; onClick: () => void; disabled?: boolean }) {
  return (
    <button type="button" onClick={onClick} disabled={disabled} aria-pressed={active}
      className={`rounded px-2.5 py-1.5 text-xs font-medium transition-colors disabled:opacity-40 ${active ? 'bg-forest text-cream' : 'text-charcoal hover:bg-charcoal/10'}`}>
      {label}
    </button>
  )
}

/**
 * Rich text editing for emails. It produces plain semantic HTML. The server
 * sanitises it and applies email safe styling, so formatting here is deliberately simple.
 */
export default function EmailEditor({ value, onChange, docKey, disabled }: Props) {
  const [source, setSource] = useState(false)
  const [raw, setRaw] = useState(value)

  const editor = useEditor({
    immediatelyRender: false,
    editable: !disabled,
    extensions: [
      StarterKit.configure({ heading: { levels: [2, 3] }, codeBlock: false, code: false, strike: false }),
      Link.configure({ openOnClick: false, autolink: false, HTMLAttributes: { rel: 'noopener noreferrer' } }),
      Image.configure({ inline: false, HTMLAttributes: { style: 'max-width:100%;height:auto' } }),
    ],
    content: value,
    editorProps: { attributes: { class: 'prose max-w-none min-h-[20rem] px-4 py-3 focus:outline-none', 'aria-label': 'Email body' } },
    onUpdate: ({ editor: e }) => onChange(e.getHTML()),
  })

  useEffect(() => {
    if (editor && editor.getHTML() !== value) editor.commands.setContent(value, false)
    setRaw(value)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [docKey, editor])

  useEffect(() => { editor?.setEditable(!disabled) }, [editor, disabled])

  if (!editor) return <div className="min-h-[20rem] rounded-md border border-border-soft bg-white" aria-busy />

  function setLink() {
    const prev = editor!.getAttributes('link').href as string | undefined
    const url = window.prompt('Link address (https:// or mailto:)', prev ?? 'https://')
    if (url === null) return
    if (url === '') { editor!.chain().focus().extendMarkRange('link').unsetLink().run(); return }
    if (!SAFE_URL.test(url)) { window.alert('Links must start with https://, http:// or mailto:'); return }
    editor!.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }

  function addImage() {
    const url = window.prompt('Image address. It must start with https:// and stay online.', 'https://')
    if (!url) return
    if (!/^https:\/\//i.test(url)) { window.alert('Images must be served over https://'); return }
    const alt = window.prompt('Describe the image for people who cannot see it') ?? ''
    editor!.chain().focus().setImage({ src: url, alt }).run()
  }

  function insertTag(field: string) {
    if (!field) return
    const fallback = window.prompt(`Text to use when ${MERGE_FIELD_LABELS[field as keyof typeof MERGE_FIELD_LABELS].toLowerCase()} is missing`, field.includes('name') ? 'there' : '') ?? ''
    const tag = `{{${field}${fallback.trim() ? `|${fallback.trim().replace(/[{}|]/g, '')}` : ''}}}`
    editor!.chain().focus().insertContent(tag).run()
  }

  function toggleSource() {
    if (source) { editor!.commands.setContent(raw, false); onChange(editor!.getHTML()) }
    else setRaw(editor!.getHTML())
    setSource(!source)
  }

  return (
    <div className="rounded-md border border-charcoal/20 bg-white focus-within:border-forest focus-within:ring-2 focus-within:ring-forest/20">
      <div role="toolbar" aria-label="Formatting" className="flex flex-wrap items-center gap-0.5 border-b border-border-soft px-2 py-1.5">
        <Btn label="Bold" active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()} disabled={source || disabled} />
        <Btn label="Italic" active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()} disabled={source || disabled} />
        <Btn label="Heading" active={editor.isActive('heading', { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} disabled={source || disabled} />
        <Btn label="Subheading" active={editor.isActive('heading', { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} disabled={source || disabled} />
        <Btn label="Bullets" active={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()} disabled={source || disabled} />
        <Btn label="Numbers" active={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()} disabled={source || disabled} />
        <Btn label="Quote" active={editor.isActive('blockquote')} onClick={() => editor.chain().focus().toggleBlockquote().run()} disabled={source || disabled} />
        <Btn label="Line" onClick={() => editor.chain().focus().setHorizontalRule().run()} disabled={source || disabled} />
        <Btn label="Link" active={editor.isActive('link')} onClick={setLink} disabled={source || disabled} />
        <Btn label="Image" onClick={addImage} disabled={source || disabled} />
        <Btn label="Undo" onClick={() => editor.chain().focus().undo().run()} disabled={source || disabled || !editor.can().undo()} />
        <Btn label="Redo" onClick={() => editor.chain().focus().redo().run()} disabled={source || disabled || !editor.can().redo()} />
        <span className="mx-1 h-5 w-px bg-border-soft" aria-hidden />
        <label className="sr-only" htmlFor="merge-select">Insert a merge field</label>
        <select id="merge-select" className="rounded border border-charcoal/20 bg-white px-2 py-1 text-xs" value="" disabled={source || disabled} onChange={(e) => insertTag(e.target.value)}>
          <option value="">Insert merge field</option>
          {MERGE_FIELDS.map((f) => <option key={f} value={f}>{MERGE_FIELD_LABELS[f]}</option>)}
        </select>
        <span className="flex-1" />
        <Btn label={source ? 'Visual editor' : 'HTML'} active={source} onClick={toggleSource} disabled={disabled} />
      </div>
      {source ? (
        <textarea aria-label="Email HTML source" className="block min-h-[20rem] w-full resize-y px-4 py-3 font-mono text-xs focus:outline-none" value={raw}
          onChange={(e) => { setRaw(e.target.value); onChange(e.target.value) }} spellCheck={false} />
      ) : (
        <EditorContent editor={editor} />
      )}
    </div>
  )
}
