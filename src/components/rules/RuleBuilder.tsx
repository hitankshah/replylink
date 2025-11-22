'use client'

import { useState } from 'react'
import { ChevronDown, X } from 'lucide-react'

export interface RuleFormData {
  name: string
  platform: 'INSTAGRAM' | 'FACEBOOK' | 'WHATSAPP'
  accountId: string
  triggerType: string
  triggerConfig: Record<string, any>
  actionConfig: {
    type: string
    message: string
    includeLink?: boolean
  }
  priority: number
}

interface Props {
  accounts: Array<{
    id: string
    platformUsername: string
    platform: string
  }>
  onSubmit: (data: RuleFormData) => Promise<void>
  isLoading?: boolean
  initialData?: RuleFormData
}

const TRIGGER_TYPES = [
  { value: 'COMMENT', label: 'New Comment' },
  { value: 'MESSAGE', label: 'Direct Message' },
  { value: 'MENTION', label: 'Mention' },
  { value: 'KEYWORD', label: 'Keyword Match' },
  { value: 'TIME', label: 'Scheduled Time' },
]

const ACTION_TYPES = [
  { value: 'REPLY', label: 'Reply to Comment' },
  { value: 'DIRECT_MESSAGE', label: 'Send Direct Message' },
  { value: 'LINK_SHARE', label: 'Share Link' },
]

const TEMPLATE_VARIABLES = [
  { label: '{userName}', desc: 'Sender\'s name' },
  { label: '{linkPageUrl}', desc: 'Your link page URL' },
  { label: '{date}', desc: 'Current date' },
  { label: '{time}', desc: 'Current time' },
]

export default function RuleBuilder({
  accounts,
  onSubmit,
  isLoading = false,
  initialData,
}: Props) {
  const [formData, setFormData] = useState<RuleFormData>(
    initialData || {
      name: '',
      platform: 'INSTAGRAM',
      accountId: '',
      triggerType: 'COMMENT',
      triggerConfig: {},
      actionConfig: {
        type: 'REPLY',
        message: '',
        includeLink: false,
      },
      priority: 5,
    }
  )

  const [keywords, setKeywords] = useState<string[]>(
    initialData?.triggerConfig?.keywords || []
  )
  const [newKeyword, setNewKeyword] = useState('')
  const [error, setError] = useState<string>()

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.currentTarget
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.currentTarget as HTMLInputElement).checked : value,
    }))
  }

  const handleTriggerConfigChange = (key: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      triggerConfig: { ...prev.triggerConfig, [key]: value },
    }))
  }

  const handleActionConfigChange = (key: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      actionConfig: { ...prev.actionConfig, [key]: value },
    }))
  }

  const addKeyword = () => {
    if (newKeyword.trim() && !keywords.includes(newKeyword.trim())) {
      setKeywords([...keywords, newKeyword.trim()])
      handleTriggerConfigChange('keywords', [...keywords, newKeyword.trim()])
      setNewKeyword('')
    }
  }

  const removeKeyword = (keyword: string) => {
    const updated = keywords.filter((k) => k !== keyword)
    setKeywords(updated)
    handleTriggerConfigChange('keywords', updated)
  }

  const insertVariable = (variable: string) => {
    const textarea = document.getElementById('message-template') as HTMLTextAreaElement
    if (textarea) {
      const start = textarea.selectionStart
      const end = textarea.selectionEnd
      const before = formData.actionConfig.message.substring(0, start)
      const after = formData.actionConfig.message.substring(end)
      const newMessage = before + variable + after
      handleActionConfigChange('message', newMessage)
      setTimeout(() => {
        textarea.selectionStart = textarea.selectionEnd = start + variable.length
        textarea.focus()
      }, 0)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!formData.name.trim()) {
      setError('Rule name is required')
      return
    }

    if (!formData.accountId) {
      setError('Please select a social media account')
      return
    }

    if (!formData.actionConfig.message.trim()) {
      setError('Reply message is required')
      return
    }

    if (formData.triggerType === 'KEYWORD' && keywords.length === 0) {
      setError('Add at least one keyword for keyword-based rules')
      return
    }

    try {
      await onSubmit(formData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error creating rule')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl mx-auto">
      {error && (
        <div className="bg-red-900/30 border border-red-700 rounded-lg p-4 text-red-200 text-sm">
          {error}
        </div>
      )}

      {/* Step 1: Basic Info */}
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h2 className="text-lg font-semibold text-white mb-4">
          Step 1: Basic Information
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Rule Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Welcome Message for New Comments"
              className="w-full bg-slate-700 border border-slate-600 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Step 2: Platform & Account */}
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h2 className="text-lg font-semibold text-white mb-4">
          Step 2: Select Platform
        </h2>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Platform
              </label>
              <select
                name="platform"
                value={formData.platform}
                onChange={handleChange}
                className="w-full bg-slate-700 border border-slate-600 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="INSTAGRAM">📷 Instagram</option>
                <option value="FACEBOOK">👥 Facebook</option>
                <option value="WHATSAPP">💬 WhatsApp</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Account
              </label>
              <select
                name="accountId"
                value={formData.accountId}
                onChange={handleChange}
                className="w-full bg-slate-700 border border-slate-600 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select an account...</option>
                {accounts
                  .filter((a) => a.platform === formData.platform)
                  .map((account) => (
                    <option key={account.id} value={account.id}>
                      {account.platformUsername}
                    </option>
                  ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Step 3: Trigger Configuration */}
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h2 className="text-lg font-semibold text-white mb-4">
          Step 3: Choose Trigger
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Trigger Type
            </label>
            <select
              name="triggerType"
              value={formData.triggerType}
              onChange={handleChange}
              className="w-full bg-slate-700 border border-slate-600 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {TRIGGER_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          {/* Keywords for KEYWORD trigger */}
          {formData.triggerType === 'KEYWORD' && (
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Keywords (comma-separated)
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={newKeyword}
                  onChange={(e) => setNewKeyword(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
                  placeholder="Type keyword and press Enter"
                  className="flex-1 bg-slate-700 border border-slate-600 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={addKeyword}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {keywords.map((keyword) => (
                  <span
                    key={keyword}
                    className="bg-blue-900/50 text-blue-200 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                  >
                    {keyword}
                    <button
                      type="button"
                      onClick={() => removeKeyword(keyword)}
                      className="hover:text-blue-100"
                    >
                      <X size={14} />
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Time for TIME trigger */}
          {formData.triggerType === 'TIME' && (
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Time (HH:MM format)
              </label>
              <input
                type="time"
                value={formData.triggerConfig.time || '09:00'}
                onChange={(e) => handleTriggerConfigChange('time', e.target.value)}
                className="w-full bg-slate-700 border border-slate-600 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}
        </div>
      </div>

      {/* Step 4: Action Configuration */}
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h2 className="text-lg font-semibold text-white mb-4">
          Step 4: Configure Action
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Action Type
            </label>
            <select
              value={formData.actionConfig.type}
              onChange={(e) => handleActionConfigChange('type', e.target.value)}
              className="w-full bg-slate-700 border border-slate-600 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {ACTION_TYPES.map((a) => (
                <option key={a.value} value={a.value}>
                  {a.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-slate-300">
                Reply Message
              </label>
              <span className="text-xs text-slate-400">
                {formData.actionConfig.message.length}/500
              </span>
            </div>
            <textarea
              id="message-template"
              value={formData.actionConfig.message}
              onChange={(e) => handleActionConfigChange('message', e.target.value)}
              maxLength={500}
              placeholder="Write your reply message here..."
              rows={4}
              className="w-full bg-slate-700 border border-slate-600 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="mt-2 text-xs text-slate-400">
              <p className="mb-2">Available variables:</p>
              <div className="flex flex-wrap gap-2">
                {TEMPLATE_VARIABLES.map((variable) => (
                  <button
                    key={variable.label}
                    type="button"
                    onClick={() => insertVariable(variable.label)}
                    className="bg-slate-700 hover:bg-slate-600 px-2 py-1 rounded transition"
                    title={variable.desc}
                  >
                    {variable.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {formData.actionConfig.type === 'LINK_SHARE' && (
            <label className="flex items-center gap-2 text-sm text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.actionConfig.includeLink || false}
                onChange={(e) =>
                  handleActionConfigChange('includeLink', e.target.checked)
                }
                className="w-4 h-4 rounded bg-slate-700 border-slate-600"
              />
              Include link to my link page
            </label>
          )}
        </div>
      </div>

      {/* Step 5: Priority */}
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h2 className="text-lg font-semibold text-white mb-4">
          Step 5: Set Priority
        </h2>
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-3">
            Priority: {formData.priority}/10
          </label>
          <input
            type="range"
            min="1"
            max="10"
            value={formData.priority}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                priority: parseInt(e.target.value),
              }))
            }
            className="w-full"
          />
          <p className="text-xs text-slate-400 mt-2">
            Higher priority rules are executed first
          </p>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex gap-4">
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-600 text-white px-6 py-3 rounded-lg font-medium transition"
        >
          {isLoading ? 'Creating...' : 'Create Rule'}
        </button>
      </div>
    </form>
  )
}
