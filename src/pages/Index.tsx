import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Heart, Users, Award, LogOut, User, Settings } from 'lucide-react';
import { Loader2 } from 'lucide-react';

const Index = () => {
  const { user, profile, loading, signOut } = useAuth();
  const navigate = useNavigate();

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'superadmin':
        return { label: 'Super Admin', variant: 'destructive' as const };
      case 'professor':
        return { label: 'Professor', variant: 'default' as const };
      case 'aluno':
        return { label: 'Aluno', variant: 'secondary' as const };
      default:
        return { label: 'Usuário', variant: 'outline' as const };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
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
              <h1 className="text-xl font-bold">Instituto Voluntários</h1>
              <p className="text-sm text-muted-foreground">Mãos Cheias de Propósito</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {user && profile ? (
              <>
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium">{profile.full_name}</p>
                  <div className="flex items-center justify-end space-x-2">
                    <Badge variant={getRoleLabel(profile.role).variant} className="text-xs">
                      {getRoleLabel(profile.role).label}
                    </Badge>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={signOut}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sair
                </Button>
              </>
            ) : (
              <Button asChild>
                <Link to="/auth">
                  <User className="h-4 w-4 mr-2" />
                  Entrar
                </Link>
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {user && profile ? (
          // Dashboard para usuários logados
          <div className="space-y-8">
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-bold">
                Bem-vindo, {profile.full_name}!
              </h2>
              <p className="text-xl text-muted-foreground">
                {profile.role === 'superadmin' && 'Gerencie toda a plataforma de cursos'}
                {profile.role === 'professor' && 'Crie e gerencie seus cursos'}
                {profile.role === 'aluno' && 'Continue seu aprendizado'}
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {profile.role === 'superadmin' && (
                <>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Settings className="h-5 w-5" />
                        <span>Painel Admin</span>
                      </CardTitle>
                      <CardDescription>
                        Gerencie usuários, cursos e configurações da plataforma
                      </CardDescription>
                    </CardHeader>
                  </Card>
                  
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Users className="h-5 w-5" />
                        <span>Usuários</span>
                      </CardTitle>
                      <CardDescription>
                        Gerencie professores e alunos da plataforma
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </>
              )}

              {(profile.role === 'superadmin' || profile.role === 'professor') && (
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <BookOpen className="h-5 w-5" />
                      <span>Meus Cursos</span>
                    </CardTitle>
                    <CardDescription>
                      {profile.role === 'professor' ? 'Crie e gerencie seus cursos' : 'Visualize todos os cursos'}
                    </CardDescription>
                  </CardHeader>
                </Card>
              )}

              {profile.role === 'aluno' && (
                <>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <BookOpen className="h-5 w-5" />
                        <span>Meus Cursos</span>
                      </CardTitle>
                      <CardDescription>
                        Continue seus estudos e acompanhe o progresso
                      </CardDescription>
                    </CardHeader>
                  </Card>
                  
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        <Award className="h-5 w-5" />
                        <span>Certificados</span>
                      </CardTitle>
                      <CardDescription>
                        Visualize e baixe seus certificados conquistados
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </>
              )}

              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BookOpen className="h-5 w-5" />
                    <span>Explorar Cursos</span>
                  </CardTitle>
                  <CardDescription>
                    Descubra novos cursos disponíveis na plataforma
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        ) : (
          // Página inicial para visitantes
          <div className="space-y-12">
            <div className="text-center space-y-6">
              <div className="flex items-center justify-center space-x-3 mb-6">
                <div className="p-3 bg-primary/10 rounded-xl">
                  <Heart className="h-12 w-12 text-primary fill-current" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold">Instituto Voluntários</h1>
                  <p className="text-xl text-muted-foreground">Mãos Cheias de Propósito</p>
                </div>
              </div>
              
              <h2 className="text-3xl font-bold">
                Transformando Vidas Através do Ensino Cristão
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Uma plataforma completa de cursos online voltada para formações com propósito social 
                e voluntariado cristão, onde você pode aprender, ensinar e fazer a diferença.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild>
                  <Link to="/auth">
                    Começar Agora
                  </Link>
                </Button>
                <Button variant="outline" size="lg">
                  Explorar Cursos
                </Button>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <Card className="text-center">
                <CardHeader>
                  <div className="mx-auto p-3 bg-primary/10 rounded-lg w-fit mb-4">
                    <BookOpen className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle>Cursos de Qualidade</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Aprenda com professores especializados em formações com propósito social e voluntariado cristão.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <div className="mx-auto p-3 bg-primary/10 rounded-lg w-fit mb-4">
                    <Users className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle>Comunidade Cristã</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Faça parte de uma comunidade engajada em transformar vidas através do ensino e voluntariado.
                  </CardDescription>
                </CardContent>
              </Card>

              <Card className="text-center">
                <CardHeader>
                  <div className="mx-auto p-3 bg-primary/10 rounded-lg w-fit mb-4">
                    <Award className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle>Certificados</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>
                    Receba certificados reconhecidos ao concluir os cursos e comprove seu aprendizado.
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
