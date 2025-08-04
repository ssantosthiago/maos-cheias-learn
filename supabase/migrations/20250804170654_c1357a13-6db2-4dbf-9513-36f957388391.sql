-- Fix missing RLS policies for tables that need them

-- Add missing RLS policies for lessons table
CREATE POLICY "Users can view lessons of accessible modules" ON public.lessons
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.modules m 
      JOIN public.courses c ON c.id = m.course_id
      WHERE m.id = module_id 
      AND (c.is_published = true OR public.has_role(auth.uid(), 'superadmin') OR 
           (public.has_role(auth.uid(), 'professor') AND c.professor_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid())))
    )
  );

CREATE POLICY "Professors can manage lessons of own courses" ON public.lessons
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.modules m 
      JOIN public.courses c ON c.id = m.course_id
      WHERE m.id = module_id 
      AND c.professor_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid())
      AND public.has_role(auth.uid(), 'professor')
    )
  );

-- Add missing RLS policies for quizzes table
CREATE POLICY "Users can view quizzes of accessible modules" ON public.quizzes
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.modules m 
      JOIN public.courses c ON c.id = m.course_id
      WHERE m.id = module_id 
      AND (c.is_published = true OR public.has_role(auth.uid(), 'superadmin') OR 
           (public.has_role(auth.uid(), 'professor') AND c.professor_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid())))
    )
  );

CREATE POLICY "Professors can manage quizzes of own courses" ON public.quizzes
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.modules m 
      JOIN public.courses c ON c.id = m.course_id
      WHERE m.id = module_id 
      AND c.professor_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid())
      AND public.has_role(auth.uid(), 'professor')
    )
  );

-- Add missing RLS policies for quiz_questions table
CREATE POLICY "Users can view quiz questions of accessible quizzes" ON public.quiz_questions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.quizzes q
      JOIN public.modules m ON m.id = q.module_id
      JOIN public.courses c ON c.id = m.course_id
      WHERE q.id = quiz_id 
      AND (c.is_published = true OR public.has_role(auth.uid(), 'superadmin') OR 
           (public.has_role(auth.uid(), 'professor') AND c.professor_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid())))
    )
  );

CREATE POLICY "Professors can manage quiz questions of own courses" ON public.quiz_questions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.quizzes q
      JOIN public.modules m ON m.id = q.module_id
      JOIN public.courses c ON c.id = m.course_id
      WHERE q.id = quiz_id 
      AND c.professor_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid())
      AND public.has_role(auth.uid(), 'professor')
    )
  );

-- Add missing RLS policies for student_progress table
CREATE POLICY "Students can view own progress" ON public.student_progress
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.enrollments e
      WHERE e.id = enrollment_id 
      AND e.student_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid())
    )
  );

CREATE POLICY "Students can update own progress" ON public.student_progress
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.enrollments e
      WHERE e.id = enrollment_id 
      AND e.student_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid())
      AND public.has_role(auth.uid(), 'aluno')
    )
  );

CREATE POLICY "Professors can view progress of their course students" ON public.student_progress
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.enrollments e
      JOIN public.courses c ON c.id = e.course_id
      WHERE e.id = enrollment_id 
      AND c.professor_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid())
      AND public.has_role(auth.uid(), 'professor')
    )
  );

-- Add missing RLS policies for certificates table
CREATE POLICY "Students can view own certificates" ON public.certificates
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.enrollments e
      WHERE e.id = enrollment_id 
      AND e.student_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid())
    )
  );

CREATE POLICY "Professors can view certificates of their course students" ON public.certificates
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.enrollments e
      JOIN public.courses c ON c.id = e.course_id
      WHERE e.id = enrollment_id 
      AND c.professor_id = (SELECT id FROM public.profiles WHERE user_id = auth.uid())
      AND public.has_role(auth.uid(), 'professor')
    )
  );

-- Fix function search_path issues by setting explicit search_path
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role user_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER SET search_path = ''
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE user_id = _user_id
      AND role = _role
      AND is_active = true
  )
$$;

CREATE OR REPLACE FUNCTION public.get_user_role(_user_id UUID)
RETURNS user_role
LANGUAGE SQL
STABLE
SECURITY DEFINER SET search_path = ''
AS $$
  SELECT role
  FROM public.profiles
  WHERE user_id = _user_id
    AND is_active = true
$$;