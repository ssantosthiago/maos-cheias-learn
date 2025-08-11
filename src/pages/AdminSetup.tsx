import { useEffect, useMemo, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Loader2, ShieldCheck, LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const setSeo = (exists: boolean | null) => {
  const title = exists === false
    ? 'Configuração do Superadmin | Administração'
    : 'Login do Administrador | Administração';
  document.title = title;

  const metaDesc = document.querySelector('meta[name="description"]') || document.createElement('meta');
  metaDesc.setAttribute('name', 'description');
  metaDesc.setAttribute('content', exists === false
    ? 'Crie o primeiro superadmin para gerenciar a plataforma com segurança.'
    : 'Acesse com sua conta de administrador para gerenciar a plataforma.');
  if (!metaDesc.parentNode) document.head.appendChild(metaDesc);

  const canonical = document.querySelector('link[rel="canonical"]') || document.createElement('link');
  canonical.setAttribute('rel', 'canonical');
  canonical.setAttribute('href', window.location.href);
  if (!canonical.parentNode) document.head.appendChild(canonical);
};

const AdminSetup = () => {
  const [checking, setChecking] = useState(true);
  const [exists, setExists] = useState<boolean | null>(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { signIn, profile, loading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { data, error } = await supabase.functions.invoke('superadmin-status');
        if (error) throw error;
        if (!mounted) return;
        setExists(Boolean(data?.exists));
      } catch (e: any) {
        console.error('Erro ao verificar status do superadmin:', e);
        setExists(true); // fallback conservador: só login
      } finally {
        setChecking(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    setSeo(exists);
  }, [exists]);

  useEffect(() => {
    if (!loading && profile?.role === 'superadmin' && profile.is_active) {
      navigate('/admin');
    }
  }, [loading, profile, navigate]);

  const canSubmit = useMemo(() => {
    if (exists === false) {
      return email.length > 3 && password.length >= 8;
    }
    return email.length > 3 && password.length >= 1;
  }, [exists, email, password]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-superadmin', {
        body: { email, password, full_name: fullName || undefined },
      });
      if (error) {
        throw new Error((data as any)?.error || error.message || 'Falha ao criar superadmin');
      }
      toast({ title: 'Superadmin criado!', description: 'Fazendo login...' });
      // Efetua login automaticamente
      const { error: signInError } = await signIn(email, password);
      if (signInError) {
        toast({ variant: 'destructive', title: 'Erro ao logar', description: signInError.message });
      } else {
        navigate('/admin');
      }
    } catch (e: any) {
      toast({ variant: 'destructive', title: 'Falha ao criar superadmin', description: e?.message || 'Tente novamente.' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { error } = await signIn(email, password);
      if (error) throw error;
      navigate('/admin');
    } catch (e: any) {
      toast({ variant: 'destructive', title: 'Falha no login', description: e?.message || 'Verifique suas credenciais.' });
    } finally {
      setSubmitting(false);
    }
  };

  if (checking) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="mt-2 text-muted-foreground">Verificando configuração...</p>
        </div>
      </main>
    );
  }

  if (exists) {
    return (
      <main className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LogIn className="h-5 w-5 text-primary" />
              Login do Administrador
            </CardTitle>
            <CardDescription>Insira seu e-mail e senha para acessar o painel.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
              <Button type="submit" disabled={!canSubmit || submitting} className="w-full">
                {submitting ? (<><Loader2 className="h-4 w-4 animate-spin mr-2" /> Entrando...</>) : 'Entrar'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary" />
            Configuração do Superadmin
          </CardTitle>
          <CardDescription>Crie o primeiro administrador da plataforma. Após a criação, novos cadastros serão feitos apenas por um superadmin.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="fullName">Nome completo (opcional)</Label>
                <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Ex.: Super Admin" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">E-mail</Label>
                <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <p className="text-xs text-muted-foreground">Mínimo de 8 caracteres.</p>
              </div>
            </div>
            <Button type="submit" disabled={!canSubmit || submitting} className="w-full">
              {submitting ? (<><Loader2 className="h-4 w-4 animate-spin mr-2" /> Criando...</>) : 'Criar Superadmin'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
};

export default AdminSetup;
