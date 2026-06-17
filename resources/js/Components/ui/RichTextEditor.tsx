import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import { useEffect } from 'react'

interface RichTextEditorProps {
    value: string
    onChange: (value: string) => void
    placeholder?: string
}

function ToolbarButton({
    onClick,
    active,
    children,
    title,
}: {
    onClick: () => void
    active?: boolean
    children: React.ReactNode
    title: string
}) {
    return (
        <button
            type="button"
            title={title}
            onMouseDown={(e) => {
                e.preventDefault()
                onClick()
            }}
            className={[
                'px-2.5 py-1.5 rounded text-sm font-medium font-sans transition-colors',
                active
                    ? 'bg-brand-400 text-white'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
            ].join(' ')}
        >
            {children}
        </button>
    )
}

export function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Link.configure({ openOnClick: false }),
        ],
        content: value,
        editorProps: {
            attributes: {
                class: 'prose max-w-none min-h-[280px] px-4 py-3 focus:outline-none text-gray-900 font-sans',
            },
        },
        onUpdate({ editor: ed }) {
            onChange(ed.getHTML())
        },
    })

    useEffect(() => {
        if (editor && value !== editor.getHTML()) {
            editor.commands.setContent(value)
        }
    }, [value, editor])

    if (!editor) {
        return null
    }

    const setLink = () => {
        const previousUrl = editor.getAttributes('link').href as string | undefined
        const url = window.prompt('Enter URL', previousUrl ?? '')
        if (url === null) {
            return
        }
        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run()
            return
        }
        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
    }

    return (
        <div className="input p-0 overflow-hidden">
            {/* Toolbar */}
            <div className="flex flex-wrap gap-0.5 border-b border-gray-300 bg-gray-50 px-2 py-1.5">
                <ToolbarButton
                    title="Bold"
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    active={editor.isActive('bold')}
                >
                    <strong>B</strong>
                </ToolbarButton>
                <ToolbarButton
                    title="Italic"
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    active={editor.isActive('italic')}
                >
                    <em>I</em>
                </ToolbarButton>
                <div className="mx-1 w-px self-stretch bg-gray-300" />
                <ToolbarButton
                    title="Heading 2"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                    active={editor.isActive('heading', { level: 2 })}
                >
                    H2
                </ToolbarButton>
                <ToolbarButton
                    title="Heading 3"
                    onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                    active={editor.isActive('heading', { level: 3 })}
                >
                    H3
                </ToolbarButton>
                <div className="mx-1 w-px self-stretch bg-gray-300" />
                <ToolbarButton
                    title="Bullet list"
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    active={editor.isActive('bulletList')}
                >
                    • List
                </ToolbarButton>
                <ToolbarButton
                    title="Ordered list"
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    active={editor.isActive('orderedList')}
                >
                    1. List
                </ToolbarButton>
                <div className="mx-1 w-px self-stretch bg-gray-300" />
                <ToolbarButton
                    title="Link"
                    onClick={setLink}
                    active={editor.isActive('link')}
                >
                    Link
                </ToolbarButton>
                <ToolbarButton
                    title="Blockquote"
                    onClick={() => editor.chain().focus().toggleBlockquote().run()}
                    active={editor.isActive('blockquote')}
                >
                    ❝
                </ToolbarButton>
                <ToolbarButton
                    title="Horizontal rule"
                    onClick={() => editor.chain().focus().setHorizontalRule().run()}
                    active={false}
                >
                    —
                </ToolbarButton>
            </div>

            {/* Editor area */}
            <EditorContent
                editor={editor}
                placeholder={placeholder}
            />
        </div>
    )
}
