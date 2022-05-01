export default () => ({
  environment: process.env.ENVIRONMENT,
  port: parseInt(process.env.PORT, 10),
  timeout: process.env.TIMEOUT,
  pullLimit: process.env.GCLOUD_PUBSUB_SUBSCRIPTION_PULL_LIMIT,
  api: {
    topic: {
      endpoint: process.env.API_TASKS_ENDPOINT,
    },
  },
  pubsub: {
    pullLimit: process.env.GCLOUD_PUBSUB_SUBSCRIPTION_PULL_LIMIT,
    subscriptionName: process.env.GCLOUD_PUBSUB_SUBCRIPTION_NAME,
    subscriberB64: process.env.GCLOUD_PUBSUB_SUBSCRIBER_B64,
    projectId: process.env.GCLOUD_PROJECT_ID,
    topicId: process.env.GCLOUD_PUBSUB_TOPIC_ID,
  },
});
