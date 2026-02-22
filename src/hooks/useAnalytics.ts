import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { AnalyticsSummary } from '../types';

export function useAnalytics(daysBack: number = 30) {
  return useQuery<AnalyticsSummary>({
    queryKey: ['analytics', daysBack],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_analytics_summary', {
        days_back: daysBack,
      });
      if (error) throw error;
      return data as AnalyticsSummary;
    },
    staleTime: 2 * 60 * 1000,       // 2 minutes
    refetchInterval: 5 * 60 * 1000,  // auto-refresh every 5 minutes
  });
}
