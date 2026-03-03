export interface StreakData {
    currentStreak: number;
    lastPlayedDate: string; // ISO Date YYYY-MM-DD
    bestStreak: number;
}

const STREAK_KEY = 'lingo-games-streak';

/**
 * Utility to manage daily play streaks.
 */
export const StreakManager = {
    /**
     * Get current streak data from LocalStorage
     */
    getStreak(): StreakData {
        if (typeof window === 'undefined') return { currentStreak: 0, lastPlayedDate: '', bestStreak: 0 };

        try {
            const saved = localStorage.getItem(STREAK_KEY);
            if (!saved) return { currentStreak: 0, lastPlayedDate: '', bestStreak: 0 };
            return JSON.parse(saved);
        } catch (e) {
            return { currentStreak: 0, lastPlayedDate: '', bestStreak: 0 };
        }
    },

    /**
     * Update streak when a game is completed
     * This should be called once per day per user completion
     */
    recordPlay() {
        if (typeof window === 'undefined') return;

        const now = new Date();
        const today = now.toISOString().split('T')[0];

        const data = this.getStreak();

        if (data.lastPlayedDate === today) {
            // Already recorded for today
            return data;
        }

        const yesterday = new Date(now);
        yesterday.setDate(now.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        let newStreak = 1;
        if (data.lastPlayedDate === yesterdayStr) {
            newStreak = data.currentStreak + 1;
        }

        const newData: StreakData = {
            currentStreak: newStreak,
            lastPlayedDate: today,
            bestStreak: Math.max(data.bestStreak, newStreak)
        };

        localStorage.setItem(STREAK_KEY, JSON.stringify(newData));
        return newData;
    },

    /**
     * Check if streak is still active (was played today or yesterday)
     */
    validateStreak() {
        if (typeof window === 'undefined') return;

        const data = this.getStreak();
        if (!data.lastPlayedDate) return;

        const now = new Date();
        const today = now.toISOString().split('T')[0];

        const yesterday = new Date(now);
        yesterday.setDate(now.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        // If last played was before yesterday, reset streak
        if (data.lastPlayedDate !== today && data.lastPlayedDate !== yesterdayStr) {
            const resetData: StreakData = {
                ...data,
                currentStreak: 0
            };
            localStorage.setItem(STREAK_KEY, JSON.stringify(resetData));
        }
    }
};
