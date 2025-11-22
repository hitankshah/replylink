'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { RefreshCw, AlertTriangle, CheckCircle, AlertCircle } from 'lucide-react'

interface SystemMetrics {
  totalUsers: number
  activeUsers: number
  totalWorkspaces: number
  totalSubscriptions: number
  monthlyRevenue: number
  eventsProcessed: number
  eventsProcessedToday: number
  failedEvents: number
  averageResponseTime: number
  databaseHealth: 'healthy' | 'warning' | 'critical'
  cacheHealth: 'healthy' | 'warning' | 'critical'
  queueHealth: 'healthy' | 'warning' | 'critical'
  lastUpdate: string
}

interface QueueStats {
  pendingJobs: number
  processingJobs: number
  completedJobs: number
  failedJobs: number
  delayedJobs: number
}

interface HealthStatus {
  database: boolean
  redis: boolean
  messageQueue: boolean
  externalAPIs: boolean
}

export default function AdminSystemPage() {
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null)
  const [queueStats, setQueueStats] = useState<QueueStats | null>(null)
  const [health, setHealth] = useState<HealthStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date())

  useEffect(() => {
    fetchSystemData()
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchSystemData, 30000)
    return () => clearInterval(interval)
  }, [])

  const fetchSystemData = async () => {
    try {
      setLoading(true)
      const [metricsRes, queueRes, healthRes] = await Promise.all([
        fetch('/api/admin/system/metrics'),
        fetch('/api/admin/system/queue'),
        fetch('/api/admin/system/health'),
      ])

      if (!metricsRes.ok || !queueRes.ok || !healthRes.ok) {
        throw new Error('Failed to fetch system data')
      }

      const metricsData = await metricsRes.json()
      const queueData = await queueRes.json()
      const healthData = await healthRes.json()

      setMetrics(metricsData.metrics)
      setQueueStats(queueData.stats)
      setHealth(healthData.health)
      setLastRefresh(new Date())
      setError('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load system data')
    } finally {
      setLoading(false)
    }
  }

  const getHealthBadge = (status: 'healthy' | 'warning' | 'critical' | boolean) => {
    if (typeof status === 'boolean') {
      return status ? (
        <div className="flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-green-600" />
          <span className="text-xs font-medium text-green-600">Healthy</span>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-red-600" />
          <span className="text-xs font-medium text-red-600">Down</span>
        </div>
      )
    }

    switch (status) {
      case 'healthy':
        return (
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span className="text-xs font-medium text-green-600">Healthy</span>
          </div>
        )
      case 'warning':
        return (
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-yellow-600" />
            <span className="text-xs font-medium text-yellow-600">Warning</span>
          </div>
        )
      case 'critical':
        return (
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-600" />
            <span className="text-xs font-medium text-red-600">Critical</span>
          </div>
        )
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">System Status</h1>
          <p className="text-slate-600 dark:text-slate-400">
            Metrics, performance, and health indicators
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={fetchSystemData} variant="outline" className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
          <span className="flex items-center text-xs text-slate-600 dark:text-slate-400">
            Last updated: {lastRefresh.toLocaleTimeString()}
          </span>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Card className="border-red-200 bg-red-50 dark:bg-red-950 dark:border-red-800">
          <CardContent className="pt-6">
            <p className="text-red-600 dark:text-red-200">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Health Status */}
      {health && (
        <Card>
          <CardHeader>
            <CardTitle>Service Health</CardTitle>
            <CardDescription>Real-time status of critical services</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-lg border bg-slate-50 dark:bg-slate-900">
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">Database</p>
                {getHealthBadge(health.database)}
              </div>
              <div className="p-4 rounded-lg border bg-slate-50 dark:bg-slate-900">
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">Redis Cache</p>
                {getHealthBadge(health.redis)}
              </div>
              <div className="p-4 rounded-lg border bg-slate-50 dark:bg-slate-900">
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">Message Queue</p>
                {getHealthBadge(health.messageQueue)}
              </div>
              <div className="p-4 rounded-lg border bg-slate-50 dark:bg-slate-900">
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">External APIs</p>
                {getHealthBadge(health.externalAPIs)}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Key Metrics */}
      {metrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Total Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.totalUsers}</div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                {metrics.activeUsers} active today
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Subscriptions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.totalSubscriptions}</div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                ${metrics.monthlyRevenue.toLocaleString()} MRR
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Events Processed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{metrics.eventsProcessedToday}</div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Today (Total: {metrics.eventsProcessed.toLocaleString()})
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Failed Events</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{metrics.failedEvents}</div>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Avg Response: {metrics.averageResponseTime}ms
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Component Health */}
      {metrics && (
        <Card>
          <CardHeader>
            <CardTitle>Component Health</CardTitle>
            <CardDescription>Individual service status and performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Database */}
              <div className="flex items-center justify-between p-4 rounded-lg border bg-slate-50 dark:bg-slate-900">
                <div>
                  <p className="font-medium">Database</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">PostgreSQL connection pool</p>
                </div>
                {getHealthBadge(metrics.databaseHealth)}
              </div>

              {/* Cache */}
              <div className="flex items-center justify-between p-4 rounded-lg border bg-slate-50 dark:bg-slate-900">
                <div>
                  <p className="font-medium">Redis Cache</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Session and data caching</p>
                </div>
                {getHealthBadge(metrics.cacheHealth)}
              </div>

              {/* Queue */}
              <div className="flex items-center justify-between p-4 rounded-lg border bg-slate-50 dark:bg-slate-900">
                <div>
                  <p className="font-medium">Message Queue</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">BullMQ job processing</p>
                </div>
                {getHealthBadge(metrics.queueHealth)}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Queue Statistics */}
      {queueStats && (
        <Card>
          <CardHeader>
            <CardTitle>Queue Statistics</CardTitle>
            <CardDescription>Background job processing status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="p-4 rounded-lg border bg-blue-50 dark:bg-blue-950 dark:border-blue-800">
                <p className="text-xs text-blue-600 dark:text-blue-400 mb-1">Pending</p>
                <p className="text-2xl font-bold text-blue-600">{queueStats.pendingJobs}</p>
              </div>

              <div className="p-4 rounded-lg border bg-yellow-50 dark:bg-yellow-950 dark:border-yellow-800">
                <p className="text-xs text-yellow-600 dark:text-yellow-400 mb-1">Processing</p>
                <p className="text-2xl font-bold text-yellow-600">{queueStats.processingJobs}</p>
              </div>

              <div className="p-4 rounded-lg border bg-green-50 dark:bg-green-950 dark:border-green-800">
                <p className="text-xs text-green-600 dark:text-green-400 mb-1">Completed</p>
                <p className="text-2xl font-bold text-green-600">{queueStats.completedJobs}</p>
              </div>

              <div className="p-4 rounded-lg border bg-red-50 dark:bg-red-950 dark:border-red-800">
                <p className="text-xs text-red-600 dark:text-red-400 mb-1">Failed</p>
                <p className="text-2xl font-bold text-red-600">{queueStats.failedJobs}</p>
              </div>

              <div className="p-4 rounded-lg border bg-slate-50 dark:bg-slate-900">
                <p className="text-xs text-slate-600 dark:text-slate-400 mb-1">Delayed</p>
                <p className="text-2xl font-bold">{queueStats.delayedJobs}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {loading && (
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      )}
    </div>
  )
}
