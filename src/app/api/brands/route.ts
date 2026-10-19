import { withErrorHandling, ok } from '@/lib/errors/handler';
import { BrandService } from '@/lib/services/brand.service';

export const GET = withErrorHandling(async () => {
  const brands = await BrandService.listAll();
  return ok({ brands });
});
