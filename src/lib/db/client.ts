import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

/**
 * Low-level DynamoDB client, shared across the app.
 *
 * - In production this talks to real AWS DynamoDB using the credentials
 *   configured in the environment (never hardcoded).
 * - For local development you can run DynamoDB Local and point
 *   DYNAMODB_ENDPOINT at it (e.g. http://localhost:8000) so the app works
 *   without an AWS account.
 */
const rawClient = new DynamoDBClient({
  region: process.env.AWS_REGION || 'ap-south-1',
  endpoint: process.env.DYNAMODB_ENDPOINT || undefined,
  credentials:
    process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY
      ? {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        }
      : undefined, // falls back to default provider chain (IAM role, etc.)
});

// The Document client lets us work with plain JS objects instead of the
// verbose { S: 'value' } / { N: '1' } AttributeValue wire format.
export const ddb = DynamoDBDocumentClient.from(rawClient, {
  marshallOptions: {
    removeUndefinedValues: true,
    convertClassInstanceToMap: true,
  },
});
