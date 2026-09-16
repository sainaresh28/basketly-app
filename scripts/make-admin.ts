/**
 * One-time CLI utility to promote a registered user to admin. After this,
 * all admin work (managing products, inventory, orders) happens through the
 * /admin dashboard in the browser — no more code/CLI needed.
 *
 * Usage: npx ts-node --compiler-options '{"module":"commonjs"}' scripts/make-admin.ts you@example.com
 */
import 'dotenv/config';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, QueryCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';

const email = process.argv[2];
if (!email) {
  console.error('Usage: npm run make-admin -- you@example.com');
  process.exit(1);
}

const raw = new DynamoDBClient({
  region: process.env.AWS_REGION || 'ap-south-1',
  endpoint: process.env.DYNAMODB_ENDPOINT || undefined,
  credentials:
    process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY
      ? { accessKeyId: process.env.AWS_ACCESS_KEY_ID, secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY }
      : undefined,
});
const ddb = DynamoDBDocumentClient.from(raw);
const TABLE = process.env.DYNAMODB_USERS_TABLE || 'basketly-users';

async function main() {
  const res = await ddb.send(
    new QueryCommand({
      TableName: TABLE,
      IndexName: 'EmailIndex',
      KeyConditionExpression: 'email = :email',
      ExpressionAttributeValues: { ':email': email.toLowerCase() },
      Limit: 1,
    })
  );
  const user = res.Items?.[0];
  if (!user) {
    console.error(`No user found with email ${email}. Register that account first, then re-run this.`);
    process.exit(1);
  }

  await ddb.send(
    new UpdateCommand({
      TableName: TABLE,
      Key: { id: user.id },
      UpdateExpression: 'SET #role = :role',
      ExpressionAttributeNames: { '#role': 'role' },
      ExpressionAttributeValues: { ':role': 'admin' },
    })
  );

  console.log(`✓ ${email} is now an admin. Sign out and back in, then visit /admin.`);
}

main().catch((err) => {
  console.error('Failed to promote user:', err);
  process.exit(1);
});
