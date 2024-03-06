import React from 'react';

import { styles } from '../../utils/styles';

interface SubmissionProps {
  name: string;
  listingName: string;
  personName: string;
  link: string;
}

export const CommentSubmissionTemplate = ({
  name,
  listingName,
  personName,
  link,
}: SubmissionProps) => {
  return (
    <div style={styles.container}>
      <p style={styles.greetings}>Hello&nbsp;{name},</p>
      <p style={styles.textWithMargin}>
        {personName} just left a new comment on your submission to the{' '}
        <strong>{listingName}</strong> listing.
        <a href={link} style={styles.link}>
          Click here to see what they said!
        </a>{' '}
      </p>
      <p style={styles.salutation}>
        Best,
        <br />
        Superteam Earn
      </p>
      <p style={styles.unsubscribe}>
        Click{' '}
        <a
          href="https://airtable.com/appqA0tn8zKv3WJg9/shrsil6vncuj35nHn"
          style={styles.unsubscribeLink}
        >
          here
        </a>{' '}
        to unsubscribe from all emails from Superteam Earn.
      </p>
    </div>
  );
};
