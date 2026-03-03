import { track } from '@vercel/analytics';

export type AnalyticsEvent =
    | 'game_start'
    | 'game_win'
    | 'game_loss'
    | 'share_clicked'
    | 'language_changed';

export interface GameEventProps {
    gameId: string;
    language: string;
    difficulty?: string;
    attempts?: number;
    platform?: string;
}

/**
 * Track a custom event to Vercel Analytics with standardized naming and properties.
 */
export const trackEvent = (event: AnalyticsEvent, props?: Record<string, any>) => {
    try {
        track(event, props);
        // console.log(`[Analytics] Tracked: ${event}`, props);
    } catch (error) {
        console.error(`[Analytics] Error tracking ${event}:`, error);
    }
};

/**
 * Standardized tracking for game outcomes
 */
export const trackGameOutcome = (
    gameId: string,
    outcome: 'win' | 'loss' | 'won' | 'lost' | 'start' | 'finished',
    details: { language: string; difficulty?: string; attempts?: number }
) => {
    let eventName: AnalyticsEvent = 'game_start';
    if (outcome === 'win' || outcome === 'won') eventName = 'game_win';
    else if (outcome === 'loss' || outcome === 'lost') eventName = 'game_loss';
    else if (outcome === 'finished') eventName = 'game_win'; // For crossword finish

    trackEvent(eventName, {
        gameId,
        ...details
    });
};
