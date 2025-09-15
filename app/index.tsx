import { Redirect } from 'expo-router';

export default function Index() {
  // Por enquanto, sempre redireciona para onboarding
  // Mais tarde vamos implementar a lógica de:
  // - Se já fez onboarding -> vai para (app)
  // - Se não está logado -> vai para (auth)
  // - Se é primeira vez -> vai para onboarding
  
  return <Redirect href="/onboarding" />;
}