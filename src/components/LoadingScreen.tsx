import { motion } from 'framer-motion';

export const LoadingScreen = () => {
  return (
    <div className="min-h-screen qlaf-bg flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center"
      >
        <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading...</p>
      </motion.div>
    </div>
  );
};
