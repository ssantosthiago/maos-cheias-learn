import { useState } from 'react';
import { useCourses, COURSE_CATEGORIES } from '@/hooks/useCourses';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Filter, BookOpen } from 'lucide-react';
import { CourseCard } from '@/components/CourseCard';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const Courses = () => {
  const { courses, loading } = useCourses();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCourses = courses.filter(course => {
    const matchesCategory = selectedCategory === 'Todos' || 
      course.tags?.some(tag => tag.toLowerCase().includes(selectedCategory.toLowerCase()));
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleEnroll = (courseId: string) => {
    if (!user) {
      toast({
        title: "Login necessário",
        description: "Você precisa fazer login para se inscrever em um curso.",
        variant: "destructive",
      });
      navigate('/auth');
      return;
    }
    
    navigate(`/courses/${courseId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold">Explorar Cursos</h1>
                <p className="text-sm text-muted-foreground">Encontre o curso perfeito para você</p>
              </div>
            </div>
            <Button onClick={() => navigate('/')} variant="outline">
              Voltar ao Início
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Search and Filters */}
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar cursos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filtros
            </Button>
          </div>

          {/* Categories */}
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
            <div className="flex justify-center mb-6">
              <TabsList className="grid grid-cols-5 lg:grid-cols-6 w-full max-w-4xl h-auto">
                <TabsTrigger value="Todos" className="text-xs py-2">Todos</TabsTrigger>
                {COURSE_CATEGORIES.slice(0, 5).map((category) => (
                  <TabsTrigger key={category} value={category} className="text-xs py-2">
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>

            <TabsContent value={selectedCategory} className="space-y-6">
              {/* Results Count */}
              <div className="flex items-center justify-between">
                <p className="text-muted-foreground">
                  {filteredCourses.length} curso(s) encontrado(s)
                  {selectedCategory !== 'Todos' && ` em ${selectedCategory}`}
                </p>
              </div>

              {/* Courses Grid */}
              {loading ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <Card key={i} className="animate-pulse">
                      <div className="aspect-video bg-muted"></div>
                      <CardHeader>
                        <div className="h-6 bg-muted rounded"></div>
                        <div className="h-4 bg-muted rounded w-3/4"></div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="h-4 bg-muted rounded"></div>
                          <div className="h-4 bg-muted rounded w-1/2"></div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : filteredCourses.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCourses.map((course) => (
                    <CourseCard
                      key={course.id}
                      course={course}
                      onEnroll={handleEnroll}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Nenhum curso encontrado</h3>
                  <p className="text-muted-foreground">
                    Tente ajustar os filtros ou buscar por outros termos.
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Courses;