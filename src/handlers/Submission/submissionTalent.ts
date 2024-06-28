import { render } from '@react-email/render';
import { SubmissionTemplate } from '../../email-templates';
import { prisma } from '../../prisma';
import { kashEmail } from '../../constants';

export async function processTalentSubmission(id: string, userId: string) {
  const listing = await prisma.bounties.findFirst({
    where: { id },
  });

  const user = await prisma.user.findFirst({
    where: { id: userId as string },
  });

  if (listing && user) {
    const subject =
      listing.type !== 'project'
        ? 'We Have Received Your Submission'
        : 'We Have Received Your Application';

    const emailHtml = render(
      SubmissionTemplate({
        name: user.firstName!,
        listingName: listing.title,
        type: listing?.type as 'bounty' | 'project' | 'hackathon',
      }),
    );

    const emailData = {
      from: kashEmail,
      to: user.email,
      subject,
      html: emailHtml,
    };
    return emailData;
  }

  return;
}
