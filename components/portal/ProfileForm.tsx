'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ProfileForm({ user, family, students }: any) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [showStudentForm, setShowStudentForm] = useState(false)
  const [editingStudent, setEditingStudent] = useState<any>(null)
  const [studentFormData, setStudentFormData] = useState({
    name: '',
    dob: '',
    grade: '',
  })
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    address: family?.address || '',
    phone: family?.phone || '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess(false)
    setLoading(true)

    try {
      // Update user name
      const userResponse = await fetch('/api/profile/user', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: formData.name }),
      })

      if (!userResponse.ok) throw new Error('Failed to update profile')

      // Update family info
      if (family) {
        const familyResponse = await fetch('/api/profile/family', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            address: formData.address,
            phone: formData.phone,
          }),
        })

        if (!familyResponse.ok) throw new Error('Failed to update family info')
      }

      setSuccess(true)
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const handleAddStudent = () => {
    setEditingStudent(null)
    setStudentFormData({ name: '', dob: '', grade: '' })
    setShowStudentForm(true)
  }

  const handleEditStudent = (student: any) => {
    setEditingStudent(student)
    setStudentFormData({
      name: student.name,
      dob: student.dob,
      grade: student.grade || '',
    })
    setShowStudentForm(true)
  }

  const handleStudentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const url = editingStudent
        ? `/api/profile/students/${editingStudent.id}`
        : '/api/profile/students'
      const method = editingStudent ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(studentFormData),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to save student')
      }

      setShowStudentForm(false)
      setStudentFormData({ name: '', dob: '', grade: '' })
      setEditingStudent(null)
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'Failed to save student')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteStudent = async (studentId: string) => {
    if (!confirm('Are you sure you want to remove this student?')) return

    setError('')
    setLoading(true)

    try {
      const response = await fetch(`/api/profile/students/${studentId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to delete student')
      }

      router.refresh()
    } catch (err: any) {
      setError(err.message || 'Failed to delete student')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-6">Personal Information</h2>
        
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-800">{error}</p>
          </div>
        )}
        
        {success && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md">
            <p className="text-green-800">Profile updated successfully!</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={user?.email || ''}
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-500"
            />
            <p className="mt-1 text-sm text-gray-500">Email cannot be changed</p>
          </div>
          
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
              Address
            </label>
            <input
              type="text"
              id="address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
              Phone
            </label>
            <input
              type="tel"
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-6">Students</h2>
        
        {students && students.length > 0 ? (
          <div className="space-y-4">
            {students.map((student: any) => (
              <div key={student.id} className="border border-gray-200 rounded-md p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg mb-2">{student.name}</h3>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>
                        <span className="font-medium">Date of Birth:</span>{' '}
                        {new Date(student.dob).toLocaleDateString()}
                      </p>
                      {student.grade && (
                        <p>
                          <span className="font-medium">Grade:</span> {student.grade}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditStudent(student)}
                      className="px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded hover:bg-blue-100"
                      disabled={loading}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteStudent(student.id)}
                      className="px-3 py-1 text-sm bg-red-50 text-red-600 rounded hover:bg-red-100"
                      disabled={loading}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No students added yet</p>
        )}
        
        {!showStudentForm && (
          <button
            onClick={handleAddStudent}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            disabled={loading}
          >
            Add Student
          </button>
        )}
        
        {showStudentForm && (
          <form onSubmit={handleStudentSubmit} className="mt-6 border-t pt-6 space-y-4">
            <h3 className="font-semibold text-lg">
              {editingStudent ? 'Edit Student' : 'Add New Student'}
            </h3>
            
            <div>
              <label htmlFor="student-name" className="block text-sm font-medium text-gray-700 mb-2">
                Student Name *
              </label>
              <input
                type="text"
                id="student-name"
                value={studentFormData.name}
                onChange={(e) => setStudentFormData({ ...studentFormData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <label htmlFor="student-dob" className="block text-sm font-medium text-gray-700 mb-2">
                Date of Birth *
              </label>
              <input
                type="date"
                id="student-dob"
                value={studentFormData.dob}
                onChange={(e) => setStudentFormData({ ...studentFormData, dob: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div>
              <label htmlFor="student-grade" className="block text-sm font-medium text-gray-700 mb-2">
                Grade
              </label>
              <input
                type="text"
                id="student-grade"
                value={studentFormData.grade}
                onChange={(e) => setStudentFormData({ ...studentFormData, grade: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="e.g., Kindergarten, 1st Grade"
              />
            </div>
            
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Saving...' : editingStudent ? 'Update Student' : 'Add Student'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowStudentForm(false)
                  setEditingStudent(null)
                  setStudentFormData({ name: '', dob: '', grade: '' })
                }}
                className="px-6 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
