import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  BookOpen, 
  Settings, 
  BarChart3, 
  LogOut,
  UserPlus,
  GraduationCap,
  Trophy,
  DollarSign
} from 'lucide-react';

const AdminDashboard = () => {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !profile || profile.role !== 'superadmin') {
      navigate('/');
    }
  }, [user, profile, navigate]);

  if (!user || !profile || profile.role !== 'superadmin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Settings className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Painel Administrativo</h1>
              <p className="text-sm text-muted-foreground">Gerencie toda a plataforma</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium">{profile.full_name}</p>
              <Badge variant="destructive" className="text-xs">Super Admin</Badge>
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
              <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,234</div>
              <p className="text-xs text-muted-foreground">+12% em relação ao mês anterior</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cursos Ativos</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">89</div>
              <p className="text-xs text-muted-foreground">+5 novos este mês</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Inscrições</CardTitle>
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2,456</div>
              <p className="text-xs text-muted-foreground">+18% em relação ao mês anterior</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Receita Total</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R$ 45,231</div>
              <p className="text-xs text-muted-foreground">+20% em relação ao mês anterior</p>
            </CardContent>
          </Card>
        </div>

        {/* Management Tabs */}
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="users">Usuários</TabsTrigger>
            <TabsTrigger value="courses">Cursos</TabsTrigger>
            <TabsTrigger value="analytics">Relatórios</TabsTrigger>
            <TabsTrigger value="settings">Configurações</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Gerenciar Usuários</h2>
              <Button>
                <UserPlus className="h-4 w-4 mr-2" />
                Adicionar Usuário
              </Button>
            </div>
            
            {/* User Management Grid */}
            <div className="grid md:grid-cols-3 gap-6 mb-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Professores
                  </CardTitle>
                  <CardDescription>
                    Gerencie professores e suas permissões
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold mb-2">25</div>
                  <p className="text-sm text-muted-foreground">professores ativos</p>
                  <Button variant="outline" size="sm" className="mt-2">
                    Gerenciar Professores
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="h-5 w-5" />
                    Alunos
                  </CardTitle>
                  <CardDescription>
                    Visualize e gerencie alunos cadastrados
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold mb-2">1,209</div>
                  <p className="text-sm text-muted-foreground">alunos registrados</p>
                  <Button variant="outline" size="sm" className="mt-2">
                    Ver Todos os Alunos
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5" />
                    Certificados
                  </CardTitle>
                  <CardDescription>
                    Certificados emitidos este mês
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold mb-2">156</div>
                  <p className="text-sm text-muted-foreground">certificados emitidos</p>
                  <Button variant="outline" size="sm" className="mt-2">
                    Gerenciar Certificados
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* User Permissions Management */}
            <Card>
              <CardHeader>
                <CardTitle>Controle de Permissões</CardTitle>
                <CardDescription>
                  Gerencie funções e permissões dos usuários
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">Funções Disponíveis</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-2 border rounded">
                        <span>Super Admin</span>
                        <Badge variant="destructive">1 usuário</Badge>
                      </div>
                      <div className="flex items-center justify-between p-2 border rounded">
                        <span>Professor</span>
                        <Badge variant="default">25 usuários</Badge>
                      </div>
                      <div className="flex items-center justify-between p-2 border rounded">
                        <span>Aluno</span>
                        <Badge variant="secondary">1,209 usuários</Badge>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-medium">Ações Rápidas</h4>
                    <div className="space-y-2">
                      <Button variant="outline" size="sm" className="w-full justify-start">
                        Promover Usuário a Professor
                      </Button>
                      <Button variant="outline" size="sm" className="w-full justify-start">
                        Desativar Conta de Usuário
                      </Button>
                      <Button variant="outline" size="sm" className="w-full justify-start">
                        Resetar Senha de Usuário
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="courses" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Gerenciar Cursos</h2>
              <Button>
                <BookOpen className="h-4 w-4 mr-2" />
                Criar Curso
              </Button>
            </div>
            
            {/* Course Statistics */}
            <div className="grid md:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold">89</div>
                  <p className="text-sm text-muted-foreground">Total de Cursos</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold">67</div>
                  <p className="text-sm text-muted-foreground">Cursos Publicados</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold">22</div>
                  <p className="text-sm text-muted-foreground">Em Desenvolvimento</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold">8</div>
                  <p className="text-sm text-muted-foreground">Categorias</p>
                </CardContent>
              </Card>
            </div>

            {/* Course Management */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Cursos por Categoria</CardTitle>
                  <CardDescription>
                    Distribução dos cursos por categoria
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {['Teologia', 'Discipulado', 'Educação Cristã', 'Ministerial', 'Missões', 'Música'].map((category) => (
                      <div key={category} className="flex items-center justify-between">
                        <span className="text-sm">{category}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-2 bg-secondary rounded-full">
                            <div className="h-2 bg-primary rounded-full" style={{ width: `${Math.random() * 100}%` }}></div>
                          </div>
                          <span className="text-sm text-muted-foreground">{Math.floor(Math.random() * 20) + 1}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Ações de Gerenciamento</CardTitle>
                  <CardDescription>
                    Ferramentas para gestão de cursos
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Aprovar Cursos Pendentes
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Settings className="h-4 w-4 mr-2" />
                    Configurar Categorias
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Trophy className="h-4 w-4 mr-2" />
                    Gerenciar Templates de Certificados
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <DollarSign className="h-4 w-4 mr-2" />
                    Configurar Preços e Promocões
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Relatórios e Analytics</h2>
              <Button variant="outline">
                <BarChart3 className="h-4 w-4 mr-2" />
                Exportar Relatório
              </Button>
            </div>
            
            {/* Analytics Cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-green-600">85%</div>
                  <p className="text-sm text-muted-foreground">Taxa de Conclusão</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-blue-600">4.7</div>
                  <p className="text-sm text-muted-foreground">Avaliação Média</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-purple-600">95%</div>
                  <p className="text-sm text-muted-foreground">Satisfação</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-2xl font-bold text-orange-600">320</div>
                  <p className="text-sm text-muted-foreground">Novos Usuários</p>
                </CardContent>
              </Card>
            </div>

            {/* Detailed Analytics */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Engagement de Usuários</CardTitle>
                  <CardDescription>
                    Métricas de atividade dos usuários
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Logins diários</span>
                      <span className="font-bold">892</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Tempo médio de sessão</span>
                      <span className="font-bold">45 min</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Páginas por sessão</span>
                      <span className="font-bold">7.2</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Taxa de retorno</span>
                      <span className="font-bold">73%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Performance de Cursos</CardTitle>
                  <CardDescription>
                    Métricas de desempenho dos cursos
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span>Curso mais popular</span>
                      <span className="font-bold">Teologia Básica</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Taxa de abandono</span>
                      <span className="font-bold">15%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Receita por curso</span>
                      <span className="font-bold">R$ 127</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Certificados emitidos</span>
                      <span className="font-bold">156</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Report Generation */}
            <Card>
              <CardHeader>
                <CardTitle>Geração de Relatórios</CardTitle>
                <CardDescription>
                  Exporte relatórios personalizados
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <Button variant="outline" className="justify-start">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Relatório de Vendas
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <Users className="h-4 w-4 mr-2" />
                    Relatório de Usuários
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Relatório de Cursos
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Configurações da Plataforma</h2>
            </div>
            
            {/* System Settings Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Configurações Gerais</CardTitle>
                  <CardDescription>
                    Configure aspectos gerais da plataforma
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Nome da Plataforma</label>
                    <input 
                      type="text" 
                      defaultValue="Portal de Cursos Cristãos"
                      className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email de Contato</label>
                    <input 
                      type="email" 
                      defaultValue="contato@portal.com"
                      className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Moeda Padrão</label>
                    <select className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary">
                      <option value="BRL">Real Brasileiro (R$)</option>
                      <option value="USD">Dólar Americano ($)</option>
                      <option value="EUR">Euro (€)</option>
                    </select>
                  </div>
                  <Button className="w-full">Salvar Configurações Gerais</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Integrações de Pagamento</CardTitle>
                  <CardDescription>
                    Configure métodos de pagamento
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border rounded">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        <span>Stripe</span>
                      </div>
                      <Badge variant="secondary">Configurado</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        <span>PayPal</span>
                      </div>
                      <Badge variant="outline">Não Configurado</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        <span>PagSeguro</span>
                      </div>
                      <Badge variant="outline">Não Configurado</Badge>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full">
                    Configurar Integrações
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Configurações de Email</CardTitle>
                  <CardDescription>
                    Configure serviços de email
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Provedor de Email</label>
                    <select className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary">
                      <option value="smtp">SMTP Personalizado</option>
                      <option value="sendgrid">SendGrid</option>
                      <option value="mailgun">Mailgun</option>
                      <option value="amazon-ses">Amazon SES</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Email de Envio</label>
                    <input 
                      type="email" 
                      placeholder="noreply@portal.com"
                      className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <Button variant="outline" className="w-full">
                    Configurar Email
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Configurações de Segurança</CardTitle>
                  <CardDescription>
                    Configure políticas de segurança
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Autenticação de Dois Fatores</p>
                      <p className="text-sm text-muted-foreground">Obrigatória para professores</p>
                    </div>
                    <Button variant="outline" size="sm">Ativar</Button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Backup Automático</p>
                      <p className="text-sm text-muted-foreground">Diário às 3:00 AM</p>
                    </div>
                    <Badge variant="secondary">Ativo</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Log de Auditoria</p>
                      <p className="text-sm text-muted-foreground">Registrar todas as ações</p>
                    </div>
                    <Badge variant="secondary">Ativo</Badge>
                  </div>
                  <Button variant="outline" className="w-full">
                    Ver Logs de Segurança
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Advanced Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Configurações Avançadas</CardTitle>
                <CardDescription>
                  Configurações técnicas e de sistema
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <Button variant="outline" className="justify-start">
                    <Settings className="h-4 w-4 mr-2" />
                    Cache do Sistema
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Otimização de Performance
                  </Button>
                  <Button variant="outline" className="justify-start">
                    <Users className="h-4 w-4 mr-2" />
                    Limites de Rate
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;