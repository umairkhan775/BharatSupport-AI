import React, { useEffect, useState } from 'react';
import { Activity, ArrowUpRight, Clock3, Globe2, Users } from 'lucide-react';
import { api } from '../../services/api';
import { AnalyticsSummary, SupportedLanguage } from '../../types';

interface AnalyticsViewProps {
  currentLanguage: SupportedLanguage;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ currentLanguage }) => {
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    api.getAnalytics()
      .then(setAnalytics)
      .catch((error) => {
        console.error('Unable to load analytics:', error);
        setHasError(true);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const trend = analytics?.dailyTrends ?? [];
  const peak = Math.max(...trend.map((day) => day.queries), 1);
  const metric = (value?: number, suffix = '') => isLoading ? '—' : hasError || value === undefined ? 'Unavailable' : `${value.toLocaleString('en-IN')}${suffix}`;

  return (
    <div className="analytics-page">
      <header className="ana-heading">
        <div>
          <div className="ana-eyebrow"><span /> SERVICE OPERATIONS</div>
          <h1>Service analytics</h1>
          <p>A clear view of requests, response progress, and the languages people use.</p>
        </div>
        <div className="ana-updated"><Activity size={15} /> {analytics ? 'Updated just now' : isLoading ? 'Loading service data' : 'Service data unavailable'}</div>
      </header>

      <section className="ana-metrics" aria-label="Service metrics">
        <article><div><span>Total queries</span><Users size={16} /></div><strong>{metric(analytics?.totalQueries)}</strong><small>Requests and assistant conversations</small></article>
        <article><div><span>Resolution rate</span><ArrowUpRight size={16} /></div><strong>{metric(analytics?.resolutionRate, '%')}</strong><small>Queries resolved in the service data</small></article>
        <article><div><span>Awaiting response</span><Clock3 size={16} /></div><strong>{metric(analytics?.pendingQueries)}</strong><small>Requests still in progress</small></article>
        <article><div><span>Officer review</span><Globe2 size={16} /></div><strong>{metric(analytics?.escalatedQueries)}</strong><small>Cases routed for human support</small></article>
      </section>

      <section className="ana-panels">
        <article className="ana-card ana-trend-card">
          <div className="ana-card-heading"><div><div className="ana-eyebrow">REQUEST VOLUME</div><h2>Daily service activity</h2></div><span className="ana-key"><i className="ana-key-received" /> Received <i className="ana-key-resolved" /> Resolved</span></div>
          {trend.length ? <div className="ana-trend-chart" role="img" aria-label="Daily requests received and resolved"><div className="ana-axis"><span>{peak.toLocaleString('en-IN')}</span><span>{Math.round(peak / 2).toLocaleString('en-IN')}</span><span>0</span></div><div className="ana-bars">{trend.map((day) => <div className="ana-bar-day" key={day.date}><div className="ana-bar-group"><span className="ana-bar ana-bar-received" style={{ height: `${Math.max(3, day.queries / peak * 100)}%` }} title={`${day.queries} received`} /><span className="ana-bar ana-bar-resolved" style={{ height: `${Math.max(3, day.resolved / peak * 100)}%` }} title={`${day.resolved} resolved`} /></div><small>{day.date.slice(0, 2)}</small></div>)}</div></div> : <div className="ana-empty">{hasError ? 'Service activity could not be loaded.' : 'Daily activity will appear here when available.'}</div>}
          {trend.length > 0 && <p className="ana-date-range">Daily totals from the available service data · {currentLanguage.toUpperCase()} workspace</p>}
        </article>

        <article className="ana-card">
          <div className="ana-card-heading"><div><div className="ana-eyebrow">SERVICE AREAS</div><h2>Requests by category</h2></div></div>
          {analytics?.categoryDistribution.length ? <div className="ana-breakdown">{[...analytics.categoryDistribution].sort((a, b) => b.count - a.count).slice(0, 6).map((item) => <div className="ana-breakdown-row" key={item.category}><div><span>{item.category}</span><small>{item.count.toLocaleString('en-IN')}</small></div><div className="ana-track"><span style={{ width: `${Math.max(2, item.percentage)}%` }} /></div></div>)}</div> : <div className="ana-empty">{hasError ? 'Category data could not be loaded.' : 'Category data will appear here when available.'}</div>}
        </article>

        <article className="ana-card ana-languages-card">
          <div className="ana-card-heading"><div><div className="ana-eyebrow">LANGUAGE ACCESS</div><h2>Conversations by language</h2></div></div>
          {analytics?.languageDistribution.length ? <div className="ana-breakdown">{[...analytics.languageDistribution].sort((a, b) => b.count - a.count).slice(0, 6).map((item) => <div className="ana-breakdown-row" key={item.code}><div><span>{item.language}</span><small>{item.count.toLocaleString('en-IN')}</small></div><div className="ana-track"><span style={{ width: `${Math.max(2, item.percentage)}%` }} /></div></div>)}</div> : <div className="ana-empty">{hasError ? 'Language data could not be loaded.' : 'Language data will appear here when available.'}</div>}
        </article>

        <article className="ana-card ana-note-card">
          <div className="ana-eyebrow">ABOUT THESE NUMBERS</div>
          <h2>One service desk, many ways to get help.</h2>
          <p>These charts summarize the data currently available to the BSAI service desk. Resolution and review counts reflect the underlying request and conversation records.</p>
          <div className="ana-note-rule" />
          <span>BHARAT SUPPORT AI <i /> {currentLanguage.toUpperCase()}</span>
        </article>
      </section>
    </div>
  );
};
