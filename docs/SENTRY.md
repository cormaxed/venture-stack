# Error Logging

By default server and browser logs are written to the console in JSON format. If you are looking for a more engineer-friendly solution we suggest Sentry.io.

## Sentry.io

Sentry is a developer-first error tracking and performance monitoring platform that helps developers see what matters, solve quicker, and learn continuously about their applications.

### Setup Error Logging and Monitoring

* Go to Sentry.io
* Select Projects
* Create Project
* Select Browser -> Next.Js
* Set Alert Frequency -> I'll create my own alerts later
* Name your project `<user>-nextjs-<venture>` for dev, or `<environment>-nextjs-<venture>`
* Open the project
* Select Settings -> Client Keys

Add the following line to your `/packages/next/.env.{local|development|test|production}`

```vi
NEXT_PUBLIC_SENTRY_DSN=<Project DSN Key>
```
