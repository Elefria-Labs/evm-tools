import { getAnalytics, logEvent, Analytics } from 'firebase/analytics';
import { getApp } from 'firebase/app';

let analytics: Analytics | null = null;

// Initialize analytics instance
export const initAnalytics = () => {
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'production') {
    try {
      const app = getApp();
      analytics = getAnalytics(app);
    } catch (error) {
      console.error('Failed to initialize analytics:', error);
    }
  }
};

// Get analytics instance
export const getAnalyticsInstance = () => {
  if (
    !analytics &&
    typeof window !== 'undefined' &&
    process.env.NODE_ENV === 'production'
  ) {
    initAnalytics();
  }
  return analytics;
};

// Tool tracking events
export const trackToolEvent = {
  // When user opens a tool
  toolOpened: (
    toolName: string,
    category: string,
    isPopular?: boolean,
    isExternal?: boolean,
  ) => {
    const analyticsInstance = getAnalyticsInstance();
    if (analyticsInstance) {
      logEvent(analyticsInstance, 'tool_opened', {
        tool_name: toolName,
        tool_category: category,
        is_popular: isPopular || false,
        is_external: isExternal || false,
        source: 'tool_card',
      });
    }
  },

  // When user views a tool card
  toolViewed: (toolName: string, category: string) => {
    const analyticsInstance = getAnalyticsInstance();
    if (analyticsInstance) {
      logEvent(analyticsInstance, 'tool_viewed', {
        tool_name: toolName,
        tool_category: category,
      });
    }
  },

  // When user searches for tools
  toolSearched: (searchQuery: string, resultsCount: number) => {
    const analyticsInstance = getAnalyticsInstance();
    if (analyticsInstance) {
      logEvent(analyticsInstance, 'tool_searched', {
        search_query: searchQuery,
        results_count: resultsCount,
      });
    }
  },

  // When user switches tool categories
  categorySwitched: (fromCategory: string, toCategory: string) => {
    const analyticsInstance = getAnalyticsInstance();
    if (analyticsInstance) {
      logEvent(analyticsInstance, 'category_switched', {
        from_category: fromCategory,
        to_category: toCategory,
      });
    }
  },

  // When user clicks external tool links
  externalToolClicked: (toolName: string, category: string) => {
    const analyticsInstance = getAnalyticsInstance();
    if (analyticsInstance) {
      logEvent(analyticsInstance, 'external_tool_clicked', {
        tool_name: toolName,
        tool_category: category,
      });
    }
  },

  // When user clicks popular tool
  popularToolClicked: (toolName: string, category: string) => {
    const analyticsInstance = getAnalyticsInstance();
    if (analyticsInstance) {
      logEvent(analyticsInstance, 'popular_tool_clicked', {
        tool_name: toolName,
        tool_category: category,
      });
    }
  },
};

// Generic event tracking for other components
export const trackEvent = (
  eventName: string,
  parameters: Record<string, any> = {},
) => {
  const analyticsInstance = getAnalyticsInstance();
  if (analyticsInstance) {
    logEvent(analyticsInstance, eventName, parameters);
  }
};
