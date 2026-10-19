import { withErrorHandling, ok } from '@/lib/errors/handler';
import { NotFoundError } from '@/lib/errors/app-error';
import { requireSession } from '@/lib/auth/guards';
import { UserRepository } from '@/lib/repositories/user.repository';
import { ProductService } from '@/lib/services/product.service';
import { ReviewService } from '@/lib/services/review.service';
import { createReviewSchema } from '@/lib/validation/schemas';

async function resolveProduct(idOrSlug: string) {
  return ProductService.getBySlug(idOrSlug).catch(async (err) => {
    if (err instanceof NotFoundError) return ProductService.getById(idOrSlug);
    throw err;
  });
}

export const GET = withErrorHandling(async (_req: Request, ctx: { params: Promise<{ idOrSlug: string }> }) => {
  const { idOrSlug } = await ctx.params;
  const product = await resolveProduct(idOrSlug);
  const reviews = await ReviewService.listForProduct(product.id);
  return ok({ reviews });
});

export const POST = withErrorHandling(async (req: Request, ctx: { params: Promise<{ idOrSlug: string }> }) => {
  const session = await requireSession();
  const { idOrSlug } = await ctx.params;
  const product = await resolveProduct(idOrSlug);
  const body = await req.json();
  const input = createReviewSchema.parse(body);

  const user = await UserRepository.findById(session.userId);
  if (!user) throw new NotFoundError('Account not found');

  const review = await ReviewService.create(session.userId, user.name, product.id, input);
  return ok({ review }, 201);
});
