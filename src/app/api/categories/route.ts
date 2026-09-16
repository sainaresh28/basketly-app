import { withErrorHandling, ok } from '@/lib/errors/handler';
import { CategoryService } from '@/lib/services/category.service';

export const GET = withErrorHandling(async () => {
  const categories = await CategoryService.listAll();
  return ok({ categories });
});
