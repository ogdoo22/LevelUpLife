/**
 * @fileoverview Share service for generating and sharing analysis results.
 */

import { Share, Platform } from 'react-native';
import { AnalysisResult } from '../types';
import { SHARE_TEMPLATES } from '../constants/roasts';
import { replacePlaceholders, truncateText } from '../utils';

// ============================================================================
// TYPES
// ============================================================================

export interface ShareContent {
  title: string;
  message: string;
  url?: string;
}

export interface ShareResult {
  success: boolean;
  action: 'shared' | 'dismissed' | 'error';
  error?: string;
}

// ============================================================================
// SHARE SERVICE CLASS
// ============================================================================

class ShareServiceClass {
  /**
   * Generates shareable text from analysis result.
   */
  generateShareText(result: AnalysisResult): string {
    const topCareer = result.careerSuggestions[0];
    
    return replacePlaceholders(SHARE_TEMPLATES.RESULT_SHARE, {
      neighborhood: result.displayStrings.fullLocationString,
      homePrice: result.displayStrings.formattedHomePrice,
      income: result.displayStrings.incomeNeededDisplay,
      career: topCareer?.title || 'various careers',
    });
  }

  /**
   * Generates a shorter roast-focused share text.
   */
  generateRoastShare(result: AnalysisResult): string {
    const shortRoast = truncateText(result.roastMessage, 100);
    
    return replacePlaceholders(SHARE_TEMPLATES.ROAST_SHARE, {
      shortRoast,
    });
  }

  /**
   * Shares the analysis result using native share dialog.
   */
  async shareResult(result: AnalysisResult): Promise<ShareResult> {
    const message = this.generateShareText(result);
    
    return this.share({
      title: `Level Up Life - ${result.displayStrings.fullLocationString}`,
      message,
    });
  }

  /**
   * Shares just the roast message.
   */
  async shareRoast(result: AnalysisResult): Promise<ShareResult> {
    const message = this.generateRoastShare(result);
    
    return this.share({
      title: 'Level Up Life Roast',
      message,
    });
  }

  /**
   * Core share function using React Native Share API.
   */
  async share(content: ShareContent): Promise<ShareResult> {
    try {
      const shareOptions: { title?: string; message: string; url?: string } = {
        message: content.message,
      };

      // iOS handles title differently
      if (Platform.OS === 'ios') {
        shareOptions.title = content.title;
      } else {
        // On Android, prepend title to message
        shareOptions.message = `${content.title}\n\n${content.message}`;
      }

      if (content.url) {
        shareOptions.url = content.url;
      }

      const result = await Share.share(shareOptions);

      if (result.action === Share.sharedAction) {
        return { success: true, action: 'shared' };
      } else if (result.action === Share.dismissedAction) {
        return { success: false, action: 'dismissed' };
      }

      return { success: false, action: 'error', error: 'Unknown result' };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Share failed';
      return { success: false, action: 'error', error: errorMessage };
    }
  }

  /**
   * Generates a text summary for clipboard copy.
   */
  generateTextSummary(result: AnalysisResult): string {
    const lines = [
      `📍 ${result.displayStrings.fullLocationString}`,
      `🏷️ ${result.displayStrings.wealthTierDisplay}`,
      '',
      '📊 The Numbers:',
      `• Median Home: ${result.displayStrings.formattedHomePrice}`,
      `• Median Income: ${result.displayStrings.formattedIncome}`,
      `• Average Rent: ${result.displayStrings.formattedRent}`,
      `• ${result.displayStrings.incomeNeededDisplay}`,
      '',
      '☕ The Tea:',
      result.roastMessage,
      '',
      '💼 Career Paths:',
      ...result.careerSuggestions.map((c) => `• ${c.title} (${c.salaryMin / 1000}K-${c.salaryMax / 1000}K)`),
      '',
      '- Analyzed with Level Up Life 🏠💰',
    ];

    return lines.join('\n');
  }
}

// ============================================================================
// SINGLETON EXPORT
// ============================================================================

export const ShareService = new ShareServiceClass();
export { ShareServiceClass };
