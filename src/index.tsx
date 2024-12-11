import * as Sentry from "@sentry/react";
import React from 'react';
import ReactDOM from 'react-dom/client';
import { ExpressionEditor } from './editor_v3/ExpressionEditor';
import './index.css';


// setupGlobalErrorHandlers();




const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

Sentry.init({
  dsn: "http://a7bff211085b07f322a00fb6b6dee9ac@172.31.41.104:9000/2",
  integrations: [
    Sentry.browserTracingIntegration({
    }),
    Sentry.replayIntegration({
      maskAllText: false,
      blockAllMedia: false,
    }),
  ],
  // Performance Monitoring
  tracesSampleRate: 1.0, //  Capture 100% of the transactions
  // Session Replay
  beforeSend: (event) => {
    const user = event.user;
    console.log(user);
    return event
  },
  replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
  replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
});

// Sentry.init({
//   dsn: "http://602ea572e6b8439bab5a5b8e71505d62@localhost/2",
//   release: "my-project-name",
//   integrations: [
//     Sentry.browserTracingIntegration(),
//     Sentry.replayIntegration()
//   ],
//   beforeBreadcrumb(breadcrumb, hint) {
//     console.log(breadcrumb)
//     return  breadcrumb;
//   },
//   tracesSampleRate: 1,
// });

const ProblematicComponent: React.FC = () => {
  throw new Error("Это тестовая ошибка!");
};

root.render(

  <Sentry.ErrorBoundary>
    <React.StrictMode>
        <ExpressionEditor />
        {/* <ProblematicComponent /> */}
    </React.StrictMode>
  </Sentry.ErrorBoundary>

);

