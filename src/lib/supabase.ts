import { createClient } from '@supabase/supabase-js';
import supabaseConfig from '../config/supabase.json';

const supabaseUrl = supabaseConfig.supabaseUrl;
const supabaseKey = supabaseConfig.supabaseKey;

export const supabase = createClient(supabaseUrl, supabaseKey);

// API管理関連の関数
export const getApiKey = async (userId: string, apiName: string) => {
  const { data, error } = await supabase
    .from('api_keys')
    .select('api_key')
    .eq('user_id', userId)
    .eq('api_name', apiName)
    .single();
  
  if (error) {
    console.error('Error fetching API key:', error);
    return null;
  }
  
  return data?.api_key || null;
};

export const saveApiKey = async (userId: string, apiName: string, apiKey: string) => {
  // 既存のキーがあるか確認
  const { data: existingKey } = await supabase
    .from('api_keys')
    .select('id')
    .eq('user_id', userId)
    .eq('api_name', apiName)
    .single();
  
  if (existingKey) {
    // 更新
    const { error } = await supabase
      .from('api_keys')
      .update({ api_key: apiKey, updated_at: new Date().toISOString() })
      .eq('id', existingKey.id);
    
    if (error) throw error;
  } else {
    // 新規作成
    const { error } = await supabase
      .from('api_keys')
      .insert({ user_id: userId, api_name: apiName, api_key: apiKey });
    
    if (error) throw error;
  }
  
  return true;
};

// 監査結果関連の関数
export const saveAuditResult = async (
    userId: string,
    name: string,
    code: string,
    sourceType: 'manual' | 'file' | 'github',
    score: number,
    result: Record<string, unknown>,
    summary: string
  ) => {
    const { data, error } = await supabase
      .from('audit_results')
      .insert({
        user_id: userId,
        name,
        code,
        source_type: sourceType,
        score,
        result,
        summary
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  };

export const getAuditResults = async (userId: string) => {
  const { data, error } = await supabase
    .from('audit_results')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data;
};

export const getAuditResultById = async (userId: string, id: string) => {
  const { data, error } = await supabase
    .from('audit_results')
    .select('*')
    .eq('user_id', userId)
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data;
};