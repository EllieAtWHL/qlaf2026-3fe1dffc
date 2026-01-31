import { MainDisplay } from '@/components/MainDisplay';
import { useQuizSync } from '@/hooks/useQuizSync';

const Index = () => {
  // Subscribe to real-time updates from co-host
  useQuizSync(false);
  
  return <MainDisplay />;
};

export default Index;
