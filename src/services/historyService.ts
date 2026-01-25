/**
 * @fileoverview History service for persisting analysis results.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { AnalysisResult } from '../types';

const HISTORY_STORAGE_KEY = '@neighborfi_history';
const MAX_HISTORY_ITEMS = 50;

export interface HistoryItem {
  id: string;
  result: AnalysisResult;
  savedAt: string;
}

class HistoryServiceClass {
  /**
   * Save an analysis result to history.
   */
  async saveAnalysis(result: AnalysisResult): Promise<HistoryItem> {
    const history = await this.getHistory();
    
    const newItem: HistoryItem = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      result,
      savedAt: new Date().toISOString(),
    };

    // Add to beginning of array
    const updatedHistory = [newItem, ...history];

    // Limit history size
    const trimmedHistory = updatedHistory.slice(0, MAX_HISTORY_ITEMS);

    await AsyncStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(trimmedHistory));
    
    return newItem;
  }

  /**
   * Get all history items.
   */
  async getHistory(): Promise<HistoryItem[]> {
    try {
      const data = await AsyncStorage.getItem(HISTORY_STORAGE_KEY);
      if (!data) {
        return [];
      }
      
      const parsed = JSON.parse(data) as HistoryItem[];
      
      // Convert date strings back to Date objects in results
      return parsed.map((item) => ({
        ...item,
        result: {
          ...item.result,
          analyzedAt: new Date(item.result.analyzedAt),
          neighborhoodData: {
            ...item.result.neighborhoodData,
            dataTimestamp: new Date(item.result.neighborhoodData.dataTimestamp),
          },
        },
      }));
    } catch (error) {
      console.error('Failed to load history:', error);
      return [];
    }
  }

  /**
   * Get a single history item by ID.
   */
  async getHistoryItem(id: string): Promise<HistoryItem | null> {
    const history = await this.getHistory();
    return history.find((item) => item.id === id) || null;
  }

  /**
   * Delete a history item.
   */
  async deleteHistoryItem(id: string): Promise<void> {
    const history = await this.getHistory();
    const filtered = history.filter((item) => item.id !== id);
    await AsyncStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(filtered));
  }

  /**
   * Clear all history.
   */
  async clearHistory(): Promise<void> {
    await AsyncStorage.removeItem(HISTORY_STORAGE_KEY);
  }

  /**
   * Get history count.
   */
  async getHistoryCount(): Promise<number> {
    const history = await this.getHistory();
    return history.length;
  }
}

export const HistoryService = new HistoryServiceClass();
export { HistoryServiceClass };