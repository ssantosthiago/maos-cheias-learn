import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Clock, 
  Users, 
  Star, 
  BookOpen, 
  Play, 
  CheckCircle, 
  ArrowLeft,
  Calendar,
  Award,
  MessageSquare
} from 'lucide-react';
import { Course } from '@/hooks/useCourses';
import { Loader2 } from 'lucide-react';

interface Module {
  id: string;
  title: string;
  description: string | null;
  order_index: number;
  lessons: Lesson[];
}

interface Lesson {
  id: string;
  title: string;
  description: string | null;
  content_type: string;
  duration_minutes: number | null;
  is_preview: boolean;
  order_index: number;
}

const CourseDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(false);

  useEffect(() => {
    if (id) {
      fetchCourseDetails(id);
      if (user && profile) {
        checkEnrollment(id);
      }
    }
  }, [id, user, profile]);

  const fetchCourseDetails = async (courseId: string) => {
    try {
      setLoading(true);
      
      // Fetch course details
      const { data: courseData, error: courseError } = await supabase
        .from('courses')
        .select(`
          *,
          professor:profiles!courses_professor_id_fkey(full_name, avatar_url)
        `)
        .eq('id', courseId)
        .eq('is_published', true)
        .single();

      if (courseError) throw courseError;
      setCourse(courseData);

      // Fetch modules and lessons
      const { data: modulesData, error: modulesError } = await supabase
        .from('modules')
        .select(`
          *,
          lessons(
            id,
            title,
            description,
            content_type,
            duration_minutes,
            is_preview,
            order_index
          )
        `)
        .eq('course_id', courseId)
        .eq('is_active', true)
        .order('order_index', { ascending: true });

      if (modulesError) throw modulesError;
      
      const sortedModules = modulesData.map(module => ({
        ...module,
        lessons: module.lessons.sort((a, b) => a.order_index - b.order_index)
      }));
      
      setModules(sortedModules);
    } catch (error) {
      console.error('Error fetching course details:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar os detalhes do curso.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const checkEnrollment = async (courseId: string) => {
    try {
      const { data, error } = await supabase
        .from('enrollments')
        .select('id')
        .eq('course_id', courseId)
        .eq('student_id', profile?.id)
        .eq('is_active', true)
        .maybeSingle();

      if (error) throw error;
      setIsEnrolled(!!data);
    } catch (error) {
      console.error('Error checking enrollment:', error);
    }
  };

  const handleEnroll = async () => {
    if (!user || !profile) {
      toast({
        title: "Login necessário",
        description: "Você precisa fazer login para se inscrever em um curso.",
        variant: "destructive",
      });
      navigate('/auth');
      return;
    }

    if (!course) return;

    try {
      setEnrolling(true);
      
      const { error } = await supabase
        .from('enrollments')
        .insert({
          student_id: profile.id,
          course_id: course.id,
          payment_status: course.is_free ? 'completed' : 'pending'
        });

      if (error) throw error;

      setIsEnrolled(true);
      toast({
        title: "Inscrição realizada!",
        description: course.is_free 
          ? "Você já pode começar a estudar!" 
          : "Redirecionando para o pagamento...",
      });

      if (!course.is_free) {
        // TODO: Implementar redirecionamento para pagamento
        console.log('Redirect to payment');
      }
    } catch (error) {
      console.error('Error enrolling:', error);
      toast({
        title: "Erro na inscrição",
        description: "Não foi possível realizar a inscrição. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Carregando curso...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">Curso não encontrado</h2>
          <Button onClick={() => navigate('/courses')}>
            Voltar aos cursos
          </Button>
        </div>
      </div>
    );
  }

  const totalLessons = modules.reduce((acc, module) => acc + module.lessons.length, 0);
  const totalDuration = modules.reduce((acc, module) => 
    acc + module.lessons.reduce((moduleAcc, lesson) => 
      moduleAcc + (lesson.duration_minutes || 0), 0), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/courses')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar aos cursos
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Course Header */}
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {course.tags?.map((tag, index) => (
                  <Badge key={index} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
              
              <h1 className="text-3xl lg:text-4xl font-bold">{course.title}</h1>
              
              <p className="text-xl text-muted-foreground">
                {course.short_description}
              </p>

              <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span>4.8 (1.2k avaliações)</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>3.4k alunos</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>Atualizado em {new Date(course.created_at).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Professor Info */}
              {course.professor && (
                <div className="flex items-center gap-3 p-4 bg-muted/50 rounded-lg">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={course.professor.avatar_url || undefined} />
                    <AvatarFallback>
                      {course.professor.full_name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{course.professor.full_name}</p>
                    <p className="text-sm text-muted-foreground">Professor</p>
                  </div>
                </div>
              )}
            </div>

            {/* Course Content Tabs */}
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="overview">Visão Geral</TabsTrigger>
                <TabsTrigger value="curriculum">Conteúdo</TabsTrigger>
                <TabsTrigger value="reviews">Avaliações</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Sobre este curso</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground leading-relaxed">
                      {course.description}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>O que você vai aprender</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>Fundamentos sólidos da fé cristã</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>Aplicação prática dos ensinamentos</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>Desenvolvimento espiritual contínuo</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="curriculum" className="space-y-4">
                {modules.map((module, moduleIndex) => (
                  <Card key={module.id}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <span className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm">
                          {moduleIndex + 1}
                        </span>
                        {module.title}
                      </CardTitle>
                      {module.description && (
                        <CardDescription>{module.description}</CardDescription>
                      )}
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {module.lessons.map((lesson, lessonIndex) => (
                          <div key={lesson.id} className="flex items-center gap-3 p-2 hover:bg-muted/50 rounded">
                            <Play className="h-4 w-4 text-muted-foreground" />
                            <div className="flex-1">
                              <p className="text-sm font-medium">{lesson.title}</p>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <span>{lesson.content_type}</span>
                                {lesson.duration_minutes && (
                                  <>
                                    <span>•</span>
                                    <span>{lesson.duration_minutes} min</span>
                                  </>
                                )}
                                {lesson.is_preview && (
                                  <Badge variant="outline" className="text-xs">
                                    Preview
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="reviews" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Avaliações dos alunos</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="text-4xl font-bold">4.8</div>
                        <div>
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            ))}
                          </div>
                          <p className="text-sm text-muted-foreground">1.234 avaliações</p>
                        </div>
                      </div>
                      <Separator />
                      <p className="text-muted-foreground">
                        As avaliações serão exibidas aqui quando implementadas.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Course Info Card */}
            <Card className="sticky top-4">
              <CardHeader>
                <div className="aspect-video bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg flex items-center justify-center">
                  {course.thumbnail_url ? (
                    <img 
                      src={course.thumbnail_url} 
                      alt={course.title}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <BookOpen className="h-12 w-12 text-primary/60" />
                  )}
                </div>
                
                <div className="text-center space-y-2">
                  <div className="text-2xl font-bold text-primary">
                    {course.is_free ? 'Gratuito' : `R$ ${course.price?.toFixed(2)}`}
                  </div>
                  {!course.is_free && course.price && (
                    <p className="text-sm text-muted-foreground">
                      ou 12x de R$ {(course.price / 12).toFixed(2)}
                    </p>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <Button 
                  className="w-full" 
                  size="lg"
                  onClick={handleEnroll}
                  disabled={enrolling || isEnrolled}
                >
                  {enrolling && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  {isEnrolled ? 'Já inscrito' : 'Inscrever-se agora'}
                </Button>

                <Separator />

                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{Math.round(totalDuration / 60)}h de conteúdo</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                    <span>{totalLessons} aulas</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4 text-muted-foreground" />
                    <span>Certificado de conclusão</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    <span>Suporte do professor</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CourseDetail;