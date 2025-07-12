import LoginForm from '@/components/LoginForm';

export default function LoginPage({ onLogin }) {
  return <LoginForm onLoginSuccess={onLogin} />;
}