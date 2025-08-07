
import React, { useState, useEffect } from 'react'
import { User, LogOut, MessageSquare, Send, HelpCircle, Camera, Edit, Trash2, Eye, Lock, Globe, Reply, X, Check } from 'lucide-react'
import { getToken } from '../utils/auth'
import axios from 'axios'

const Home = () => {
  // Auth utility functions
  const removeToken = () => {
    localStorage.removeItem('token')
  }
  
  const removeUser = () => {
    localStorage.removeItem('user')
  }
  
  const navigate = (path) => {
    window.location.href = path
  }
  
  // State management
  const [activeTab, setActiveTab] = useState('dashboard')
  const [user, setUser] = useState({
    name: '',
    email: '',
    contact: '',
    image: '',
    role: ''
  })
  const [imageFile, setImageFile] = useState(null)
  const [questions, setQuestions] = useState([])
  const [myQuestions, setMyQuestions] = useState([])
  const [publicQuestions, setPublicQuestions] = useState([])
  const [users, setUsers] = useState([])
  const [questionData, setQuestionData] = useState({
    title: '',
    description: '',
    isPublic: true
  })

  // Edit states
  const [editingQuestion, setEditingQuestion] = useState(null)
  const [editQuestionData, setEditQuestionData] = useState({
    title: '',
    description: '',
    isPublic: true
  })

  // Answer states
  const [answeringQuestion, setAnsweringQuestion] = useState(null)
  const [answerText, setAnswerText] = useState('')

  // Fetch user profile from server
  const fetchUserProfile = async () => {
    try {
      const token = getToken()
      if (!token) return

      const response = await fetch('http://localhost:7000/api/auth/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      
      if (response.ok) {
        const result = await response.json()
        setUser(result.user || result)
        localStorage.setItem('user', JSON.stringify(result.user || result))
      }
    } catch (err) {
      console.error("Failed to fetch user profile", err)
    }
  }

  // Fetch all questions (admin only)
  const fetchAllQuestions = async () => {
    try {
      const token = getToken()
      const response = await fetch('http://localhost:7000/api/auth/questions', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      
      if (response.ok) {
        const result = await response.json()
        setQuestions(result)
      }
    } catch (err) {
      console.error("Failed to fetch all questions", err)
    }
  }

  // Fetch public questions
  const fetchPublicQuestions = async () => {
    try {
      const response = await fetch('http://localhost:7000/api/auth/questions/public')
      
      if (response.ok) {
        const result = await response.json()
        setPublicQuestions(result)
      }
    } catch (err) {
      console.error("Failed to fetch public questions", err)
    }
  }

  // Fetch user's own questions
  const fetchMyQuestions = async () => {
    try {
      const token = getToken()
      const response = await fetch('http://localhost:7000/api/auth/questions/my', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      
      if (response.ok) {
        const result = await response.json()
        setMyQuestions(result)
      }
    } catch (err) {
      console.error("Failed to fetch my questions", err)
    }
  }

  // Fetch users data (for admin)
  const fetchUsers = async () => {
    try {
      const token = getToken()
      const response = await fetch('http://localhost:7000/api/auth/users', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      
      if (response.ok) {
        const result = await response.json()
        setUsers(result)
      }
    } catch (err) {
      console.error("Failed to fetch users", err)
    }
  }

  // Update question function
  const updateQuestion = async (id, updatedData) => {
    try {
      const token = getToken()
      const response = await axios.put(`http://localhost:7000/api/auth/questions/${id}`, updatedData, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.status === 200) {
        alert("Question updated successfully!")
        setEditingQuestion(null)
        setEditQuestionData({ title: '', description: '', isPublic: true })
        
        // Refresh the appropriate data based on current tab
        if (activeTab === 'show-questions') {
          fetchAllQuestions()
        } else if (activeTab === 'my-questions') {
          fetchMyQuestions()
        }
        fetchPublicQuestions() // Always refresh public questions
      }
    } catch (error) {
      console.error("Error updating question:", error)
      alert("Failed to update question")
    }
  }

  // Delete question function
  const deleteQuestion = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this question?")
    if (!confirmDelete) return

    try {
      const token = getToken()
      const response = await axios.delete(`http://localhost:7000/api/auth/questions/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.status === 200) {
        // Remove the deleted question from all relevant states
        setQuestions(questions.filter((q) => q._id !== id))
        setMyQuestions(myQuestions.filter((q) => q._id !== id))
        alert("Question deleted successfully!")
        
        // Refresh the appropriate data based on current tab
        if (activeTab === 'show-questions') {
          fetchAllQuestions()
        } else if (activeTab === 'my-questions') {
          fetchMyQuestions()
        }
        fetchPublicQuestions()
      }
    } catch (error) {
      console.error("Error deleting question:", error)
      alert("Failed to delete question")
    }
  }

  // Delete user function (admin only)
  const handleDeleteUser = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this user?")
    if (!confirmDelete) return

    try {
      const token = getToken()
      const response = await axios.delete(`http://localhost:7000/api/auth/users/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (response.status === 200) {
        setUsers(users.filter((user) => user._id !== id))
        alert("User deleted successfully!")
      }
    } catch (err) {
      console.error("Error deleting user", err)
      alert("Failed to delete user")
    }
  }

  // Handle logout
  const handleLogout = () => {
    removeToken()
    removeUser()
    alert("Successfully logged out!")
    navigate('/auth')
  }

  // Handle question submission
  const handleQuestionSubmit = async (e) => {
    e.preventDefault()
    
    try {
      const token = getToken()
      const response = await fetch('http://localhost:7000/api/auth/questions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(questionData)
      })

      const result = await response.json()

      if (response.ok) {
        alert('Question submitted successfully!')
        setQuestionData({
          title: '',
          description: '',
          isPublic: true
        })
        
        // Refresh relevant data
        if (activeTab === 'show-questions') {
          fetchAllQuestions()
        }
        if (activeTab === 'my-questions') {
          fetchMyQuestions()
        }
        fetchPublicQuestions() // Always refresh public questions
      } else {
       alert(`Failed to submit question: ${result.message || result.error || 'Unknown error'}`)
      }

    } catch (error) {
      console.error('Error submitting question:', error)
      alert('Something went wrong while submitting question.')
    }
  }

  // Handle edit question
  const handleEditQuestion = (question) => {
    setEditingQuestion(question._id)
    setEditQuestionData({
      title: question.title,
      description: question.description,
      isPublic: question.isPublic
    })
  }

  // Handle update question
  const handleUpdateQuestion = () => {
    if (!editQuestionData.title.trim() || !editQuestionData.description.trim()) {
      alert('Please fill in all required fields')
      return
    }
    updateQuestion(editingQuestion, editQuestionData)
  }

  // Handle cancel edit
  const handleCancelEdit = () => {
    setEditingQuestion(null)
    setEditQuestionData({ title: '', description: '', isPublic: true })
  }

  // Handle answer submission (for admin)
  const handleAnswerSubmit = async () => {
    if (!answerText.trim()) {
      alert('Please enter an answer')
      return
    }

    try {
      const token = getToken()
      const response = await axios.post(`http://localhost:7000/api/auth/questions/${answeringQuestion}/answer`, {
        answer: answerText
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (response.status === 200) {
        alert('Answer submitted successfully!')
        setAnsweringQuestion(null)
        setAnswerText('')
        
        // Refresh all relevant data
        if (activeTab === 'show-questions') {
          fetchAllQuestions()
        } else if (activeTab === 'my-questions') {
          fetchMyQuestions()
        } else if (activeTab === 'public-questions') {
          fetchPublicQuestions()
        }
        
        // Always refresh public questions as answers might affect them
        fetchPublicQuestions()
      }
    } catch (error) {
      console.error("Error submitting answer:", error)
      const errorMessage = error.response?.data?.message || "Failed to submit answer"
      alert(`Error: ${errorMessage}`)
    }
  }

  // Input change handlers
  const handleQuestionInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setQuestionData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleEditInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setEditQuestionData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleProfileInputChange = (e) => {
    const { name, value } = e.target
    setUser(prev => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0])
  }

  // Update profile
  const handleUpdate = async () => {
    try {
      const formData = new FormData()
      formData.append('name', user.name)
      formData.append('email', user.email)
      formData.append('contact', user.contact)
      if (imageFile) {
        formData.append('image', imageFile)
      }

      const token = getToken()
      const response = await fetch('http://localhost:7000/api/auth/profile', {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      })

      const result = await response.json()

      if (response.ok) {
        alert(result.message)
        setUser(result.user)
        localStorage.setItem('user', JSON.stringify(result.user))
        setImageFile(null)
        setActiveTab('profile')
      } else {
        alert(result.message || 'Profile update failed.')
      }
    } catch (err) {
      console.error('Error updating profile:', err)
      alert("Something went wrong while updating profile.")
    }
  }

  // Delete profile
  const handleDelete = async () => {
    const confirmDelete = window.confirm('Are you sure you want to delete your profile?')
    if (!confirmDelete) return

    try {
      const token = getToken()
      const response = await fetch('http://localhost:7000/api/auth/profile', {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      const result = await response.json()

      alert(result.message)
      if (response.ok) {
        handleLogout() // Logout after successful profile deletion
      }
    } catch (err) {
      console.error('Error deleting profile', err)
    }
  }

  // Initialize component
  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser)
      setUser(parsedUser)
    }
    
    fetchUserProfile()
    fetchPublicQuestions() // Load public questions on mount
  }, [])

  // Effect to fetch data when tabs change
  useEffect(() => {
    if (activeTab === 'show-questions' && user.role === 'admin') {
      fetchAllQuestions()
    } else if (activeTab === 'my-questions') {
      fetchMyQuestions()
    } else if (activeTab === 'get-users' && user.role === 'admin') {
      fetchUsers()
    }
  }, [activeTab, user.role])

  // Check if user can edit/delete a question
  const canUserModifyQuestion = (question) => {
    if (user.role === 'admin') return true // Admin can modify any question
    return question.user?._id === user._id || question.userId === user._id
  }

  // Check if admin can answer any question
  const canAdminAnswer = (question) => {
    return user.role === 'admin'
  }

  // Render functions
  const renderQuestionTable = (questionsToShow, title, showActions = false, showAnswerOption = false) => {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <HelpCircle className="mr-2 text-blue-600" size={28} />
          {title}
        </h2>

        {questionsToShow.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 text-lg">No questions available.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {questionsToShow.map((q, index) => (
              <div key={q._id || index} className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                {/* Question Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-2">
                      <span className="text-sm font-medium text-gray-500">#{index + 1}</span>
                      <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${
                        q.isPublic 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {q.isPublic ? (
                          <>
                            <Globe size={12} className="mr-1" />
                            Public
                          </>
                        ) : (
                          <>
                            <Lock size={12} className="mr-1" />
                            Private
                          </>
                        )}
                      </span>
                      <span className="text-sm text-gray-500">
                        {q.createdAt ? new Date(q.createdAt).toLocaleDateString() : 'N/A'}
                      </span>
                    </div>

                    {/* User Information */}
                    {(q.user || q.userEmail) && (
                      <div className="mb-3 p-3 bg-blue-50 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <User size={16} className="text-blue-600" />
                          <span className="text-sm font-medium text-blue-800">
                            Asked by: {q.user?.name || q.userName || 'Unknown'}
                          </span>
                          {(q.user?.email || q.userEmail) && (
                            <span className="text-sm text-blue-600">
                              ({q.user?.email || q.userEmail})
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Question Content */}
                {editingQuestion === q._id ? (
                  <div className="space-y-4 mb-4">
                    <div>
                      <input
                        type="text"
                        name="title"
                        value={editQuestionData.title}
                        onChange={handleEditInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Question title"
                      />
                    </div>
                    <div>
                      <textarea
                        name="description"
                        value={editQuestionData.description}
                        onChange={handleEditInputChange}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        placeholder="Question description"
                      />
                    </div>
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id={`edit-isPublic-${q._id}`}
                        name="isPublic"
                        checked={editQuestionData.isPublic}
                        onChange={handleEditInputChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <label htmlFor={`edit-isPublic-${q._id}`} className="text-sm font-medium text-gray-700 flex items-center">
                        {editQuestionData.isPublic ? (
                          <>
                            <Globe size={16} className="mr-1 text-green-600" />
                            Make this question public
                          </>
                        ) : (
                          <>
                            <Lock size={16} className="mr-1 text-red-600" />
                            Keep this question private
                          </>
                        )}
                      </label>
                    </div>
                  </div>
                ) : (
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">{q.title}</h3>
                    <p className="text-gray-700 leading-relaxed">{q.description}</p>
                  </div>
                )}

                {/* Answer Section */}
                {q.answer && (
                  <div className="mb-4 p-4 bg-green-50 border-l-4 border-green-500 rounded">
                    <div className="flex items-center mb-2">
                      <Reply size={16} className="text-green-600 mr-2" />
                      <span className="font-semibold text-green-800">Admin Answer:</span>
                    </div>
                    <p className="text-green-700">{q.answer}</p>
                  </div>
                )}

                {/* Answer Input (Admin Only) */}
                {answeringQuestion === q._id ? (
                  <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded">
                    <textarea
                      value={answerText}
                      onChange={(e) => setAnswerText(e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none mb-2"
                      placeholder="Enter your answer..."
                    />
                    <div className="flex space-x-2">
                      <button
                        onClick={handleAnswerSubmit}
                        className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors flex items-center text-sm"
                      >
                        <Check size={14} className="mr-1" />
                        Submit Answer
                      </button>
                      <button
                        onClick={() => {
                          setAnsweringQuestion(null)
                          setAnswerText('')
                        }}
                        className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors flex items-center text-sm"
                      >
                        <X size={14} className="mr-1" />
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : null}

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-2">
                  {editingQuestion === q._id ? (
                    <>
                      <button
                        onClick={handleUpdateQuestion}
                        className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors flex items-center text-sm"
                      >
                        <Check size={14} className="mr-1" />
                        Save Changes
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors flex items-center text-sm"
                      >
                        <X size={14} className="mr-1" />
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      {showActions && canUserModifyQuestion(q) && (
                        <button
                          onClick={() => handleEditQuestion(q)}
                          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center text-sm"
                        >
                          <Edit size={14} className="mr-1" />
                          Edit
                        </button>
                      )}

                      {showAnswerOption && canAdminAnswer(q) && !q.answer && (
                        <button
                          onClick={() => setAnsweringQuestion(q._id)}
                          className="bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700 transition-colors flex items-center text-sm"
                        >
                          <Reply size={14} className="mr-1" />
                          Answer
                        </button>
                      )}

                      {showActions && (user.role === 'admin' || (showActions && canUserModifyQuestion(q))) && (
                        <button
                          onClick={() => deleteQuestion(q._id)}
                          className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors flex items-center text-sm"
                        >
                          <Trash2 size={14} className="mr-1" />
                          Delete
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    )
  }

  const renderShowQuestions = () => {
    return renderQuestionTable(questions, "All Questions (Admin)", true, true)
  }

  const renderMyQuestions = () => {
    return renderQuestionTable(myQuestions, "My Questions", true, false)
  }

  const renderPublicQuestions = () => {
    return renderQuestionTable(publicQuestions, "Public Questions", user.role === 'admin', true)
  }

  const renderGetUsers = () => {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <User className="mr-2 text-green-600" size={28} />
          All Users
        </h2>

        {users.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 text-lg">No users found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-700">#</th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-700">Name</th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-700">Email</th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-700">Contact</th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-700">Role</th>
                  <th className="border border-gray-300 px-4 py-3 text-left font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr key={user._id || index} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-3 text-gray-800">{index + 1}</td>
                    <td className="border border-gray-300 px-4 py-3 text-gray-800 font-medium">{user.name || 'N/A'}</td>
                    <td className="border border-gray-300 px-4 py-3 text-gray-800">{user.email || 'N/A'}</td>
                    <td className="border border-gray-300 px-4 py-3 text-gray-800">{user.contact || 'N/A'}</td>
                    <td className="border border-gray-300 px-4 py-3 text-gray-800">
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        user.role === 'admin' 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {user.role || 'user'}
                      </span>
                    </td>
                    <td className="border border-gray-300 px-4 py-3 text-gray-800">
                      <button
                        onClick={() => handleDeleteUser(user._id)}
                        className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 transition-colors flex items-center text-sm"
                      >
                        <Trash2 size={14} className="mr-1" />
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    )
  }

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Welcome to Q&A Board</h2>
        <p className="text-gray-600 mb-6">Ask questions and get answers from the community.</p>
        
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
          <h3 className="font-semibold text-blue-800 mb-2">Q&A Community</h3>
          <p className="text-blue-700 text-sm">Share your questions with the community and help others by providing answers.</p>
        </div>
      </div>

      {/* Question Form */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <HelpCircle className="mr-2 text-blue-600" size={24} />
          Ask a Question
        </h3>
        
        <form onSubmit={handleQuestionSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Question Title *
            </label>
            <input
              type="text"
              name="title"
              value={questionData.title}
              onChange={handleQuestionInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your question title"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              name="description"
              value={questionData.description}
              onChange={handleQuestionInputChange}
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Provide detailed description of your question..."
              required
            />
          </div>

          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="isPublic"
              name="isPublic"
              checked={questionData.isPublic}
              onChange={handleQuestionInputChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="isPublic" className="text-sm font-medium text-gray-700 flex items-center">
              {questionData.isPublic ? (
                <>
                  <Globe size={16} className="mr-1 text-green-600" />
                  Make this question public
                </>
              ) : (
                <>
                  <Lock size={16} className="mr-1 text-red-600" />
                  Keep this question private
                </>
              )}
            </label>
          </div>

          <button
           type='submit'
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center"
          >
            <Send size={16} className="mr-2" />
            Submit Question
          </button>
        </form>
      </div>
    </div>
  )

  const renderProfile = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <User className="mr-2 text-blue-600" size={28} />
        Profile
      </h2>
      
      <div className="space-y-6">
        {/* Profile Image Section */}
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            {user.image && user.image.length > 0 && user.image[0]?.url ? (
              <img
                src={user.image[0].url}
                alt="Profile"
                style={{
                  width: "100px",
                  height: "100px",
                  objectFit: "cover",
                  borderRadius: "50%",
                }}
              />
            ) : (
              <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
                <User size={40} className="text-gray-400" />
              </div>
            )}
          </div>
        </div>

        {/* Profile Information Display */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                Name
              </label>
              <p className="text-lg font-medium text-gray-800 bg-gray-50 px-4 py-3 rounded-lg">
                {user.name || 'Not provided'}
              </p>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                Email
              </label>
              <p className="text-lg font-medium text-gray-800 bg-gray-50 px-4 py-3 rounded-lg">
                {user.email || 'Not provided'}
              </p>
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">
              Contact Number
            </label>
            <p className="text-lg font-medium text-gray-800 bg-gray-50 px-4 py-3 rounded-lg">
              {user.contact || 'Not provided'}
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">
              Role
            </label>
            <p className="text-lg font-medium text-gray-800 bg-gray-50 px-4 py-3 rounded-lg">
              {user.role || 'user'}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4 pt-4 border-t">
          <button
            onClick={() => setActiveTab('edit-profile')}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center"
          >
            <Edit size={16} className="mr-2" />
            Edit Profile
          </button>
          
          <button
            onClick={handleDelete}
            className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition-colors flex items-center"
          >
            <Trash2 size={16} className="mr-2" />
            Delete Profile
          </button>
        </div>
      </div>
    </div>
  )

  const renderEditProfile = () => (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <Edit className="mr-2 text-blue-600" size={28} />
        Edit Profile
      </h2>
      
      <div className="space-y-6">
        {/* Profile Image Section */}
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            {user.image && user.image.length > 0 && user.image[0]?.url ? (
              <img
                src={user.image[0].url}
                alt="Profile"
                style={{
                  width: "100px",
                  height: "100px",
                  objectFit: "cover",
                  borderRadius: "50%",
                }}
              />
            ) : (
              <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center">
                <User size={40} className="text-gray-400" />
              </div>
            )}

            <div className="absolute bottom-0 right-0 bg-blue-600 rounded-full p-2 cursor-pointer hover:bg-blue-700 transition-colors">
              <Camera size={16} className="text-white" />
            </div>
          </div>
          
          <div className="w-full max-w-xs">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Change Profile Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>
        </div>

        {/* Profile Information Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={user.name}
              onChange={handleProfileInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your name"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={user.email}
              onChange={handleProfileInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your email"
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Contact Number
            </label>
            <input
              type="text"
              name="contact"
              value={user.contact}
              onChange={handleProfileInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your contact number"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4 pt-4 border-t">
          <button
            onClick={handleUpdate}
            className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors flex items-center"
          >
            <Edit size={16} className="mr-2" />
            Update Profile
          </button>
          
          <button
            onClick={() => setActiveTab('profile')}
            className="bg-gray-600 text-white px-6 py-2 rounded-md hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 bg-white shadow-lg z-10">
        <div className="p-6 border-b">
          <h1 className="text-xl font-bold text-gray-800">Q&A Board</h1>
        </div>
        
        <nav className="mt-6">
          <div className="px-4 space-y-2">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                activeTab === 'dashboard'
                  ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-600'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <MessageSquare size={20} className="mr-3" />
              Dashboard
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                activeTab === 'profile'
                  ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-600'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <User size={20} className="mr-3" />
              Profile
            </button>

            <button
              onClick={() => setActiveTab('public-questions')}
              className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                activeTab === 'public-questions'
                  ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-600'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Globe size={20} className="mr-3" />
              Public Questions
            </button>

            <button
              onClick={() => setActiveTab('my-questions')}
              className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                activeTab === 'my-questions'
                  ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-600'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <HelpCircle size={20} className="mr-3" />
              My Questions
            </button>

            {user.role === 'admin' && (
              <>
                <button
                  onClick={() => setActiveTab('show-questions')}
                  className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                    activeTab === 'show-questions'
                      ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-600'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <HelpCircle size={20} className="mr-3" />
                  All Questions (Admin)
                </button>

                <button
                  onClick={() => setActiveTab('get-users')}
                  className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                    activeTab === 'get-users'
                      ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-600'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <User size={20} className="mr-3" />
                  All Users (Admin)
                </button>
              </>
            )}

            <button
              onClick={handleLogout}
              className="w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors text-red-600 hover:bg-red-50"
            >
              <LogOut size={20} className="mr-3" />
              Logout
            </button>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="ml-64 p-8">
        <div className="max-w-4xl mx-auto">
          {activeTab === 'dashboard' && renderDashboard()}
          {activeTab === 'profile' && renderProfile()}
          {activeTab === 'edit-profile' && renderEditProfile()}
          {activeTab === 'public-questions' && renderPublicQuestions()}
          {activeTab === 'my-questions' && renderMyQuestions()}
          {activeTab === 'show-questions' && renderShowQuestions()}
          {activeTab === 'get-users' && renderGetUsers()}
        </div>
      </div>
    </div>
  )
}

export default Home