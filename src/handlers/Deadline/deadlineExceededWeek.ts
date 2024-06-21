import { prisma } from '../../prisma';
import { DeadlineExceededbyWeekTemplate } from '../../email-templates';
import { render } from '@react-email/render';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { getUserEmailPreference } from '../../utils';
import { alertsEmail } from '../../constants';

export async function processDeadlineExceededWeek() {
  dayjs.extend(utc);

  const sevenDaysAgo = dayjs.utc().subtract(7, 'day').toISOString();
  const nineDaysAgo = dayjs.utc().subtract(9, 'day').toISOString();

  const listings = await prisma.bounties.findMany({
    where: {
      isPublished: true,
      isActive: true,
      isArchived: false,
      status: 'OPEN',
      deadline: {
        lt: sevenDaysAgo,
        gte: nineDaysAgo,
      },
      isWinnersAnnounced: false,
    },
    include: {
      poc: true,
    },
  });

  const emailData = [];

  for (const listing of listings) {
    const checkLogs = await prisma.emailLogs.findFirst({
      where: {
        bountyId: listing.id,
        type: 'BOUNTY_DEADLINE_WEEK',
      },
    });

    if (checkLogs || !listing.poc?.email) continue;

    const pocPreference = await getUserEmailPreference(
      listing.pocId,
      'deadlineExceededWeek',
    );

    if (!pocPreference) continue;

    const emailHtml = render(
      DeadlineExceededbyWeekTemplate({
        name: listing.poc.firstName!,
        listingName: listing.title,
        link: `https://earn.superteam.fun/dashboard/listings/${listing?.slug}/submissions/?utm_source=superteamearn&utm_medium=email&utm_campaign=notifications`,
      }),
    );

    await prisma.emailLogs.create({
      data: {
        type: 'BOUNTY_DEADLINE_WEEK',
        bountyId: listing.id,
      },
    });

    emailData.push({
      from: alertsEmail,
      to: listing.poc.email,
      bcc: ['pratikd.earnings@gmail.com'],
      subject: 'Please Announce the Winners of Your Listing ASAP',
      html: emailHtml,
    });
  }

  return emailData.filter(Boolean);
}
