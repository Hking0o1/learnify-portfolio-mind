
// Re-export Supabase services
export { courseAPI, userAPI, useAPI } from './supabase';
export { moduleAPI, useModuleAPI } from './modules';
export { generateModulesWithAI, saveGeneratedModules } from './ai-modules';
export { inviteAPI, useInviteAPI } from './invites';
export { progressAPI, useProgressAPI, type UserProgress } from './progress';
export { portfolioAPI, usePortfolioAPI } from './portfolio';
