
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { Regulation, ActivityCategory } from '@/types/Regulation';
import { mockRegulations } from '@/data/mockRegulations';

class RegulationService {
  // Get regulations
  async getRegulations(filters?: {
    state?: string;
    category?: ActivityCategory;
  }): Promise<{ data: Regulation[]; error: Error | null }> {
    if (!isSupabaseConfigured()) {
      console.log('Supabase not configured, using mock data');
      return { data: mockRegulations, error: null };
    }

    try {
      let query = supabase
        .from('regulations')
        .select('*')
        .order('state', { ascending: true });

      if (filters?.state) {
        query = query.eq('state_code', filters.state);
      }

      if (filters?.category) {
        query = query.eq('category', filters.category);
      }

      const { data, error } = await query;

      if (error) throw error;

      return { data: data.map(this.mapRegulationFromDb), error: null };
    } catch (error) {
      console.error('Get regulations error:', error);
      return { data: mockRegulations, error: error as Error };
    }
  }

  // Helper to map database regulation to Regulation type
  private mapRegulationFromDb(dbRegulation: any): Regulation {
    return {
      id: dbRegulation.id,
      state: dbRegulation.state,
      stateCode: dbRegulation.state_code,
      category: dbRegulation.category,
      seasons: dbRegulation.seasons || [],
      licenseRequirements: dbRegulation.license_requirements || [],
      specialRules: dbRegulation.special_rules || [],
      lastUpdated: dbRegulation.last_updated,
    };
  }
}

export const regulationService = new RegulationService();
