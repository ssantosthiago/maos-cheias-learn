import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  BookOpen, 
  LogOut,
  Play,
  Award,
  Clock,
  TrendingUp,
  User,
  CheckCircle,
  Calendar,
  Target
} from 'lucide-react';

const StudentDashboard = () => {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !profile || profile.role !== 'aluno') {
      navigate('/');
    }
  }, [user, profile, navigate]);

  if (!user || !profile || profile.role !== 'aluno') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <BookOpen className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Minha Área de Estudos</h1>
              <p className="text-sm text-muted-foreground">Continue seu aprendizado</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium">{profile.full_name}</p>
              <Badge variant="secondary" className="text-xs">Aluno</Badge>
            </div>
            <Button variant="outline" size="sm" onClick={() => navigate('/')}>
              Voltar ao Início
            </Button>
            <Button variant="outline" size="sm" onClick={signOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Dashboard Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cursos Inscritos</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">6</div>
              <p className="text-xs text-muted-foreground">2 em andamento, 4 concluídos</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Horas Estudadas</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">47h</div>
              <p className="text-xs text-muted-foreground">este mês</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Certificados</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4</div>
              <p className="text-xs text-muted-foreground">conquistados</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Progresso Médio</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">73%</div>
              <p className="text-xs text-muted-foreground">dos cursos em andamento</p>
            </CardContent>
          </Card>
        </div>

        {/* Management Tabs */}
        <Tabs defaultValue="courses" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="courses">Meus Cursos</TabsTrigger>
            <TabsTrigger value="progress">Progresso</TabsTrigger>
            <TabsTrigger value="certificates">Certificados</TabsTrigger>
            <TabsTrigger value="profile">Perfil</TabsTrigger>
          </TabsList>

          <TabsContent value="courses" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Meus Cursos</h2>
              <Button onClick={() => navigate('/courses')}>
                <BookOpen className="h-4 w-4 mr-2" />
                Explorar Mais Cursos
              </Button>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Cursos em Andamento</h3>
              <div className="grid md:grid-cols-2 gap-6">
                {/* Course Card Example */}
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="aspect-video bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg flex items-center justify-center mb-3">
                      <BookOpen className="h-8 w-8 text-primary/60" />
                    </div>
                    <CardTitle className="line-clamp-2">Fundamentos da Teologia Cristã</CardTitle>
                    <CardDescription className="line-clamp-2">
                      Prof. João Silva
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Progresso</span>
                        <span>65%</span>
                      </div>
                      <Progress value={65} className="h-2" />
                    </div>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>12 de 18 aulas</span>
                      <Badge variant="outline">Em andamento</Badge>
                    </div>
                    <Button className="w-full">
                      <Play className="h-4 w-4 mr-2" />
                      Continuar Estudando
                    </Button>
                  </CardContent>
                </Card>

                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="aspect-video bg-gradient-to-br from-primary/10 to-secondary/10 rounded-lg flex items-center justify-center mb-3">
                      <BookOpen className="h-8 w-8 text-primary/60" />
                    </div>
                    <CardTitle className="line-clamp-2">Discipulado Prático</CardTitle>
                    <CardDescription className="line-clamp-2">
                      Prof. Maria Santos
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Progresso</span>
                        <span>82%</span>
                      </div>
                      <Progress value={82} className="h-2" />
                    </div>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>14 de 17 aulas</span>
                      <Badge variant="outline">Em andamento</Badge>
                    </div>
                    <Button className="w-full">
                      <Play className="h-4 w-4 mr-2" />
                      Continuar Estudando
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <h3 className="text-lg font-semibold pt-6">Cursos Concluídos</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="aspect-video bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center mb-3">
                      <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>
                    <CardTitle className="line-clamp-2">Introdução à Bíblia</CardTitle>
                    <CardDescription className="line-clamp-2">
                      Prof. Pedro Oliveira
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>Concluído em 15/12/2024</span>
                      <Badge variant="secondary">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Concluído
                      </Badge>
                    </div>
                    <Button variant="outline" className="w-full">
                      <Award className="h-4 w-4 mr-2" />
                      Ver Certificado
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="progress" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Meu Progresso</h2>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Estatísticas de Estudo</CardTitle>
                  <CardDescription>
                    Acompanhe seu desempenho
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Taxa de Conclusão</span>
                    <span className="text-sm font-medium">66%</span>
                  </div>
                  <Progress value={66} className="h-2" />
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Aulas Assistidas</span>
                    <span className="text-sm font-medium">78/118</span>
                  </div>
                  <Progress value={66} className="h-2" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Atividade Recente</CardTitle>
                  <CardDescription>
                    Últimas atividades de estudo
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Concluiu: Módulo 3 - Teologia</p>
                        <p className="text-xs text-muted-foreground">Hoje às 14:30</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Target className="h-4 w-4 text-muted-foreground" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">Quiz aprovado com 95%</p>
                        <p className="text-xs text-muted-foreground">Ontem às 19:45</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="certificates" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Meus Certificados</h2>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="aspect-square bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-lg flex items-center justify-center mb-3">
                    <Award className="h-12 w-12 text-yellow-600" />
                  </div>
                  <CardTitle className="text-center">Introdução à Bíblia</CardTitle>
                  <CardDescription className="text-center">
                    Certificado de Conclusão
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center space-y-3">
                  <p className="text-sm text-muted-foreground">Emitido em 15/12/2024</p>
                  <Button variant="outline" className="w-full">
                    Baixar Certificado
                  </Button>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="aspect-square bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center mb-3">
                    <Award className="h-12 w-12 text-blue-600" />
                  </div>
                  <CardTitle className="text-center">História do Cristianismo</CardTitle>
                  <CardDescription className="text-center">
                    Certificado de Conclusão
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center space-y-3">
                  <p className="text-sm text-muted-foreground">Emitido em 28/11/2024</p>
                  <Button variant="outline" className="w-full">
                    Baixar Certificado
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Meu Perfil</h2>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Informações Pessoais</CardTitle>
                <CardDescription>
                  Gerencie suas informações pessoais
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Formulário de edição de perfil será implementado aqui.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default StudentDashboard;