import { Link } from 'react-router-dom';
import Header from '../components/Header';

const sections = [
  {
    title: '1. Acceptance of Terms',
    body: [
      'By accessing or using Hurammy, you agree to these Terms of Service and any policies referenced here. If you do not agree, do not use the platform.',
      'These terms apply to all visitors, registered users, creators, contestants, voters, and any other person who accesses Hurammy.'
    ]
  },
  {
    title: '2. Eligibility',
    body: [
      'You must be legally able to enter into these terms. If you are under the age of majority where you live, you may use Hurammy only with permission and supervision from a parent or legal guardian.',
      'You are responsible for making sure your use of Hurammy complies with all laws and rules that apply to you.'
    ]
  },
  {
    title: '3. Accounts and Security',
    body: [
      'You agree to provide accurate account information and keep it updated. You are responsible for maintaining the confidentiality of your login credentials.',
      'You are responsible for all activity under your account. If you believe your account has been accessed without permission, contact us promptly.'
    ]
  },
  {
    title: '4. User Content',
    body: [
      'Hurammy may allow you to upload, post, share, vote on, comment on, or otherwise submit content, including videos, images, text, audio, profile information, and campaign materials.',
      'You keep ownership of content you submit. By submitting content, you grant Hurammy a worldwide, non-exclusive, royalty-free license to host, store, display, reproduce, modify for technical formatting, distribute, promote, and otherwise use that content in connection with operating, improving, and marketing the platform and related campaigns.',
      'You represent that you own or have all required rights and permissions for content you submit, including any music, images, video, voice, likeness, trademarks, or other third-party materials included in it.'
    ]
  },
  {
    title: '5. Prohibited Conduct',
    body: [
      'You may not upload or share unlawful, harmful, abusive, defamatory, hateful, sexually exploitative, violent, misleading, infringing, or otherwise inappropriate content.',
      'You may not harass others, impersonate any person or entity, manipulate votes or rankings, use bots or automated abuse, interfere with platform security, scrape the service without permission, or attempt to access accounts, systems, or data you are not authorized to access.',
      'Hurammy may remove or restrict content, suspend accounts, or take other action if we believe these terms or applicable laws have been violated.'
    ]
  },
  {
    title: '6. Campaigns, Contests, Voting, and Rewards',
    body: [
      'Campaigns, contests, voting, awards, rankings, flowers, coins, or similar features may have additional rules, eligibility requirements, judging criteria, deadlines, or limitations.',
      'Hurammy may modify, pause, cancel, disqualify entries from, or adjust campaigns or contests when needed to protect fairness, comply with law, address technical issues, or prevent abuse.',
      'Rewards, virtual items, credits, points, flowers, or coins may have no cash value unless expressly stated in writing. They may be changed, revoked, limited, or discontinued as allowed by applicable law.'
    ]
  },
  {
    title: '7. Payments and Purchases',
    body: [
      'If Hurammy offers paid features, you agree to pay all applicable fees, taxes, and charges. Payments may be processed by third-party payment providers subject to their own terms.',
      'Except where required by law or expressly stated, purchases may be final and non-refundable.'
    ]
  },
  {
    title: '8. Intellectual Property',
    body: [
      'Hurammy, including its design, logos, software, features, graphics, and platform content, is owned by Hurammy or its licensors and is protected by intellectual property laws.',
      'You may not copy, modify, distribute, sell, lease, reverse engineer, or exploit any part of Hurammy except as permitted by these terms or with written permission.'
    ]
  },
  {
    title: '9. Privacy',
    body: [
      'Your use of Hurammy is also governed by our Privacy Policy. Please review it to understand how information may be collected, used, and shared.',
      'If you submit content that includes another person, you are responsible for obtaining any required consent from that person.'
    ]
  },
  {
    title: '10. Third-Party Services and Links',
    body: [
      'Hurammy may include links, embeds, integrations, or services provided by third parties. We are not responsible for third-party websites, services, content, policies, or practices.',
      'Your use of third-party services may be subject to separate terms and privacy policies.'
    ]
  },
  {
    title: '11. Disclaimers',
    body: [
      'Hurammy is provided on an "as is" and "as available" basis. We do not guarantee that the platform will be uninterrupted, secure, error-free, or available at all times.',
      'We do not guarantee any specific audience, ranking, income, reward, result, or outcome from using Hurammy or participating in any campaign or contest.'
    ]
  },
  {
    title: '12. Limitation of Liability',
    body: [
      'To the fullest extent permitted by law, Hurammy and its owners, employees, partners, and service providers will not be liable for indirect, incidental, special, consequential, exemplary, or punitive damages, or for lost profits, lost data, or business interruption.',
      'Our total liability for any claim related to Hurammy will be limited to the amount you paid to Hurammy for the service giving rise to the claim during the twelve months before the claim, or one hundred U.S. dollars, whichever is greater.'
    ]
  },
  {
    title: '13. Indemnification',
    body: [
      'You agree to defend, indemnify, and hold harmless Hurammy and its owners, employees, partners, and service providers from claims, damages, losses, liabilities, costs, and expenses arising from your content, your use of the platform, or your violation of these terms or applicable law.'
    ]
  },
  {
    title: '14. Termination',
    body: [
      'You may stop using Hurammy at any time. Hurammy may suspend or terminate your access if we believe you violated these terms, created risk for the platform or other users, or if continued access is not commercially or legally practical.',
      'Sections that by their nature should survive termination will continue to apply, including ownership, licenses, disclaimers, limitation of liability, and indemnification.'
    ]
  },
  {
    title: '15. Changes to These Terms',
    body: [
      'We may update these terms from time to time. When we make material changes, we may provide notice through the platform or by other reasonable means.',
      'Your continued use of Hurammy after updated terms become effective means you accept the updated terms.'
    ]
  },
  {
    title: '16. Contact',
    body: [
      'Questions about these Terms of Service may be sent to hurammy.help@gmail.com.'
    ]
  }
];

function Terms() {
  return (
    <div style={{ minHeight: '100vh' }}>
      <Header />

      <main style={{ maxWidth: '980px', margin: '0 auto', padding: '28px 18px 56px' }}>
        <section className="panel" style={{ padding: '28px', display: 'grid', gap: '18px' }}>
          <div style={{ display: 'grid', gap: '10px' }}>
            <Link to="/" className="muted" style={{ width: 'fit-content', fontSize: '13px' }}>
              Back to Home
            </Link>
            <h1 style={{ margin: 0, fontSize: 'clamp(28px, 4vw, 44px)', lineHeight: 1.08 }}>
              Terms of Service
            </h1>
            <p className="muted" style={{ margin: 0, fontSize: '14px' }}>
              Effective date: June 4, 2026
            </p>
            <p style={{ margin: 0, color: 'rgba(245,247,255,0.88)', maxWidth: '760px' }}>
              Welcome to Hurammy. These Terms of Service explain the rules for using our website,
              applications, services, contests, campaigns, community features, and related tools.
            </p>
          </div>

          <div style={{ display: 'grid', gap: '18px' }}>
            {sections.map((section) => (
              <section key={section.title} style={{ display: 'grid', gap: '8px' }}>
                <h2 style={{ margin: 0, fontSize: '18px' }}>{section.title}</h2>
                {section.body.map((paragraph) => (
                  <p key={paragraph} className="muted" style={{ margin: 0 }}>
                    {paragraph}
                  </p>
                ))}
              </section>
            ))}
          </div>

          <p className="muted" style={{ margin: 0, fontSize: '12px' }}>
            This page is provided as a general Terms of Service template for Hurammy and should be
            reviewed by qualified legal counsel before being relied on as legal advice.
          </p>
        </section>
      </main>
    </div>
  );
}

export default Terms;
