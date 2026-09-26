import React, { useEffect, useState } from 'react';
import { Activity, ArrowRight, ArrowUpRight, Bot, Check, ChevronRight, Clock3, FilePlus2, Globe2, Headphones, MessageCircle, ShieldCheck, Users } from 'lucide-react';
import { api } from '../../services/api';
import { AnalyticsSummary, Ticket, SupportedLanguage, SupportCategory } from '../../types';
import { getTranslation } from '../../data/i18n';

interface DashboardHomeProps {
  onNavigate: (view: string) => void;
  currentLanguage: SupportedLanguage;
  onSelectTicket?: (ticket: Ticket) => void;
  onNavigateToChatWithQuery?: (query: string, category: SupportCategory) => void;
  onOpenCreateTicket?: (category?: SupportCategory, title?: string, description?: string, isEscalated?: boolean) => void;
}

const relativeTime = (value: string) => {
  const minutes = Math.max(1, Math.round((Date.now() - new Date(value).getTime()) / 60000));
  return minutes < 60 ? `${minutes} min ago` : `${Math.floor(minutes / 60)} hr ago`;
};

export const DashboardHome: React.FC<DashboardHomeProps> = ({
  onNavigate,
  currentLanguage,
  onSelectTicket,
  onNavigateToChatWithQuery,
  onOpenCreateTicket
}) => {
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api.getAnalytics().then(setAnalytics).catch((error) => console.error('Failed to load dashboard analytics:', error)).finally(() => setIsLoading(false));
  }, []);

  const t = (key: string) => getTranslation(currentLanguage, key);

  const total = analytics?.totalQueries;
  const resolved = analytics?.resolvedQueries;
  const pending = analytics?.pendingQueries;
  const escalated = analytics?.escalatedQueries;
  const recentActivity = analytics?.recentActivity?.slice(0, 4) ?? [];
  const trend = analytics?.dailyTrends?.slice(-7) ?? [];
  const peak = Math.max(...trend.map((day) => day.queries), 1);
  const today = new Date();
  const dateLabel = today.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }).toUpperCase();

  return (
    <div className="ops-dashboard">
      <div className="ops-page-heading">
        <div>
          <div className="ops-eyebrow">
            <span className="ops-live-dot" /> {t('dashboard_kicker')} <span className="ops-heading-separator">/</span> {dateLabel}
          </div>
          <h1>{t('dashboard_title')}</h1>
          <p>{t('dashboard_subtitle')}</p>
        </div>
        <div className="ops-heading-actions">
          <button className="ops-quiet-button" onClick={() => onNavigate('analytics')}>
            <Activity size={16} /> {t('nav_analytics')}
          </button>
          <button className="ops-primary-button" onClick={() => onOpenCreateTicket?.()}>
            <FilePlus2 size={16} /> {t('btn_raise_request')}
          </button>
        </div>
      </div>

      <section className="ops-metrics" aria-label="Service overview">
        <article className="ops-metric ops-metric-highlight">
          <div className="ops-metric-top">
            <span>{t('stat_total_requests')}</span>
            <span className="ops-metric-icon"><Users size={16} /></span>
          </div>
          <strong>{total?.toLocaleString('en-IN') ?? '—'}</strong>
          <div className="ops-metric-foot"><span>{t('support_247')}</span></div>
        </article>
        <article className="ops-metric">
          <div className="ops-metric-top">
            <span>{t('stat_resolution_rate')}</span>
            <span className="ops-metric-icon"><Bot size={16} /></span>
          </div>
          <strong>{analytics ? `${analytics.resolutionRate.toFixed(1)}%` : '—'}</strong>
          <div className="ops-metric-foot">
            <span>{resolved?.toLocaleString('en-IN') ?? '—'} {t('stat_resolved').toLowerCase()}</span>
          </div>
        </article>
        <article className="ops-metric">
          <div className="ops-metric-top">
            <span>{t('stat_pending')}</span>
            <span className="ops-metric-icon ops-icon-amber"><Clock3 size={16} /></span>
          </div>
          <strong>{pending?.toLocaleString('en-IN') ?? '—'}</strong>
          <div className="ops-metric-foot"><span>{t('step_processing')}</span></div>
        </article>
        <article className="ops-metric">
          <div className="ops-metric-top">
            <span>{t('stat_escalated')}</span>
            <span className="ops-metric-icon ops-icon-rose"><Headphones size={16} /></span>
          </div>
          <strong>{escalated?.toLocaleString('en-IN') ?? '—'}</strong>
          <div className="ops-metric-foot">
            <span>{t('district_nodal_desk')}</span>
            <button onClick={() => onNavigate('escalations')}>{t('nav_escalations')} <ArrowRight size={12} /></button>
          </div>
        </article>
      </section>

      <section className="ops-feature-grid">
        <article className="ops-card ops-service-card">
          <div className="ops-card-header">
            <div>
              <div className="ops-section-kicker">SERVICE DELIVERY</div>
              <h2>{t('intake_trends_title')}</h2>
            </div>
            <button className="ops-icon-button" aria-label="Open analytics" onClick={() => onNavigate('analytics')}>
              <ArrowUpRight size={17} />
            </button>
          </div>
          <div className="ops-chart-wrap">
            <div className="ops-chart-axis">
              <span>{trend.length ? peak.toLocaleString('en-IN') : '—'}</span>
              <span>{trend.length ? Math.round(peak * .67).toLocaleString('en-IN') : '—'}</span>
              <span>{trend.length ? Math.round(peak * .33).toLocaleString('en-IN') : '—'}</span>
              <span>{trend.length ? '0' : '—'}</span>
            </div>
            <div className="ops-chart">
              {[0, 1, 2].map((line) => <div key={line} className="ops-chart-gridline" style={{ top: `${line * 33.33}%` }} />)}
              {trend.length > 0 ? (
                trend.map((day) => (
                  <div key={day.date} className="ops-chart-day">
                    <div className="ops-chart-bar-group">
                      <span className="ops-bar ops-bar-total" style={{ height: `${Math.max(3, (day.queries / peak) * 100)}%` }} />
                      <span className="ops-bar ops-bar-resolved" style={{ height: `${Math.max(3, (day.resolved / peak) * 100)}%` }} />
                    </div>
                    <span className="ops-chart-label">{day.date.slice(0, 2)}</span>
                  </div>
                ))
              ) : (
                <div className="ops-chart-empty">{isLoading ? 'Loading service trends…' : 'Service data is unavailable right now.'}</div>
              )}
            </div>
          </div>
          <div className="ops-chart-legend">
            <span><i className="legend-dot legend-total" /> {t('legend_intake')}</span>
            <span><i className="legend-dot legend-resolved" /> {t('legend_resolved')}</span>
          </div>
        </article>

        <article className="ops-card ops-ai-card">
          <div className="ops-card-header">
            <div>
              <div className="ops-section-kicker">BSAI ASSISTANT</div>
              <h2>{t('multilingual_title')}</h2>
            </div>
            <span className="ops-ai-mark"><MessageCircle size={17} /></span>
          </div>
          <p className="ops-ai-copy">{t('smart_human')}</p>
          <div className="ops-language-stat">
            <span className="ops-language-number">8</span>
            <div>
              <strong>Indian Languages Active</strong>
              <span>English, हिन्दी, தமிழ், తెలుగు, বাংলা, मराठी, ગુજરાતી, ಕನ್ನಡ</span>
            </div>
          </div>
          <div className="ops-language-pills">
            <span>English</span>
            <span>हिन्दी</span>
            <span>தமிழ்</span>
            <span>తెలుగు</span>
            <span>+4</span>
          </div>
          <button className="ops-ai-link" onClick={() => onNavigateToChatWithQuery?.('How can I access government services?', 'Government Services')}>
            {t('btn_ask_ai')} <ArrowRight size={15} />
          </button>
        </article>
      </section>

      <section className="ops-lower-grid">
        <article className="ops-card ops-activity-card">
          <div className="ops-card-header">
            <div>
              <div className="ops-section-kicker">LIVE SERVICE DESK</div>
              <h2>{t('recent_activity_title')}</h2>
            </div>
            <button className="ops-text-button" onClick={() => onNavigate('support-requests')}>
              {t('nav_support_requests')} <ChevronRight size={15} />
            </button>
          </div>
          <div className="ops-activity-list">
            {recentActivity.length ? (
              recentActivity.map((item) => (
                <button
                  className="ops-activity-row"
                  key={item.id}
                  onClick={() => (item.type === 'escalation' ? onNavigate('escalations') : onNavigate('support-requests'))}
                >
                  <span className={`ops-activity-icon ops-activity-${item.type}`}>
                    {item.type === 'resolution' ? <Check size={16} /> : item.type === 'escalation' ? <Headphones size={16} /> : <FilePlus2 size={16} />}
                  </span>
                  <span className="ops-activity-main">
                    <strong>{item.title}</strong>
                    <small>{item.description}</small>
                  </span>
                  <time>{relativeTime(item.timestamp)}</time>
                  <ChevronRight className="ops-activity-chevron" size={16} />
                </button>
              ))
            ) : (
              <p className="ops-empty-activity">{isLoading ? 'Loading recent activity…' : 'Service data is unavailable right now.'}</p>
            )}
          </div>
        </article>

        <article className="ops-card ops-priority-card">
          <div className="ops-card-header">
            <div>
              <div className="ops-section-kicker">ATTENTION REQUIRED</div>
              <h2>{t('priority_queue_title')}</h2>
            </div>
            <span className="ops-queue-count">{escalated ?? 0}</span>
          </div>
          <p className="ops-queue-summary">
            {escalated ? `${escalated} citizen inquiries require manual district nodal officer review.` : 'All citizen inquiries are proceeding within normal service thresholds.'}
          </p>
          <button className="ops-queue-link" onClick={() => onNavigate('escalations')}>
            {t('nav_escalations')} <ArrowRight size={15} />
          </button>
        </article>
      </section>
    </div>
  );
};
