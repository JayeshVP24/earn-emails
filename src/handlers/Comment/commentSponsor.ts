import { render } from '@react-email/render';
import { CommentSponsorTemplate } from '../../email-templates';
import { prisma } from '../../prisma';
import { getUserEmailPreference } from '../../utils';
import { kashEmail } from '../../constants';

export async function processCommentSponsor(id: string, userId: string) {
  const userPreference = await getUserEmailPreference(userId, 'commentSponsor');

  if (!userPreference) {
    console.log(`User ${userId} has opted out of this type of email.`);
    return;
  }

  const listing = await prisma.bounties.findFirst({
    where: { id },
    include: {
      poc: true,
    },
  });

  if (listing) {
    const pocUser = listing?.poc;

    const emailHtml = render(
      CommentSponsorTemplate({
        name: pocUser.firstName!,
        listingName: listing.title,
        link: `https://earn.superteam.fun/listings/${listing?.type}/${listing?.slug}/?utm_source=superteamearn&utm_medium=email&utm_campaign=notifications`,
      }),
    );

    const emailData = {
      from: kashEmail,
      to: pocUser.email,
      subject: 'Comment Received on Your Superteam Earn Listing',
      html: emailHtml,
    };
    return emailData;
  }

  return;
}
