'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

type Contact = {
  id: string
  email: string
  first_name: string | null
  last_name: string | null
  phone: string | null
  status: string
  source: string | null
  grade_interest: string | null
  engagement_score: number
  tags: string[]
  opted_out: boolean
  created_at: string
}

type Interaction = {
  id: string
  type: string
  details: any
  occurred_at: string
}

type Note = {
  id: string
  note: string
  created_at: string
  created_by_user: { name: string }
}

export default function ContactDetail({
  contact: initialContact,
  interactions,
  notes: initialNotes,
}: {
  contact: Contact
  interactions: Interaction[]
  notes: Note[]
}) {
  const router = useRouter()
  const [contact, setContact] = useState(initialContact)
  const [notes, setNotes] = useState(initialNotes)
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [newNote, setNewNote] = useState('')
  const [editForm, setEditForm] = useState({
    first_name: contact.first_name || '',
    last_name: contact.last_name || '',
    phone: contact.phone || '',
    status: contact.status,
    grade_interest: contact.grade_interest || '',
    tags: contact.tags || [],
  })

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch(`/api/crm/contacts/${contact.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      })

      if (response.ok) {
        const data = await response.json()
        setContact(data.contact)
        setIsEditing(false)
        router.refresh()
      }
    } catch (error) {
      console.error('Failed to update contact:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newNote.trim()) return

    setLoading(true)

    try {
      const response = await fetch(`/api/crm/contacts/${contact.id}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ note: newNote }),
      })

      if (response.ok) {
        const data = await response.json()
        setNotes([data.note, ...notes])
        setNewNote('')
        router.refresh()
      }
    } catch (error) {
      console.error('Failed to add note:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'lead': return 'bg-gray-100 text-gray-800'
      case 'prospect': return 'bg-blue-100 text-blue-800'
      case 'enrolled': return 'bg-green-100 text-green-800'
      case 'alumni': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getInteractionIcon = (type: string) => {
    switch (type) {
      case 'form_submission': return '📝'
      case 'tour_booking': return '🏫'
      case 'event_registration': return '🎟️'
      case 'email_open': return '📧'
      case 'page_visit': return '👁️'
      default: return '•'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/admin/crm" className="text-blue-600 hover:underline mb-2 inline-block">
            ← Back to Contacts
          </Link>
          <h1 className="text-3xl font-bold">
            {contact.first_name || contact.last_name
              ? `${contact.first_name || ''} ${contact.last_name || ''}`.trim()
              : contact.email}
          </h1>
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Edit Contact
          </button>
        )}
      </div>

      {/* Contact Information */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
        
        {isEditing ? (
          <form onSubmit={handleUpdate} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  value={editForm.first_name}
                  onChange={(e) => setEditForm({ ...editForm, first_name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  value={editForm.last_name}
                  onChange={(e) => setEditForm({ ...editForm, last_name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  value={editForm.phone}
                  onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={editForm.status}
                  onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="lead">Lead</option>
                  <option value="prospect">Prospect</option>
                  <option value="enrolled">Enrolled</option>
                  <option value="alumni">Alumni</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Grade Interest
                </label>
                <input
                  type="text"
                  value={editForm.grade_interest}
                  onChange={(e) => setEditForm({ ...editForm, grade_interest: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-6 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-3">
            <div>
              <span className="text-sm font-medium text-gray-500">Email:</span>
              <p className="text-gray-900">{contact.email}</p>
            </div>
            {contact.phone && (
              <div>
                <span className="text-sm font-medium text-gray-500">Phone:</span>
                <p className="text-gray-900">{contact.phone}</p>
              </div>
            )}
            <div>
              <span className="text-sm font-medium text-gray-500">Status:</span>
              <div className="mt-1">
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(contact.status)}`}>
                  {contact.status}
                </span>
              </div>
            </div>
            {contact.source && (
              <div>
                <span className="text-sm font-medium text-gray-500">Source:</span>
                <p className="text-gray-900">{contact.source}</p>
              </div>
            )}
            {contact.grade_interest && (
              <div>
                <span className="text-sm font-medium text-gray-500">Grade Interest:</span>
                <p className="text-gray-900">{contact.grade_interest}</p>
              </div>
            )}
            <div>
              <span className="text-sm font-medium text-gray-500">Engagement Score:</span>
              <p className="text-gray-900">{contact.engagement_score || 0}</p>
            </div>
            {contact.tags && contact.tags.length > 0 && (
              <div>
                <span className="text-sm font-medium text-gray-500">Tags:</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {contact.tags.map((tag, i) => (
                    <span key={i} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Interaction Timeline */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4">Interaction History</h2>
        {interactions.length === 0 ? (
          <p className="text-gray-500">No interactions recorded</p>
        ) : (
          <div className="space-y-4">
            {interactions.map((interaction) => (
              <div key={interaction.id} className="border-l-2 border-gray-200 pl-4">
                <div className="flex items-start gap-2">
                  <span className="text-xl">{getInteractionIcon(interaction.type)}</span>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">
                      {interaction.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(interaction.occurred_at).toLocaleString()}
                    </p>
                    {interaction.details && (
                      <pre className="text-xs text-gray-600 mt-1 bg-gray-50 p-2 rounded">
                        {JSON.stringify(interaction.details, null, 2)}
                      </pre>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Notes */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4">Notes</h2>
        
        <form onSubmit={handleAddNote} className="mb-6">
          <textarea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Add a note..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md mb-2"
            rows={3}
          />
          <button
            type="submit"
            disabled={loading || !newNote.trim()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            Add Note
          </button>
        </form>

        {notes.length === 0 ? (
          <p className="text-gray-500">No notes yet</p>
        ) : (
          <div className="space-y-4">
            {notes.map((note) => (
              <div key={note.id} className="border-l-2 border-blue-200 pl-4">
                <p className="text-gray-900">{note.note}</p>
                <p className="text-sm text-gray-500 mt-1">
                  {note.created_by_user.name} • {new Date(note.created_at).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
