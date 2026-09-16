import { withErrorHandling, ok } from '@/lib/errors/handler';
import { requireSession } from '@/lib/auth/guards';
import { addressInputSchema } from '@/lib/validation/schemas';
import { AuthService } from '@/lib/services/auth.service';

export const GET = withErrorHandling(async () => {
  const session = await requireSession();
  const addresses = await AuthService.listAddresses(session.userId);
  return ok({ addresses });
});

export const POST = withErrorHandling(async (req: Request) => {
  const session = await requireSession();
  const body = await req.json();
  const input = addressInputSchema.parse(body);

  const addresses = await AuthService.addAddress(session.userId, input);
  return ok({ addresses }, 201);
});
