import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface Course {
  id: string;
  title: string;
  description: string | null;
  short_description: string | null;
  thumbnail_url: string | null;
  price: number | null;
  is_free: boolean;
  duration_hours: number | null;
  difficulty_level: string | null;
  tags: string[] | null;
  professor_id: string;
  is_published: boolean;
  created_at: string;
  professor?: {
    full_name: string;
    avatar_url: string | null;
  };
}

export const COURSE_CATEGORIES = [
  'Teologia',
  'Discipulado',
  'Educação Cristã',
  'Ministerial',
  'Missões',
  'Música',
  'Batismo',
  'Liderança',
  'Família',
  'Evangelismo'
];

export const useCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('courses')
        .select(`
          *,
          professor:profiles!courses_professor_id_fkey(full_name, avatar_url)
        `)
        .eq('is_published', true)
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCourses(data || []);
    } catch (err) {
      console.error('Error fetching courses:', err);
      setError('Erro ao carregar cursos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  return { courses, loading, error, refetch: fetchCourses };
};